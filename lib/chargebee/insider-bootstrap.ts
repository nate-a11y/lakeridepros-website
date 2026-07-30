import { createHash } from "node:crypto";

const CHARGEBEE_API_VERSION = "v2";
export const INSIDER_BOOTSTRAP_CONFIRMATION =
  "APPLY-INSIDERS-CHARGEBEE-BACKFILL";

type MembershipType = "individual" | "family" | "business";
type BillingInterval = "month" | "year";
type SubscriptionStatus =
  | "future"
  | "in_trial"
  | "active"
  | "non_renewing"
  | "paused"
  | "past_due"
  | "cancelled";
type AccountStatus = "pending" | "active" | "hold" | "past_due" | "cancelled";

interface PlanMapping {
  membershipType: MembershipType;
  billingInterval: BillingInterval;
}

interface ChargebeeSubscriptionItem {
  item_price_id?: string;
  item_type?: string;
  amount?: number;
  quantity?: number;
}

export interface BootstrapSubscription {
  id?: string;
  customer_id?: string;
  status?: string;
  billing_period?: number;
  billing_period_unit?: string;
  current_term_start?: number;
  current_term_end?: number;
  cancelled_at?: number;
  activated_at?: number;
  started_at?: number;
  created_at?: number;
  resource_version?: number;
  due_invoices_count?: number;
  currency_code?: string;
  subscription_items?: ChargebeeSubscriptionItem[];
}

export interface BootstrapCustomer {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  phone?: string;
}

interface ChargebeeInvoiceLineItem {
  entity_id?: string;
  entity_type?: string;
  subscription_id?: string;
  amount?: number;
  date_from?: number;
  date_to?: number;
}

interface ChargebeeLinkedPayment {
  txn_id?: string;
  txn_status?: string;
  applied_amount?: number;
  applied_at?: number;
}

export interface BootstrapInvoice {
  id?: string;
  customer_id?: string;
  subscription_id?: string;
  status?: string;
  recurring?: boolean;
  amount_paid?: number;
  paid_at?: number;
  date?: number;
  line_items?: ChargebeeInvoiceLineItem[];
  linked_payments?: ChargebeeLinkedPayment[];
}

interface ChargebeeLinkedInvoice {
  invoice_id?: string;
  applied_amount?: number;
  applied_at?: number;
}

export interface BootstrapTransaction {
  id?: string;
  customer_id?: string;
  subscription_id?: string;
  status?: string;
  type?: string;
  date?: number;
  linked_invoices?: ChargebeeLinkedInvoice[];
}

export interface ExistingInsiderMember {
  id: string;
  email: string | null;
  phone: string | null;
  chargebee_customer_id: string | null;
  is_active: boolean;
}

export interface BootstrapRpcClient {
  rpc(
    functionName: string,
    params: Record<string, unknown>,
  ): PromiseLike<{
    data: unknown;
    error: { message?: string } | null;
  }>;
}

export interface ChargebeeBootstrapClient {
  listApprovedSubscriptions(): Promise<
    Array<{
      subscription: BootstrapSubscription;
      customer: BootstrapCustomer;
    }>
  >;
  listPaidInvoices(subscriptionId: string): Promise<BootstrapInvoice[]>;
  listSuccessfulTransactions(
    subscriptionId: string,
  ): Promise<BootstrapTransaction[]>;
}

export interface BootstrapArguments {
  apply: boolean;
  confirm: string | null;
  targetChargebeeSite: string | null;
  targetProjectRef: string | null;
  help: boolean;
}

interface BootstrapEvent {
  eventId: string;
  eventType: "payment_succeeded" | "subscription_changed";
  occurredAt: string;
  termStart: string | null;
  termEnd: string | null;
  planId: string;
  plan: PlanMapping;
  kind: "historical_payment" | "current_snapshot";
}

interface PlannedSubscription {
  ref: string;
  expectedMemberId: string;
  subscription: BootstrapSubscription & { id: string; customer_id: string };
  customer: BootstrapCustomer & { id: string };
  currentPlanId: string;
  currentPlan: PlanMapping;
  events: BootstrapEvent[];
  anniversaryTriggers: number;
  partialTermsSkipped: number;
}

export interface BootstrapIssue {
  ref: string;
  code:
    | "ambiguous_member_match"
    | "contact_identity_conflict"
    | "incomplete_subscription"
    | "invalid_invoice_history"
    | "mixed_billing_cadence"
    | "multiple_subscriptions_for_member"
    | "stale_chargebee_snapshot"
    | "unmapped_member";
  detail: string;
  historyReason?: BootstrapHistoryReasonCode;
}

export type BootstrapHistoryReasonCode =
  | "conflicting_term_invoices"
  | "missing_billing_term"
  | "multiple_qualifying_plan_terms"
  | "overlapping_billing_terms"
  | "unexpected_term_length"
  | "unknown_history_validation_failure";

