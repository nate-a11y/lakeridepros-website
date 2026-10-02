import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { CamdenInvoicesView } from "@/components/camden/invoices-view"
import { requireCamdenSession } from "@/lib/camden/auth"

export const metadata: Metadata = { title: "Invoices | Treatment Court Transportation" }

export default async function CamdenInvoicesPage() {
  const context = await requireCamdenSession(["coordinator"], { allowDevelopmentDemo: false })
  if (!context) redirect("/camden-county/login")
  return <CamdenInvoicesView context={context} />
}
