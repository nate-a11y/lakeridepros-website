-- Website-only snapshot filtering before metric/location aggregation.
-- Existing public two-argument RPC (LRP Bolt) keeps its all-roster semantics.
-- No participant records, permissions, or transportation approvals are changed.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '2min';

-- The personal-use check previously normalized/scanned all trips per rider.
create index if not exists trip_reservations_camden_normalized_phone_idx
  on public.trip_reservations (public.camden_normalize_phone(passenger_phone));

CREATE OR REPLACE FUNCTION camden_private.camden_participant_snapshots_scoped(p_start_date date, p_end_date date, p_approved_only boolean)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  actor_role text := camden_private.current_role();
  actor_rider_id uuid := camden_private.current_rider_id();
  settings public.camden_program_settings%rowtype;
  start_date date;
  end_date date;
  result jsonb;
begin
  if actor_role is null
    or actor_role not in ('rider', 'coordinator', 'lrp_operator', 'lrp_admin') then
    raise exception 'Camden participant access required' using errcode = '42501';
  end if;
  select * into settings from public.camden_program_settings where id = 1;
  start_date := coalesce(
    p_start_date, settings.program_start_date, settings.budget_period_start,
    date_trunc('month', current_date)::date
  );
  end_date := coalesce(
    p_end_date, greatest(current_date, start_date)
  );
  if end_date < start_date then
    raise exception 'Snapshot end date must be on or after start date';
  end if;
  if end_date > start_date + 3660 then
    raise exception 'Snapshot period cannot exceed ten years';
  end if;

  with eligible_riders as (
    select rider.*
    from public.camden_riders rider
    where (actor_role = 'rider' and rider.id = actor_rider_id)
      or (
        actor_role in ('coordinator', 'lrp_operator', 'lrp_admin')
        and (not coalesce(p_approved_only, true) or exists (
          select 1 from camden_private.participant_roster_details details
          where details.rider_id = rider.id
            and details.transportation_eligibility = 'approved'
        ))
      )
  ), participant_rows as (
    select jsonb_build_object(
      'rider_id', rider.id,
      'full_name', rider.full_name,
      'phone', rider.normalized_phone,
      'email', rider.email,
      'status', rider.status,
      'phase', rider.program_phase,
      'home_locations', coalesce(home_locations.items, '[]'::jsonb),
      'treatment_locations', coalesce(treatment_locations.items, '[]'::jsonb),
      'drug_testing_sites', coalesce(drug_testing_locations.items, '[]'::jsonb),
      'metrics', jsonb_build_object(
        'rides_scheduled', coalesce(metrics.rides_scheduled, 0),
        'rides_completed', coalesce(metrics.rides_completed, 0),
        'rides_cancelled', coalesce(metrics.rides_cancelled, 0),
        'no_shows', coalesce(metrics.no_shows, 0),
        'finalized_rides', coalesce(metrics.finalized_rides, 0),
        'cancellation_rate', case
          when coalesce(metrics.finalized_rides, 0) = 0 then 0
          else round(
            metrics.rides_cancelled::numeric
              / metrics.finalized_rides::numeric * 100,
            2
          )
        end,
        'total_cost', case when actor_role = 'rider'
          then null else coalesce(metrics.total_cost, 0) end
      ),
      'personal_usage_detected', case when actor_role = 'rider'
        then null else coalesce(personal.personal_usage_detected, false) end,
      'personal_usage_override', case when actor_role = 'rider'
        then null else rider.personal_usage_override end,
      'has_personal_transportation', case when actor_role = 'rider'
        then null else coalesce(
          rider.personal_usage_override,
          personal.personal_usage_detected,
          false
        ) end
    ) as payload
    from eligible_riders rider
    left join lateral (
      select jsonb_agg(jsonb_build_object(
        'id', pickup.id,
        'name', pickup.label,
        'address', concat_ws(', ', pickup.address_line1,
          nullif(pickup.address_line2, ''), pickup.city,
          pickup.state || ' ' || pickup.postal_code),
        'is_primary', pickup.is_default
      ) order by pickup.is_default desc, pickup.label) as items
      from public.camden_rider_pickup_locations pickup
      where pickup.rider_id = rider.id
        and pickup.approval_status = 'approved'
    ) home_locations on true
    left join lateral (
      select jsonb_agg(jsonb_build_object(
        'id', location.id,
        'name', location.name,
        'address', concat_ws(', ', location.address_line1,
          nullif(location.address_line2, ''), location.city,
          location.state || ' ' || location.postal_code),
        'is_primary', assignment.is_primary
      ) order by assignment.is_primary desc, location.name) as items
      from public.camden_rider_program_locations assignment
      join public.camden_locations location on location.id = assignment.location_id
      where assignment.rider_id = rider.id
        and assignment.purpose = 'treatment'
        and assignment.active
        and location.active and location.approval_status = 'approved'
    ) treatment_locations on true
    left join lateral (
      select jsonb_agg(jsonb_build_object(
        'id', location.id,
        'name', location.name,
        'address', concat_ws(', ', location.address_line1,
          nullif(location.address_line2, ''), location.city,
          location.state || ' ' || location.postal_code),
        'is_primary', assignment.is_primary
      ) order by assignment.is_primary desc, location.name) as items
      from public.camden_rider_program_locations assignment
      join public.camden_locations location on location.id = assignment.location_id
      where assignment.rider_id = rider.id
        and assignment.purpose = 'drug_testing'
        and assignment.active
        and location.active and location.approval_status = 'approved'
    ) drug_testing_locations on true
    left join lateral (
      select
        count(*)::integer as rides_scheduled,
        count(*) filter (where leg.is_completed)::integer as rides_completed,
        count(*) filter (where leg.is_cancelled)::integer as rides_cancelled,
        count(*) filter (where leg.is_no_show)::integer as no_shows,
        count(*) filter (
          where leg.is_completed or leg.is_cancelled or leg.is_no_show
        )::integer as finalized_rides,
        coalesce(sum(leg.total_amount), 0) as total_cost
      from (
        select distinct on (trip.id)
          trip.id,
          trip.total_amount,
          (
            request.status <> 'no_show'
            and (
              coalesce(trip.cancelled, false)
              or lower(coalesce(trip.status_slug, '')) in ('cancelled', 'canceled')
              or lower(coalesce(trip.closed_status, '')) in ('cancelled', 'canceled')
            )
          ) as is_cancelled,
          (request.status = 'no_show') as is_no_show,
          (
            request.status <> 'no_show'
            and not coalesce(trip.cancelled, false)
            and lower(coalesce(trip.status_slug, '')) not in ('cancelled', 'canceled')
            and lower(coalesce(trip.closed_status, '')) not in ('cancelled', 'canceled')
            and (
              lower(coalesce(trip.status_slug, '')) in ('done', 'complete', 'completed', 'closed')
              or lower(coalesce(trip.closed_status, '')) in ('done', 'complete', 'completed', 'closed')
            )
          ) as is_completed
        from public.camden_request_trip_links link
        join public.camden_requests request on request.id = link.request_id
        join public.trip_reservations trip on trip.id = link.trip_reservation_id
        where request.rider_id = rider.id
          and request.request_kind = 'ride'
          and link.reconciliation_state = 'linked'
          and trip.pickup_date between start_date and end_date
        order by trip.id, link.matched_at desc
      ) leg
    ) metrics on true
    left join lateral (
      select exists (
        select 1
        from public.trip_reservations trip
        where public.camden_normalize_phone(trip.passenger_phone)
            = rider.normalized_phone
          and not camden_private.trip_is_in_program_scope(
            trip.company_id, trip.booking_contact_id
          )
          and not exists (
            select 1 from public.camden_request_trip_links link
            where link.trip_reservation_id = trip.id
              and link.reconciliation_state = 'linked'
          )
      ) as personal_usage_detected
    ) personal on true
  )
  select jsonb_build_object(
    'period', jsonb_build_object(
      'start_date', start_date,
      'end_date', end_date
    ),
    'participants', coalesce(
      (select jsonb_agg(payload order by payload->>'full_name') from participant_rows),
      '[]'::jsonb
    )
  ) into result;

  return result;