export interface BootstrapReconciliationSummary {
  mode: "dry-run" | "apply";
  subscriptionsEnumerated: number;
  subscriptionsEvaluated: number;
  subscriptionsSkippedCancelled: number;
  subscriptionsReady: number;
  subscriptionsBlocked: number;
  membersMatched: number;
  historicalPaymentEvents: number;
  currentSnapshotEvents: number;
  alreadyAppliedEvents: number;
  eventsToApply: number;
  eventsApplied: number;
  duplicateEvents: number;
  anniversaryTriggers: number;
  partialTermsSkipped: number;
  failures: number;
  historyIssueCounts: Partial<Record<BootstrapHistoryReasonCode, number>>;
  issues: BootstrapIssue[];
}

class BootstrapHistoryValidationError extends Error {
  readonly reason: BootstrapHistoryReasonCode;

  constructor(reason: BootstrapHistoryReasonCode) {
    super("Chargebee invoice history failed validation");
    this.name = "BootstrapHistoryValidationError";
    this.reason = reason;
  }
}

const PLAN_ENVIRONMENTS: Array<{
  envName: string;
  membershipType: MembershipType;
  billingInterval: BillingInterval;
}> = [
  {
    envName: "CHARGEBEE_INSIDER_INDIVIDUAL_MONTHLY_PRICE_ID",
    membershipType: "individual",
    billingInterval: "month",
  },
  {
    envName: "CHARGEBEE_INSIDER_INDIVIDUAL_ANNUAL_PRICE_ID",
    membershipType: "individual",
    billingInterval: "year",
  },
  {
    envName: "CHARGEBEE_INSIDER_FAMILY_MONTHLY_PRICE_ID",
    membershipType: "family",
    billingInterval: "month",
  },
  {
    envName: "CHARGEBEE_INSIDER_FAMILY_ANNUAL_PRICE_ID",
    membershipType: "family",
    billingInterval: "year",
  },
  {
    envName: "CHARGEBEE_INSIDER_BUSINESS_MONTHLY_PRICE_ID",
    membershipType: "business",
    billingInterval: "month",
  },
  {
    envName: "CHARGEBEE_INSIDER_BUSINESS_ANNUAL_PRICE_ID",
    membershipType: "business",
    billingInterval: "year",
  },
];

