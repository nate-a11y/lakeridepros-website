'use client'

/**
 * Step 4: License History (All Licenses - Past 3 Years)
 * Complies with 49 CFR 391.21(b)(4)
 */

import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useApplication } from '../context/ApplicationContext'
import { Plus, Trash2 } from 'lucide-react'

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
] as const

const licenseHistorySchema = z.object({
  licenses: z.array(z.object({
    state: z.enum(US_STATES),
    number: z.string().min(1, 'License number required'),
    type_class: z.string().min(1, 'Class required'),
    endorsements: z.string().optional(),
    expiration_date: z.string().min(1, 'Expiration required'),
    is_current: z.boolean()
  })),
  certify_one_license: z.literal(true)
})

type LicenseHistoryFormData = z.infer<typeof licenseHistorySchema>

interface Step4LicenseHistoryProps {
  onNext: () => void
  onPrevious: () => void
}

export default function Step4LicenseHistory({ onNext, onPrevious }: Step4LicenseHistoryProps) {
  const { applicationData, updateApplicationData } = useApplication()

  const { register, control, handleSubmit, formState: { errors } } = useForm<LicenseHistoryFormData>({
    resolver: zodResolver(licenseHistorySchema),
    defaultValues: {
      licenses: applicationData.licenses && applicationData.licenses.length > 0
        ? applicationData.licenses
        : [],
      certify_one_license: applicationData.certify_one_license ?? true
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'licenses'
  })

  const onSubmit = (data: LicenseHistoryFormData) => {
    updateApplicationData({
      licenses: data.licenses,
      certify_one_license: data.certify_one_license
    })
    onNext()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">License History</h2>
      <p className="text-gray-600 mb-6">
        List ALL driver's licenses held in the past 3 years (49 CFR 391.21(b)(4)).
        If you've only had one license, check the certification box below.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <input
                {...register('certify_one_license')}
                type="checkbox"
                id="certify_one"
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="certify_one" className="ml-3 text-sm text-gray-700">
                I certify that I have only held ONE driver's license in the past 3 years
                (the one entered in the previous step) *
              </label>
            </div>
            {errors.certify_one_license && (
              <p className="text-red-600 text-sm mt-2">{errors.certify_one_license.message}</p>
            )}
          </div>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="border border-gray-300 rounded-lg p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">License {index + 1}</h3>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <select
                    {...register(`licenses.${index}.state`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {US_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                  <input
                    {...register(`licenses.${index}.number`)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.licenses?.[index]?.number && (
                    <p className="text-red-600 text-sm mt-1">{errors.licenses[index]?.number?.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class/Type *</label>
                  <input
                    {...register(`licenses.${index}.type_class`)}
                    type="text"
                    placeholder="e.g., Class A CDL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.licenses?.[index]?.type_class && (
                    <p className="text-red-600 text-sm mt-1">{errors.licenses[index]?.type_class?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date *</label>
                  <input
                    {...register(`licenses.${index}.expiration_date`)}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endorsements</label>
                <input
                  {...register(`licenses.${index}.endorsements`)}
                  type="text"
                  placeholder="e.g., H (Hazmat), N (Tank), P (Passenger)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-center">
                <input
                  {...register(`licenses.${index}.is_current`)}
                  type="checkbox"
                  id={`current-${index}`}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`current-${index}`} className="ml-2 text-sm text-gray-700">
                  This is my current license
                </label>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ state: 'MO', number: '', type_class: '', endorsements: '', expiration_date: '', is_current: false })}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Another License
        </button>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onPrevious}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}
