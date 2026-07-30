const CHARGEBEE_API_VERSION = "v2";

export const INSIDER_CHARGEBEE_EVENTS = new Set([
  "subscription_created",
  "subscription_started",
  "subscription_activated",
  "subscription_changed",
  "subscription_cancelled",
  "subscription_reactivated",
  "subscription_paused",
  "subscription_resumed",
  "subscription_pause_scheduled",
  "subscription_scheduled_pause_removed",
  "subscription_cancellation_scheduled",
  "subscription_scheduled_cancellation_removed",
  "payment_succeeded",
  "payment_failed",
]);

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

interface ChargebeeSubscriptionItem {
  item_price_id?: string;
  item_type?: string;
  amount?: number;
  quantity?: number;
}

interface ChargebeeSubscription {
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

interface ChargebeeCustomer {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  phone?: string;
}

interface ChargebeeSubscriptionResponse {
  subscription?: ChargebeeSubscription;
  customer?: ChargebeeCustomer;
}

export interface ChargebeeWebhookPayload {
  id?: string;
  object?: string;
  api_version?: string;
  event_type?: string;
  occurred_at?: number;
  content?: {
    subscription?: { id?: string };
    invoice?: { subscription_id?: string };
    transaction?: { subscription_id?: string };
  };
}

export interface InsiderChargebeeSyncEvent {
  chargebeeEventId: string;
  eventType: string;
  subscriptionId: string;
  occurredAt: number;
}

interface PlanMapping {
  membershipType: MembershipType;
  billingInterval: BillingInterval;
}

interface RpcResult {
  data: unknown;
  error: { message?: string } | null;
}

export interface ChargebeeSyncRpcClient {
  rpc(
    functionName: string,
    params: Record<string, unknown>,
  ): PromiseLike<RpcResult>;
}

interface ProcessDependencies {
  env?: Record<string, string | undefined>;
  fetchImpl?: typeof fetch;
  supabase: ChargebeeSyncRpcClient;
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

function createPlanMap(
  env: Record<string, string | undefined>,
): Map<string, PlanMapping> {
  const mappings = new Map<string, PlanMapping>();

  for (const config of PLAN_ENVIRONMENTS) {
    const itemPriceId = env[config.envName]?.trim();
    if (!itemPriceId) continue;

    const existing = mappings.get(itemPriceId);
    if (
      existing &&
      (existing.membershipType !== config.membershipType ||
        existing.billingInterval !== config.billingInterval)
    ) {
      throw new Error(`Chargebee item price ID is mapped more than once`);
    }

    mappings.set(itemPriceId, {
      membershipType: config.membershipType,
      billingInterval: config.billingInterval,
    });
  }

  if (mappings.size !== PLAN_ENVIRONMENTS.length) {
    throw new Error("Incomplete Chargebee Insider plan mapping");
  }

  return mappings;
}

function normalizeSubscriptionStatus(subscription: ChargebeeSubscription): {
  subscriptionStatus: SubscriptionStatus;
  accountStatus: AccountStatus;
} {
  const rawStatus = subscription.status;

  if (
    (rawStatus === "active" || rawStatus === "non_renewing") &&
    (subscription.due_invoices_count ?? 0) > 0
  ) {
    return {
      subscriptionStatus: "past_due",
      accountStatus: "past_due",
    };
  }

  switch (rawStatus) {
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

function unixTimestampToIso(value?: number): string | null {
  if (!Number.isFinite(value) || !value || value < 0) return null;
  return new Date(value * 1000).toISOString();
}

function customerName(customer: ChargebeeCustomer): string {
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

function sanitizeSnapshot(
  subscription: ChargebeeSubscription,
  customer: ChargebeeCustomer,
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
      email: customer.email?.trim().toLowerCase(),
      name: customerName(customer),
      phone: customer.phone?.trim() || null,
    },
  };
}

async function retrieveChargebeeSubscription(
  subscriptionId: string,
  env: Record<string, string | undefined>,
  fetchImpl: typeof fetch,
): Promise<ChargebeeSubscriptionResponse> {
  const site = requiredEnvironment(env, "CHARGEBEE_SITE");
  const apiKey = requiredEnvironment(env, "CHARGEBEE_API_KEY");

  if (!/^[a-z0-9][a-z0-9-]*$/i.test(site)) {
    throw new Error("Invalid CHARGEBEE_SITE");
  }

  const response = await fetchImpl(
    `https://${site}.chargebee.com/api/${CHARGEBEE_API_VERSION}/subscriptions/${encodeURIComponent(subscriptionId)}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Chargebee subscription retrieval failed (${response.status})`,
    );
  }

  return (await response.json()) as ChargebeeSubscriptionResponse;
}

export function extractChargebeeSubscriptionId(
  payload: ChargebeeWebhookPayload,
): string | null {
  return (
    payload.content?.subscription?.id ||
    payload.content?.invoice?.subscription_id ||
    payload.content?.transaction?.subscription_id ||
    null
  );
}

export async function processInsiderChargebeeSync(
  event: InsiderChargebeeSyncEvent,
  dependencies: ProcessDependencies,
) {
  const env = dependencies.env ?? process.env;
  const fetchImpl = dependencies.fetchImpl ?? fetch;
  const planMap = createPlanMap(env);
  const authoritative = await retrieveChargebeeSubscription(
    event.subscriptionId,
    env,
    fetchImpl,
  );
  const subscription = authoritative.subscription;
  const customer = authoritative.customer;

  if (
    !subscription?.id ||
    !subscription.customer_id ||
    subscription.id !== event.subscriptionId ||
    !customer?.id ||
    customer.id !== subscription.customer_id
  ) {
    throw new Error("Incomplete Chargebee subscription response");
  }

  const planItem =
    subscription.subscription_items?.find(
      (item) => item.item_type === "plan",
    ) ?? subscription.subscription_items?.[0];
  const planId = planItem?.item_price_id;

  if (!planItem || !planId) {
    throw new Error("Chargebee subscription has no plan item");
  }

  const plan = planMap.get(planId);
  if (!plan) {
    return {
      ignored: true,
      reason: "not_an_insider_plan",
      subscriptionId: subscription.id,
      planId,
    };
  }

  const status = normalizeSubscriptionStatus(subscription);
  const snapshot = sanitizeSnapshot(subscription, customer, planItem);
  const { data, error } = await dependencies.supabase.rpc(
    "sync_insider_chargebee_subscription",
    {
      target_event_id: event.chargebeeEventId,
      target_event_type: event.eventType,
      target_event_occurred_at: unixTimestampToIso(event.occurredAt),
      target_subscription_id: subscription.id,
      target_customer_id: customer.id,
      target_customer_email: customer.email?.trim().toLowerCase() || null,
      target_customer_name: customerName(customer),
      target_customer_phone: customer.phone?.trim() || null,
      target_plan_id: planId,
      target_membership_type: plan.membershipType,
      target_billing_interval: plan.billingInterval,
      target_subscription_status: status.subscriptionStatus,
      target_account_status: status.accountStatus,
      target_resource_version: subscription.resource_version ?? 0,
      target_current_term_start: unixTimestampToIso(
        subscription.current_term_start,
      ),
      target_current_term_end: unixTimestampToIso(
        subscription.current_term_end,
      ),
      target_cancelled_at: unixTimestampToIso(subscription.cancelled_at),
      target_snapshot: snapshot,
    },
  );

  if (error) {
    throw new Error(
      `Insider Chargebee database sync failed: ${error.message || "unknown error"}`,
    );
  }

  return data;
}
