import type { NextRequest } from "next/server"
import { CamdenInvoiceOffsetSchema } from "@/lib/camden/invoices"
import { CamdenServiceError } from "@/lib/camden/types"
import { noStoreJson } from "@/lib/camden/server/http"
import { listPublishedCamdenInvoices } from "@/lib/camden/server/invoices"
import { camdenInvoicePrivacyHeaders, invoiceError, invoiceSession } from "@/lib/camden/server/invoice-http"

export async function GET(request: NextRequest) {
  try {
    const token = invoiceSession(request)
    const offset = CamdenInvoiceOffsetSchema.safeParse(request.nextUrl.searchParams.get("offset") ?? "0")
    if (!offset.success || [...request.nextUrl.searchParams.keys()].some((key) => key !== "offset")) throw new CamdenServiceError("Invalid request.", "validation")
    return noStoreJson(await listPublishedCamdenInvoices(token, offset.data), { headers: camdenInvoicePrivacyHeaders })
  } catch (error) { return invoiceError(error) }
}
