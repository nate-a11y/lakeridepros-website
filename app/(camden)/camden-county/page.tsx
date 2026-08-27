import { RiderDashboard } from "@/components/camden/rider-dashboard"
import { requireCamdenSession } from "@/lib/camden/auth"

export default async function CamdenCountyPage() {
  await requireCamdenSession(["rider"])
  return <RiderDashboard />
}
