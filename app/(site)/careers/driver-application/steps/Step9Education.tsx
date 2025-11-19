'use client'

/**
 * Step 9: Education & Qualifications
 * Complies with 49 CFR 391.21(b)(10)
 */

import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useApplication } from '../context/ApplicationContext'
import { Plus, Trash2 } from 'lucide-react'

const educationSchema = z.object({
  education: z.array(z.object({
    school_name: z.string().min(1, 'School name required'),
    location: z.string().min(1, 'Location required'),
    course_of_study: z.string().optional(),
    years_completed: z.number().min(0).max(20).optional(),
    graduated: z.boolean(),
    details: z.string().optional()
  })),
  other_qualifications: z.string().optional()
})

type EducationFormData = z.infer<typeof educationSchema>

interface Step9EducationProps {
  onNext: () => void
  onPrevious: () => void
}

export default function Step9Education({ onNext, onPrevious }: Step9EducationProps) {
  const { applicationData, updateApplicationData } = useApplication()

  const { register, control, handleSubmit, formState: { errors } } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: applicationData.education && applicationData.education.length > 0
        ? applicationData.education
        : [],
      other_qualifications: applicationData.other_qualifications || ''
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education'
  })

  const onSubmit = (data: EducationFormData) => {
    updateApplicationData({
      education: data.education,
      other_qualifications: data.other_qualifications
    })
    onNext()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">Education & Qualifications</h2>
      <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary mb-6">
        Provide information about your education and any other qualifications (49 CFR 391.21(b)(10)).
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.length === 0 && (
          <div className="text-center py-8 text-lrp-text-secondary dark:text-dark-text-secondary border-2 border-dashed border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-lg">
            No education records yet. Click below to add your education history.
          </div>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-lg p-6 bg-white dark:bg-dark-bg-secondary">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Education {index + 1}</h3>
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
                  <label htmlFor={`education-school-name-${index}`} className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
                    School/Institution Name *
                  </label>
                  <input
                    {...register(`education.${index}.school_name`)}
                    id={`education-school-name-${index}`}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-md"
                    placeholder="e.g., Lincoln High School"
                  />
                  {errors.education?.[index]?.school_name && (
                    <p className="text-red-600 text-sm mt-1">{errors.education[index]?.school_name?.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor={`education-location-${index}`} className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
                    Location (City, State) *
                  </label>
                  <input
                    {...register(`education.${index}.location`)}
                    id={`education-location-${index}`}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-md"
                    placeholder="e.g., Springfield, MO"
                  />
                  {errors.education?.[index]?.location && (
                    <p className="text-red-600 text-sm mt-1">{errors.education[index]?.location?.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`education-course-${index}`} className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
                    Course of Study/Major
                  </label>
                  <input
                    {...register(`education.${index}.course_of_study`)}
                    id={`education-course-${index}`}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-md"
                    placeholder="e.g., Business Administration"
                  />
                </div>

                <div>
                  <label htmlFor={`education-years-${index}`} className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
                    Years Completed
                  </label>
                  <input
                    {...register(`education.${index}.years_completed`, { valueAsNumber: true })}
                    id={`education-years-${index}`}
                    type="number"
                    min={0}
                    max={20}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-md"
                    placeholder="e.g., 4"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <input
                    {...register(`education.${index}.graduated`)}
                    type="checkbox"
                    id={`graduated-${index}`}
                    className="h-4 w-4 text-primary focus:ring-primary focus:ring-primary border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded"
                  />
                  <label htmlFor={`graduated-${index}`} className="ml-2 text-sm text-neutral-900 dark:text-white">
                    Graduated/Completed
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor={`education-details-${index}`} className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
                  Additional Details
                </label>
                <textarea
                  {...register(`education.${index}.details`)}
                  id={`education-details-${index}`}
                  rows={2}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-md"
                  placeholder="Certifications, honors, relevant coursework, etc."
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ school_name: '', location: '', course_of_study: '', years_completed: 0, graduated: false, details: '' })}
          className="w-full py-3 border-2 border-dashed border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-lg text-lrp-text-secondary dark:text-dark-text-secondary hover:border-primary hover:text-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Education Record
        </button>

        {/* Other Qualifications */}
        <div className="border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-lg p-6 bg-neutral-50 dark:hover:bg-dark-bg-secondary">
          <label htmlFor="other-qualifications" className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
            Other Qualifications, Certifications, or Training
          </label>
          <textarea
            {...register('other_qualifications')}
            id="other-qualifications"
            rows={4}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  rounded-md bg-white dark:bg-dark-bg-secondary"
            placeholder="List any other relevant qualifications such as CDL training, defensive driving courses, safety certifications, etc."
          />
          <p className="text-xs text-lrp-text-secondary dark:text-dark-text-secondary mt-1">
            Include any training or certifications relevant to commercial driving
          </p>
        </div>

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
