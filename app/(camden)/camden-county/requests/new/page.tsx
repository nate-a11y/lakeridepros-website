import { Suspense } from "react"
import { NewRequestForm } from "@/components/camden/request-form"
import { LoadingState } from "@/components/camden/ui"
import { requireCamdenSession } from "@/lib/camden/auth"

export default async function NewCamdenRequestPage() {
  await requireCamdenSession(["rider", "coordinator"])
  return <Suspense fallback={<LoadingState label="Preparing request form" />}><NewRequestForm /></Suspense>
}
