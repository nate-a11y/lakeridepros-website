import type { CollectionConfig } from 'payload'

export const Dvirs: CollectionConfig = {
  slug: 'dvirs',
  admin: {
    useAsTitle: 'vehicle',
    defaultColumns: ['vehicle', 'inspectionType', 'inspector', 'status', 'inspectionDate', 'hasDefects'],
  },
  access: {
    // Only authenticated users can read DVIRs
    read: ({ req: { user } }) => !!user,
    // Only authenticated users can create DVIRs
    create: ({ req: { user } }) => !!user,
    // Only authenticated users can update DVIRs
    update: ({ req: { user } }) => !!user,
    // Only admins can delete DVIRs
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
        description: 'Vehicle being inspected',
      },
    },
    {
      name: 'inspector',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'Driver/user performing the inspection',
      },
    },
    {
      name: 'inspectionDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Date and time of inspection',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'inspectionType',
      type: 'select',
      required: true,
      options: [
        { label: 'Pre-Trip', value: 'pre_trip' },
        { label: 'Post-Trip', value: 'post_trip' },
        { label: 'Routine', value: 'routine' },
      ],
      admin: {
        description: 'Type of inspection being performed',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Submitted', value: 'submitted' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Approved', value: 'approved' },
        { label: 'Requires Repair', value: 'requires_repair' },
      ],
      admin: {
        description: 'Current status of the DVIR',
      },
    },
    {
      name: 'odometerReading',
      type: 'number',
      admin: {
        description: 'Current odometer reading',
      },
    },
    {
      name: 'inspectionItems',
      type: 'array',
      admin: {
        description: 'Checklist items inspected',
      },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Exterior', value: 'exterior' },
            { label: 'Interior', value: 'interior' },
            { label: 'Engine', value: 'engine' },
            { label: 'Brakes', value: 'brakes' },
            { label: 'Tires', value: 'tires' },
            { label: 'Lights', value: 'lights' },
            { label: 'Safety Equipment', value: 'safety' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'condition',
          type: 'select',
          required: true,
          options: [
            { label: 'Satisfactory', value: 'satisfactory' },
            { label: 'Needs Attention', value: 'needs_attention' },
            { label: 'Defective', value: 'defective' },
          ],
        },
        {
          name: 'notes',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'newDefects',
      type: 'array',
      admin: {
        description: 'New defects identified during this inspection',
      },
      fields: [
        {
          name: 'defect',
          type: 'relationship',
          relationTo: 'defects',
          required: true,
        },
      ],
    },
    {
      name: 'carriedOverDefects',
      type: 'array',
      admin: {
        description: 'Defects carried over from previous inspections (auto-populated)',
        readOnly: true,
      },
      fields: [
        {
          name: 'defect',
          type: 'relationship',
          relationTo: 'defects',
          required: true,
        },
        {
          name: 'carriedOverFrom',
          type: 'relationship',
          relationTo: 'dvirs',
          admin: {
            description: 'Original DVIR this defect was carried over from',
          },
        },
      ],
    },
    {
      name: 'hasDefects',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this inspection found any defects (auto-calculated)',
        readOnly: true,
      },
    },
    {
      name: 'safeToOperate',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is the vehicle safe to operate?',
      },
    },
    {
      name: 'inspectorSignature',
      type: 'textarea',
      admin: {
        description: 'Inspector signature/certification',
      },
    },
    {
      name: 'inspectorNotes',
      type: 'textarea',
      admin: {
        description: 'Additional notes from inspector',
      },
    },
    {
      name: 'reviewedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Manager/supervisor who reviewed this DVIR',
        condition: (data) => data.status === 'reviewed' || data.status === 'approved',
      },
    },
    {
      name: 'reviewedDate',
      type: 'date',
      admin: {
        description: 'When this DVIR was reviewed',
        condition: (data) => data.status === 'reviewed' || data.status === 'approved',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'reviewNotes',
      type: 'textarea',
      admin: {
        description: 'Notes from reviewer',
        condition: (data) => data.status === 'reviewed' || data.status === 'approved',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Auto-populate carried over defects when creating a new DVIR
        if (operation === 'create' && data.vehicle) {
          try {
            // Find all uncorrected defects for this vehicle
            const uncorrectedDefects = await req.payload.find({
              collection: 'defects',
              where: {
                and: [
                  {
                    vehicle: {
                      equals: data.vehicle,
                    },
                  },
                  {
                    status: {
                      not_equals: 'corrected',
                    },
                  },
                ],
              },
              limit: 1000,
            })

            // Populate carried over defects array
            if (uncorrectedDefects.docs.length > 0) {
              data.carriedOverDefects = uncorrectedDefects.docs.map((defect) => ({
                defect: defect.id,
                carriedOverFrom: defect.originDvir,
              }))

              // Update the carried over count on each defect
              for (const defect of uncorrectedDefects.docs) {
                await req.payload.update({
                  collection: 'defects',
                  id: defect.id,
                  data: {
                    carriedOverCount: (defect.carriedOverCount || 0) + 1,
                  },
                })
              }

              data.hasDefects = true
            }
          } catch (error) {
            console.error('Error fetching uncorrected defects:', error)
          }
        }

        // Calculate hasDefects based on new defects or carried over defects
        if (data.newDefects?.length > 0 || data.carriedOverDefects?.length > 0) {
          data.hasDefects = true
        } else {
          data.hasDefects = false
        }

        // If status is being set to reviewed or approved, set review date
        if ((data.status === 'reviewed' || data.status === 'approved') && !data.reviewedDate) {
          data.reviewedDate = new Date().toISOString()
        }

        // If vehicle has critical defects, mark as requires repair
        if (data.hasDefects && data.status === 'submitted') {
          // Check if any defects are critical
          const allDefects = [
            ...(data.newDefects?.map((d) => d.defect) || []),
            ...(data.carriedOverDefects?.map((d) => d.defect) || []),
          ]

          try {
            for (const defectId of allDefects) {
              const defect = await req.payload.findByID({
                collection: 'defects',
                id: defectId as string,
              })

              if (defect.severity === 'critical') {
                data.safeToOperate = false
                data.status = 'requires_repair'
                break
              }
            }
          } catch (error) {
            console.error('Error checking defect severity:', error)
          }
        }

        return data
      },
    ],
  },
}
