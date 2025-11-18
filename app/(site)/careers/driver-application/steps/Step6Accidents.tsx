'use client'

/**
 * Step 6: Safety History - Accidents (Past 3 Years)
 * Complies with 49 CFR 391.21(b)(5)
 */

import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useApplication } from '../context/ApplicationContext'
import { Plus, Trash2 } from 'lucide-react'

const accidentsSchema = z.object({
  has_accidents: z.boolean(),
  accidents: z.array(z.object({
    date: z.string().min(1, 'Date required'),
    nature: z.string().min(1, 'Description required'),
    fatalities: z.number().min(0),
    injuries: z.number().min(0),
    chemical_spills: z.boolean()
  }))
}).refine(
  data => !data.has_accidents || data.accidents.length > 0,
  { message: 'Please add accidents or uncheck the box', path: ['accidents'] }
)

type AccidentsFormData = z.infer<typeof accidentsSchema>

interface Step6AccidentsProps {
  onNext: () => void
  onPrevious: () => void
}

export default function Step6Accidents({ onNext, onPrevious }: Step6AccidentsProps) {
  const { applicationData, updateApplicationData } = useApplication()

  const { register, control, handleSubmit, watch } = useForm<AccidentsFormData>({
    resolver: zodResolver(accidentsSchema),
    defaultValues: {
      has_accidents: (applicationData.accidents && applicationData.accidents.length > 0) || false,
      accidents: applicationData.accidents || []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'accidents'
  })

  const hasAccidents = watch('has_accidents')

  const onSubmit = (data: AccidentsFormData) => {
    updateApplicationData({ accidents: data.has_accidents ? data.accidents : [] })
    onNext()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">Accident Record</h2>
      <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary mb-6">
        List all accidents you were involved in during the past 3 years (49 CFR 391.21(b)(5)).
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40 rounded-lg p-4">
          <div className="flex items-center">
            <input
              {...register('has_accidents')}
              type="checkbox"
              id="has_accidents"
              className="h-4 w-4 text-primary focus:ring-primary focus:ring-primary border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded"
            />
            <label htmlFor="has_accidents" className="ml-2 text-sm text-neutral-900 dark:text-white">
              I have been involved in accidents in the past 3 years
            </label>
          </div>
        </div>

        {hasAccidents && (
          <>
            {fields.map((field, index) => (
              <div key={field.id} className="border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-lg p-6 bg-white dark:bg-dark-bg-secondary">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Accident {index + 1}</h3>
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
                        {...register(`accidents.${index}.date`)}
                        type="date"
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-md"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        {...register(`accidents.${index}.chemical_spills`)}
                        type="checkbox"
                        id={`spill-${index}`}
                        className="h-4 w-4 text-primary focus:ring-primary focus:ring-primary border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded"
                      />
                      <label htmlFor={`spill-${index}`} className="ml-2 text-sm text-neutral-900 dark:text-white">
                        Hazardous material spill
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
                      Nature of Accident *
                    </label>
                    <textarea
                      {...register(`accidents.${index}.nature`)}
                      rows={3}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-md"
                      placeholder="Describe what happened"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">Fatalities</label>
                      <input
                        {...register(`accidents.${index}.fatalities`, { valueAsNumber: true })}
                        type="number"
                        defaultValue={0}
                        min={0}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">Injuries</label>
                      <input
                        {...register(`accidents.${index}.injuries`, { valueAsNumber: true })}
                        type="number"
                        defaultValue={0}
                        min={0}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ date: '', nature: '', fatalities: 0, injuries: 0, chemical_spills: false })}
              className="w-full py-3 border-2 border-dashed border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-lg text-lrp-text-secondary dark:text-dark-text-secondary hover:border-primary hover:text-primary flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Another Accident
            </button>
          </>
        )}

        {!hasAccidents && (
          <div className="text-center py-8 text-lrp-text-secondary dark:text-dark-text-secondary">
            No accidents to report
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
