import { NextResponse, type NextRequest } from "next/server"
import { CamdenInvoiceIdSchema } from "@/lib/camden/invoices"
import { CamdenServiceError } from "@/lib/camden/types"
import { readPublishedCamdenInvoicePdf } from "@/lib/camden/server/invoices"
import { camdenInvoicePrivacyHeaders, invoiceError, invoiceSession } from "@/lib/camden/server/invoice-http"

export async function GET(request: NextRequest, context: { params: Promise<{ invoiceId: string; versionId: string }> }) {
  try {
    const token = invoiceSession(request)
    const { invoiceId, versionId } = await context.params
    const download = request.nextUrl.searchParams.get("download")
    if (!CamdenInvoiceIdSchema.safeParse(invoiceId).success || !CamdenInvoiceIdSchema.safeParse(versionId).success || (download !== null && download !== "1") || [...request.nextUrl.searchParams.keys()].some((key) => key !== "download")) throw new CamdenServiceError("Invalid request.", "validation")
    const { bytes, filename } = await readPublishedCamdenInvoicePdf(token, invoiceId, versionId)
    return new NextResponse(new Uint8Array(bytes), { headers: {
      ...camdenInvoicePrivacyHeaders, "Content-Type": "application/pdf", "Content-Length": String(bytes.byteLength),
      "Content-Disposition": `${download === "1" ? "attachment" : "inline"}; filename="${filename}"`,
      "Content-Security-Policy": "sandbox; default-src 'none'; frame-ancestors 'self'",
    } })
  } catch (error) { return invoiceError(error) }
}
