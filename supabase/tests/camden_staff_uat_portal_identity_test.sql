\set ON_ERROR_STOP on

begin;

do $$
begin
  if has_function_privilege(
      'anon',
      'public.camden_admin_upsert_staff_portal_identity(uuid,text,text,text)',
      'EXECUTE'
    )
    or has_function_privilege(
      'authenticated',
      'public.camden_admin_upsert_staff_portal_identity(uuid,text,text,text)',
      'EXECUTE'
    )
    or not has_function_privilege(
      'service_role',
      'public.camden_admin_upsert_staff_portal_identity(uuid,text,text,text)',
      'EXECUTE'
    )
    or has_table_privilege(
      'authenticated', 'camden_private.portal_identities', 'SELECT'
    )
  then
    raise exception 'Staff UAT identity boundary grants are unsafe';
  end if;
end;
$$;

insert into auth.users (id, phone, email, raw_user_meta_data) values
  (
    'cb000000-0000-4000-8000-000000000001',
    '+15735551001', 'nate-uat@example.com',
    '{"display_name":"Nate UAT"}'::jsonb
  ),
  (
    'cb000000-0000-4000-8000-000000000002',
    null, 'michael-uat@example.com',
    '{"display_name":"Michael UAT"}'::jsonb
  ),
  (
    'cb000000-0000-4000-8000-000000000003',
    '+15735551003', 'other-primary@example.com',
    '{}'::jsonb
  ),
  (
    'cb000000-0000-4000-8000-000000000004',
    '+15735551004', 'inactive-staff@example.com',
    '{}'::jsonb
  );

insert into public.camden_program_users (
  auth_user_id, role, access_status
) values
  ('cb000000-0000-4000-8000-000000000001', 'lrp_admin', 'approved'),
  ('cb000000-0000-4000-8000-000000000002', 'lrp_operator', 'approved'),
  ('cb000000-0000-4000-8000-000000000004', 'lrp_operator', 'suspended');

set role service_role;
select set_config('request.jwt.claim.sub', '', false);
select set_config('request.jwt.claims', '{"role":"service_role"}', false);

create temporary table nate_staff_identity as
select result->>'portal_identity_id' as id
from (
  select public.camden_admin_upsert_staff_portal_identity(
    'cb000000-0000-4000-8000-000000000001',
    '+15735551001', null, null
  ) result
) source;

create temporary table michael_staff_identity as
select result->>'portal_identity_id' as id
from (
  select public.camden_admin_upsert_staff_portal_identity(
    'cb000000-0000-4000-8000-000000000002',
    '+15735551002', 'Michael UAT', null
  ) result
) source;

do $$
begin
  if not exists (
    select 1
    from camden_private.portal_identities identity
    where identity.id = (select id::uuid from nate_staff_identity)
      and identity.linked_auth_user_id = 'cb000000-0000-4000-8000-000000000001'
      and identity.role = 'coordinator'
      and identity.rider_id is null
      and identity.access_status = 'approved'
      and identity.normalized_phone = '+15735551001'
  ) then
    raise exception 'Nate staff UAT identity was not safely linked';
  end if;
  if not exists (
    select 1
    from camden_private.portal_identities identity
    where identity.id = (select id::uuid from michael_staff_identity)
      and identity.linked_auth_user_id = 'cb000000-0000-4000-8000-000000000002'
      and identity.normalized_phone = '+15735551002'
  ) then
    raise exception 'Email-only Michael account could not receive an explicit UAT phone';
  end if;
  if not public.camden_portal_identity_auth_collision(
    '+15735551001', 'nate-uat@example.com'
  ) then
    raise exception 'Existing primary-account collision protections were weakened';
  end if;
  begin
    perform public.camden_admin_upsert_portal_identity(jsonb_build_object(
      'role', 'coordinator', 'full_name', 'Generic duplicate',
      'normalized_phone', '+15735551001',
      'email', 'nate-uat@example.com', 'access_status', 'approved'
    ));
    raise exception 'Generic external provisioning bypassed primary-account collision';
  exception when unique_violation then null;
  end;
  begin
    perform public.camden_admin_upsert_staff_portal_identity(
      'cb000000-0000-4000-8000-000000000002',
      '+15735551003', 'Michael UAT', null
    );
    raise exception 'Staff UAT phone owned by another Auth user was accepted';
  exception when unique_violation then null;
  end;
  begin
    perform public.camden_admin_upsert_staff_portal_identity(
      'cb000000-0000-4000-8000-000000000004',
      '+15735551004', 'Inactive Staff', null
    );
    raise exception 'Suspended LRP member received a staff UAT identity';
  exception when insufficient_privilege then null;
  end;
