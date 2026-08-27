-- Additive staff-UAT bridge for the public Camden portal.
--
-- Nate/Michael remain primary LRP Auth users for Bolt. This bridge does not
-- mint, return, or accept a Supabase JWT in the public portal: it links an
-- explicitly approved staff membership to the existing Camden opaque-session
-- identity model and presents only the coordinator role to that portal.

begin;

set local lock_timeout = '10s';
set local statement_timeout = '5min';
set local idle_in_transaction_session_timeout = '5min';

alter table camden_private.portal_identities
  add column if not exists linked_auth_user_id uuid
    references auth.users(id) on delete restrict;

create unique index if not exists camden_portal_identities_linked_auth_user_key
  on camden_private.portal_identities (linked_auth_user_id)
  where linked_auth_user_id is not null;

alter table camden_private.portal_identities
  drop constraint if exists camden_portal_identities_staff_uat_shape;
alter table camden_private.portal_identities
  add constraint camden_portal_identities_staff_uat_shape check (
    linked_auth_user_id is null
    or (role = 'coordinator' and rider_id is null)
  );

create or replace function camden_private.staff_portal_membership_is_active(
  target_auth_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.camden_program_users membership
    where membership.auth_user_id = target_auth_user_id
      and membership.role in ('lrp_operator', 'lrp_admin')
      and membership.access_status = 'approved'
  );
$$;

revoke all on function camden_private.staff_portal_membership_is_active(uuid)
  from public, anon, authenticated;
grant execute on function camden_private.staff_portal_membership_is_active(uuid)
  to service_role;

-- Only the dedicated service-only upsert and membership sync trigger may write
-- a linked staff identity. Existing external provisioning cannot convert or
-- edit one, preserving the auth-user collision boundary.
create or replace function camden_private.guard_staff_portal_identity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  authorized_write boolean :=
    current_setting('camden.staff_uat_identity_write', true) = 'allowed';
begin
  if tg_op = 'DELETE' then
    if old.linked_auth_user_id is not null then
      raise exception 'Linked staff portal identities cannot be deleted'
        using errcode = '55000';
    end if;
    return old;
  end if;

  if new.linked_auth_user_id is not null then
    if not authorized_write then
      raise exception 'Use the staff UAT identity service operation'
        using errcode = '42501';
    end if;
    if new.role <> 'coordinator' or new.rider_id is not null then
      raise exception 'Staff UAT identities are coordinator-only';
    end if;
    if not camden_private.staff_portal_membership_is_active(new.linked_auth_user_id)
      and new.access_status = 'approved' then
      raise exception 'An approved LRP staff membership is required'
        using errcode = '42501';
    end if;
  elsif tg_op = 'UPDATE' and old.linked_auth_user_id is not null then
    raise exception 'A linked staff portal identity cannot be converted'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

revoke all on function camden_private.guard_staff_portal_identity()
  from public, anon, authenticated;

drop trigger if exists camden_guard_staff_portal_identity
  on camden_private.portal_identities;
create trigger camden_guard_staff_portal_identity
before insert or update or delete on camden_private.portal_identities
for each row execute function camden_private.guard_staff_portal_identity();

create or replace function public.camden_admin_upsert_staff_portal_identity(
  p_auth_user_id uuid,
  p_normalized_phone text,
  p_full_name text default null,
  p_email text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_phone text := public.camden_normalize_phone(p_normalized_phone);
  target_name text;
  target_email text;
  auth_user auth.users%rowtype;
  identity camden_private.portal_identities%rowtype;
begin
  if not camden_private.is_service_role() then
    raise exception 'Service role required' using errcode = '42501';
  end if;
  if p_auth_user_id is null or target_phone is null then
    raise exception 'A valid staff user and E.164 phone are required';
  end if;

  select * into auth_user
  from auth.users source
  where source.id = p_auth_user_id
  for update;
  if auth_user.id is null then
    raise exception 'Staff Auth user not found' using errcode = 'P0002';
  end if;
  if not camden_private.staff_portal_membership_is_active(p_auth_user_id) then
    raise exception 'An approved LRP staff membership is required'
      using errcode = '42501';
  end if;

  target_name := coalesce(
    nullif(btrim(p_full_name), ''),
    nullif(btrim(auth_user.raw_user_meta_data->>'display_name'), ''),
    nullif(split_part(auth_user.email, '@', 1), '')
  );
  if length(coalesce(target_name, '')) not between 2 and 200 then
    raise exception 'A valid staff display name is required';
  end if;
  target_email := coalesce(
    nullif(lower(btrim(p_email)), ''),
    nullif(lower(btrim(auth_user.email)), '')
  );

  -- When Auth already owns a phone/email, the linked account must be that
  -- exact owner. A phone may be supplied for an email-only staff account only
  -- when no other primary account owns it.
  if public.camden_normalize_phone(auth_user.phone) is not null
    and public.camden_normalize_phone(auth_user.phone) <> target_phone then
    raise exception 'Staff phone does not match the linked primary account'
      using errcode = '23505';
  end if;
  if nullif(lower(btrim(auth_user.email)), '') is not null
    and target_email is distinct from lower(btrim(auth_user.email)) then
    raise exception 'Staff email does not match the linked primary account'
      using errcode = '23505';
  end if;
  if exists (
    select 1 from auth.users other_user
    where other_user.id <> p_auth_user_id
      and (
        public.camden_normalize_phone(other_user.phone) = target_phone
        or (
          target_email is not null
          and lower(btrim(other_user.email)) = target_email
        )
      )
  ) then
    raise exception 'Staff portal identity conflicts with another primary account'
      using errcode = '23505';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(target_phone, 7413));
  perform set_config('camden.staff_uat_identity_write', 'allowed', true);

  insert into camden_private.portal_identities (
    linked_auth_user_id, rider_id, role, access_status,
    full_name, normalized_phone, email,
    created_by, updated_by
  ) values (
    p_auth_user_id, null, 'coordinator', 'approved',
    target_name, target_phone, target_email,
    p_auth_user_id, p_auth_user_id
  )
  on conflict (linked_auth_user_id) where linked_auth_user_id is not null
  do update set
    rider_id = null,
    role = 'coordinator',
    access_status = 'approved',
    full_name = excluded.full_name,
    normalized_phone = excluded.normalized_phone,
    email = excluded.email,
    updated_by = excluded.updated_by
  returning * into identity;

  -- Reprovisioning rotates away every old browser session. The next login uses
  -- the same custom OTP/opaque cookie path as any coordinator.
  with revoked as (
    update camden_private.portal_sessions session
    set revoked_at = coalesce(session.revoked_at, now()),
        revoke_reason = coalesce(session.revoke_reason, 'staff_uat_reprovisioned')
    where session.identity_id = identity.id and session.revoked_at is null
    returning session.*
  )
  insert into camden_private.portal_auth_events (
    identity_id, session_id, event_type, ip_hash,
    metadata
  )
  select identity.id, revoked.id, 'session_revoked', revoked.ip_hash,
    '{"reason":"staff_uat_reprovisioned"}'::jsonb
  from revoked;

  return jsonb_build_object(
    'portal_identity_id', identity.id,
    'linked_auth_user_id', identity.linked_auth_user_id,
    'role', identity.role,
    'access_status', identity.access_status,
    'display_name', identity.full_name,
    'normalized_phone', identity.normalized_phone,
    'email', identity.email
  );
