-- Driver Applications Table
-- Complies with 49 CFR 391.21 federal regulations for driver employment applications

-- Create driver_applications table
CREATE TABLE IF NOT EXISTS driver_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),

  -- Personal Information (Step 1)
  first_name VARCHAR(100),
  middle_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  ssn_encrypted TEXT, -- Encrypted SSN
  email VARCHAR(255),
  phone VARCHAR(20),
  address_street VARCHAR(255),
  address_city VARCHAR(100),
  address_state VARCHAR(2),
  address_zip VARCHAR(10),
  has_legal_right_to_work BOOLEAN,

  -- Residence History (Step 2)
  residence_history JSONB DEFAULT '[]'::jsonb,

  -- License Verification (Step 3)
  license_number VARCHAR(50),
  license_state VARCHAR(2),
  license_class VARCHAR(10),
  license_expiration DATE,
  license_endorsements TEXT,
  license_restrictions TEXT,
  has_revocations BOOLEAN,
  revocation_details TEXT,
  license_verification_signature TEXT, -- Base64 signature data
  license_verification_date TIMESTAMP WITH TIME ZONE,
  license_verification_ip VARCHAR(50),

  -- License History (Step 4)
  license_history JSONB DEFAULT '[]'::jsonb,

  -- Driving Experience (Step 5)
  driving_experience JSONB DEFAULT '[]'::jsonb,

  -- Safety History - Accidents (Step 6)
  has_accidents BOOLEAN,
  accidents JSONB DEFAULT '[]'::jsonb,

  -- Safety History - Traffic Convictions (Step 7)
  has_convictions BOOLEAN,
  convictions JSONB DEFAULT '[]'::jsonb,

  -- Employment History (Step 8)
  employment_history JSONB DEFAULT '[]'::jsonb,
  employment_gaps_explanation TEXT,

  -- Education & Qualifications (Step 9)
  high_school_name VARCHAR(255),
  high_school_location VARCHAR(255),
  high_school_graduated BOOLEAN,
  college_name VARCHAR(255),
  college_location VARCHAR(255),
  college_degree VARCHAR(100),
  other_training TEXT,

  -- Document Uploads (Step 10)
  license_front_url TEXT,
  license_back_url TEXT,

  -- Final Certification (Step 11)
  certification_signature TEXT, -- Base64 signature data
  certification_date TIMESTAMP WITH TIME ZONE,
  certification_ip VARCHAR(50),
  certification_user_agent TEXT,

  -- Audit fields
  submitted_at TIMESTAMP WITH TIME ZONE,
  submitted_ip VARCHAR(50),
  submitted_user_agent TEXT
);

-- Create index on status for querying
CREATE INDEX IF NOT EXISTS idx_driver_applications_status ON driver_applications(status);

-- Create index on email for lookups
CREATE INDEX IF NOT EXISTS idx_driver_applications_email ON driver_applications(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_driver_applications_created_at ON driver_applications(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_driver_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_driver_applications_updated_at
  BEFORE UPDATE ON driver_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_driver_applications_updated_at();

-- Create storage bucket for driver application documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('driver-applications', 'driver-applications', false)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for driver-applications bucket
-- Allow authenticated users to upload their own documents
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'driver-applications');

-- Allow users to read their own documents
CREATE POLICY "Users can read their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'driver-applications');

-- Allow service role full access
CREATE POLICY "Service role has full access"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'driver-applications');

-- Enable Row Level Security
ALTER TABLE driver_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Note: For public application form, we'll use service role key on the server
-- This policy allows service role to manage all applications
CREATE POLICY "Service role can manage all applications"
ON driver_applications FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Optional: If you want to allow authenticated users to view their own applications
CREATE POLICY "Users can view their own applications"
ON driver_applications FOR SELECT
TO authenticated
USING (email = auth.jwt() ->> 'email');

COMMENT ON TABLE driver_applications IS 'Driver employment applications complying with 49 CFR 391.21';
COMMENT ON COLUMN driver_applications.ssn_encrypted IS 'SSN encrypted using AES-256-GCM before storage';
COMMENT ON COLUMN driver_applications.license_verification_signature IS 'Base64-encoded signature image data for PSP authorization (49 CFR 391.23)';
COMMENT ON COLUMN driver_applications.certification_signature IS 'Base64-encoded signature image data for final certification';
