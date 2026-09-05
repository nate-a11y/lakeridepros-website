-- Read-only regression checks against a seeded Camden database after migration.
-- Requires at least one approved coordinator identity and one active rider
-- identity. Prints no participant identifiers, phones, or roster contents.
-- Execute as the migration owner with psql -v ON_ERROR_STOP=1.
begin read only;
set local statement_timeout = '30s';
set local request.jwt.claims = '{"role":"service_role"}';

do $test$
declare
  actor_id uuid;
  baseline jsonb;
  scoped jsonb;
  expected jsonb;
begin
  select id into actor_id from camden_private.portal_identities
  where role = 'coordinator' and access_status = 'approved'
    and (linked_auth_user_id is null
      or camden_private.staff_portal_membership_is_active(linked_auth_user_id))
  limit 1;
  if actor_id is null then raise exception 'Seed an approved coordinator before this test'; end if;
  perform set_config('camden.portal_identity_id', actor_id::text, true);

  baseline := public.camden_participant_snapshots(null,null);
  scoped := camden_private.camden_participant_snapshots_with_roster_scoped(null,null,false);
  assert baseline = scoped, 'All-participant metrics or roster changed';
  select coalesce(jsonb_agg(participant order by participant->>'full_name'), '[]'::jsonb)
  into expected from jsonb_array_elements(baseline->'participants') participant
  where participant#>>'{roster,transportation_eligibility}' = 'approved';
  scoped := camden_private.camden_participant_snapshots_with_roster_scoped(null,null,true);
  assert scoped->'participants' = expected, 'Approved filtering or participant metrics changed';
  assert scoped = camden_private.camden_participant_snapshots_with_roster_scoped(null,null,null),
    'Null scope must default to approved';

  select identity.id into actor_id from camden_private.portal_identities identity
  join public.camden_riders rider on rider.id = identity.rider_id
  where identity.role = 'rider' and identity.access_status = 'approved'
    and rider.status = 'active'
    and (identity.linked_auth_user_id is null
      or camden_private.staff_portal_membership_is_active(identity.linked_auth_user_id))
  limit 1;
  if actor_id is null then raise exception 'Seed an active rider before this test'; end if;
  perform set_config('camden.portal_identity_id', actor_id::text, true);
  baseline := public.camden_participant_snapshots(null,null);
  scoped := camden_private.camden_participant_snapshots_with_roster_scoped(null,null,true);
  assert scoped = baseline, 'Rider history changed';
  assert jsonb_array_length(scoped->'participants') = 1, 'Rider isolation failed';
  assert not ((scoped->'participants'->0) ? 'roster'), 'Rider roster disclosure';
  assert scoped#>>'{participants,0,metrics,total_cost}' is null, 'Rider cost disclosure';

  perform set_config('camden.portal_identity_id', '', true);
  begin
    perform camden_private.camden_participant_snapshots_with_roster_scoped(null,null,false);
    raise exception 'Missing actor should be denied';
  exception when insufficient_privilege then null;
  end;
  assert not has_function_privilege('anon', 'camden_private.camden_participant_snapshots_scoped(date,date,boolean)', 'execute');
  assert not has_function_privilege('authenticated', 'camden_private.camden_participant_snapshots_with_roster_scoped(date,date,boolean)', 'execute');
  assert not has_function_privilege('service_role', 'camden_private.camden_participant_snapshots_with_roster_scoped(date,date,boolean)', 'execute');
end;
$test$;
rollback;
