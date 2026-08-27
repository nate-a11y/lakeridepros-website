import { Suspense } from "react"
import { RequestDetailView } from "@/components/camden/request-detail"
import { LoadingState } from "@/components/camden/ui"
import { requireCamdenSession } from "@/lib/camden/auth"

export default async function CamdenRequestPage() {
  await requireCamdenSession(["rider", "coordinator"])
  return <Suspense fallback={<LoadingState label="Loading request details" />}><RequestDetailView /></Suspense>
}
