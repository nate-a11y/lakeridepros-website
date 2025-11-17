'use client'

import { useState } from 'react'

interface DefectCorrectionFormProps {
  defectId: string
  defectDescription: string
  onSuccess?: () => void
}

export default function DefectCorrectionForm({
  defectId,
  defectDescription,
  onSuccess,
}: DefectCorrectionFormProps) {
  const [correctionNotes, setCorrectionNotes] = useState('')
  const [correctedBy, setCorrectedBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/defects/mark-corrected', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defectId,
          correctedBy,
          correctionNotes,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Defect marked as corrected successfully!' })
        setCorrectionNotes('')
        setCorrectedBy('')

        // Call success callback if provided
        if (onSuccess) {
          setTimeout(() => {
            onSuccess()
          }, 1500)
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to mark defect as corrected' })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Mark Defect as Corrected
      </h3>

      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Defect:</p>
        <p className="text-gray-900 dark:text-white font-medium">{defectDescription}</p>
      </div>

      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}
        >
          <p
            className={
              message.type === 'success'
                ? 'text-green-800 dark:text-green-200'
                : 'text-red-800 dark:text-red-200'
            }
          >
            {message.text}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="correctedBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Corrected By (User ID) *
          </label>
          <input
            type="text"
            id="correctedBy"
            value={correctedBy}
            onChange={(e) => setCorrectedBy(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter user ID who corrected this defect"
          />
        </div>

        <div>
          <label htmlFor="correctionNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Correction Notes
          </label>
          <textarea
            id="correctionNotes"
            value={correctionNotes}
            onChange={(e) => setCorrectionNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Describe what was done to correct this defect..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Marking as Corrected...' : 'Mark as Corrected'}
        </button>
      </form>
    </div>
  )
}
