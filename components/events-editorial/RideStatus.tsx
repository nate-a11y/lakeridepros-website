import styles from './EventsEditorial.module.css'

export default function RideStatus({
  status,
  notes,
}: {
  status: 'available' | 'limited' | 'reserved'
  notes?: string
}) {
  const label =
    status === 'reserved'
      ? 'Sold Out'
      : status === 'limited'
        ? 'Limited'
        : 'Available'
  return (
    <div>
      <span
        className={styles.status}
        data-status={status}
        title={notes || label}
      >
        {label}
      </span>
      {notes && <p className={styles.statusNote}>{notes}</p>}
    </div>
  )
}
