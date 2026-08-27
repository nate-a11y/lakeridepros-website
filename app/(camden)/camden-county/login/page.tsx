import type { Metadata } from "next"
import { CamdenLoginForm } from "@/components/camden/login-form"

export const metadata: Metadata = { title: "Sign in | Camden County Transportation Portal" }

export default function CamdenCountyLoginPage() {
  return <CamdenLoginForm />
}
