/**
 * Supabase Database Types
 *
 * These types define the structure of tables used in the application.
 * Since we don't have auto-generated types from Supabase, we define them manually.
 *
 * Note: This is a partial type definition covering tables used in the codebase.
 * The actual database may have additional columns.
 */

export interface Database {
  public: {
    Tables: {
      bridal_show_registrations: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          transportation_needs: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          transportation_needs: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          transportation_needs?: string
          created_at?: string
        }
        Relationships: []
      }
      driver_applications: {
        Row: {
          id: string
          email: string
          status: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'rejected'
          first_name: string | null
          last_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
          [key: string]: unknown // Allow additional fields
        }
        Insert: {
          id?: string
          email?: string
          status?: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'rejected'
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          [key: string]: unknown
        }
        Update: {
          id?: string
          email?: string
          status?: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'rejected'
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          [key: string]: unknown
        }
        Relationships: []
      }
      drivers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          active: boolean
          role: string[] | null
          portal_role: string | null
          priority: number | null
          vehicles: string[] | null
          availability_hours: number | null
          bio: string | null
          display_on_website: boolean | null
          notes: string | null
          created_at: string
          updated_at: string
          image_id: number | null
          assignment_number: string | null
          employee_type: 'driver' | 'non_driver'
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          active?: boolean
          role?: string[] | null
          portal_role?: string | null
          priority?: number | null
          vehicles?: string[] | null
          availability_hours?: number | null
          bio?: string | null
          display_on_website?: boolean | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          image_id?: number | null
          assignment_number?: string | null
          employee_type?: 'driver' | 'non_driver'
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          active?: boolean
          role?: string[] | null
          portal_role?: string | null
          priority?: number | null
          vehicles?: string[] | null
          availability_hours?: number | null
          bio?: string | null
          display_on_website?: boolean | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          image_id?: number | null
          assignment_number?: string | null
          employee_type?: 'driver' | 'non_driver'
        }
        Relationships: []
      }
      notification_log: {
        Row: {
          id: string
          application_id: string | null
          notification_type: 'email' | 'sms'
          template_name: string
          recipient: string
          subject: string | null
          status: 'sent' | 'failed' | 'pending' | 'bounced'
          error_message: string | null
          metadata: Record<string, unknown> | null
          external_id: string | null
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          application_id?: string | null
          notification_type: 'email' | 'sms'
          template_name: string
          recipient: string
          subject?: string | null
          status: 'sent' | 'failed' | 'pending' | 'bounced'
          error_message?: string | null
          metadata?: Record<string, unknown> | null
          external_id?: string | null
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          application_id?: string | null
          notification_type?: 'email' | 'sms'
          template_name?: string
          recipient?: string
          subject?: string | null
          status?: 'sent' | 'failed' | 'pending' | 'bounced'
          error_message?: string | null
          metadata?: Record<string, unknown> | null
          external_id?: string | null
          sent_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          id: string
          action: string
          table_name: string
          record_id: string
          user_id: string | null
          timestamp: string
          details: Record<string, unknown> | null
        }
        Insert: {
          id?: string
          action: string
          table_name: string
          record_id: string
          user_id?: string | null
          timestamp?: string
          details?: Record<string, unknown> | null
        }
        Update: {
          id?: string
          action?: string
          table_name?: string
          record_id?: string
          user_id?: string | null
          timestamp?: string
          details?: Record<string, unknown> | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
