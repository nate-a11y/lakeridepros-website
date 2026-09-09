\set ON_ERROR_STOP on
-- Synthetic, rollback-only test. Run on an isolated database with Camden migrations.
begin;
set local request.jwt.claims = '{"role":"service_role"}';
insert into public.camden_riders (id, full_name, normalized_phone, status) values
 ('cb100000-0000-4000-8000-000000000001', 'Route Test One', '+15735550801', 'active'),
 ('cb100000-0000-4000-8000-000000000002', 'Route Test Two', '+15735550802', 'active');
insert into camden_private.portal_identities (id,rider_id,role,access_status,full_name,normalized_phone) values
 ('cb900000-0000-4000-8000-000000000001','cb100000-0000-4000-8000-000000000001','rider','approved','Route Test One','+15735550801');
insert into camden_private.portal_identities (id,role,access_status,full_name,normalized_phone) values
 ('cb900000-0000-4000-8000-000000000002','coordinator','approved','Route Coordinator','+15735550803');
insert into auth.users (id) values ('cb900000-0000-4000-8000-000000000003');
insert into public.camden_program_users (auth_user_id,role,access_status) values
 ('cb900000-0000-4000-8000-000000000003','lrp_admin','approved');
insert into camden_private.portal_sessions (identity_id, token_hash) values
 ('cb900000-0000-4000-8000-000000000001', encode(sha256(convert_to('synthetic-camden-route-session-for-local-test','UTF8')),'hex'));
insert into public.camden_rider_pickup_locations (id,rider_id,label,address_line1,address_line2,city,state,postal_code,approval_status) values
 ('cb200000-0000-4000-8000-000000000001','cb100000-0000-4000-8000-000000000001','Home','101 Test St','Unit A','Camdenton','MO','65020','approved'),
 ('cb200000-0000-4000-8000-000000000002','cb100000-0000-4000-8000-000000000002','Other Home','102 Test St',null,'Camdenton','MO','65020','approved'),
 ('cb200000-0000-4000-8000-000000000003','cb100000-0000-4000-8000-000000000001','Pending Home','103 Test St',null,'Camdenton','MO','65020','pending');
insert into public.camden_locations (id,category_id,name,address_line1,city,state,postal_code,approval_status,active) values
 ('cb400000-0000-4000-8000-000000000001',(select id from public.camden_location_categories limit 1),'Test Clinic','201 Test Rd','Camdenton','MO','65020','approved',true),
 ('cb400000-0000-4000-8000-000000000002',(select id from public.camden_location_categories limit 1),'Inactive Clinic','202 Test Rd','Camdenton','MO','65020','approved',false),
 ('cb400000-0000-4000-8000-000000000003',(select id from public.camden_location_categories limit 1),'Pending Clinic','203 Test Rd','Camdenton','MO','65020','pending',true);
insert into public.camden_ride_types (id,name,slug,minimum_notice_minutes,same_day_allowed) values
 ('cb500000-0000-4000-8000-000000000001','Route regression','route-regression',0,true);
select set_config('camden.portal_identity_id','cb900000-0000-4000-8000-000000000001',true);

do $test$
declare
  home uuid := 'cb200000-0000-4000-8000-000000000001';
  clinic uuid := 'cb400000-0000-4000-8000-000000000001';
  input jsonb := jsonb_build_object('ride_type_id','cb500000-0000-4000-8000-000000000001',
    'service_date',current_date + 3,'requested_pickup_time','09:00','appointment_time','10:00',
    'direction','one_way','duplicate_override',true);
  outbound public.camden_requests;
  inbound public.camden_requests;
  copied public.camden_requests;
  invalid_id uuid;
  endpoint text;
  detail jsonb;
  api_role text;