end;
$function$;

CREATE OR REPLACE FUNCTION camden_private.camden_participant_snapshots_with_roster_scoped(p_start_date date, p_end_date date, p_approved_only boolean)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  actor_role text := camden_private.current_role();
  result jsonb := camden_private.camden_participant_snapshots_scoped(
    p_start_date,
    p_end_date,
    p_approved_only
  );
  participants jsonb;
begin
  if actor_role = 'rider' then return result; end if;
  if actor_role is null
    or actor_role not in ('coordinator', 'lrp_operator', 'lrp_admin') then
    raise exception 'Camden participant access required' using errcode = '42501';
  end if;

  select coalesce(jsonb_agg(
    participant || jsonb_build_object(
      'roster', jsonb_build_object(
        'court_program', details.court_program,
        'jurisdiction_county', details.jurisdiction_county,
        'case_number', details.case_number,
        -- Keep the legacy keys until both clients have completed rollout.
        'program_started_on', details.program_started_on,
        'program_start_needs_review', coalesce(
          details.phase_started_on > current_date,
          false
        ),
        'phase_started_on', details.phase_started_on,
        'phase_start_needs_review', coalesce(
          details.phase_started_on > current_date,
          false
        ),
        'next_phase', details.next_phase,
        'next_phase_target_on', details.next_phase_target_on,
        'supervision_provider', details.supervision_provider,
        'phase_progress_status', details.phase_progress_status,
        'treatment_provider', details.treatment_provider,
        'curfew', details.curfew,
        'source_home_address', details.source_home_address,
        'transportation_eligibility', coalesce(
          details.transportation_eligibility,
          'pending'
        )
      )
    ) order by participant->>'full_name'
  ), '[]'::jsonb)
  into participants
  from jsonb_array_elements(coalesce(result->'participants', '[]'::jsonb)) participant
  left join camden_private.participant_roster_details details
    on details.rider_id = (participant->>'rider_id')::uuid;

  return jsonb_set(result, '{participants}', participants, true);
end;
$function$;

-- Only the existing session-validating gateway may expose the scoped functions.
revoke all on function
  camden_private.camden_participant_snapshots_scoped(date,date,boolean),
  camden_private.camden_participant_snapshots_with_roster_scoped(date,date,boolean)
from public, anon, authenticated, service_role;

-- Preserve every other operation and all deployed session/role checks.
-- Fail closed if the deployed gateway no longer has the expected snapshot arm.
do $migration$
declare
  definition text := pg_get_functiondef('public.camden_portal_gateway(text,text,jsonb)'::regprocedure);
  previous_arm text := $old$return public.camden_participant_snapshots(
        nullif(payload->>'start_date', '')::date,
        nullif(payload->>'end_date', '')::date
      );$old$;
  replacement_arm text := $new$return camden_private.camden_participant_snapshots_with_roster_scoped(
        nullif(payload->>'start_date', '')::date,
        nullif(payload->>'end_date', '')::date,
        coalesce((payload->>'approved_only')::boolean, true)
      );$new$;
begin
  if strpos(definition, previous_arm) = 0 then
    raise exception 'Snapshot gateway has changed; review migration before applying';
  end if;
  execute replace(definition, previous_arm, replacement_arm);
end;
$migration$;

commit;
