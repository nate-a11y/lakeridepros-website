import { HistoryView } from "@/components/camden/history-view"
import { requireCamdenSession } from "@/lib/camden/auth"

export default async function CamdenHistoryPage() {
  await requireCamdenSession(["rider"])
  return <HistoryView />
}
