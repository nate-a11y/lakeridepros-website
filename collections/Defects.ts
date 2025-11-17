import type { CollectionConfig } from 'payload'

export const Defects: CollectionConfig = {
  slug: 'defects',
  admin: {
    useAsTitle: 'description',
    defaultColumns: ['description', 'vehicle', 'status', 'severity', 'identifiedDate', 'correctedDate'],
  },
  access: {
    // Only authenticated users can read defects
    read: ({ req: { user } }) => !!user,
    // Only authenticated users can create defects
    create: ({ req: { user } }) => !!user,
    // Only authenticated users can update defects
    update: ({ req: { user } }) => !!user,
    // Only admins can delete defects
    delete: ({ req: { user } }) => {
      return !!user && user.role === 'admin'
    },
  },
  fields: [
    {
      name: 'vehicle',
      type: 'relationship',
      relationTo: 'vehicles',
      required: true,
      admin: {
        description: 'Vehicle this defect is associated with',
      },
    },
    {
      name: 'originDvir',
      type: 'relationship',
      relationTo: 'dvirs',
      required: true,
      admin: {
        description: 'DVIR where this defect was first identified',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Detailed description of the defect',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'Location on vehicle (e.g., front left tire, engine, interior)',
      },
    },
    {
      name: 'severity',
      type: 'select',
      required: true,
      defaultValue: 'minor',
      options: [
        { label: 'Critical - Vehicle Unsafe', value: 'critical' },
        { label: 'Major - Needs Immediate Attention', value: 'major' },
        { label: 'Minor - Can Wait', value: 'minor' },
      ],
      admin: {
        description: 'Severity level of the defect',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Corrected', value: 'corrected' },
        { label: 'Deferred', value: 'deferred' },
      ],
      admin: {
        description: 'Current status of the defect',
      },
    },
    {
      name: 'identifiedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'User who identified this defect',
      },
    },
    {
      name: 'identifiedDate',
      type: 'date',
      required: true,
      admin: {
        description: 'When the defect was identified',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'correctedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'User who corrected this defect',
        condition: (data) => data.status === 'corrected',
      },
    },
    {
      name: 'correctedDate',
      type: 'date',
      admin: {
        description: 'When the defect was corrected',
        condition: (data) => data.status === 'corrected',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'correctionNotes',
      type: 'textarea',
      admin: {
        description: 'Details about how the defect was corrected',
        condition: (data) => data.status === 'corrected',
      },
    },
    {
      name: 'deferralReason',
      type: 'textarea',
      admin: {
        description: 'Reason for deferring this defect',
        condition: (data) => data.status === 'deferred',
      },
    },
    {
      name: 'deferralApprovedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Manager who approved the deferral',
        condition: (data) => data.status === 'deferred',
      },
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
      admin: {
        description: 'Photos documenting the defect',
      },
    },
    {
      name: 'carriedOverCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of times this defect has been carried over to subsequent DVIRs',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // When marking a defect as corrected, set the corrected date if not already set
        if (data.status === 'corrected' && !data.correctedDate) {
          data.correctedDate = new Date().toISOString()
        }

        // If status changes from corrected to something else, clear correction fields
        if (data.status !== 'corrected' && operation === 'update') {
          data.correctedDate = null
          data.correctedBy = null
          data.correctionNotes = null
        }

        return data
      },
    ],
  },
}
