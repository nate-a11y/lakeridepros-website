'use client'

/**
 * Employment Timeline Component
 * Visual timeline showing employment history with gap detection
 */

import React from 'react'
import { AlertCircle } from 'lucide-react'

interface Employment {
  name: string
  position: string
  from_date: string
  to_date?: string
  subject_to_fmcsr: boolean
}

interface EmploymentTimelineProps {
  employments: Employment[]
  requiredYears?: number
}

export default function EmploymentTimeline({ employments, requiredYears = 3 }: EmploymentTimelineProps) {
  if (!employments || employments.length === 0) {
    return null
  }

  // Sort employments by date (newest first)
  const sortedEmployments = [...employments]
    .filter(e => e.from_date)
    .sort((a, b) => {
      const dateA = new Date(b.to_date || new Date())
      const dateB = new Date(a.to_date || new Date())
      return dateB.getTime() - dateA.getTime()
    })

  // Calculate gaps and coverage
  const gaps: Array<{ index: number; months: number; startDate: Date; endDate: Date }> = []
  let totalMonthsCovered = 0
  const today = new Date()
  const requiredDate = new Date()
  requiredDate.setFullYear(requiredDate.getFullYear() - requiredYears)

  // Calculate gaps between jobs
  for (let i = 0; i < sortedEmployments.length - 1; i++) {
    const current = sortedEmployments[i]
    const next = sortedEmployments[i + 1]

    const currentStart = new Date(current.from_date)
    const nextEnd = new Date(next.to_date || today)

    const diffTime = currentStart.getTime() - nextEnd.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    const diffMonths = Math.floor(diffDays / 30)

    if (diffMonths > 1) {
      gaps.push({
        index: i,
        months: diffMonths,
        startDate: nextEnd,
        endDate: currentStart
      })
    }
  }

  // Calculate total coverage
  sortedEmployments.forEach(emp => {
    const start = new Date(emp.from_date)
    const end = new Date(emp.to_date || today)
    const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
    totalMonthsCovered += months
  })

  const totalYearsCovered = Math.floor(totalMonthsCovered / 12)
  const remainingMonths = Math.floor(totalMonthsCovered % 12)
  const meetsRequirement = totalYearsCovered >= requiredYears

  // Check if any job was CMV driver
  const hasCMVExperience = sortedEmployments.some(emp => emp.subject_to_fmcsr)
  const actualRequiredYears = hasCMVExperience ? 10 : 3

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Timeline</h3>

      {/* Coverage Summary */}
      <div className={`rounded-lg p-4 mb-6 ${
        meetsRequirement && totalYearsCovered >= actualRequiredYears
          ? 'bg-green-50 border border-green-200'
          : 'bg-yellow-50 border border-yellow-300'
      }`}>
        <div className="flex items-start gap-3">
          {meetsRequirement && totalYearsCovered >= actualRequiredYears ? (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
              ✓
            </div>
          ) : (
            <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className="font-semibold text-gray-900">
              Total Coverage: {totalYearsCovered} years, {remainingMonths} months
            </p>
            <p className="text-sm text-gray-700 mt-1">
              {hasCMVExperience
                ? `You have CMV experience. Required: 10 years minimum.`
                : `Required: 3 years minimum.`
              }
              {totalYearsCovered >= actualRequiredYears
                ? ' ✓ Requirement met'
                : ` Need ${actualRequiredYears - totalYearsCovered} more years.`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Gap Warnings */}
      {gaps.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-800">
                {gaps.length} Employment Gap{gaps.length > 1 ? 's' : ''} Detected
              </p>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                {gaps.map((gap, idx) => (
                  <li key={idx}>
                    • {gap.months} month gap between{' '}
                    <strong>{sortedEmployments[gap.index + 1].name}</strong> and{' '}
                    <strong>{sortedEmployments[gap.index].name}</strong>
                    {' '}({gap.startDate.toLocaleDateString()} - {gap.endDate.toLocaleDateString()})
                  </li>
                ))}
              </ul>
              <p className="text-sm text-yellow-700 mt-2">
                Please provide explanations for gaps greater than 1 month in the gap explanation fields below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Visual Timeline */}
      <div className="space-y-2">
        {sortedEmployments.map((emp, index) => {
          const start = new Date(emp.from_date)
          const end = emp.to_date ? new Date(emp.to_date) : today
          const months = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))
          const years = Math.floor(months / 12)
          const remainingMo = months % 12

          // Check if there's a gap after this job
          const hasGapAfter = gaps.some(g => g.index === index)
          const gapAfter = gaps.find(g => g.index === index)

          return (
            <div key={index}>
              {/* Employment Bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-blue-100 border border-blue-300 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-blue-900">{emp.name}</p>
                      <p className="text-sm text-blue-700">{emp.position}</p>
                      {emp.subject_to_fmcsr && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
                          CMV Driver
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-800">
                        {start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {' → '}
                        {emp.to_date ? end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {years > 0 && `${years}y `}
                        {remainingMo}m
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gap Indicator */}
              {hasGapAfter && gapAfter && (
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1">
                    <div className="bg-red-50 border-2 border-dashed border-red-300 rounded p-2 text-center">
                      <p className="text-sm font-semibold text-red-700">
                        ⚠️ {gapAfter.months} Month Gap
                      </p>
                      <p className="text-xs text-red-600">
                        {gapAfter.startDate.toLocaleDateString()} - {gapAfter.endDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Date Range Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <strong>Earliest Employment:</strong>{' '}
          {new Date(sortedEmployments[sortedEmployments.length - 1].from_date).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Most Recent:</strong>{' '}
          {sortedEmployments[0].to_date
            ? new Date(sortedEmployments[0].to_date).toLocaleDateString()
            : 'Present'}
        </p>
      </div>
    </div>
  )
}