function requiredEnvironment(
  env: Record<string, string | undefined>,
  name: string,
): string {
  const value = env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function createBootstrapPlanMap(
  env: Record<string, string | undefined>,
): Map<string, PlanMapping> {
  const planMap = new Map<string, PlanMapping>();

  for (const config of PLAN_ENVIRONMENTS) {
    const planId = requiredEnvironment(env, config.envName);
    if (planMap.has(planId)) {
      throw new Error("Chargebee item price ID is mapped more than once");
    }
    planMap.set(planId, {
      membershipType: config.membershipType,
      billingInterval: config.billingInterval,
    });
  }

  return planMap;
}

function normalizeEmail(value?: string | null): string | null {
  const normalized = value?.trim().toLowerCase();
  return normalized || null;
}

function normalizePhone(value?: string | null): string | null {
  const digits = value?.replace(/\D/g, "") ?? "";
  if (digits.length === 11 && digits.startsWith("1")) {
    return digits.slice(1);
  }
  return digits.length >= 7 ? digits : null;
}

function customerName(customer: BootstrapCustomer): string {
  return (
    customer.company?.trim() ||
    [customer.first_name, customer.last_name]
      .filter((part): part is string => Boolean(part?.trim()))
      .map((part) => part.trim())
      .join(" ") ||
    customer.email?.split("@")[0] ||
    "Insider Member"
  );
}

function unixTimestampToIso(value?: number): string | null {
  if (!Number.isFinite(value) || !value || value < 0) return null;
  return new Date(value * 1000).toISOString();
}

function stableRef(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}

function currentPlanItem(
  subscription: BootstrapSubscription,
): ChargebeeSubscriptionItem | null {
  return (
    subscription.subscription_items?.find(
      (item) => item.item_type === "plan",
    ) ??
    subscription.subscription_items?.[0] ??
    null
  );
}

function normalizeSubscriptionStatus(subscription: BootstrapSubscription): {
  subscriptionStatus: SubscriptionStatus;
  accountStatus: AccountStatus;
} {
  if (
    (subscription.status === "active" ||
      subscription.status === "non_renewing") &&
    (subscription.due_invoices_count ?? 0) > 0
  ) {
    return {
      subscriptionStatus: "past_due",
      accountStatus: "past_due",
    };
  }

  switch (subscription.status) {
    case "future":
      return { subscriptionStatus: "future", accountStatus: "pending" };
    case "in_trial":
      return { subscriptionStatus: "in_trial", accountStatus: "active" };
    case "active":
      return { subscriptionStatus: "active", accountStatus: "active" };
    case "non_renewing":
      return { subscriptionStatus: "non_renewing", accountStatus: "active" };
    case "paused":
      return { subscriptionStatus: "paused", accountStatus: "hold" };
    case "cancelled":
      return { subscriptionStatus: "cancelled", accountStatus: "cancelled" };
    default:
      throw new Error("Unsupported Chargebee subscription status");
  }
}

function matchExistingMember(
  customer: BootstrapCustomer,
  members: ExistingInsiderMember[],
):
  | { kind: "matched"; member: ExistingInsiderMember }
  | { kind: "unmapped" | "ambiguous" | "contact_conflict" } {
  const customerId = customer.id?.trim();
  const email = normalizeEmail(customer.email);
  const phone = normalizePhone(customer.phone);
  const customerMatches = customerId
    ? members.filter(
        (member) => member.chargebee_customer_id?.trim() === customerId,
      )
    : [];
  const emailMatches = email
    ? members.filter((member) => normalizeEmail(member.email) === email)
    : [];
  const phoneMatches = phone
    ? members.filter((member) => normalizePhone(member.phone) === phone)
    : [];

  if (
    customerMatches.length > 1 ||
    emailMatches.length > 1 ||
    phoneMatches.length > 1
  ) {
    return { kind: "ambiguous" };
  }

  const customerMember = customerMatches[0];
  const emailMember = emailMatches[0];
  const phoneMember = phoneMatches[0];

  if (customerMember && emailMember && customerMember.id !== emailMember.id) {
    return { kind: "ambiguous" };
  }

  const authoritativeMember = customerMember ?? emailMember;
  if (
    authoritativeMember &&
    phoneMember &&
    authoritativeMember.id !== phoneMember.id
  ) {
    return { kind: "contact_conflict" };
  }
  if (authoritativeMember) {
    return { kind: "matched", member: authoritativeMember };
  }
  if (!phoneMember) {
    return { kind: "unmapped" };
  }

  const memberEmail = normalizeEmail(phoneMember.email);
  if (email && memberEmail && email !== memberEmail) {
    return { kind: "contact_conflict" };
  }

  return { kind: "matched", member: phoneMember };
}

function successfulPaymentByInvoice(
  transactions: BootstrapTransaction[],
): Map<string, { occurredAt: number }> {
  const payments = new Map<string, { occurredAt: number }>();

  for (const transaction of transactions) {
    if (transaction.status !== "success" || transaction.type !== "payment") {
      continue;
    }

    for (const invoice of transaction.linked_invoices ?? []) {
      if (
        !invoice.invoice_id ||
        !Number.isFinite(invoice.applied_amount) ||
        (invoice.applied_amount ?? 0) <= 0
      ) {
        continue;
      }

      const occurredAt = invoice.applied_at ?? transaction.date ?? Number.NaN;
      if (!Number.isFinite(occurredAt) || occurredAt <= 0) continue;

      const existing = payments.get(invoice.invoice_id);
      if (!existing || occurredAt < existing.occurredAt) {
        payments.set(invoice.invoice_id, { occurredAt });
      }
    }
  }

  return payments;
}

function buildHistoricalEvents(
  subscriptionId: string,
  invoices: BootstrapInvoice[],
  transactions: BootstrapTransaction[],
  planMap: Map<string, PlanMapping>,
): {
  events: BootstrapEvent[];
  anniversaryTriggers: number;
  partialTermsSkipped: number;
} {
  const successfulPayments = successfulPaymentByInvoice(transactions);
  const eventsByTerm = new Map<string, BootstrapEvent>();
  let partialTermsSkipped = 0;

  for (const invoice of invoices) {
    if (
      !invoice.id ||
      invoice.status !== "paid" ||
      invoice.recurring === false ||
      (invoice.amount_paid ?? 0) <= 0
    ) {
      continue;
    }

    const matchingLineItems = (invoice.line_items ?? []).filter((lineItem) => {
      const belongsToSubscription = lineItem.subscription_id
        ? lineItem.subscription_id === subscriptionId
        : invoice.subscription_id === subscriptionId;
      return (
        lineItem.entity_type === "plan_item_price" &&
        Boolean(lineItem.entity_id && planMap.has(lineItem.entity_id)) &&
        (lineItem.amount ?? 0) > 0 &&
        belongsToSubscription
      );
    });
    if (matchingLineItems.length === 0) continue;
    const canonicalLineItems = new Map<string, ChargebeeInvoiceLineItem>();
    for (const lineItem of matchingLineItems) {
      const canonicalKey = JSON.stringify([
        lineItem.entity_id ?? null,
        lineItem.entity_type ?? null,
        lineItem.subscription_id ?? null,
        lineItem.amount ?? null,
        lineItem.date_from ?? null,
        lineItem.date_to ?? null,
      ]);
      canonicalLineItems.set(canonicalKey, lineItem);
    }
    if (canonicalLineItems.size !== 1) {
      throw new BootstrapHistoryValidationError(
        "multiple_qualifying_plan_terms",
      );
    }

    const payment =
      successfulPayments.get(invoice.id) ??
      (invoice.linked_payments ?? []).reduce<
        { occurredAt: number } | undefined
      >((earliest, linkedPayment) => {
        if (
          linkedPayment.txn_status !== "success" ||
          (linkedPayment.applied_amount ?? 0) <= 0
        ) {
          return earliest;
        }
        const occurredAt = linkedPayment.applied_at ?? Number.NaN;
        if (!Number.isFinite(occurredAt) || occurredAt <= 0) return earliest;
        return !earliest || occurredAt < earliest.occurredAt
          ? { occurredAt }
          : earliest;
      }, undefined);

    if (!payment) continue;
    const paymentOccurredAt = invoice.paid_at ?? payment.occurredAt;

    const lineItem = [...canonicalLineItems.values()][0];
    const planId = lineItem.entity_id;
    const plan = planId ? planMap.get(planId) : undefined;
    const termStart = lineItem.date_from ?? invoice.date;
    const termEnd = lineItem.date_to;

    if (
      !planId ||
      !plan ||
      !termStart ||
      termStart <= 0 ||
      !termEnd ||
      termEnd <= termStart ||
      !Number.isFinite(paymentOccurredAt) ||
      paymentOccurredAt <= 0
    ) {
      throw new BootstrapHistoryValidationError("missing_billing_term");
    }
    const termSeconds = termEnd - termStart;
    const minimumTermSeconds =
      plan.billingInterval === "month" ? 27 * 86_400 : 364 * 86_400;
    const maximumTermSeconds =
      plan.billingInterval === "month" ? 32 * 86_400 : 367 * 86_400;
    if (termSeconds < minimumTermSeconds || termSeconds > maximumTermSeconds) {
      partialTermsSkipped += 1;
      continue;
    }

    const termKey = `${subscriptionId}:${termStart}`;
    const candidate: BootstrapEvent = {
      eventId: `backfill:chargebee:invoice:${invoice.id}`,
      eventType: "payment_succeeded",
      occurredAt: unixTimestampToIso(paymentOccurredAt)!,
      termStart: unixTimestampToIso(termStart),
      termEnd: unixTimestampToIso(termEnd),
      planId,
      plan,
      kind: "historical_payment",
    };
    const existing = eventsByTerm.get(termKey);

    if (
      existing &&
      (existing.plan.billingInterval !== plan.billingInterval ||
        existing.plan.membershipType !== plan.membershipType)
    ) {
      throw new BootstrapHistoryValidationError("conflicting_term_invoices");
    }

    if (
      !existing ||
      candidate.occurredAt < existing.occurredAt ||
      (candidate.occurredAt === existing.occurredAt &&
        candidate.eventId.localeCompare(existing.eventId) < 0)
    ) {
      eventsByTerm.set(termKey, candidate);
    }
  }

  const events = [...eventsByTerm.values()].sort((left, right) =>
    left.termStart!.localeCompare(right.termStart!),
  );
  for (let index = 1; index < events.length; index += 1) {
    const previousTermEnd = events[index - 1].termEnd;
    const currentTermStart = events[index].termStart;
    if (
      previousTermEnd &&
      currentTermStart &&
      currentTermStart < previousTermEnd
    ) {
      throw new BootstrapHistoryValidationError("overlapping_billing_terms");
    }
  }
  const intervals = new Set(events.map((event) => event.plan.billingInterval));
  const interval = events[0]?.plan.billingInterval;
  const anniversaryTriggers =
    intervals.size > 1
      ? 0
      : interval === "month"
        ? Math.floor(events.length / 12)
        : interval === "year"
          ? Math.max(events.length - 1, 0)
          : 0;

  return { events, anniversaryTriggers, partialTermsSkipped };
}

function currentSnapshotEvent(
  subscription: BootstrapSubscription & { id: string },
  planId: string,
  plan: PlanMapping,
  historicalEvents: BootstrapEvent[],
): BootstrapEvent {
  const occurredAt =
    subscription.resource_version &&
    subscription.resource_version > 10_000_000_000
      ? Math.floor(subscription.resource_version / 1000)
      : (subscription.current_term_start ??
        subscription.activated_at ??
        subscription.started_at ??
        subscription.created_at);

  if (!occurredAt) {
    throw new Error("Subscription has no authoritative timestamp");
  }

  const historyFingerprint = createHash("sha256")
    .update(
      historicalEvents
        .map((event) => `${event.eventId}:${event.termStart}`)
        .join("|"),
    )
    .digest("hex")
    .slice(0, 16);

  return {
    eventId: `backfill:chargebee:subscription:${subscription.id}:rv:${subscription.resource_version ?? 0}:history:${historyFingerprint}`,
    eventType: "subscription_changed",
    occurredAt: unixTimestampToIso(occurredAt)!,
    termStart: unixTimestampToIso(subscription.current_term_start),
    termEnd: unixTimestampToIso(subscription.current_term_end),
    planId,
    plan,
    kind: "current_snapshot",
  };
}

export function parseBootstrapArguments(argv: string[]): BootstrapArguments {
  const valueFor = (name: string) => {
    const inline = argv.find((argument) => argument.startsWith(`${name}=`));
    if (inline) return inline.slice(name.length + 1);
    const index = argv.indexOf(name);
    return index >= 0 ? argv[index + 1] : undefined;
  };

  const known = new Set([
    "--apply",
    "--dry-run",
    "--help",
    "-h",
    "--confirm",
    "--target-chargebee-site",
    "--target-project-ref",
  ]);
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const name = argument.split("=", 1)[0];
    if (!known.has(name)) throw new Error(`Unknown argument: ${name}`);
    if (
      (name === "--confirm" ||
        name === "--target-chargebee-site" ||
        name === "--target-project-ref") &&
      !argument.includes("=")
    ) {
      index += 1;
    }
  }

  if (argv.includes("--apply") && argv.includes("--dry-run")) {
    throw new Error("Choose either --apply or --dry-run");
  }

  return {
    apply: argv.includes("--apply"),
    confirm: valueFor("--confirm") ?? null,
    targetChargebeeSite: valueFor("--target-chargebee-site") ?? null,
    targetProjectRef: valueFor("--target-project-ref") ?? null,
    help: argv.includes("--help") || argv.includes("-h"),
  };
}

