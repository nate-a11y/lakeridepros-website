export function isChargebeeManagementEnabled() {
  return (
    process.env.INSIDERS_CHARGEBEE_MANAGEMENT_MODE?.trim().toLowerCase() ===
    'live'
  )
}
