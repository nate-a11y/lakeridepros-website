import { describe, expect, it, vi } from "vitest";
import {
  assertBootstrapApplyGuard,
  createChargebeeBootstrapClient,
  INSIDER_BOOTSTRAP_CONFIRMATION,
  parseBootstrapArguments,
  runInsiderChargebeeBootstrap,
  type BootstrapCustomer,
  type BootstrapInvoice,
  type BootstrapSubscription,
  type BootstrapTransaction,
  type ChargebeeBootstrapClient,
} from "../insider-bootstrap";
import {
  isMissingInsiderBootstrapTableError,
  isMissingLegacyMemberCustomerIdColumnError,
  normalizeLegacyInsiderMemberRows,
  shouldUseLegacyInsiderMemberIndex,
  shouldUseEmptyInsiderBootstrapIndex,
} from "../bootstrap-schema-errors";
import {
  InsiderBootstrapOperatorError,
  safeInsiderBootstrapOperatorFailure,
} from "../bootstrap-operator-errors";
import { loadInsiderBootstrapMemberIndex } from "../bootstrap-member-index";

const PLAN_ENV = {
  CHARGEBEE_SITE: "lakeridepros-test",
  CHARGEBEE_API_KEY: "test-key",
  CHARGEBEE_INSIDER_INDIVIDUAL_MONTHLY_PRICE_ID: "individual-monthly",
  CHARGEBEE_INSIDER_INDIVIDUAL_ANNUAL_PRICE_ID: "individual-annual",
  CHARGEBEE_INSIDER_FAMILY_MONTHLY_PRICE_ID: "family-monthly",
  CHARGEBEE_INSIDER_FAMILY_ANNUAL_PRICE_ID: "family-annual",
  CHARGEBEE_INSIDER_BUSINESS_MONTHLY_PRICE_ID: "business-monthly",
  CHARGEBEE_INSIDER_BUSINESS_ANNUAL_PRICE_ID: "business-annual",
};

function invoice(
  id: string,
  termStart: number,
  planId = "family-monthly",
): BootstrapInvoice {
  return {
    id,
    customer_id: "customer-1",
    subscription_id: "subscription-1",
    status: "paid",
    recurring: true,
    amount_paid: 1999,
    paid_at: termStart,
    date: termStart,
    line_items: [
      {
        entity_id: planId,
        entity_type: "plan_item_price",
        subscription_id: "subscription-1",
        amount: 1999,
        date_from: termStart,
        date_to:
          termStart + (planId.endsWith("-annual") ? 31_536_000 : 2_592_000),
      },
    ],
  };
}

function transaction(id: string, invoiceId: string, date: number) {
  return {
    id,
    customer_id: "customer-1",
    subscription_id: "subscription-1",
    status: "success",
    type: "payment",
    date,
    linked_invoices: [
      { invoice_id: invoiceId, applied_amount: 1999, applied_at: date },
    ],
  } satisfies BootstrapTransaction;
}

function client(
  options: {
    invoices?: BootstrapInvoice[];
    transactions?: BootstrapTransaction[];
    approvedSubscriptions?: Array<{
      subscription: BootstrapSubscription;
      customer: BootstrapCustomer;
    }>;
  } = {},
): ChargebeeBootstrapClient {
  return {
    listApprovedSubscriptions: vi.fn().mockResolvedValue(
      options.approvedSubscriptions ?? [
        {
          subscription: {
            id: "subscription-1",
            customer_id: "customer-1",
            status: "active",
            billing_period: 1,
            billing_period_unit: "month",
            current_term_start: 1_830_000_000,
            current_term_end: 1_832_592_000,
            resource_version: 1_830_000_000_000,
            currency_code: "USD",
            subscription_items: [
              {
                item_price_id: "family-monthly",
                item_type: "plan",
                amount: 1999,
                quantity: 1,
              },
            ],
          },
          customer: {
            id: "customer-1",
            email: "member@example.com",
            first_name: "Test",
            last_name: "Member",
          },
        },
      ],
    ),
    listPaidInvoices: vi.fn().mockResolvedValue(options.invoices ?? []),
    listSuccessfulTransactions: vi
      .fn()
      .mockResolvedValue(options.transactions ?? []),
  };
}