function supabaseProjectRef(urlValue: string): string {
  const url = new URL(urlValue);
  const ref = url.hostname.split(".")[0];
  if (!ref || !url.hostname.endsWith(".supabase.co")) {
    throw new Error("Invalid NEXT_PUBLIC_SUPABASE_URL");
  }
  return ref;
}

export function assertBootstrapApplyGuard(
  args: BootstrapArguments,
  env: Record<string, string | undefined>,
): void {
  if (!args.apply) return;
  if (args.confirm !== INSIDER_BOOTSTRAP_CONFIRMATION) {
    throw new Error("Apply confirmation guard did not match");
  }
  if (env.INSIDERS_CHARGEBEE_BOOTSTRAP_MODE?.trim() !== "apply") {
    throw new Error("INSIDERS_CHARGEBEE_BOOTSTRAP_MODE must be apply");
  }
  if (env.INSIDERS_CHARGEBEE_SYNC_MODE?.trim() !== "off") {
    throw new Error("INSIDERS_CHARGEBEE_SYNC_MODE must be off");
  }
  const configuredChargebeeSite = requiredEnvironment(env, "CHARGEBEE_SITE");
  if (
    !args.targetChargebeeSite ||
    args.targetChargebeeSite !== configuredChargebeeSite
  ) {
    throw new Error("Target Chargebee site confirmation did not match");
  }

  const configuredRef = supabaseProjectRef(
    requiredEnvironment(env, "NEXT_PUBLIC_SUPABASE_URL"),
  );
  if (!args.targetProjectRef || args.targetProjectRef !== configuredRef) {
    throw new Error("Target Supabase project confirmation did not match");
  }
}

