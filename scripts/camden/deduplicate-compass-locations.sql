\set ON_ERROR_STOP on
-- Scoped operational cleanup approved by Nate; applied 2026-09-08 America/Chicago.
-- Retained as an audit/runbook artifact; guards intentionally reject reapplication.
-- Defaults to a rollback rehearsal. At release, after rechecking current usage,
-- run with psql -v apply_changes=true to commit. Guards fail closed on data drift.
\if :{?apply_changes}
\else
  \set apply_changes false
\endif

begin;
set local lock_timeout = '5s';
set local statement_timeout = '20s';
lock table public.camden_locations, public.camden_requests, public.camden_rider_program_locations in share row exclusive mode;
create temporary table location_merge (duplicate_id uuid primary key, canonical_id uuid not null) on commit drop;
insert into location_merge values
 ('ab50475c-8be1-4982-b3a7-f684666a5736','9c831c08-615e-4ebb-a949-145def772f25'),
 ('25eaec3c-7847-433a-8a86-98682b56a5f0','1decacdf-49be-4427-958c-db4c908851c7'),
 ('9abbbade-6cfd-4463-bddb-391c9bac9123','bfb64d73-05c0-4db0-8988-f3f66d7e2f0d');
create temporary table location_before on commit drop as select id,to_jsonb(l) as value from public.camden_locations l;
create temporary table assignment_before on commit drop as select id,to_jsonb(a) as value from public.camden_rider_program_locations a;
create temporary table request_before on commit drop as select id,to_jsonb(r) as value from public.camden_requests r;
do $merge$
declare
 old_request public.camden_requests%rowtype;
 new_request public.camden_requests%rowtype;
 mapped_id uuid;
 updated_count integer;
begin
 if (select count(*) from location_merge m
   join public.camden_locations d on d.id=m.duplicate_id
   join public.camden_locations c on c.id=m.canonical_id
   join public.camden_location_categories category on category.id=c.category_id
   where d.active and c.active and d.approval_status='approved' and c.approval_status='approved'
    and category.slug='treatment'
    and row(d.name,d.address_line1,d.address_line2,d.city,d.state,d.postal_code,d.place_id)
        is not distinct from row(c.name,c.address_line1,c.address_line2,c.city,c.state,c.postal_code,c.place_id)) <> 3 then
   raise exception 'Location identity/approval changed; review before merging';
 end if;
 if exists(select 1 from public.camden_rider_program_locations a join location_merge m on m.duplicate_id=a.location_id) then
   raise exception 'Duplicate now has participant assignments; review before merging';
 end if;
 if (select count(*) from public.camden_requests r join location_merge m on m.duplicate_id=r.destination_location_id) <> 1 then
   raise exception 'Request usage changed; review before merging';
 end if;
 for old_request in select r.* from public.camden_requests r join location_merge m on m.duplicate_id=r.destination_location_id loop
   select canonical_id into strict mapped_id from location_merge where duplicate_id=old_request.destination_location_id;
   update public.camden_requests set destination_location_id=mapped_id, version=version+1
   where id=old_request.id returning * into strict new_request;
   if (to_jsonb(old_request)-array['destination_location_id','updated_at','version'])
     is distinct from (to_jsonb(new_request)-array['destination_location_id','updated_at','version']) then
     raise exception 'Unrelated request fields changed';
   end if;
   perform camden_private.record_event(old_request.id,'destination_catalog_deduplicated','lrp_only',
     jsonb_build_object('destination_location_id',old_request.destination_location_id,'version',old_request.version),
     jsonb_build_object('destination_location_id',new_request.destination_location_id,'version',new_request.version),
     jsonb_build_object('reason','Nate approved consolidating identical Compass Health facility entries. Physical route, status, and Moovs links unchanged.'));
 end loop;
 update public.camden_locations l set active=false from location_merge m where l.id=m.duplicate_id;
 get diagnostics updated_count = row_count;
 if updated_count <> 3 then raise exception 'Expected exactly three duplicate records to retire'; end if;
 if exists(select 1 from location_before b join public.camden_locations l using(id) left join location_merge m on m.duplicate_id=l.id
   where case when m.duplicate_id is null then b.value is distinct from to_jsonb(l)
      else (b.value-array['active','updated_at']) is distinct from (to_jsonb(l)-array['active','updated_at']) end) then
   raise exception 'Unrelated location fields changed';
 end if;
 if exists(select 1 from assignment_before b full join public.camden_rider_program_locations a using(id) where b.value is distinct from to_jsonb(a)) then
   raise exception 'Participant assignments changed';
 end if;
 if exists(select 1 from request_before b full join public.camden_requests r using(id)
   left join location_merge m on m.duplicate_id=(b.value->>'destination_location_id')::uuid
   where case when m.duplicate_id is null then b.value is distinct from to_jsonb(r)
     else (b.value-array['destination_location_id','updated_at','version']) is distinct from (to_jsonb(r)-array['destination_location_id','updated_at','version']) end) then
   raise exception 'Unrelated requests changed';
 end if;
 if exists(select 1 from public.camden_requests r join location_merge m on m.duplicate_id=r.destination_location_id) then
   raise exception 'Duplicate request references remain';
 end if;
 if (select count(*) from public.camden_locations where active and approval_status='approved' and name like 'Compass Health%')<>3 then
   raise exception 'Expected one active Compass Health location per city';
 end if;
end;
$merge$;

\if :apply_changes
commit;
\else
rollback;
\endif