end;
$$;

-- Public login remains Camden OTP + opaque session. Verification returns a
-- coordinator context but no Supabase access/refresh token.
select public.camden_issue_portal_challenge(
  'cb100000-0000-4000-8000-000000000001',
  '+15735551001', repeat('a', 64), repeat('1', 64),
  'staff UAT SQL test', now() + interval '10 minutes'
);
select public.camden_record_portal_challenge_delivery(
  'cb100000-0000-4000-8000-000000000001', true
);
create temporary table nate_verify_result as
select public.camden_verify_portal_challenge(
  'cb100000-0000-4000-8000-000000000001', repeat('a', 64),
  'nate-staff-uat-opaque-session-token-000000000001',
  repeat('1', 64), 'staff UAT SQL test'
) result;

do $$
declare
  result jsonb := (select nate_verify_result.result from nate_verify_result);
  context jsonb;
begin
  if not (result->>'verified')::boolean
    or result->>'role' <> 'coordinator'
    or result ? 'access_token'
    or result ? 'refresh_token'
  then
    raise exception 'Staff UAT verification exposed or depended on a Supabase JWT';
  end if;
  context := public.camden_portal_gateway(
    'nate-staff-uat-opaque-session-token-000000000001',
    'current_context', '{}'
  );
  if context->>'role' <> 'coordinator'
    or context->>'portal_identity_id' <> (select id from nate_staff_identity)
    or context ? 'access_token'
  then
    raise exception 'Staff UAT opaque session did not resolve as coordinator';
  end if;
  if not exists (
    select 1 from camden_private.portal_sessions session
    where session.identity_id = (select id::uuid from nate_staff_identity)
      and session.token_hash <> 'nate-staff-uat-opaque-session-token-000000000001'
      and length(session.token_hash) = 64
      and session.revoked_at is null
  ) then
    raise exception 'Raw staff UAT session token was stored or session is missing';
  end if;
end;
$$;

-- Membership suspension synchronously suspends the linked identity and revokes
-- every custom Camden session. Reapproving membership alone is intentionally
-- insufficient; a service-only reprovision is required.
update public.camden_program_users
set access_status = 'suspended'
where auth_user_id = 'cb000000-0000-4000-8000-000000000001';

do $$
declare
  issue_result jsonb;
begin
  if not exists (
    select 1 from camden_private.portal_identities identity
    where identity.id = (select id::uuid from nate_staff_identity)
      and identity.access_status = 'suspended'
  ) or not exists (
    select 1 from camden_private.portal_sessions session
    where session.identity_id = (select id::uuid from nate_staff_identity)
      and session.revoked_at is not null
      and session.revoke_reason = 'staff_membership_inactive'
  ) then
    raise exception 'Staff membership suspension did not revoke Camden access';
  end if;
  begin
    perform public.camden_portal_gateway(
      'nate-staff-uat-opaque-session-token-000000000001',
      'current_context', '{}'
    );
    raise exception 'Suspended staff member retained gateway access';
  exception when insufficient_privilege then null;
  end;
  issue_result := public.camden_issue_portal_challenge(
    'cb100000-0000-4000-8000-000000000011',
    '+15735551001', repeat('b', 64), repeat('1', 64),
    'staff UAT SQL test', now() + interval '10 minutes'
  );
  if (issue_result->>'accepted')::boolean then
    raise exception 'Suspended staff member received a new OTP challenge';
  end if;
end;
$$;

update public.camden_program_users
set access_status = 'approved'
where auth_user_id = 'cb000000-0000-4000-8000-000000000001';
do $$
begin
  if exists (
    select 1 from camden_private.portal_identities identity
    where identity.id = (select id::uuid from nate_staff_identity)
      and identity.access_status = 'approved'
  ) then
    raise exception 'Staff UAT identity auto-reactivated without explicit service approval';
  end if;
end;
$$;

select public.camden_admin_upsert_staff_portal_identity(
  'cb000000-0000-4000-8000-000000000001',
  '+15735551001', 'Nate UAT', null
);

-- Removing Michael's staff membership also fails closed.
delete from public.camden_program_users
where auth_user_id = 'cb000000-0000-4000-8000-000000000002';
do $$
begin
  if not exists (
    select 1 from camden_private.portal_identities identity
    where identity.id = (select id::uuid from michael_staff_identity)
      and identity.access_status = 'suspended'
  ) then
    raise exception 'Deleted staff membership left linked UAT access active';
  end if;
end;
$$;

reset role;

rollback;

select 'Camden staff UAT portal identity tests passed' as result;
