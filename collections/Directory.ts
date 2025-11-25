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
    // Relationship to Users collection - this is the key field that links the two tables
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
      // Map to the existing 'user_id' column in the database
      dbName: 'user_id',
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
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      // Map to the existing 'is_active' column
      dbName: 'is_active',
    },
    {
      name: 'photoUrl',
      type: 'text',
      label: 'Photo URL',
      // Map to the existing 'photo_url' column
      dbName: 'photo_url',
      admin: {
        description: 'URL to profile photo (consider using Media collection instead)',
      },
    },
    {
      name: 'escalationTiers',
      type: 'json',
      label: 'Escalation Tiers',
      // Map to the existing 'escalation_tiers' column
      dbName: 'escalation_tiers',
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
      name: 'availabilityHours',
      type: 'text',
      label: 'Availability Hours',
      // Map to the existing 'availability_hours' column
      dbName: 'availability_hours',
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
      name: 'createdBy',
      type: 'text',
      label: 'Created By',
      // Map to the existing 'created_by' column
      dbName: 'created_by',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'updatedBy',
      type: 'text',
      label: 'Updated By',
      // Map to the existing 'updated_by' column
      dbName: 'updated_by',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
