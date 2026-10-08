'use client'

import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { IDENTITY_STATES, type GeneralApplicationFormData } from '@/lib/validation/general-application'

type Side = 'front' | 'back'
interface Props {
  register: UseFormRegister<GeneralApplicationFormData>
  errors: FieldErrors<GeneralApplicationFormData>
  files: Record<Side, File | null>
  fileErrors: Record<Side, string | null>
  disabled: boolean
  onFileChange: (side: Side, file: File | null) => void
}

export default function GeneralApplicationIdentity({ register, errors, files, fileErrors, disabled, onFileChange }: Props) {
  const fieldClass = 'w-full px-3 py-2 border border-neutral-300 rounded-md bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
  return (
    <fieldset disabled={disabled} className="space-y-4" aria-describedby="identity-purpose">
      <legend className="text-lg font-semibold text-neutral-900">Driver’s license / photo ID — identity verification</legend>
      <p id="identity-purpose" className="text-sm text-lrp-text-secondary">
        Provide your driver’s license or state-issued photo ID so our team can review your identity. This is not a driving-eligibility check for non-driving roles. No CDL, driving-record authorization, or driving history is required.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="identity-number" className="block text-sm font-medium mb-1">ID number *</label>
          <input {...register('current_license_number')} id="identity-number" type="text" autoComplete="off" autoCapitalize="characters" autoCorrect="off" spellCheck={false} maxLength={100} className={fieldClass} aria-invalid={!!errors.current_license_number} aria-describedby={errors.current_license_number ? 'identity-number-error' : undefined} />
          {errors.current_license_number && <p id="identity-number-error" role="alert" className="text-sm text-red-600">{errors.current_license_number.message}</p>}
        </div>
        <div>
          <label htmlFor="identity-state" className="block text-sm font-medium mb-1">Issuing state *</label>
          <select {...register('current_license_state')} id="identity-state" defaultValue="" autoComplete="off" className={fieldClass} aria-invalid={!!errors.current_license_state} aria-describedby={errors.current_license_state ? 'identity-state-error' : undefined}>
            <option value="">Select state</option>
            {IDENTITY_STATES.map(state => <option key={state} value={state}>{state}</option>)}
          </select>
          {errors.current_license_state && <p id="identity-state-error" role="alert" className="text-sm text-red-600">{errors.current_license_state.message}</p>}
        </div>
        <div>
          <label htmlFor="identity-expiration" className="block text-sm font-medium mb-1">ID expiration date *</label>
          <input {...register('current_license_expiration')} id="identity-expiration" type="date" autoComplete="off" className={fieldClass} aria-invalid={!!errors.current_license_expiration} aria-describedby={errors.current_license_expiration ? 'identity-expiration-error' : undefined} />
          {errors.current_license_expiration && <p id="identity-expiration-error" role="alert" className="text-sm text-red-600">{errors.current_license_expiration.message}</p>}
        </div>
      </div>
      <p id="identity-photo-help" className="text-sm text-lrp-text-secondary">Upload clear front and back photos. JPG or PNG, up to 5MB each. Photos are stored privately for application review, not attached to notification emails.</p>
      {(['front', 'back'] as const).map(side => (
        <div key={side}>
          <label htmlFor={`identity-${side}`} className="block text-sm font-medium mb-1">ID {side} photo *</label>
          <input id={`identity-${side}`} type="file" accept="image/jpeg,image/png" className={fieldClass} onChange={event => onFileChange(side, event.target.files?.[0] || null)} aria-invalid={!!fileErrors[side]} aria-describedby={`identity-photo-help${fileErrors[side] ? ` identity-${side}-error` : ''}`} />
          {files[side] && <p className="text-sm text-lrp-text-secondary">Selected: {files[side].name}</p>}
          {fileErrors[side] && <p id={`identity-${side}-error`} role="alert" className="text-sm text-red-600">{fileErrors[side]}</p>}
        </div>
      ))}
    </fieldset>
  )
}
