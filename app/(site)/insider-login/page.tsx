import { redirect } from 'next/navigation'

export default function InsiderLoginPage() {
  redirect('https://lakeridepros.chargebeeportal.com/portal/v2/login?forward=portal_main')
}
