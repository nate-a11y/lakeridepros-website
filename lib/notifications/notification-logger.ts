/**
 * Notification Logger
 * Logs all email and SMS notifications to database for compliance and debugging
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
  metadata?: Record<string, any>
  external_id?: string
}

/**
 * Log a notification event
 */
export async function logNotification(entry: NotificationLogEntry): Promise<void> {
  try {
    const { error } = await supabase
      .from('notification_log')
      .insert({
        ...entry,
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
    const updateData: any = { status }

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
    const { data, error } = await supabase
      .from('notification_log')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to get notification history:', error)
      return []
    }

    return data || []
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
