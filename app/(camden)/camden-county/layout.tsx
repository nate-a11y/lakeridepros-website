import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Camden County Transportation Portal | Lake Ride Pros",
  description: "Secure Camden County transportation request portal.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
}

export default function CamdenCountyLayout({ children }: { children: React.ReactNode }) {
  return <div data-camden-portal>{children}</div>
}