function approvedSubscription(
  subscriptionId: string,
  customerId: string,
  email = "member@example.com",
  planId = "family-monthly",
): {
  subscription: BootstrapSubscription;
  customer: BootstrapCustomer;
} {
  return {
    subscription: {
      id: subscriptionId,
      customer_id: customerId,
      status: "active",
      billing_period: 1,
      billing_period_unit: planId.endsWith("-annual") ? "year" : "month",
      current_term_start: 1_830_000_000,
      current_term_end:
        1_830_000_000 + (planId.endsWith("-annual") ? 31_536_000 : 2_592_000),
      resource_version: 1_830_000_000_000,
      currency_code: "USD",
      subscription_items: [
        {
          item_price_id: planId,
          item_type: "plan",
          amount: 1999,
          quantity: 1,
        },
      ],
    },
    customer: {
      id: customerId,
      email,
      first_name: "Test",
      last_name: "Member",
    },
  };
}

const members = [
  {
    id: "member-1",
    email: "member@example.com",
    phone: "573-555-0101",
    chargebee_customer_id: null,
    is_active: true,
  },
];

describe("Chargebee Insider bootstrap/backfill", () => {
  it("uses empty pre-migration indexes only for exact dry-run missing-table errors", () => {
    const postgresMissing = {
      code: "42P01",
      message: 'relation "public.insider_billing_events" does not exist',
    };
    const schemaCacheMissing = {
      code: "PGRST205",
      message:
        "Could not find the table 'public.insider_subscriptions' in the schema cache",
    };

    expect(
      isMissingInsiderBootstrapTableError(
        postgresMissing,
        "insider_billing_events",
      ),
    ).toBe(true);
    expect(
      isMissingInsiderBootstrapTableError(
        schemaCacheMissing,
        "insider_subscriptions",
      ),
    ).toBe(true);
    expect(
      shouldUseEmptyInsiderBootstrapIndex({
        apply: false,
        error: postgresMissing,
        table: "insider_billing_events",
      }),
    ).toBe(true);
    expect(
      shouldUseEmptyInsiderBootstrapIndex({
        apply: true,
        error: postgresMissing,
        table: "insider_billing_events",
      }),
    ).toBe(false);
  });

  it("fails closed for the wrong table, wrong code, or non-exact schema error", () => {
    expect(
      shouldUseEmptyInsiderBootstrapIndex({
        apply: false,
        error: {
          code: "42P01",
          message: 'relation "public.insider_members" does not exist',
        },
        table: "insider_billing_events",
      }),
    ).toBe(false);
    expect(
      shouldUseEmptyInsiderBootstrapIndex({
        apply: false,
        error: {
          code: "42501",
          message: "permission denied for table insider_billing_events",
        },
        table: "insider_billing_events",
      }),
    ).toBe(false);
    expect(
      shouldUseEmptyInsiderBootstrapIndex({
        apply: false,
        error: {
          code: "PGRST205",
          message:
            "Could not find the table 'private.insider_subscriptions' in the schema cache",
        },
        table: "insider_subscriptions",
      }),
    ).toBe(false);
  });

  it("falls back to email-only legacy member rows only for exact dry-run column errors", () => {
    const postgresMissingColumn = {
      code: "42703",
      message: "column insider_members.chargebee_customer_id does not exist",
    };
    const schemaCacheMissingColumn = {
      code: "PGRST204",
      message:
        "Could not find the 'chargebee_customer_id' column of 'insider_members' in the schema cache",
    };

    expect(
      isMissingLegacyMemberCustomerIdColumnError(postgresMissingColumn),
    ).toBe(true);
    expect(
      isMissingLegacyMemberCustomerIdColumnError(schemaCacheMissingColumn),
    ).toBe(true);
    expect(
      shouldUseLegacyInsiderMemberIndex({
        apply: false,
        error: postgresMissingColumn,
      }),
    ).toBe(true);
    expect(
      shouldUseLegacyInsiderMemberIndex({
        apply: true,
        error: postgresMissingColumn,
      }),
    ).toBe(false);
    expect(
      shouldUseLegacyInsiderMemberIndex({
        apply: false,
        error: {
          code: "42703",
          message: "column insider_members.phone does not exist",
        },
      }),
    ).toBe(false);
    expect(
      normalizeLegacyInsiderMemberRows([
        {
          id: "member-legacy",
          email: "legacy@example.com",
          phone: "573-555-0102",
          is_active: true,
        },
      ]),
    ).toEqual([
      {
        id: "member-legacy",
        email: "legacy@example.com",
        phone: "573-555-0102",
        is_active: true,
        chargebee_customer_id: null,
      },
    ]);
  });

  it("retries the dry-run member index without the legacy column and fails closed for apply", async () => {
    const missingLegacyColumn = {
      code: "PGRST204",
      message:
        "Could not find the 'chargebee_customer_id' column of 'insider_members' in the schema cache",
    };
    const readDryRunPage = vi
      .fn()
      .mockResolvedValueOnce({ data: null, error: missingLegacyColumn })
      .mockResolvedValueOnce({
        data: [
          {
            id: "member-legacy",
            email: "legacy@example.com",
            phone: "573-555-0102",
            is_active: true,
          },
        ],
        error: null,
      });

    await expect(
      loadInsiderBootstrapMemberIndex({
        apply: false,
        readPage: readDryRunPage,
      }),
    ).resolves.toEqual({
      legacyMemberIndex: true,
      members: [
        {
          id: "member-legacy",
          email: "legacy@example.com",
          phone: "573-555-0102",
          is_active: true,
          chargebee_customer_id: null,
        },
      ],
    });
    expect(readDryRunPage).toHaveBeenNthCalledWith(1, {
      includeChargebeeCustomerId: true,
      from: 0,
      to: 999,
    });
    expect(readDryRunPage).toHaveBeenNthCalledWith(2, {
      includeChargebeeCustomerId: false,
      from: 0,
      to: 999,
    });

    const readApplyPage = vi
      .fn()
      .mockResolvedValue({ data: null, error: missingLegacyColumn });
    await expect(
      loadInsiderBootstrapMemberIndex({
        apply: true,
        readPage: readApplyPage,
      }),
    ).rejects.toThrow("Member index unavailable");
    expect(readApplyPage).toHaveBeenCalledTimes(1);
  });

  it("formats operator failures with safe stages and codes only", () => {
    const failure = new InsiderBootstrapOperatorError(
      "member_index",
      "member_index_read_failed",
    );
    const output = safeInsiderBootstrapOperatorFailure(failure);

    expect(output).toBe(
      "Chargebee Insider bootstrap failed [stage=member_index] [code=member_index_read_failed]",
    );
    expect(output).not.toContain("example.com");
    expect(
      safeInsiderBootstrapOperatorFailure(
        new Error("secret value and customer@example.com"),
      ),
    ).toBe(
      "Chargebee Insider bootstrap failed [stage=config] [code=invalid_configuration]",
    );
  });

  it("defaults to dry-run and requires every apply guard", () => {
    expect(parseBootstrapArguments([])).toMatchObject({ apply: false });
    const args = parseBootstrapArguments([
      "--apply",
      `--confirm=${INSIDER_BOOTSTRAP_CONFIRMATION}`,
      "--target-chargebee-site=lakeridepros-test",
      "--target-project-ref=testref",
    ]);
    expect(() =>
      assertBootstrapApplyGuard(args, {
        INSIDERS_CHARGEBEE_BOOTSTRAP_MODE: "apply",
        INSIDERS_CHARGEBEE_SYNC_MODE: "off",
        CHARGEBEE_SITE: "lakeridepros-test",
        NEXT_PUBLIC_SUPABASE_URL: "https://testref.supabase.co",
      }),
    ).not.toThrow();
    expect(() =>
      assertBootstrapApplyGuard(args, {
        INSIDERS_CHARGEBEE_BOOTSTRAP_MODE: "dry-run",
        INSIDERS_CHARGEBEE_SYNC_MODE: "off",
        CHARGEBEE_SITE: "lakeridepros-test",
        NEXT_PUBLIC_SUPABASE_URL: "https://testref.supabase.co",
      }),
    ).toThrow("INSIDERS_CHARGEBEE_BOOTSTRAP_MODE must be apply");
    expect(() =>
      assertBootstrapApplyGuard(
        { ...args, confirm: "wrong" },
        {
          INSIDERS_CHARGEBEE_BOOTSTRAP_MODE: "apply",
          INSIDERS_CHARGEBEE_SYNC_MODE: "off",
          CHARGEBEE_SITE: "lakeridepros-test",
          NEXT_PUBLIC_SUPABASE_URL: "https://testref.supabase.co",
        },
      ),
    ).toThrow("Apply confirmation guard did not match");
    expect(() =>
      assertBootstrapApplyGuard(
        { ...args, targetChargebeeSite: "wrong-site" },
        {
          INSIDERS_CHARGEBEE_BOOTSTRAP_MODE: "apply",
          INSIDERS_CHARGEBEE_SYNC_MODE: "off",
          CHARGEBEE_SITE: "lakeridepros-test",
          NEXT_PUBLIC_SUPABASE_URL: "https://testref.supabase.co",
        },
      ),
    ).toThrow("Target Chargebee site confirmation did not match");
  });

  it("plans a current snapshot and twelve unique monthly payment terms without writing", async () => {
    const invoices = Array.from({ length: 12 }, (_, index) =>
      invoice(`invoice-${index + 1}`, 1_700_000_000 + index * 2_592_000),
    );
    const transactions = invoices.map((value, index) =>
      transaction(`transaction-${index + 1}`, value.id!, value.paid_at!),
    );
    const rpc = vi.fn();

    const summary = await runInsiderChargebeeBootstrap({
      chargebee: client({ invoices, transactions }),
      members,
      planEnv: PLAN_ENV,
      supabase: { rpc },
    });

    expect(summary).toMatchObject({
      mode: "dry-run",
      subscriptionsReady: 1,
      historicalPaymentEvents: 12,
      currentSnapshotEvents: 1,
      eventsToApply: 13,
      anniversaryTriggers: 1,
      failures: 0,
    });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("skips cancelled subscriptions before member mapping or history validation", async () => {
    const cancelled = approvedSubscription(
      "subscription-cancelled",
      "customer-cancelled",
      "cancelled@example.com",
    );
    cancelled.subscription.status = "cancelled";
    const chargebee = client({
      approvedSubscriptions: [
        cancelled,
        approvedSubscription("subscription-1", "customer-1"),
      ],
    });

    const summary = await runInsiderChargebeeBootstrap({
      chargebee,
      members,
      planEnv: PLAN_ENV,
    });

    expect(summary).toMatchObject({
      subscriptionsEnumerated: 2,
      subscriptionsEvaluated: 1,
      subscriptionsSkippedCancelled: 1,
      subscriptionsReady: 1,
      subscriptionsBlocked: 0,
    });
    expect(chargebee.listPaidInvoices).toHaveBeenCalledTimes(1);
    expect(chargebee.listPaidInvoices).toHaveBeenCalledWith("subscription-1");
  });

  it("uses the verified successful payment timestamp when invoice paid_at is absent", async () => {
    const paidInvoice = invoice("invoice-payment-time", 1_700_000_000);
    paidInvoice.paid_at = undefined;
    const paymentTime = 1_700_000_010;
    const rpc = vi
      .fn()
      .mockImplementation((_name: string, params: Record<string, unknown>) =>
        Promise.resolve({
          data: {
            bootstrapValidated: true,
            duplicate: false,
            historicalBackfill: params.historical_backfill === true,
            memberId: "member-1",
            memberCreated: false,
          },
          error: null,
        }),
      );

    const summary = await runInsiderChargebeeBootstrap({
      apply: true,
      chargebee: client({
        invoices: [paidInvoice],
        transactions: [
          transaction(
            "transaction-payment-time",
            "invoice-payment-time",
            paymentTime,
          ),
        ],
      }),
      members,
      supabase: { rpc },
      planEnv: PLAN_ENV,
    });

    expect(summary).toMatchObject({
      subscriptionsReady: 1,
      subscriptionsBlocked: 0,
      historicalPaymentEvents: 1,
      eventsApplied: 2,
    });
    expect(rpc.mock.calls[0][1]).toMatchObject({
      target_event_type: "payment_succeeded",
      target_event_occurred_at: new Date(paymentTime * 1000).toISOString(),
      historical_backfill: true,
    });
  });

  it("skips a paid prorated term from anniversary history without blocking the snapshot", async () => {
    const proratedInvoice = invoice("invoice-prorated", 1_700_000_000);
    proratedInvoice.line_items![0].date_to =
      proratedInvoice.line_items![0].date_from! + 13 * 86_400;

    const summary = await runInsiderChargebeeBootstrap({
      chargebee: client({
        invoices: [proratedInvoice],
        transactions: [
          transaction(
            "transaction-prorated",
            "invoice-prorated",
            1_700_000_010,
          ),
        ],
      }),
      members,
      planEnv: PLAN_ENV,
    });

    expect(summary).toMatchObject({
      subscriptionsReady: 1,
      subscriptionsBlocked: 0,
      historicalPaymentEvents: 0,
      currentSnapshotEvents: 1,
      partialTermsSkipped: 1,
    });
  });

  it("blocks overlapping paid terms that could double-count an anniversary", async () => {
    const firstInvoice = invoice("invoice-overlap-1", 1_700_000_000);
    const secondInvoice = invoice(
      "invoice-overlap-2",
      1_700_000_000 + 10 * 86_400,
    );

    const summary = await runInsiderChargebeeBootstrap({
      chargebee: client({
        invoices: [firstInvoice, secondInvoice],
        transactions: [
          transaction(
            "transaction-overlap-1",
            "invoice-overlap-1",
            1_700_000_010,
          ),
          transaction(
            "transaction-overlap-2",
            "invoice-overlap-2",
            1_700_000_010 + 10 * 86_400,
          ),
        ],
      }),
      members,
      planEnv: PLAN_ENV,
    });

    expect(summary.subscriptionsReady).toBe(0);
    expect(summary.subscriptionsBlocked).toBe(1);
    expect(summary.issues[0].historyReason).toBe("overlapping_billing_terms");
    expect(summary.historyIssueCounts).toEqual({
      overlapping_billing_terms: 1,
    });
  });

  it("does not replay an existing payment term or current resource version", async () => {
    const paidInvoice = invoice("invoice-existing", 1_700_000_000);
    const summary = await runInsiderChargebeeBootstrap({
      chargebee: client({
        invoices: [paidInvoice],
        transactions: [
          transaction(
            "transaction-existing",
            "invoice-existing",
            1_700_000_010,
          ),
        ],
      }),
      members,
      existingPaymentTerms: new Set([
        "subscription-1:2023-11-14T22:13:20.000Z",
      ]),
      existingSubscriptionVersions: new Map([
        ["subscription-1", 1_830_000_000_000],
      ]),
      planEnv: PLAN_ENV,
    });

    expect(summary).toMatchObject({
      historicalPaymentEvents: 1,
      currentSnapshotEvents: 1,
      alreadyAppliedEvents: 2,
      eventsToApply: 0,
    });
  });

  it("applies history oldest-first, current snapshot last, and is resumable", async () => {
    const firstInvoice = invoice("invoice-1", 1_700_000_000);
    const secondInvoice = invoice("invoice-2", 1_702_592_000);
    const rpc = vi
      .fn()
      .mockImplementation((_name: string, params: Record<string, unknown>) =>
        Promise.resolve({
          data: {
            bootstrapValidated: true,
            duplicate: false,
            historicalBackfill: params.historical_backfill === true,
            memberId: "member-1",
            memberCreated: false,
            eventId: params.target_event_id,
          },
          error: null,
        }),
      );

    const summary = await runInsiderChargebeeBootstrap({
      apply: true,
      chargebee: client({
        invoices: [secondInvoice, firstInvoice],
        transactions: [
          transaction("transaction-2", "invoice-2", 1_702_592_010),
          transaction("transaction-1", "invoice-1", 1_700_000_010),
        ],
      }),
      members,
      existingEventIds: new Set(["backfill:chargebee:invoice:invoice-1"]),
      supabase: { rpc },
      planEnv: PLAN_ENV,
    });

    expect(summary).toMatchObject({
      alreadyAppliedEvents: 1,
      eventsToApply: 2,
      eventsApplied: 2,
      failures: 0,
    });
    expect(rpc).toHaveBeenCalledTimes(2);
    expect(rpc.mock.calls[0][0]).toBe(
      "apply_insider_chargebee_bootstrap_event",
    );
    expect(rpc.mock.calls[0][1].target_event_id).toBe(
      "backfill:chargebee:invoice:invoice-2",
    );
    expect(rpc.mock.calls[0][1]).toMatchObject({
      expected_member_id: "member-1",
      historical_backfill: true,
    });
    expect(rpc.mock.calls[1][1].target_event_type).toBe("subscription_changed");
    expect(rpc.mock.calls[1][1]).toMatchObject({
      expected_member_id: "member-1",
      historical_backfill: false,
    });
  });

  it("blocks apply when a subscription cannot map to exactly one existing member", async () => {
    const summary = await runInsiderChargebeeBootstrap({
      chargebee: client(),
      members: [],
      planEnv: PLAN_ENV,
    });
    expect(summary.subscriptionsBlocked).toBe(1);
    expect(summary.issues[0].code).toBe("unmapped_member");

    const rpc = vi.fn();
    const applySummary = await runInsiderChargebeeBootstrap({
      apply: true,
      chargebee: client(),
      members: [],
      supabase: { rpc },
      planEnv: PLAN_ENV,
    });
    expect(applySummary.subscriptionsBlocked).toBe(1);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("uses a unique normalized phone only when customer identity does not conflict", async () => {
    const phoneOnly = approvedSubscription("subscription-1", "customer-1", "");
    phoneOnly.customer.email = undefined;
    phoneOnly.customer.phone = "+1 (573) 555-0101";

    const matched = await runInsiderChargebeeBootstrap({
      chargebee: client({ approvedSubscriptions: [phoneOnly] }),
      members,
      planEnv: PLAN_ENV,
    });
    expect(matched).toMatchObject({
      subscriptionsReady: 1,
      subscriptionsBlocked: 0,
    });

    const conflicting = approvedSubscription(
      "subscription-1",
      "customer-1",
      "different@example.com",
    );
    conflicting.customer.phone = "+1 (573) 555-0101";
    const blocked = await runInsiderChargebeeBootstrap({
      chargebee: client({ approvedSubscriptions: [conflicting] }),
      members,
      planEnv: PLAN_ENV,
    });
    expect(blocked.subscriptionsReady).toBe(0);
    expect(blocked.subscriptionsBlocked).toBe(1);
    expect(blocked.issues[0].code).toBe("contact_identity_conflict");
  });

  it("fails closed when the bootstrap RPC does not confirm expected-member binding", async () => {
    const paidInvoice = invoice("invoice-binding", 1_700_000_000);
    const rpc = vi.fn().mockResolvedValue({
      data: {
        bootstrapValidated: true,
        duplicate: false,
        historicalBackfill: true,
        memberId: "different-member",
        memberCreated: false,
      },
      error: null,
    });

    const summary = await runInsiderChargebeeBootstrap({
      apply: true,
      chargebee: client({
        invoices: [paidInvoice],
        transactions: [
          transaction("transaction-binding", "invoice-binding", 1_700_000_010),
        ],
      }),
      members,
      supabase: { rpc },
      planEnv: PLAN_ENV,
    });

    expect(summary.failures).toBe(1);
    expect(summary.eventsApplied).toBe(0);
    expect(rpc).toHaveBeenCalledTimes(1);
    expect(rpc.mock.calls[0][1].expected_member_id).toBe("member-1");
  });

  it("rejects mixed monthly and annual history instead of corrupting anniversary counts", async () => {
    const monthly = invoice("invoice-month", 1_700_000_000);
    const annual = invoice("invoice-year", 1_702_592_000, "family-annual");
    const summary = await runInsiderChargebeeBootstrap({
      chargebee: client({
        invoices: [monthly, annual],
        transactions: [
          transaction("transaction-month", "invoice-month", 1_700_000_010),
          transaction("transaction-year", "invoice-year", 1_702_592_010),
        ],
      }),
      members,
      planEnv: PLAN_ENV,
    });

    expect(summary.subscriptionsBlocked).toBe(1);
    expect(summary.issues[0].code).toBe("mixed_billing_cadence");
  });

  it("blocks multiple approved subscriptions that resolve to one member", async () => {
    const summary = await runInsiderChargebeeBootstrap({
      chargebee: client({
        approvedSubscriptions: [
          approvedSubscription("subscription-1", "customer-1"),
          approvedSubscription("subscription-2", "customer-2"),
        ],
      }),
      members,
      planEnv: PLAN_ENV,
    });

    expect(summary.subscriptionsReady).toBe(0);
    expect(summary.subscriptionsBlocked).toBe(2);
    expect(
      summary.issues.every(
        (issue) => issue.code === "multiple_subscriptions_for_member",
      ),
    ).toBe(true);
  });

  it("does not attribute an approved invoice line to the wrong subscription", async () => {
    const crossSubscriptionInvoice = invoice(
      "invoice-cross-subscription",
      1_700_000_000,
    );
    crossSubscriptionInvoice.line_items![0].subscription_id =
      "different-subscription";

    const summary = await runInsiderChargebeeBootstrap({
      chargebee: client({
        invoices: [crossSubscriptionInvoice],
        transactions: [
          transaction(
            "transaction-cross-subscription",
            "invoice-cross-subscription",
            1_700_000_010,
          ),
        ],
      }),
      members,
      planEnv: PLAN_ENV,
    });

    expect(summary.subscriptionsBlocked).toBe(0);
    expect(summary.historicalPaymentEvents).toBe(0);
    expect(summary.currentSnapshotEvents).toBe(1);
  });

  it("blocks a combined invoice with multiple distinct qualifying plan lines", async () => {
    const ambiguousInvoice = invoice("invoice-ambiguous", 1_700_000_000);
    ambiguousInvoice.line_items!.push({
      entity_id: "individual-monthly",
      entity_type: "plan_item_price",
      subscription_id: "subscription-1",
      amount: 999,
      date_from: 1_700_000_000,
      date_to: 1_702_592_000,
    });

    const summary = await runInsiderChargebeeBootstrap({
      chargebee: client({
        invoices: [ambiguousInvoice],
        transactions: [
          transaction(
            "transaction-ambiguous",
            "invoice-ambiguous",
            1_700_000_010,
          ),
        ],
      }),
      members,
      planEnv: PLAN_ENV,
    });

    expect(summary.subscriptionsReady).toBe(0);
    expect(summary.subscriptionsBlocked).toBe(1);
    expect(summary.issues[0].code).toBe("invalid_invoice_history");
    expect(summary.issues[0].historyReason).toBe(
      "multiple_qualifying_plan_terms",
    );
    expect(summary.historyIssueCounts).toEqual({
      multiple_qualifying_plan_terms: 1,
    });
  });

  it("blocks when an existing paid term is absent from authoritative invoice history", async () => {
    const summary = await runInsiderChargebeeBootstrap({
      chargebee: client(),
      members,
      existingPaymentTerms: new Set([
        "subscription-1:2023-11-14T22:13:20.000Z",
      ]),
      planEnv: PLAN_ENV,
    });

    expect(summary.subscriptionsReady).toBe(0);
    expect(summary.subscriptionsBlocked).toBe(1);
    expect(summary.issues[0].code).toBe("mixed_billing_cadence");
  });

  it("blocks a stale Chargebee snapshot and rejects mapped cadence disagreement", async () => {
    const stale = await runInsiderChargebeeBootstrap({
      chargebee: client(),
      members,
      existingSubscriptionVersions: new Map([
        ["subscription-1", 1_830_000_000_001],
      ]),
      planEnv: PLAN_ENV,
    });
    expect(stale.issues[0].code).toBe("stale_chargebee_snapshot");

    const mismatched = approvedSubscription("subscription-1", "customer-1");
    mismatched.subscription.billing_period_unit = "year";
    const cadence = await runInsiderChargebeeBootstrap({
      chargebee: client({ approvedSubscriptions: [mismatched] }),
      members,
      planEnv: PLAN_ENV,
    });
    expect(cadence.issues[0].code).toBe("incomplete_subscription");
  });

  it("paginates approved subscription enumeration without exposing credentials", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            list: [],
            next_offset: "opaque-next-page",
          }),
          { status: 200 },
        ),
      )
      .mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify({ list: [] }), { status: 200 }),
        ),
      );
    const chargebee = createChargebeeBootstrapClient({
      env: PLAN_ENV,
      fetchImpl,
    });

    await chargebee.listApprovedSubscriptions();

    expect(fetchImpl).toHaveBeenCalledTimes(7);
    expect(fetchImpl.mock.calls[1][0]).toContain("offset=opaque-next-page");
    expect(fetchImpl.mock.calls[0][1].headers.Authorization).toMatch(/^Basic /);
    expect(fetchImpl.mock.calls[0][0]).not.toContain("test-key");
  });

  it("requests invoice and payment history only for the exact Insider subscription", async () => {
    const fetchImpl = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ list: [] }), {
          status: 200,
        }),
      ),
    );
    const chargebee = createChargebeeBootstrapClient({
      env: PLAN_ENV,
      fetchImpl,
    });

    await chargebee.listPaidInvoices("approved-subscription");
    await chargebee.listSuccessfulTransactions("approved-subscription");

    expect(fetchImpl).toHaveBeenCalledTimes(2);
    for (const [rawUrl] of fetchImpl.mock.calls) {
      const url = new URL(rawUrl);
      expect(url.searchParams.get("subscription_id[is]")).toBe(
        "approved-subscription",
      );
      expect(url.searchParams.has("customer_id[is]")).toBe(false);
    }
    expect(new URL(fetchImpl.mock.calls[0][0]).pathname).toBe(
      "/api/v2/invoices",
    );
    expect(new URL(fetchImpl.mock.calls[1][0]).pathname).toBe(
      "/api/v2/transactions",
    );
  });
});
