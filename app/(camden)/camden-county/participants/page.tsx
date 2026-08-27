import type { Metadata } from "next"
import { ParticipantSnapshotsView } from "@/components/camden/participant-snapshots"

export const metadata: Metadata = { title: "Participant snapshots | Treatment Court Transportation" }

export default function ParticipantSnapshotsPage() {
  return <ParticipantSnapshotsView />
}
