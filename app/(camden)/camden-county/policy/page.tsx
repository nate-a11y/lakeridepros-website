import { PolicyView } from "@/components/camden/policy-view"
import { requireCamdenSession } from "@/lib/camden/auth"

export default async function CamdenCountyPolicyPage() {
  await requireCamdenSession(["rider"])
  return <PolicyView />
}
