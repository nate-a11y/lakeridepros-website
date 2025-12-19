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
        ? applicationData.licenses as LicenseHistoryFormData['licenses']
        : [],
      certify_one_license: applicationData.certify_one_license === true ? true : undefined as unknown as true
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
      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">License History</h2>
      <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary mb-6">
        List ALL driver's licenses held in the past 3 years (49 CFR 391.21(b)(4)).
        If you've only had one license, check the certification box below.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.length === 0 && (
          <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40 rounded-lg p-4">
            <div className="flex items-start">
              <input
                {...register('certify_one_license')}
                type="checkbox"
                id="certify_one"
                className="mt-1 h-4 w-4 text-primary focus:ring-primary focus:ring-primary border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-lrp-black transition-colors  rounded"
              />
              <label htmlFor="certify_one" className="ml-3 text-sm text-neutral-900 dark:text-white">
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
          <div key={field.id} className="border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-lrp-black transition-colors  rounded-lg p-6 bg-white dark:bg-dark-bg-secondary">
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
                  <label htmlFor={`license-state-${index}`} className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">State *</label>
                  <select
                    {...register(`licenses.${index}.state`)}
                    id={`license-state-${index}`}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-lrp-black transition-colors  rounded-md"
                  >
                    {US_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor={`license-number-${index}`} className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">License Number *</label>
                  <input
                    {...register(`licenses.${index}.number`)}
                    id={`license-number-${index}`}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-lrp-black transition-colors  rounded-md"
                  />
                  {errors.licenses?.[index]?.number && (
                    <p className="text-red-600 text-sm mt-1">{errors.licenses[index]?.number?.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`license-class-${index}`} className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">Class/Type *</label>
                  <input
                    {...register(`licenses.${index}.type_class`)}
                    id={`license-class-${index}`}
                    type="text"
                    placeholder="e.g., Class A CDL"
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-lrp-black transition-colors  rounded-md"
                  />
                  {errors.licenses?.[index]?.type_class && (
                    <p className="text-red-600 text-sm mt-1">{errors.licenses[index]?.type_class?.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor={`license-expiration-${index}`} className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">Expiration Date *</label>
                  <input
                    {...register(`licenses.${index}.expiration_date`)}
                    id={`license-expiration-${index}`}
                    type="date"
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-lrp-black transition-colors  rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`license-endorsements-${index}`} className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">Endorsements</label>
                <input
                  {...register(`licenses.${index}.endorsements`)}
                  id={`license-endorsements-${index}`}
                  type="text"
                  placeholder="e.g., H (Hazmat), N (Tank), P (Passenger)"
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-lrp-black transition-colors  rounded-md"
                />
              </div>

              <div className="flex items-center">
                <input
                  {...register(`licenses.${index}.is_current`)}
                  type="checkbox"
                  id={`current-${index}`}
                  className="h-4 w-4 text-primary focus:ring-primary focus:ring-primary border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-lrp-black transition-colors  rounded"
                />
                <label htmlFor={`current-${index}`} className="ml-2 text-sm text-neutral-900 dark:text-white">
                  This is my current license
                </label>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ state: 'MO' as const, number: '', type_class: '', endorsements: '', expiration_date: '', is_current: false })}
          className="w-full py-3 border-2 border-dashed border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-lrp-black transition-colors  rounded-lg text-lrp-text-secondary dark:text-dark-text-secondary hover:border-primary hover:text-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Another License
        </button>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onPrevious}
            className="px-6 py-3 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-lrp-black transition-colors  font-semibold rounded-lg transition-colors hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary"
          >
            Previous
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-lrp-black font-semibold rounded-lg transition-colors hover:bg-primary-dark"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}
