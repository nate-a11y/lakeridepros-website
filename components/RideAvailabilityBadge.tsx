'use client'

interface RideAvailabilityBadgeProps {
  status: 'available' | 'limited' | 'reserved'
  notes?: string
}

const STATUS_CONFIG = {
  available: {
    label: 'Available',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-700 dark:text-green-400',
    dotColor: 'bg-green-500',
  },
  limited: {
    label: 'Limited',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    textColor: 'text-amber-700 dark:text-amber-400',
    dotColor: 'bg-amber-500',
  },
  reserved: {
    label: 'Reserved',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-700 dark:text-red-400',
    dotColor: 'bg-red-500',
  },
}

export default function RideAvailabilityBadge({ status, notes }: RideAvailabilityBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.available

  return (
    <div className="inline-flex flex-col items-center">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
        title={notes || config.label}
      >
        <span className={`w-2 h-2 rounded-full ${config.dotColor}`}></span>
        {config.label}
      </span>
      {notes && (
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[100px] truncate">
          {notes}
        </span>
      )}
    </div>
  )
}
