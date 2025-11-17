-- Add missing collection foreign key columns to payload_locked_documents_rels
-- These collections were added after the initial locked_documents table creation

-- Add columns for collections that were added after initial locked_documents table creation
ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "services_id" integer;
ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "service_analytics_id" integer;
ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "vehicles_id" integer;
ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "testimonials_id" integer;

-- Add foreign key constraints for the new columns
DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels"
    ADD CONSTRAINT "payload_locked_documents_rels_services_fk"
    FOREIGN KEY ("services_id")
    REFERENCES "services"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels"
    ADD CONSTRAINT "payload_locked_documents_rels_service_analytics_fk"
    FOREIGN KEY ("service_analytics_id")
    REFERENCES "service_analytics"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels"
    ADD CONSTRAINT "payload_locked_documents_rels_vehicles_fk"
    FOREIGN KEY ("vehicles_id")
    REFERENCES "vehicles"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels"
    ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk"
    FOREIGN KEY ("testimonials_id")
    REFERENCES "testimonials"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_services_idx"
  ON "payload_locked_documents_rels" ("services_id");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_service_analytics_idx"
  ON "payload_locked_documents_rels" ("service_analytics_id");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_vehicles_idx"
  ON "payload_locked_documents_rels" ("vehicles_id");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_testimonials_idx"
  ON "payload_locked_documents_rels" ("testimonials_id");
