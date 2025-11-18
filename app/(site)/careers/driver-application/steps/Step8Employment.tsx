'use client'

/**
 * Step 8: Employment History (Past 3-10 Years)
 * Complies with 49 CFR 391.21(b)(9)
 * Detects employment gaps > 1 month
 */

import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useApplication } from '../context/ApplicationContext'
import EmploymentTimeline from '../components/EmploymentTimeline'
import { Plus, Trash2, AlertCircle } from 'lucide-react'

const employmentHistorySchema = z.object({
  employment_history: z.array(z.object({
    name: z.string().min(1, 'Employer name required'),
    phone: z.string().min(1, 'Phone required'),
    address: z.string().min(1, 'Address required'),
    position: z.string().min(1, 'Position required'),
    from_date: z.string().min(1, 'Start date required'),
    to_date: z.string().optional(),
    reason_leaving: z.string().optional(),
    salary: z.string().optional(),
    subject_to_fmcsr: z.boolean(),
    subject_to_dot_testing: z.boolean(),
    gap_explanation: z.string().optional()
  })).min(1, 'At least one employment record required')
})

type EmploymentHistoryFormData = z.infer<typeof employmentHistorySchema>

interface Step8EmploymentProps {
  onNext: () => void
  onPrevious: () => void
}

export default function Step8Employment({ onNext, onPrevious }: Step8EmploymentProps) {
  const { applicationData, updateApplicationData } = useApplication()
  const [gaps, setGaps] = useState<Array<{ index: number; months: number }>>([])

  const { register, control, handleSubmit, formState: { errors }, watch } = useForm<EmploymentHistoryFormData>({
    resolver: zodResolver(employmentHistorySchema),
    defaultValues: {
      employment_history: applicationData.employment_history && applicationData.employment_history.length > 0
        ? applicationData.employment_history
        : [{ name: '', phone: '', address: '', position: '', from_date: '', to_date: '', reason_leaving: '', salary: '', subject_to_fmcsr: false, subject_to_dot_testing: false, gap_explanation: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'employment_history'
  })

  const employmentData = watch('employment_history')

  // Detect employment gaps
  useEffect(() => {
    const sorted = [...employmentData]
      .filter(e => e.from_date)
      .sort((a, b) => new Date(b.to_date || new Date()).getTime() - new Date(a.to_date || new Date()).getTime())

    const detectedGaps: Array<{ index: number; months: number }> = []

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i]
      const next = sorted[i + 1]

      const currentStart = new Date(current.from_date)
      const nextEnd = new Date(next.to_date || new Date())

      const diffTime = currentStart.getTime() - nextEnd.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      const diffMonths = Math.floor(diffDays / 30)

      if (diffMonths > 1) {
        detectedGaps.push({ index: i, months: diffMonths })
      }
    }

    setGaps(detectedGaps)
  }, [employmentData])

  const onSubmit = (data: EmploymentHistoryFormData) => {
    updateApplicationData({ employment_history: data.employment_history })
    onNext()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Employment History</h2>
      <p className="text-gray-600 mb-6">
        List all employment for the past 3 years. If you held a CMV driver position, provide 10 years (49 CFR 391.21(b)(9)).
      </p>

      {/* Visual Employment Timeline */}
      {employmentData.length > 0 && employmentData.some(e => e.from_date) && (
        <EmploymentTimeline employments={employmentData} requiredYears={3} />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="border border-gray-300 rounded-lg p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Employment {index + 1}</h3>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employer Name *
                  </label>
                  <input
                    {...register(`employment_history.${index}.name`)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    {...register(`employment_history.${index}.phone`)}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  {...register(`employment_history.${index}.address`)}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position Held *
                  </label>
                  <input
                    {...register(`employment_history.${index}.position`)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary/Rate
                  </label>
                  <input
                    {...register(`employment_history.${index}.salary`)}
                    type="text"
                    placeholder="e.g., $50,000/year or $25/hour"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date *</label>
                  <input
                    {...register(`employment_history.${index}.from_date`)}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    {...register(`employment_history.${index}.to_date`)}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank if current position</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Leaving
                </label>
                <input
                  {...register(`employment_history.${index}.reason_leaving`)}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded p-4 space-y-3">
                <div className="flex items-center">
                  <input
                    {...register(`employment_history.${index}.subject_to_fmcsr`)}
                    type="checkbox"
                    id={`fmcsr-${index}`}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`fmcsr-${index}`} className="ml-2 text-sm text-gray-700">
                    Position subject to Federal Motor Carrier Safety Regulations (FMCSR)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    {...register(`employment_history.${index}.subject_to_dot_testing`)}
                    type="checkbox"
                    id={`dot-${index}`}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`dot-${index}`} className="ml-2 text-sm text-gray-700">
                    Position subject to DOT drug and alcohol testing
                  </label>
                </div>
              </div>

              {gaps.some(g => g.index === index) && (
                <div>
                  <label className="block text-sm font-medium text-yellow-700 mb-1">
                    Gap Explanation (Employment gap of {gaps.find(g => g.index === index)?.months} months detected)
                  </label>
                  <textarea
                    {...register(`employment_history.${index}.gap_explanation`)}
                    rows={2}
                    className="w-full px-3 py-2 border border-yellow-300 rounded-md bg-yellow-50"
                    placeholder="Explain the gap between this job and the next"
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ name: '', phone: '', address: '', position: '', from_date: '', to_date: '', reason_leaving: '', salary: '', subject_to_fmcsr: false, subject_to_dot_testing: false, gap_explanation: '' })}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Another Employment Record
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