async function paginatedChargebeeGet<T>(
  baseUrl: string,
  path: string,
  params: URLSearchParams,
  authorization: string,
  fetchImpl: typeof fetch,
  resourceName: string,
): Promise<T[]> {
  const records: T[] = [];
  let offset: string | null = null;

  do {
    const pageParams = new URLSearchParams(params);
    pageParams.set("limit", "100");
    if (offset) pageParams.set("offset", offset);
    const response = await fetchImpl(`${baseUrl}${path}?${pageParams}`, {
      headers: {
        Accept: "application/json",
        Authorization: authorization,
      },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(
        `Chargebee ${resourceName} request failed (${response.status})`,
      );
    }
    const payload = (await response.json()) as {
      list?: T[];
      next_offset?: string;
    };
    records.push(...(payload.list ?? []));
    offset = payload.next_offset ?? null;
  } while (offset);

  return records;
}

export function createChargebeeBootstrapClient(
  options: {
    env?: Record<string, string | undefined>;
    fetchImpl?: typeof fetch;
  } = {},
): ChargebeeBootstrapClient {
  const env = options.env ?? process.env;
  const fetchImpl = options.fetchImpl ?? fetch;
  const site = requiredEnvironment(env, "CHARGEBEE_SITE");
  const apiKey = requiredEnvironment(env, "CHARGEBEE_API_KEY");
  const planMap = createBootstrapPlanMap(env);
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(site)) {
    throw new Error("Invalid CHARGEBEE_SITE");
  }
  const baseUrl = `https://${site}.chargebee.com/api/${CHARGEBEE_API_VERSION}`;
  const authorization = `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;

  return {
    async listApprovedSubscriptions() {
      const byId = new Map<
        string,
        {
          subscription: BootstrapSubscription;
          customer: BootstrapCustomer;
        }
      >();

      for (const planId of planMap.keys()) {
        const params = new URLSearchParams({
          "item_price_id[is]": planId,
          "sort_by[asc]": "created_at",
        });
        const entries = await paginatedChargebeeGet<{
          subscription?: BootstrapSubscription;
          customer?: BootstrapCustomer;
        }>(
          baseUrl,
          "/subscriptions",
          params,
          authorization,
          fetchImpl,
          "subscription list",
        );
        for (const entry of entries) {
          if (entry.subscription?.id && entry.customer) {
            byId.set(entry.subscription.id, {
              subscription: entry.subscription,
              customer: entry.customer,
            });
          }
        }
      }

      return [...byId.values()];
    },

    async listPaidInvoices(subscriptionId) {
      const params = new URLSearchParams({
        "subscription_id[is]": subscriptionId,
        "status[is]": "paid",
        "recurring[is]": "true",
        "amount_paid[gt]": "0",
        "sort_by[asc]": "date",
      });
      const entries = await paginatedChargebeeGet<{
        invoice?: BootstrapInvoice;
      }>(
        baseUrl,
        "/invoices",
        params,
        authorization,
        fetchImpl,
        "invoice list",
      );
      return entries.flatMap((entry) => (entry.invoice ? [entry.invoice] : []));
    },

    async listSuccessfulTransactions(subscriptionId) {
      const params = new URLSearchParams({
        "subscription_id[is]": subscriptionId,
        "status[is]": "success",
        "type[is]": "payment",
        "sort_by[asc]": "date",
      });
      const entries = await paginatedChargebeeGet<{
        transaction?: BootstrapTransaction;
      }>(
        baseUrl,
        "/transactions",
        params,
        authorization,
        fetchImpl,
        "transaction list",
      );
      return entries.flatMap((entry) =>
        entry.transaction ? [entry.transaction] : [],
      );
    },
  };
}

function sanitizedSnapshot(
  subscription: BootstrapSubscription & { id: string; customer_id: string },
  customer: BootstrapCustomer & { id: string },
  planItem: ChargebeeSubscriptionItem,
) {
  return {
    subscription: {
      id: subscription.id,
      customerId: subscription.customer_id,
      status: subscription.status,
      billingPeriod: subscription.billing_period,
      billingPeriodUnit: subscription.billing_period_unit,
      currentTermStart: subscription.current_term_start,
      currentTermEnd: subscription.current_term_end,
      cancelledAt: subscription.cancelled_at,
      resourceVersion: subscription.resource_version,
      dueInvoicesCount: subscription.due_invoices_count,
      currencyCode: subscription.currency_code,
      planItem: {
        itemPriceId: planItem.item_price_id,
        amount: planItem.amount,
        quantity: planItem.quantity,
      },
    },
    customer: {
      id: customer.id,
      email: normalizeEmail(customer.email),
      name: customerName(customer),
      phone: customer.phone?.trim() || null,
    },
    bootstrap: {
      source: "chargebee_authoritative_backfill",
      version: 1,
    },
  };
}

function rpcParams(
  planned: PlannedSubscription,
  event: BootstrapEvent,
): Record<string, unknown> {
  const status = normalizeSubscriptionStatus(planned.subscription);
  const currentItem = currentPlanItem(planned.subscription)!;

  return {
    expected_member_id: planned.expectedMemberId,
    target_event_id: event.eventId,
    target_event_type: event.eventType,
    target_event_occurred_at: event.occurredAt,
    target_subscription_id: planned.subscription.id,
    target_customer_id: planned.customer.id,
    target_customer_email: normalizeEmail(planned.customer.email),
    target_customer_name: customerName(planned.customer),
    target_customer_phone: planned.customer.phone?.trim() || null,
    target_plan_id: event.planId,
    target_membership_type: event.plan.membershipType,
    target_billing_interval: event.plan.billingInterval,
    target_subscription_status: status.subscriptionStatus,
    target_account_status: status.accountStatus,
    target_resource_version: planned.subscription.resource_version ?? 0,
    target_current_term_start: event.termStart,
    target_current_term_end: event.termEnd,
    target_cancelled_at: unixTimestampToIso(planned.subscription.cancelled_at),
    target_snapshot: sanitizedSnapshot(
      planned.subscription,
      planned.customer,
      currentItem,
    ),
    historical_backfill: event.kind === "historical_payment",
  };
}

export async function runInsiderChargebeeBootstrap(options: {
  apply?: boolean;
  chargebee: ChargebeeBootstrapClient;
  members: ExistingInsiderMember[];
  existingEventIds?: Set<string>;
  existingPaymentTerms?: Set<string>;
  existingSubscriptionVersions?: Map<string, number>;
  supabase?: BootstrapRpcClient;
  planEnv: Record<string, string | undefined>;
}): Promise<BootstrapReconciliationSummary> {
  const apply = options.apply ?? false;
  if (apply && !options.supabase) {
    throw new Error("Apply mode requires a Supabase RPC client");
  }

  const planMap = createBootstrapPlanMap(options.planEnv);
  const entries = await options.chargebee.listApprovedSubscriptions();
  const existingEventIds = options.existingEventIds ?? new Set<string>();
  const existingPaymentTerms =
    options.existingPaymentTerms ?? new Set<string>();
  const existingSubscriptionVersions =
    options.existingSubscriptionVersions ?? new Map<string, number>();
  const issues: BootstrapIssue[] = [];
  let subscriptionsSkippedCancelled = 0;
  let planned: PlannedSubscription[] = [];

  for (const entry of entries) {
    const subscription = entry.subscription;
    const customer = entry.customer;
    const ref = stableRef(subscription.id ?? customer.id ?? "incomplete");

    if (subscription.status === "cancelled") {
      subscriptionsSkippedCancelled += 1;
      continue;
    }

    const approvedPlanItems = (subscription.subscription_items ?? []).filter(
      (item) =>
        item.item_type === "plan" &&
        Boolean(item.item_price_id && planMap.has(item.item_price_id)),
    );
    const planItem =
      approvedPlanItems.length === 1 ? approvedPlanItems[0] : undefined;
    const planId = planItem?.item_price_id;
    const currentPlan = planId ? planMap.get(planId) : undefined;
    const resourceVersion = subscription.resource_version;

    if (
      !subscription.id ||
      !subscription.customer_id ||
      !customer.id ||
      customer.id !== subscription.customer_id ||
      !planId ||
      !currentPlan ||
      !Number.isFinite(resourceVersion) ||
      (resourceVersion ?? 0) <= 0 ||
      subscription.billing_period !== 1 ||
      subscription.billing_period_unit !== currentPlan.billingInterval
    ) {
      issues.push({
        ref,
        code: "incomplete_subscription",
        detail:
          "Approved subscription response was incomplete or inconsistent.",
      });
      continue;
    }

    const memberMatch = matchExistingMember(customer, options.members);
    if (memberMatch.kind !== "matched") {
      issues.push({
        ref,
        code:
          memberMatch.kind === "ambiguous"
            ? "ambiguous_member_match"
            : memberMatch.kind === "contact_conflict"
              ? "contact_identity_conflict"
              : "unmapped_member",
        detail:
          memberMatch.kind === "ambiguous"
            ? "Customer ID and email do not resolve to one existing member."
            : memberMatch.kind === "contact_conflict"
              ? "Phone identity conflicts with existing customer-ID or email identity."
              : "No existing Insider member matches this Chargebee customer.",
      });
      continue;
    }

    const existingResourceVersion = existingSubscriptionVersions.get(
      subscription.id,
    );
    if (
      existingResourceVersion !== undefined &&
      existingResourceVersion > resourceVersion!
    ) {
      issues.push({
        ref,
        code: "stale_chargebee_snapshot",
        detail:
          "Database subscription version is newer than the enumerated Chargebee snapshot.",
      });
      continue;
    }

    try {
      const [invoices, transactions] = await Promise.all([
        options.chargebee.listPaidInvoices(subscription.id),
        options.chargebee.listSuccessfulTransactions(subscription.id),
      ]);
      const history = buildHistoricalEvents(
        subscription.id,
        invoices,
        transactions,
        planMap,
      );
      if (
        history.events.some(
          (event) => event.plan.billingInterval !== currentPlan.billingInterval,
        )
      ) {
        issues.push({
          ref,
          code: "mixed_billing_cadence",
          detail:
            "Historical and current billing cadence differ; replay would miscount anniversaries.",
        });
        continue;
      }
      const sourceTerms = new Set(
        history.events
          .filter((event) => event.termStart)
          .map((event) => `${subscription.id}:${event.termStart}`),
      );
      if (
        [...existingPaymentTerms].some(
          (term) =>
            term.startsWith(`${subscription.id}:`) && !sourceTerms.has(term),
        )
      ) {
        issues.push({
          ref,
          code: "mixed_billing_cadence",
          detail:
            "Existing paid terms are not fully represented by validated Chargebee invoice history.",
        });
        continue;
      }

      const authoritativeSubscription = {
        ...subscription,
        id: subscription.id,
        customer_id: subscription.customer_id,
      };

      planned.push({
        ref,
        expectedMemberId: memberMatch.member.id,
        subscription: authoritativeSubscription,
        customer: { ...customer, id: customer.id },
        currentPlanId: planId,
        currentPlan,
        events: [
          ...history.events,
          currentSnapshotEvent(
            authoritativeSubscription,
            planId,
            currentPlan,
            history.events,
          ),
        ],
        anniversaryTriggers: history.anniversaryTriggers,
        partialTermsSkipped: history.partialTermsSkipped,
      });
    } catch (error) {
      issues.push({
        ref,
        code: "invalid_invoice_history",
        detail:
          "Paid invoice history could not be converted into a safe, unique term sequence.",
        historyReason:
          error instanceof BootstrapHistoryValidationError
            ? error.reason
            : "unknown_history_validation_failure",
      });
    }
  }

  const subscriptionsByMember = new Map<string, PlannedSubscription[]>();
  for (const item of planned) {
    const memberSubscriptions =
      subscriptionsByMember.get(item.expectedMemberId) ?? [];
    memberSubscriptions.push(item);
    subscriptionsByMember.set(item.expectedMemberId, memberSubscriptions);
  }
  const ambiguousMemberIds = new Set(
    [...subscriptionsByMember.entries()]
      .filter(([, subscriptions]) => subscriptions.length > 1)
      .map(([memberId]) => memberId),
  );
  if (ambiguousMemberIds.size > 0) {
    for (const item of planned) {
      if (!ambiguousMemberIds.has(item.expectedMemberId)) continue;
      issues.push({
        ref: item.ref,
        code: "multiple_subscriptions_for_member",
        detail:
          "More than one approved Chargebee subscription maps to this existing member.",
      });
    }
    planned = planned.filter(
      (item) => !ambiguousMemberIds.has(item.expectedMemberId),
    );
  }

  const eventAlreadyApplied = (
    item: PlannedSubscription,
    event: BootstrapEvent,
  ) => {
    if (existingEventIds.has(event.eventId)) return true;
    if (
      event.kind === "historical_payment" &&
      event.termStart &&
      existingPaymentTerms.has(`${item.subscription.id}:${event.termStart}`)
    ) {
      return true;
    }
    if (event.kind === "current_snapshot") {
      const hasPendingHistory = item.events.some(
        (candidate) =>
          candidate.kind === "historical_payment" &&
          !existingEventIds.has(candidate.eventId) &&
          (!candidate.termStart ||
            !existingPaymentTerms.has(
              `${item.subscription.id}:${candidate.termStart}`,
            )),
      );
      if (
        !hasPendingHistory &&
        existingSubscriptionVersions.get(item.subscription.id) ===
          item.subscription.resource_version
      ) {
        return true;
      }
    }
    return false;
  };
  const allEvents = planned.flatMap((item) =>
    item.events.map((event) => ({ item, event })),
  );
  const pendingEvents = allEvents.filter(
    ({ item, event }) => !eventAlreadyApplied(item, event),
  );
  const historyIssueCounts = issues.reduce<
    BootstrapReconciliationSummary["historyIssueCounts"]
  >((counts, issue) => {
    if (issue.historyReason) {
      counts[issue.historyReason] = (counts[issue.historyReason] ?? 0) + 1;
    }
    return counts;
  }, {});
  const summary: BootstrapReconciliationSummary = {
    mode: apply ? "apply" : "dry-run",
    subscriptionsEnumerated: entries.length,
    subscriptionsEvaluated: entries.length - subscriptionsSkippedCancelled,
    subscriptionsSkippedCancelled,
    subscriptionsReady: planned.length,
    subscriptionsBlocked: issues.length,
    membersMatched: planned.length,
    historicalPaymentEvents: allEvents.filter(
      ({ event }) => event.kind === "historical_payment",
    ).length,
    currentSnapshotEvents: planned.length,
    alreadyAppliedEvents: allEvents.length - pendingEvents.length,
    eventsToApply: pendingEvents.length,
    eventsApplied: 0,
    duplicateEvents: 0,
    anniversaryTriggers: planned.reduce(
      (total, item) => total + item.anniversaryTriggers,
      0,
    ),
    partialTermsSkipped: planned.reduce(
      (total, item) => total + item.partialTermsSkipped,
      0,
    ),
    failures: 0,
    historyIssueCounts,
    issues,
  };

  if (!apply) return summary;
  if (issues.length > 0) {
    return summary;
  }

  for (const item of planned) {
    const applyEvent = async (event: BootstrapEvent): Promise<boolean> => {
      if (eventAlreadyApplied(item, event)) return true;
      try {
        const { data, error } = await options.supabase!.rpc(
          "apply_insider_chargebee_bootstrap_event",
          rpcParams(item, event),
        );
        if (error) throw new Error("RPC failed");
        const result = data as {
          bootstrapValidated?: boolean;
          duplicate?: boolean;
          historicalBackfill?: boolean;
          memberId?: string;
          memberCreated?: boolean;
        } | null;
        if (
          result?.bootstrapValidated !== true ||
          result.historicalBackfill !== (event.kind === "historical_payment")
        ) {
          throw new Error("Bootstrap RPC validation postcondition failed");
        }
        if (result?.duplicate) {
          summary.duplicateEvents += 1;
          return true;
        }
        if (
          result?.memberCreated ||
          !result?.memberId ||
          result.memberId !== item.expectedMemberId
        ) {
          throw new Error("RPC member postcondition failed");
        }
        summary.eventsApplied += 1;
        return true;
      } catch {
        summary.failures += 1;
        summary.issues.push({
          ref: item.ref,
          code: "invalid_invoice_history",
          detail:
            "An apply operation failed; rerun after reviewing server logs.",
        });
        return false;
      }
    };

    let subscriptionFailed = false;
    for (const event of item.events.filter(
      (candidate) => candidate.kind === "historical_payment",
    )) {
      if (!(await applyEvent(event))) {
        subscriptionFailed = true;
        break;
      }
    }

    const currentEvent = item.events.find(
      (event) => event.kind === "current_snapshot",
    );
    if (currentEvent && !subscriptionFailed) {
      await applyEvent(currentEvent);
    }
  }

  return summary;
}
