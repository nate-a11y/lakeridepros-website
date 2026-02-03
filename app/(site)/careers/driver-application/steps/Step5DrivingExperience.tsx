'use client'

/**
 * Step 5: Driving Experience
 * Complies with 49 CFR 391.21(b)(7)
 */

import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useApplication } from '../context/ApplicationContext'
import { Plus, Trash2 } from 'lucide-react'

const drivingExperienceSchema = z.object({
  driving_experience: z.array(z.object({
    class_of_equipment: z.string().min(1, 'Equipment class required'),
    type: z.string().min(1, 'Equipment type required'),
    date_from: z.string().min(1, 'Start date required'),
    date_to: z.string().optional(),
    miles: z.number().min(0).optional()
  }))
})

type DrivingExperienceFormData = z.infer<typeof drivingExperienceSchema>

interface Step5DrivingExperienceProps {
  onNext: () => void
  onPrevious: () => void
}

export default function Step5DrivingExperience({ onNext, onPrevious }: Step5DrivingExperienceProps) {
  const { applicationData, updateApplicationData } = useApplication()

  const { register, control, handleSubmit, formState: { errors } } = useForm<DrivingExperienceFormData>({
    resolver: zodResolver(drivingExperienceSchema),
    defaultValues: {
      driving_experience: applicationData.driving_experience && applicationData.driving_experience.length > 0
        ? applicationData.driving_experience
        : []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'driving_experience'
  })

  const onSubmit = (data: DrivingExperienceFormData) => {
    updateApplicationData({ driving_experience: data.driving_experience })
    onNext()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">Driving Experience</h2>
      <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary mb-6">
        List your driving experience with different types of equipment (49 CFR 391.21(b)(7)).
        If you have no commercial driving experience, click Continue.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-lg p-6 bg-white dark:bg-dark-bg-secondary">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Experience {index + 1}</h3>
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
                  <label htmlFor={`experience-class-${index}`} className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
                    Class of Equipment *
                  </label>
                  <select
                    {...register(`driving_experience.${index}.class_of_equipment`)}
                    id={`experience-class-${index}`}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-md"
                  >
                    <option value="">Select class</option>
                    <option value="Tractor and Semi-Trailer">Tractor and Semi-Trailer</option>
                    <option value="Tractor-Two Trailers">Tractor-Two Trailers</option>
                    <option value="Tractor-Three Trailers">Tractor-Three Trailers</option>
                    <option value="Straight Truck">Straight Truck</option>
                    <option value="Bus">Bus</option>
                    <option value="Motorcoach">Motorcoach</option>
                    <option value="School Bus">School Bus</option>
                    <option value="Van/Sprinter">Van/Sprinter</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.driving_experience?.[index]?.class_of_equipment && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.driving_experience[index]?.class_of_equipment?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor={`experience-type-${index}`} className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
                    Type of Equipment *
                  </label>
                  <input
                    {...register(`driving_experience.${index}.type`)}
                    id={`experience-type-${index}`}
                    type="text"
                    placeholder="e.g., Van trailer, Flatbed, Tanker"
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-md"
                  />
                  {errors.driving_experience?.[index]?.type && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.driving_experience[index]?.type?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor={`experience-from-date-${index}`} className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">From Date *</label>
                  <input
                    {...register(`driving_experience.${index}.date_from`)}
                    id={`experience-from-date-${index}`}
                    type="date"
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor={`experience-to-date-${index}`} className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">To Date</label>
                  <input
                    {...register(`driving_experience.${index}.date_to`)}
                    id={`experience-to-date-${index}`}
                    type="date"
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor={`experience-miles-${index}`} className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
                    Approximate Miles
                  </label>
                  <input
                    {...register(`driving_experience.${index}.miles`, { valueAsNumber: true })}
                    id={`experience-miles-${index}`}
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ class_of_equipment: '', type: '', date_from: '', date_to: '', miles: 0 })}
          className="w-full py-3 border-2 border-dashed border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-lg text-lrp-text-secondary dark:text-dark-text-secondary hover:border-primary hover:text-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Driving Experience
        </button>

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
            className="px-6 py-3 bg-primary text-lrp-black font-semibold rounded-lg transition-colors hover:bg-primary-dark"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}
