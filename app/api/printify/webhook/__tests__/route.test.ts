import { createHmac } from "crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn().mockResolvedValue({ ids: ["inngest-event-id"] }),
}));

vi.mock("@/lib/inngest/client", () => ({
  inngest: {
    send: mockSend,
  },
}));

import { POST } from "../route";

const WEBHOOK_SECRET = "test-printify-webhook-secret";

function createRequest(
  payload: unknown,
  options: { signature?: string; rawBody?: string } = {},
) {
  const body = options.rawBody ?? JSON.stringify(payload);
  const signature =
    options.signature ??
    `sha256=${createHmac("sha256", WEBHOOK_SECRET).update(body).digest("hex")}`;

  return new NextRequest("https://www.lakeridepros.com/api/printify/webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-pfy-signature": signature,
    },
    body,
  });
}

function publishPayload(overrides: Record<string, unknown> = {}) {
  return {
    id: "printify-event-123",
    type: "product:publish:started",
    resource: {
      id: "printify-product-123",
      type: "product",
      data: {
        shop_id: 4504357,
        action: "create",
      },
    },
    ...overrides,
  };
}

describe("Printify publish webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.PRINTIFY_WEBHOOK_SECRET = WEBHOOK_SECRET;
    process.env.PRINTIFY_SHOP_ID = "4504357";
  });

  it("verifies and enqueues a publish event", async () => {
    const response = await POST(createRequest(publishPayload()));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ received: true });
    expect(mockSend).toHaveBeenCalledWith({
      id: "printify-event-123",
      name: "printify/product.publish.requested",
      data: {
        printifyEventId: "printify-event-123",
        productId: "printify-product-123",
        shopId: "4504357",
        action: "create",
      },
    });
  });

  it("rejects an invalid signature", async () => {
    const response = await POST(
      createRequest(publishPayload(), { signature: "sha256=invalid" }),
    );

    expect(response.status).toBe(401);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("rejects events for another shop", async () => {
    const payload = publishPayload({
      resource: {
        id: "printify-product-123",
        type: "product",
        data: { shop_id: 999999, action: "update" },
      },
    });
    const response = await POST(createRequest(payload));

    expect(response.status).toBe(403);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON after signature verification", async () => {
    const response = await POST(createRequest({}, { rawBody: "{not-json" }));

    expect(response.status).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });
});
