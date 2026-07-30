export function isInsiderDemoMode() {
  const requested = process.env.INSIDERS_DEMO_MODE === 'true'
  const localDevelopment = process.env.NODE_ENV === 'development'
  const explicitInternalPreview =
    process.env.INSIDERS_INTERNAL_PREVIEW_MODE === 'true'
  const isProductionDeployment = process.env.VERCEL_ENV === 'production'

  return (
    requested &&
    !isProductionDeployment &&
    (localDevelopment || explicitInternalPreview)
  )
}
