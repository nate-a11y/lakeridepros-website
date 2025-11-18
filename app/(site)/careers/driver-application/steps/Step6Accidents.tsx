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
      <h2 className="text-2xl font-bold mb-2">Accident Record</h2>
      <p className="text-gray-600 mb-6">
        List all accidents you were involved in during the past 3 years (49 CFR 391.21(b)(5)).
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <input
              {...register('has_accidents')}
              type="checkbox"
              id="has_accidents"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="has_accidents" className="ml-2 text-sm text-gray-700">
              I have been involved in accidents in the past 3 years
            </label>
          </div>
        </div>

        {hasAccidents && (
          <>
            {fields.map((field, index) => (
              <div key={field.id} className="border border-gray-300 rounded-lg p-6 bg-white">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                      <input
                        {...register(`accidents.${index}.date`)}
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        {...register(`accidents.${index}.chemical_spills`)}
                        type="checkbox"
                        id={`spill-${index}`}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`spill-${index}`} className="ml-2 text-sm text-gray-700">
                        Hazardous material spill
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nature of Accident *
                    </label>
                    <textarea
                      {...register(`accidents.${index}.nature`)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Describe what happened"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fatalities</label>
                      <input
                        {...register(`accidents.${index}.fatalities`, { valueAsNumber: true })}
                        type="number"
                        defaultValue={0}
                        min={0}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Injuries</label>
                      <input
                        {...register(`accidents.${index}.injuries`, { valueAsNumber: true })}
                        type="number"
                        defaultValue={0}
                        min={0}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ date: '', nature: '', fatalities: 0, injuries: 0, chemical_spills: false })}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Another Accident
            </button>
          </>
        )}

        {!hasAccidents && (
          <div className="text-center py-8 text-gray-500">
            No accidents to report
          </div>
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