end;
$$;

revoke all on function public.camden_admin_upsert_staff_portal_identity(uuid,text,text,text)
  from public, anon, authenticated;
grant execute on function public.camden_admin_upsert_staff_portal_identity(uuid,text,text,text)
  to service_role;

-- Defense in depth: all gateway authorization continues through current_role.
-- A linked staff identity is a coordinator only while both its own access and
-- its primary Camden staff membership are approved.
create or replace function camden_private.current_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  with portal_actor as (
    select identity.role
    from camden_private.portal_identities identity
    left join public.camden_riders rider on rider.id = identity.rider_id
    where identity.id = camden_private.current_portal_identity_id()
      and identity.access_status = 'approved'
      and (identity.rider_id is null or rider.status = 'active')
      and (
        identity.linked_auth_user_id is null
        or camden_private.staff_portal_membership_is_active(identity.linked_auth_user_id)
      )
    limit 1
  ), staff_actor as (
    select membership.role
    from public.camden_program_users membership
    where camden_private.current_portal_identity_id() is null
      and membership.auth_user_id = (select auth.uid())
      and membership.access_status = 'approved'
    limit 1
  )
  select role from portal_actor
  union all
  select role from staff_actor
  limit 1;
$$;

revoke all on function camden_private.current_role()
  from public, anon;
grant execute on function camden_private.current_role()
  to authenticated, service_role;

create or replace function camden_private.sync_staff_portal_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_auth_user_id uuid;
  remains_approved boolean;
begin
  if tg_op = 'DELETE' then
    target_auth_user_id := old.auth_user_id;
    remains_approved := false;
  else
    target_auth_user_id := new.auth_user_id;
    remains_approved := new.access_status = 'approved'
      and new.role in ('lrp_operator', 'lrp_admin');
  end if;
  if remains_approved then return coalesce(new, old); end if;

  perform set_config('camden.staff_uat_identity_write', 'allowed', true);
  update camden_private.portal_identities identity
  set access_status = 'suspended', updated_by = target_auth_user_id
  where identity.linked_auth_user_id = target_auth_user_id
    and identity.access_status = 'approved';

  with revoked as (
    update camden_private.portal_sessions session
    set revoked_at = coalesce(session.revoked_at, now()),
        revoke_reason = coalesce(session.revoke_reason, 'staff_membership_inactive')
    where session.identity_id in (
      select identity.id
      from camden_private.portal_identities identity
      where identity.linked_auth_user_id = target_auth_user_id
    )
      and session.revoked_at is null
    returning session.*
  )
  insert into camden_private.portal_auth_events (
    identity_id, session_id, event_type, ip_hash, metadata
  )
  select revoked.identity_id, revoked.id, 'session_revoked', revoked.ip_hash,
    '{"reason":"staff_membership_inactive"}'::jsonb
  from revoked;

  return coalesce(new, old);
end;
$$;

revoke all on function camden_private.sync_staff_portal_membership()
  from public, anon, authenticated;

drop trigger if exists camden_sync_staff_portal_membership
  on public.camden_program_users;
create trigger camden_sync_staff_portal_membership
after update of role, access_status or delete on public.camden_program_users
for each row execute function camden_private.sync_staff_portal_membership();

comment on column camden_private.portal_identities.linked_auth_user_id is
  'Optional staff-UAT link only. Public Camden auth still uses custom OTP and opaque Camden sessions; no Supabase JWT is issued to the portal.';
comment on function public.camden_admin_upsert_staff_portal_identity(uuid,text,text,text) is
  'Service-only coordinator identity bridge for approved LRP staff UAT. Fails closed on inactive membership and never mints a Supabase session.';

commit;
