import { ProfileView } from "@/components/camden/profile-view"
import { requireCamdenSession } from "@/lib/camden/auth"

export default async function CamdenProfilePage() {
  await requireCamdenSession(["rider"])
  return <ProfileView />
}