begin
  perform public.camden_accept_current_policy();
  outbound := public.camden_submit_request(input || jsonb_build_object('pickup_location_id',home,'destination_location_id',clinic));
  inbound := public.camden_submit_request(input || jsonb_build_object('pickup_location_id',clinic,'destination_location_id',home));
  assert inbound.pickup_location_id = clinic and inbound.destination_location_id = home, 'Return-home route was not preserved';
  copied := public.camden_duplicate_request(inbound.id, jsonb_build_object('duplicate_override',true,'service_date',current_date + 4));
  assert copied.pickup_location_id = clinic and copied.destination_location_id = home, 'Duplicate lost the inbound route';
  outbound := public.camden_update_pending_request(outbound.id,outbound.version,
    jsonb_build_object('pickup_location_id',clinic,'destination_location_id',home,'direction','round_trip','return_type','call_when_ready'));
  assert outbound.pickup_location_id = clinic and outbound.destination_location_id = home and outbound.direction = 'round_trip', 'Editing a route failed';
  detail := public.camden_portal_dashboard(null);
  select item into detail from jsonb_array_elements(detail->'requests') item where item->>'id' = inbound.id::text;
  assert detail->>'pickup_label' = 'Test Clinic' and detail->>'destination_name' = 'Home', 'Dashboard reversed or lost the route';
  assert detail->>'destination_address' like '%Unit A%', 'Home unit was lost';

  detail := public.camden_portal_gateway('synthetic-camden-route-session-for-local-test','request_detail',jsonb_build_object('request_id',inbound.id));
  assert detail#>>'{request,pickup_name}' = 'Test Clinic' and detail#>>'{request,destination_name}' = 'Home', 'Gateway detail lost the inbound route';
  assert detail#>>'{request,destination_address}' like '%Unit A%', 'Gateway lost the home unit';
  assert not exists (select 1 from jsonb_array_elements(public.camden_portal_dashboard(null)->'pickup_locations') item
    where item->>'rider_id' <> 'cb100000-0000-4000-8000-000000000001'), 'Another rider home leaked';
  perform set_config('camden.portal_identity_id','cb900000-0000-4000-8000-000000000002',true);
  detail := public.camden_coordinator_dashboard(null);
  select item into detail from jsonb_array_elements(detail->'requests') item where item->>'id' = inbound.id::text;
  assert detail->>'pickup_label' = 'Test Clinic' and detail->>'destination_name' = 'Home', 'Coordinator report lost the inbound route';
  copied := public.camden_submit_request(input || jsonb_build_object('rider_id','cb100000-0000-4000-8000-000000000001','pickup_location_id',clinic,'destination_location_id',home));
  assert copied.rider_id = inbound.rider_id and copied.destination_location_id = home, 'Coordinator on-behalf inbound submission failed';
  perform set_config('camden.portal_identity_id','',true);
  perform set_config('request.jwt.claim.sub','cb900000-0000-4000-8000-000000000003',true);
  detail := public.camden_admin_workspace(null);
  select item into detail from jsonb_array_elements(detail->'requests') item where item->>'id' = inbound.id::text;
  assert detail->>'pickup_label' = 'Test Clinic' and detail->>'destination_name' = 'Home', 'Bolt workspace lost the inbound route';
  perform set_config('request.jwt.claim.sub','',true);
  perform set_config('camden.portal_identity_id','cb900000-0000-4000-8000-000000000001',true);
  foreach api_role in array array['anon','authenticated','service_role'] loop
    assert not has_table_privilege(api_role,'camden_private.request_locations','SELECT'), 'Private endpoint view exposed';
    assert not has_table_privilege(api_role,'camden_private.request_location_ids','SELECT'), 'Private endpoint registry exposed';
    assert not has_function_privilege(api_role,'camden_private.register_request_location()','EXECUTE'), 'Registry trigger exposed';
    assert not has_function_privilege(api_role,'camden_private.validate_request_endpoints()','EXECUTE'), 'Validation trigger exposed';
  end loop;

  foreach invalid_id in array array['cb200000-0000-4000-8000-000000000002'::uuid,
    'cb200000-0000-4000-8000-000000000003'::uuid,'cb400000-0000-4000-8000-000000000002'::uuid,
    'cb400000-0000-4000-8000-000000000003'::uuid,'cb400000-0000-4000-8000-000000000099'::uuid]
  loop
    foreach endpoint in array array['pickup_location_id','destination_location_id'] loop
      begin
        perform public.camden_submit_request(input || jsonb_build_object('pickup_location_id',home,'destination_location_id',clinic) || jsonb_build_object(endpoint,invalid_id));
        raise exception 'Unauthorized endpoint was accepted' using errcode = 'XX000';
      exception when raise_exception or foreign_key_violation or check_violation then null;
      end;
      begin
        perform public.camden_update_pending_request(inbound.id,inbound.version,jsonb_build_object(endpoint,invalid_id));
        raise exception 'Unauthorized endpoint edit was accepted' using errcode = 'XX000';
      exception when raise_exception or foreign_key_violation or check_violation then null;
      end;
    end loop;
  end loop;
  begin
    update public.camden_requests set destination_location_id = 'cb200000-0000-4000-8000-000000000002' where id = inbound.id;
    raise exception 'Direct update bypassed home ownership' using errcode = 'XX000';
  exception when check_violation then null;
  end;
  -- A retired location remains visible on historical rides, and status changes
  -- are still allowed. New requests at that location remain prohibited above.
  update public.camden_locations set active = false where id = clinic;
  update public.camden_requests set status = 'acknowledged' where id = inbound.id;
  detail := public.camden_portal_gateway('synthetic-camden-route-session-for-local-test','request_detail',jsonb_build_object('request_id',inbound.id));
  assert detail#>>'{request,pickup_name}' = 'Test Clinic', 'Historical endpoint disappeared after retirement';
  begin
    delete from public.camden_locations where id = clinic;
    raise exception 'Referenced facility was deleted' using errcode = 'XX000';
  exception when foreign_key_violation then null;
  end;
  begin
    delete from public.camden_rider_pickup_locations where id = home;
    raise exception 'Referenced home was deleted' using errcode = 'XX000';
  exception when foreign_key_violation then null;
  end;
end;
$test$;
rollback;
