import type { CollectionConfig } from 'payload'

export const Directory: CollectionConfig = {
  slug: 'directory',
  admin: {
    useAsTitle: 'role',
    defaultColumns: ['user', 'role', 'department', 'isActive', 'priority'],
    description: 'Employee directory entries linked to user accounts',
  },
  access: {
    // Authenticated users can read all, public can only read active entries
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        isActive: { equals: true },
      }
    },
    // Only admins can create, update, or delete
    create: ({ req: { user } }) => !!user && user.role === 'admin',
    update: ({ req: { user } }) => !!user && user.role === 'admin',
    delete: ({ req: { user } }) => !!user && user.role === 'admin',
  },
  fields: [
    // Relationship to Users collection - Payload auto-creates user_id column
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      hasMany: false,
      admin: {
        description: 'The user account associated with this directory entry',
      },
    },
    {
      name: 'role',
      type: 'text',
      label: 'Job Role/Title',
      admin: {
        description: 'Job title or role (e.g., Driver, Dispatcher, Owner)',
      },
    },
    {
      name: 'department',
      type: 'text',
      label: 'Department',
    },
    {
      name: 'priority',
      type: 'number',
      label: 'Display Priority',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first in listings',
      },
    },
    {
      // Payload converts camelCase to snake_case: isActive -> is_active
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
    },
    {
      // Payload converts: photoUrl -> photo_url
      name: 'photoUrl',
      type: 'text',
      label: 'Photo URL',
      admin: {
        description: 'URL to profile photo (consider using Media collection instead)',
      },
    },
    {
      // Payload converts: escalationTiers -> escalation_tiers
      name: 'escalationTiers',
      type: 'json',
      label: 'Escalation Tiers',
      admin: {
        description: 'Array of escalation tier assignments',
      },
    },
    {
      name: 'vehicles',
      type: 'json',
      label: 'Assigned Vehicles',
      admin: {
        description: 'Array of assigned vehicle identifiers',
      },
    },
    {
      // Payload converts: availabilityHours -> availability_hours
      name: 'availabilityHours',
      type: 'text',
      label: 'Availability Hours',
      admin: {
        description: 'Working hours or availability schedule',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      admin: {
        description: 'Internal notes about this employee',
      },
    },
    {
      // Payload converts: createdBy -> created_by
      name: 'createdBy',
      type: 'text',
      label: 'Created By',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      // Payload converts: updatedBy -> updated_by
      name: 'updatedBy',
      type: 'text',
      label: 'Updated By',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
