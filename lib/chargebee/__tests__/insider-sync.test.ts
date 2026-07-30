import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  extractChargebeeSubscriptionId,
  INSIDER_CHARGEBEE_EVENTS,
  processInsiderChargebeeSync,
} from "../insider-sync";

const PLAN_ENV = {
  CHARGEBEE_SITE: "lakeridepros-test",
  CHARGEBEE_API_KEY: "test_chargebee_api_key",
  CHARGEBEE_INSIDER_INDIVIDUAL_MONTHLY_PRICE_ID: "individual-monthly",
  CHARGEBEE_INSIDER_INDIVIDUAL_ANNUAL_PRICE_ID: "individual-annual",
  CHARGEBEE_INSIDER_FAMILY_MONTHLY_PRICE_ID: "family-monthly",
  CHARGEBEE_INSIDER_FAMILY_ANNUAL_PRICE_ID: "family-annual",
  CHARGEBEE_INSIDER_BUSINESS_MONTHLY_PRICE_ID: "business-monthly",
  CHARGEBEE_INSIDER_BUSINESS_ANNUAL_PRICE_ID: "business-annual",
};

function chargebeeResponse(
  overrides: {
    status?: string;
    dueInvoicesCount?: number;
    planId?: string;
  } = {},
) {
  return {
    subscription: {
      id: "subscription_123",
      customer_id: "customer_123",
      status: overrides.status ?? "active",
      billing_period: 1,
      billing_period_unit: "month",
      current_term_start: 1785370800,
      current_term_end: 1788049200,
      resource_version: 1785370800123,
      due_invoices_count: overrides.dueInvoicesCount ?? 0,
      currency_code: "USD",
      subscription_items: [
        {
          item_price_id: overrides.planId ?? "family-annual",
          item_type: "plan",
          amount: 19900,
          quantity: 1,
        },
      ],
    },
    customer: {
      id: "customer_123",
      email: "Nate@Example.com",
      first_name: "Nate",
      last_name: "Bullock",
      phone: "(573) 555-0100",
    },
  };
}

describe("Insider Chargebee synchronization", () => {
  const rpc = vi.fn();
  const fetchImpl = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    rpc.mockResolvedValue({
      data: {
        duplicate: false,
        memberId: "member_123",
      },
      error: null,
    });
    fetchImpl.mockResolvedValue(
      new Response(JSON.stringify(chargebeeResponse()), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
  });

  it("uses the exact Chargebee v2 event names configured on the webhook", () => {
    expect([...INSIDER_CHARGEBEE_EVENTS].sort()).toEqual(
      [
        "payment_failed",
        "payment_succeeded",
        "subscription_activated",
        "subscription_cancelled",
        "subscription_cancellation_scheduled",
        "subscription_changed",
        "subscription_created",
        "subscription_paused",
        "subscription_pause_scheduled",
        "subscription_reactivated",
        "subscription_resumed",
        "subscription_scheduled_cancellation_removed",
        "subscription_scheduled_pause_removed",
        "subscription_started",
      ].sort(),
    );
  });

  it("fetches authoritative billing state and syncs the approved plan", async () => {
    const result = await processInsiderChargebeeSync(
      {
        chargebeeEventId: "event_123",
        eventType: "subscription_changed",
        subscriptionId: "subscription_123",
        occurredAt: 1785370800,
      },
      {
        env: PLAN_ENV,
        fetchImpl,
        supabase: { rpc },
      },
    );

    expect(result).toEqual({
      duplicate: false,
      memberId: "member_123",
    });
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://lakeridepros-test.chargebee.com/api/v2/subscriptions/subscription_123",
      expect.objectContaining({
        cache: "no-store",
        headers: expect.objectContaining({
          Accept: "application/json",
          Authorization: expect.stringMatching(/^Basic /),
        }),
      }),
    );
    expect(rpc).toHaveBeenCalledWith(
      "sync_insider_chargebee_subscription",
      expect.objectContaining({
        target_event_id: "event_123",
        target_subscription_id: "subscription_123",
        target_customer_id: "customer_123",
        target_customer_email: "nate@example.com",
        target_customer_name: "Nate Bullock",
        target_plan_id: "family-annual",
        target_membership_type: "family",
        target_billing_interval: "year",
        target_subscription_status: "active",
        target_account_status: "active",
        target_resource_version: 1785370800123,
      }),
    );
  });

  it("maps an active subscription with money due to past due", async () => {
    fetchImpl.mockResolvedValue(
      new Response(
        JSON.stringify(
          chargebeeResponse({
            dueInvoicesCount: 1,
          }),
        ),
        { status: 200 },
      ),
    );

    await processInsiderChargebeeSync(
      {
        chargebeeEventId: "event_past_due",
        eventType: "payment_failed",
        subscriptionId: "subscription_123",
        occurredAt: 1785370800,
      },
      {
        env: PLAN_ENV,
        fetchImpl,
        supabase: { rpc },
      },
    );

    expect(rpc).toHaveBeenCalledWith(
      "sync_insider_chargebee_subscription",
      expect.objectContaining({
        target_subscription_status: "past_due",
        target_account_status: "past_due",
      }),
    );
  });

  it("ignores a subscription that is not mapped to an Insider plan", async () => {
    fetchImpl.mockResolvedValue(
      new Response(
        JSON.stringify(
          chargebeeResponse({
            planId: "unrelated-plan",
          }),
        ),
        { status: 200 },
      ),
    );

    const result = await processInsiderChargebeeSync(
      {
        chargebeeEventId: "event_other",
        eventType: "subscription_changed",
        subscriptionId: "subscription_123",
        occurredAt: 1785370800,
      },
      {
        env: PLAN_ENV,
        fetchImpl,
        supabase: { rpc },
      },
    );

    expect(result).toEqual({
      ignored: true,
      reason: "not_an_insider_plan",
      subscriptionId: "subscription_123",
      planId: "unrelated-plan",
    });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("requires all six approved plan mappings", async () => {
    const incompleteEnvironment = {
      ...PLAN_ENV,
      CHARGEBEE_INSIDER_BUSINESS_ANNUAL_PRICE_ID: "",
    };

    await expect(
      processInsiderChargebeeSync(
        {
          chargebeeEventId: "event_123",
          eventType: "subscription_changed",
          subscriptionId: "subscription_123",
          occurredAt: 1785370800,
        },
        {
          env: incompleteEnvironment,
          fetchImpl,
          supabase: { rpc },
        },
      ),
    ).rejects.toThrow("Incomplete Chargebee Insider plan mapping");

    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("extracts subscription IDs from supported webhook resources", () => {
    expect(
      extractChargebeeSubscriptionId({
        content: { subscription: { id: "subscription_direct" } },
      }),
    ).toBe("subscription_direct");
    expect(
      extractChargebeeSubscriptionId({
        content: { invoice: { subscription_id: "subscription_invoice" } },
      }),
    ).toBe("subscription_invoice");
    expect(
      extractChargebeeSubscriptionId({
        content: {
          transaction: { subscription_id: "subscription_transaction" },
        },
      }),
    ).toBe("subscription_transaction");
  });
});
