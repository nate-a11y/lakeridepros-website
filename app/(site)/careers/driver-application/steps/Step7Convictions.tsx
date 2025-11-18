'use client'

/**
 * Step 7: Traffic Convictions (Past 3 Years)
 * Complies with 49 CFR 391.21(b)(6)
 */

import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useApplication } from '../context/ApplicationContext'
import { Plus, Trash2 } from 'lucide-react'

const US_STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'] as const

const convictionsSchema = z.object({
  has_convictions: z.boolean(),
  traffic_convictions: z.array(z.object({
    date: z.string().min(1, 'Date required'),
    violation: z.string().min(1, 'Violation required'),
    state: z.enum(US_STATES),
    penalty: z.string().min(1, 'Penalty required')
  }))
}).refine(
  data => !data.has_convictions || data.traffic_convictions.length > 0,
  { message: 'Please add convictions or uncheck the box', path: ['traffic_convictions'] }
)

type ConvictionsFormData = z.infer<typeof convictionsSchema>

interface Step7ConvictionsProps {
  onNext: () => void
  onPrevious: () => void
}

export default function Step7Convictions({ onNext, onPrevious }: Step7ConvictionsProps) {
  const { applicationData, updateApplicationData } = useApplication()

  const { register, control, handleSubmit, watch } = useForm<ConvictionsFormData>({
    resolver: zodResolver(convictionsSchema),
    defaultValues: {
      has_convictions: (applicationData.traffic_convictions && applicationData.traffic_convictions.length > 0) || false,
      traffic_convictions: (applicationData.traffic_convictions as ConvictionsFormData['traffic_convictions']) || []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'traffic_convictions'
  })

  const hasConvictions = watch('has_convictions')

  const onSubmit = (data: ConvictionsFormData) => {
    updateApplicationData({ traffic_convictions: data.has_convictions ? data.traffic_convictions : [] })
    onNext()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">Traffic Convictions</h2>
      <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary mb-6">
        List all traffic law violations (excluding parking) in the past 3 years (49 CFR 391.21(b)(6)).
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40 rounded-lg p-4">
          <div className="flex items-center">
            <input
              {...register('has_convictions')}
              type="checkbox"
              id="has_convictions"
              className="h-4 w-4 text-primary focus:ring-primary focus:ring-primary border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors dark:border-gray-600 rounded"
            />
            <label htmlFor="has_convictions" className="ml-2 text-sm text-neutral-900 dark:text-white">
              I have traffic violations/convictions in the past 3 years (excluding parking)
            </label>
          </div>
        </div>

        {hasConvictions && (
          <>
            {fields.map((field, index) => (
              <div key={field.id} className="border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors dark:border-gray-600 rounded-lg p-6 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Conviction {index + 1}</h3>
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
                      <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">Date *</label>
                      <input
                        {...register(`traffic_convictions.${index}.date`)}
                        type="date"
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors dark:border-gray-600 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">State *</label>
                      <select
                        {...register(`traffic_convictions.${index}.state`)}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors dark:border-gray-600 rounded-md"
                      >
                        <option value="">Select state</option>
                        {US_STATES.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">Violation *</label>
                    <input
                      {...register(`traffic_convictions.${index}.violation`)}
                      type="text"
                      placeholder="e.g., Speeding, DUI, Reckless driving"
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors dark:border-gray-600 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">Penalty *</label>
                    <input
                      {...register(`traffic_convictions.${index}.penalty`)}
                      type="text"
                      placeholder="e.g., Fine, License suspension, Probation"
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors dark:border-gray-600 rounded-md"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ date: '', violation: '', state: 'MO' as const, penalty: '' })}
              className="w-full py-3 border-2 border-dashed border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-primary flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Another Conviction
            </button>
          </>
        )}

        {!hasConvictions && (
          <div className="text-center py-8 text-lrp-text-secondary dark:text-dark-text-secondary">
            No traffic violations to report
          </div>
        )}

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onPrevious}
            className="px-6 py-3 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  font-semibold rounded-lg transition-colors hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary"
          >
            Previous
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-colors hover:bg-primary-dark"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}
