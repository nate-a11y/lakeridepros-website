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

const USERNAME = "chargebee-webhook";
const PASSWORD = "test-webhook-password";

function createRequest(
  payload: unknown,
  authorization = `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`,
) {
  return new NextRequest("https://www.lakeridepros.com/api/chargebee/webhook", {
    method: "POST",
    headers: {
      authorization,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

function subscriptionEvent(overrides: Record<string, unknown> = {}) {
  return {
    id: "ev_subscription_123",
    object: "event",
    api_version: "v2",
    event_type: "subscription_changed",
    occurred_at: 1785370800,
    content: {
      subscription: {
        id: "subscription_123",
      },
    },
    ...overrides,
  };
}

describe("Chargebee Insider webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CHARGEBEE_WEBHOOK_USERNAME = USERNAME;
    process.env.CHARGEBEE_WEBHOOK_PASSWORD = PASSWORD;
    process.env.INSIDERS_CHARGEBEE_SYNC_MODE = "apply";
  });

  it("authenticates and enqueues a relevant subscription event", async () => {
    const response = await POST(createRequest(subscriptionEvent()));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ received: true });
    expect(mockSend).toHaveBeenCalledWith({
      id: "chargebee:ev_subscription_123",
      name: "chargebee/insider.subscription.sync.requested",
      data: {
        chargebeeEventId: "ev_subscription_123",
        eventType: "subscription_changed",
        subscriptionId: "subscription_123",
        occurredAt: 1785370800,
      },
    });
  });

  it("extracts the subscription from a payment event", async () => {
    const response = await POST(
      createRequest(
        subscriptionEvent({
          id: "ev_payment_123",
          event_type: "payment_failed",
          content: {
            transaction: {
              subscription_id: "subscription_payment_123",
            },
          },
        }),
      ),
    );

    expect(response.status).toBe(200);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          subscriptionId: "subscription_payment_123",
        }),
      }),
    );
  });

  it("accepts Chargebee cancellation-scheduled events", async () => {
    const response = await POST(
      createRequest(
        subscriptionEvent({
          id: "ev_cancellation_scheduled_123",
          event_type: "subscription_cancellation_scheduled",
        }),
      ),
    );

    expect(response.status).toBe(200);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          eventType: "subscription_cancellation_scheduled",
        }),
      }),
    );
  });

  it("rejects invalid Basic Auth", async () => {
    const response = await POST(
      createRequest(subscriptionEvent(), "Basic invalid"),
    );

    expect(response.status).toBe(401);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("fails closed when webhook credentials are not configured", async () => {
    delete process.env.CHARGEBEE_WEBHOOK_PASSWORD;

    const response = await POST(createRequest(subscriptionEvent()));

    expect(response.status).toBe(500);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("fails closed and asks Chargebee to retry while sync is off", async () => {
    process.env.INSIDERS_CHARGEBEE_SYNC_MODE = "off";

    const response = await POST(createRequest(subscriptionEvent()));

    expect(response.status).toBe(503);
    expect(response.headers.get("retry-after")).toBe("3600");
    await expect(response.json()).resolves.toEqual({
      error: "Insider billing sync is disabled",
    });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("validates and acknowledges events without writing in dry-run mode", async () => {
    process.env.INSIDERS_CHARGEBEE_SYNC_MODE = "dry-run";

    const response = await POST(createRequest(subscriptionEvent()));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      received: true,
      dryRun: true,
    });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("treats an unknown sync mode as off", async () => {
    process.env.INSIDERS_CHARGEBEE_SYNC_MODE = "definitely-not-apply";

    const response = await POST(createRequest(subscriptionEvent()));

    expect(response.status).toBe(503);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("acknowledges unrelated events without enqueueing them", async () => {
    const response = await POST(
      createRequest(
        subscriptionEvent({
          event_type: "customer_changed",
        }),
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      received: true,
      ignored: true,
    });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("rejects a relevant event without a subscription ID", async () => {
    const response = await POST(
      createRequest(
        subscriptionEvent({
          content: {},
        }),
      ),
    );

    expect(response.status).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });
});
