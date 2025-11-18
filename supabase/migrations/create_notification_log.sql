-- Notification Log Table
-- Tracks all email and SMS notifications sent from the driver application system
-- COMPLIANCE: Provides audit trail for regulatory requirements

-- Create notification_log table
CREATE TABLE IF NOT EXISTS notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  application_id UUID REFERENCES driver_applications(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('email', 'sms')),
  template_name TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'pending', 'bounced')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  sent_at TIMESTAMP WITH TIME ZONE,
  external_id TEXT -- ID from email/SMS provider
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_notification_log_application_id ON notification_log(application_id);
CREATE INDEX IF NOT EXISTS idx_notification_log_created_at ON notification_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_log_status ON notification_log(status);
CREATE INDEX IF NOT EXISTS idx_notification_log_type ON notification_log(notification_type);

-- Create audit_log table for security events
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  event_type TEXT NOT NULL,
  application_id UUID,
  user_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index for audit log
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_event_type ON audit_log(event_type);

-- Enable RLS
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notification_log
CREATE POLICY "Service role can manage all notification logs"
ON notification_log FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- RLS Policies for audit_log
CREATE POLICY "Service role can manage all audit logs"
ON audit_log FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

COMMENT ON TABLE notification_log IS 'Tracks all email and SMS notifications for driver applications';
COMMENT ON TABLE audit_log IS 'Security and compliance audit trail';
