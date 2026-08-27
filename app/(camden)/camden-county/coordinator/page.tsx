import { CoordinatorDashboard } from "@/components/camden/coordinator-dashboard"
import { requireCamdenSession } from "@/lib/camden/auth"

export default async function CamdenCoordinatorPage() {
  await requireCamdenSession(["coordinator"])
  return <CoordinatorDashboard />
}
