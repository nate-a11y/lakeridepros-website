'use client'

import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { ROLE_QUESTIONS, type GeneralApplicationFormData } from '@/lib/validation/general-application'

type Props = {
  register: UseFormRegister<GeneralApplicationFormData>
  errors: FieldErrors<GeneralApplicationFormData>
  positions: GeneralApplicationFormData['positions']
}
const inputClass = 'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'

export default function GeneralApplicationDetails({ register, errors, positions }: Props) {
  const questions = [
    { name: 'availability', label: 'Availability', hint: 'Which days and times can you work, including evenings and weekends? How many hours per week would you prefer? Include any scheduling limits.', maxLength: 2000 },
    ...ROLE_QUESTIONS.filter(question => positions.includes(question.role)).map(question => ({ ...question, maxLength: 3000 })),
  ] as const

  return (
    <fieldset className="space-y-6">
      <legend className="text-lg font-semibold text-neutral-900 mb-3">Availability &amp; role details</legend>
      <div>
        <label htmlFor="earliestStartDate" className="block text-sm font-medium text-neutral-900 mb-1">Earliest start date *</label>
        <p id="earliestStartDate-hint" className="text-xs text-lrp-text-secondary mb-2">Choose today if you are available to start immediately.</p>
        <input {...register('earliestStartDate')} id="earliestStartDate" type="date" required className={inputClass}
          aria-invalid={!!errors.earliestStartDate}
          aria-describedby={`earliestStartDate-hint${errors.earliestStartDate ? ' earliestStartDate-error' : ''}`} />
        {errors.earliestStartDate && <p id="earliestStartDate-error" role="alert" className="text-red-600 text-sm mt-1">{errors.earliestStartDate.message}</p>}
      </div>
      {questions.map(question => (
        <div key={question.name}>
          <label htmlFor={question.name} className="block text-sm font-medium text-neutral-900 mb-1">{question.label} *</label>
          <p id={`${question.name}-hint`} className="text-xs text-lrp-text-secondary mb-2">{question.hint}</p>
          <textarea {...register(question.name)} id={question.name} rows={3} required maxLength={question.maxLength} className={inputClass}
            aria-invalid={!!errors[question.name]}
            aria-describedby={`${question.name}-hint${errors[question.name] ? ` ${question.name}-error` : ''}`} />
          {errors[question.name] && <p id={`${question.name}-error`} role="alert" className="text-red-600 text-sm mt-1">{errors[question.name]?.message}</p>}
        </div>
      ))}
    </fieldset>
  )
}
