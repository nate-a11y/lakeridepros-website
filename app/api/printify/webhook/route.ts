import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/lib/inngest/client";

interface PrintifyWebhookEvent {
  id?: string;
  type?: string;
  resource?: {
    id?: string;
    type?: string;
    data?: {
      shop_id?: number | string;
      action?: string;
    } | null;
  };
}

function isValidSignature(
  body: string,
  signature: string | null,
  secret: string,
): boolean {
  if (!signature) return false;

  const expected = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.PRINTIFY_WEBHOOK_SECRET;
  const configuredShopId = process.env.PRINTIFY_SHOP_ID;

  if (!webhookSecret || !configuredShopId) {
    console.error("[Printify Webhook] Missing webhook configuration");
    return NextResponse.json(
      { error: "Webhook configuration missing" },
      { status: 500 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-pfy-signature");

  if (!isValidSignature(rawBody, signature, webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: PrintifyWebhookEvent;
  try {
    payload = JSON.parse(rawBody) as PrintifyWebhookEvent;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  if (payload.type !== "product:publish:started") {
    return NextResponse.json(
      { received: true, ignored: true },
      { status: 200 },
    );
  }

  const eventId = payload.id;
  const productId = payload.resource?.id;
  const shopId = String(payload.resource?.data?.shop_id || "");
  const action = payload.resource?.data?.action || "update";

  if (!eventId || !productId || !shopId) {
    return NextResponse.json(
      { error: "Incomplete publish event" },
      { status: 400 },
    );
  }

  if (shopId !== configuredShopId) {
    return NextResponse.json({ error: "Unexpected shop" }, { status: 403 });
  }

  if (!["create", "update", "delete"].includes(action)) {
    return NextResponse.json(
      { error: "Unsupported publish action" },
      { status: 400 },
    );
  }

  await inngest.send({
    id: eventId,
    name: "printify/product.publish.requested",
    data: {
      printifyEventId: eventId,
      productId,
      shopId,
      action,
    },
  });

  return NextResponse.json({ received: true }, { status: 200 });
}
