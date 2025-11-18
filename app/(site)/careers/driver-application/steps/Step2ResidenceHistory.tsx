'use client'

/**
 * Step 2: Residence History (Past 3 Years)
 * Complies with 49 CFR 391.21(b)(2) - Addresses where applicant has resided
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

const residenceSchema = z.object({
  residences: z.array(z.object({
    street: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.enum(US_STATES),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP'),
    from_date: z.string().min(1, 'Start date is required'),
    to_date: z.string().optional(),
    is_current: z.boolean()
  })).min(1, 'At least one residence is required')
})

type ResidenceFormData = z.infer<typeof residenceSchema>

interface Step2ResidenceHistoryProps {
  onNext: () => void
  onPrevious: () => void
}

export default function Step2ResidenceHistory({ onNext, onPrevious }: Step2ResidenceHistoryProps) {
  const { applicationData, updateApplicationData } = useApplication()

  const { register, control, handleSubmit, formState: { errors }, watch } = useForm<ResidenceFormData>({
    resolver: zodResolver(residenceSchema),
    defaultValues: {
      residences: applicationData.residences && applicationData.residences.length > 0
        ? applicationData.residences
        : [{ street: '', city: '', state: 'MO', zip: '', from_date: '', to_date: '', is_current: true }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'residences'
  })

  const onSubmit = (data: ResidenceFormData) => {
    updateApplicationData({ residences: data.residences })
    onNext()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Residence History</h2>
      <p className="text-gray-600 mb-6">
        List all addresses where you have resided for the past 3 years (49 CFR 391.21(b)(2)).
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="border border-gray-300 rounded-lg p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Residence {index + 1}</h3>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  {...register(`residences.${index}.street`)}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {errors.residences?.[index]?.street && (
                  <p className="text-red-600 text-sm mt-1">{errors.residences[index]?.street?.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    {...register(`residences.${index}.city`)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.residences?.[index]?.city && (
                    <p className="text-red-600 text-sm mt-1">{errors.residences[index]?.city?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <select
                    {...register(`residences.${index}.state`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {US_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP *</label>
                  <input
                    {...register(`residences.${index}.zip`)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.residences?.[index]?.zip && (
                    <p className="text-red-600 text-sm mt-1">{errors.residences[index]?.zip?.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date *</label>
                  <input
                    {...register(`residences.${index}.from_date`)}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date {watch(`residences.${index}.is_current`) ? '(Current)' : '*'}
                  </label>
                  <input
                    {...register(`residences.${index}.to_date`)}
                    type="date"
                    disabled={watch(`residences.${index}.is_current`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  {...register(`residences.${index}.is_current`)}
                  type="checkbox"
                  id={`current-${index}`}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`current-${index}`} className="ml-2 text-sm text-gray-700">
                  This is my current address
                </label>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ street: '', city: '', state: 'MO', zip: '', from_date: '', to_date: '', is_current: false })}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Another Residence
        </button>

        {errors.residences && (
          <p className="text-red-600 text-sm">{errors.residences.message}</p>
        )}

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
