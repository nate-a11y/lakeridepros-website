-- Both request endpoints may reference a rider-owned home or a shared approved
-- program location. Existing IDs and source records remain unchanged.
begin;
set local lock_timeout = '10s';
set local statement_timeout = '2min';

-- Block source inserts while backfilling the registry and installing its triggers.
lock table public.camden_rider_pickup_locations, public.camden_locations in share row exclusive mode;
create table camden_private.request_location_ids (
  id uuid primary key,
  rider_pickup_id uuid unique references public.camden_rider_pickup_locations(id) on delete cascade,
  program_location_id uuid unique references public.camden_locations(id) on delete cascade,
  check (num_nonnulls(rider_pickup_id, program_location_id) = 1),
  check (id = coalesce(rider_pickup_id, program_location_id))
);
alter table camden_private.request_location_ids enable row level security;
revoke all on camden_private.request_location_ids from public, anon, authenticated, service_role;
-- A cross-table UUID collision aborts rather than binding a home to a facility.
insert into camden_private.request_location_ids (id, rider_pickup_id)
select id, id from public.camden_rider_pickup_locations;
insert into camden_private.request_location_ids (id, program_location_id)
select id, id from public.camden_locations;

create function camden_private.register_request_location()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_table_name = 'camden_rider_pickup_locations' then
    insert into camden_private.request_location_ids (id, rider_pickup_id) values (new.id, new.id);
  elsif tg_table_name = 'camden_locations' then
    insert into camden_private.request_location_ids (id, program_location_id) values (new.id, new.id);
  else
    raise exception 'Unsupported request location source';
  end if;
  return new;
end;
$$;
revoke all on function camden_private.register_request_location() from public, anon, authenticated, service_role;
create trigger camden_register_home_endpoint after insert on public.camden_rider_pickup_locations
for each row execute function camden_private.register_request_location();
create trigger camden_register_program_endpoint after insert on public.camden_locations
for each row execute function camden_private.register_request_location();

create view camden_private.request_locations with (security_invoker = true) as
select id, rider_id, label, label as name, address_line1, address_line2, city, state, postal_code,
  approval_status, true as active
from public.camden_rider_pickup_locations
union all
select id, null::uuid as rider_id, name as label, name, address_line1, address_line2, city, state, postal_code,
  approval_status, active
from public.camden_locations;
revoke all on camden_private.request_locations from public, anon, authenticated, service_role;

-- Keep real foreign keys (including delete protection), now to either source.
alter table public.camden_requests
  drop constraint camden_requests_pickup_location_id_fkey,
  drop constraint camden_requests_destination_location_id_fkey,
  add constraint camden_requests_pickup_location_id_fkey foreign key (pickup_location_id)
    references camden_private.request_location_ids(id) on delete restrict,
  add constraint camden_requests_destination_location_id_fkey foreign key (destination_location_id)
    references camden_private.request_location_ids(id) on delete restrict;

-- Defense in depth for writes outside the normal submit/edit RPCs. Don't reject
-- status-only updates to historical requests whose locations were later retired.
create function camden_private.validate_request_endpoints()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'UPDATE' and new.rider_id is not distinct from old.rider_id
    and new.pickup_location_id is not distinct from old.pickup_location_id
    and new.destination_location_id is not distinct from old.destination_location_id then
    return new;
  end if;
  if not exists (select 1 from camden_private.request_locations location
    where location.id = new.pickup_location_id and location.active and location.approval_status = 'approved'
      and (location.rider_id is null or location.rider_id = new.rider_id))
    or (new.destination_location_id is not null and not exists (
      select 1 from camden_private.request_locations location
      where location.id = new.destination_location_id and location.active and location.approval_status = 'approved'
        and (location.rider_id is null or location.rider_id = new.rider_id))) then
    raise exception 'Request contains an inactive or unauthorized location' using errcode = '23514';
  end if;
  return new;
end;
$$;
revoke all on function camden_private.validate_request_endpoints() from public, anon, authenticated, service_role;
create trigger camden_validate_request_endpoints before insert or update of rider_id, pickup_location_id, destination_location_id
on public.camden_requests for each row execute function camden_private.validate_request_endpoints();

-- Preserve deployed authorization, policy, audit, notifications, follow-up and
-- reporting behavior. Require each known fragment exactly once; drift fails closed.
create function pg_temp.camden_replace_once(definition text, previous text, replacement text)
returns text language plpgsql as $$
begin
  if (length(definition) - length(replace(definition, previous, ''))) / length(previous) <> 1 then
    raise exception 'Camden location function changed; review migration before applying';
  end if;
  return replace(definition, previous, replacement);
end;
$$;

do $migration$
declare
  definition text;
  signature text;
  rider_expression text;
begin
  foreach signature in array array['public.camden_submit_request(jsonb)', 'public.camden_update_pending_request(uuid,integer,jsonb)'] loop
    definition := pg_get_functiondef(signature::regprocedure);
    rider_expression := case when signature like '%camden_submit_request%' then 'target_rider_id' else 'after_request.rider_id' end;
    definition := pg_temp.camden_replace_once(definition,
      'from public.camden_rider_pickup_locations pickup', 'from camden_private.request_locations pickup');
    definition := pg_temp.camden_replace_once(definition,
      'and pickup.rider_id = ' || rider_expression,
      'and (pickup.rider_id is null or pickup.rider_id = ' || rider_expression || ') and pickup.active');
    definition := pg_temp.camden_replace_once(definition,
      'from public.camden_locations destination', 'from camden_private.request_locations destination');
    definition := pg_temp.camden_replace_once(definition,
      'and destination.active', 'and (destination.rider_id is null or destination.rider_id = ' || rider_expression || ') and destination.active');
    execute definition;
  end loop;

  -- These are the four deployed request projections, including Bolt's workspace
  -- and coordinator reporting plus the session-validating website gateway.
  foreach signature in array array[
    'public.camden_admin_workspace(text)', 'public.camden_coordinator_dashboard(text)',
    'public.camden_portal_dashboard(text)', 'public.camden_portal_gateway(text,text,jsonb)'
  ] loop
    definition := pg_get_functiondef(signature::regprocedure);
    definition := pg_temp.camden_replace_once(definition,
      'join public.camden_rider_pickup_locations pickup on pickup.id = request.pickup_location_id',
      'join camden_private.request_locations pickup on pickup.id = request.pickup_location_id');
    definition := pg_temp.camden_replace_once(definition,
      'join public.camden_locations destination on destination.id = request.destination_location_id',
      'join camden_private.request_locations destination on destination.id = request.destination_location_id');
    -- Apartment/suite is part of an approved address in either direction.
    definition := replace(definition, 'pickup.address_line1, pickup.city', 'pickup.address_line1, nullif(pickup.address_line2, ''''), pickup.city');
    definition := replace(definition, 'destination.address_line1, destination.city', 'destination.address_line1, nullif(destination.address_line2, ''''), destination.city');
    execute definition;
  end loop;
end;
$migration$;
commit;
