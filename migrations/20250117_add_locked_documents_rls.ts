import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(`
    -- Enable RLS on payload_locked_documents tables
    ALTER TABLE "payload_locked_documents" ENABLE ROW LEVEL SECURITY;
    ALTER TABLE "payload_locked_documents_rels" ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if they exist (for idempotency)
    DROP POLICY IF EXISTS "Authenticated users can view locked documents" ON "payload_locked_documents";
    DROP POLICY IF EXISTS "Authenticated users can create locks" ON "payload_locked_documents";
    DROP POLICY IF EXISTS "Authenticated users can update their locks" ON "payload_locked_documents";
    DROP POLICY IF EXISTS "Authenticated users can delete locks" ON "payload_locked_documents";
    DROP POLICY IF EXISTS "Authenticated users can view lock relationships" ON "payload_locked_documents_rels";
    DROP POLICY IF EXISTS "Authenticated users can create lock relationships" ON "payload_locked_documents_rels";
    DROP POLICY IF EXISTS "Authenticated users can update lock relationships" ON "payload_locked_documents_rels";
    DROP POLICY IF EXISTS "Authenticated users can delete lock relationships" ON "payload_locked_documents_rels";

    -- RLS policies for payload_locked_documents table
    -- Only authenticated backend connections can access document locks
    CREATE POLICY "Authenticated users can view locked documents" ON "payload_locked_documents"
      FOR SELECT
      TO authenticated
      USING (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
        OR current_setting('role', true) != 'anon'
      );

    CREATE POLICY "Authenticated users can create locks" ON "payload_locked_documents"
      FOR INSERT
      TO authenticated
      WITH CHECK (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
        OR current_setting('role', true) != 'anon'
      );

    CREATE POLICY "Authenticated users can update their locks" ON "payload_locked_documents"
      FOR UPDATE
      TO authenticated
      USING (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
        OR current_setting('role', true) != 'anon'
      )
      WITH CHECK (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
        OR current_setting('role', true) != 'anon'
      );

    CREATE POLICY "Authenticated users can delete locks" ON "payload_locked_documents"
      FOR DELETE
      TO authenticated
      USING (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
        OR current_setting('role', true) != 'anon'
      );

    -- RLS policies for payload_locked_documents_rels table
    CREATE POLICY "Authenticated users can view lock relationships" ON "payload_locked_documents_rels"
      FOR SELECT
      TO authenticated
      USING (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
        OR current_setting('role', true) != 'anon'
      );

    CREATE POLICY "Authenticated users can create lock relationships" ON "payload_locked_documents_rels"
      FOR INSERT
      TO authenticated
      WITH CHECK (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
        OR current_setting('role', true) != 'anon'
      );

    CREATE POLICY "Authenticated users can update lock relationships" ON "payload_locked_documents_rels"
      FOR UPDATE
      TO authenticated
      USING (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
        OR current_setting('role', true) != 'anon'
      )
      WITH CHECK (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
        OR current_setting('role', true) != 'anon'
      );

    CREATE POLICY "Authenticated users can delete lock relationships" ON "payload_locked_documents_rels"
      FOR DELETE
      TO authenticated
      USING (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
        OR current_setting('role', true) != 'anon'
      );
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(`
    -- Remove RLS policies from both tables
    DROP POLICY IF EXISTS "Authenticated users can view locked documents" ON "payload_locked_documents";
    DROP POLICY IF EXISTS "Authenticated users can create locks" ON "payload_locked_documents";
    DROP POLICY IF EXISTS "Authenticated users can update their locks" ON "payload_locked_documents";
    DROP POLICY IF EXISTS "Authenticated users can delete locks" ON "payload_locked_documents";
    DROP POLICY IF EXISTS "Authenticated users can view lock relationships" ON "payload_locked_documents_rels";
    DROP POLICY IF EXISTS "Authenticated users can create lock relationships" ON "payload_locked_documents_rels";
    DROP POLICY IF EXISTS "Authenticated users can update lock relationships" ON "payload_locked_documents_rels";
    DROP POLICY IF EXISTS "Authenticated users can delete lock relationships" ON "payload_locked_documents_rels";

    -- Disable RLS on both tables
    ALTER TABLE "payload_locked_documents" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "payload_locked_documents_rels" DISABLE ROW LEVEL SECURITY;
  `)
}
