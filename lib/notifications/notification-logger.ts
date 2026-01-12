/**
 * Notification Logger
 * Logs all email and SMS notifications to database for compliance and debugging
 */

import { getSupabaseServerClient } from '@/lib/supabase/client'

const getSupabase = () => getSupabaseServerClient()

export type NotificationType = 'email' | 'sms'
export type NotificationStatus = 'sent' | 'failed' | 'pending' | 'bounced'

export interface NotificationLogEntry {
  application_id?: string
  notification_type: NotificationType
  template_name: string
  recipient: string
  subject?: string
  status: NotificationStatus
  error_message?: string
  metadata?: Record<string, unknown>
  external_id?: string
}

/**
 * Log a notification event
 */
export async function logNotification(entry: NotificationLogEntry): Promise<void> {
  try {
    const supabase = getSupabase()
    const { error } = await supabase
      .from('notification_log')
      .insert({
        application_id: entry.application_id,
        notification_type: entry.notification_type,
        template_name: entry.template_name,
        recipient: entry.recipient,
        subject: entry.subject,
        status: entry.status,
        error_message: entry.error_message,
        metadata: entry.metadata,
        external_id: entry.external_id,
        sent_at: entry.status === 'sent' ? new Date().toISOString() : null
      })

    if (error) {
      console.error('Failed to log notification:', error)
    }
  } catch (error) {
    console.error('Unexpected error logging notification:', error)
  }
}

/**
 * Update notification status
 */
export async function updateNotificationStatus(
  externalId: string,
  status: NotificationStatus,
  errorMessage?: string
): Promise<void> {
  try {
    const supabase = getSupabase()
    const updateData: {
      status: NotificationStatus
      sent_at?: string
      error_message?: string
    } = { status }

    if (status === 'sent') {
      updateData.sent_at = new Date().toISOString()
    }

    if (errorMessage) {
      updateData.error_message = errorMessage
    }

    const { error } = await supabase
      .from('notification_log')
      .update(updateData)
      .eq('external_id', externalId)

    if (error) {
      console.error('Failed to update notification status:', error)
    }
  } catch (error) {
    console.error('Unexpected error updating notification status:', error)
  }
}

/**
 * Get notification history for an application
 */
export async function getNotificationHistory(
  applicationId: string
): Promise<NotificationLogEntry[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('notification_log')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to get notification history:', error)
      return []
    }

    // Map database rows to NotificationLogEntry interface
    return (data || []).map(row => ({
      application_id: row.application_id ?? undefined,
      notification_type: row.notification_type,
      template_name: row.template_name,
      recipient: row.recipient,
      subject: row.subject ?? undefined,
      status: row.status,
      error_message: row.error_message ?? undefined,
      metadata: row.metadata ?? undefined,
      external_id: row.external_id ?? undefined,
    }))
  } catch (error) {
    console.error('Unexpected error getting notification history:', error)
    return []
  }
}

/**
 * Check if a notification was recently sent (within 24 hours)
 */
export async function wasRecentlySent(
  applicationId: string,
  templateName: string,
  hoursAgo: number = 24
): Promise<boolean> {
  try {
    const supabase = getSupabase()
    const cutoff = new Date()
    cutoff.setHours(cutoff.getHours() - hoursAgo)

    const { data, error } = await supabase
      .from('notification_log')
      .select('id')
      .eq('application_id', applicationId)
      .eq('template_name', templateName)
      .eq('status', 'sent')
      .gte('created_at', cutoff.toISOString())
      .limit(1)

    if (error) {
      console.error('Failed to check recent notifications:', error)
      return false
    }

    return (data?.length || 0) > 0
  } catch (error) {
    console.error('Unexpected error checking recent notifications:', error)
    return false
  }
}
