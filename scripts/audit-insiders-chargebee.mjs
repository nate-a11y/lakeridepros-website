#!/usr/bin/env node

import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const EXPECTED_PRICES = [
  {
    env: "CHARGEBEE_INSIDER_INDIVIDUAL_MONTHLY_PRICE_ID",
    label: "Individual monthly",
    amount: 999,
    period: "month",
  },
  {
    env: "CHARGEBEE_INSIDER_INDIVIDUAL_ANNUAL_PRICE_ID",
    label: "Individual annual",
    amount: 9900,
    period: "year",
  },
  {
    env: "CHARGEBEE_INSIDER_FAMILY_MONTHLY_PRICE_ID",
    label: "Family monthly",
    amount: 1999,
    period: "month",
  },
  {
    env: "CHARGEBEE_INSIDER_FAMILY_ANNUAL_PRICE_ID",
    label: "Family annual",
    amount: 19900,
    period: "year",
  },
  {
    env: "CHARGEBEE_INSIDER_BUSINESS_MONTHLY_PRICE_ID",
    label: "Business monthly",
    amount: 2999,
    period: "month",
  },
  {
    env: "CHARGEBEE_INSIDER_BUSINESS_ANNUAL_PRICE_ID",
    label: "Business annual",
    amount: 29900,
    period: "year",
  },
];

const EXPECTED_EVENTS = [
  "payment_failed",
  "payment_succeeded",
  "subscription_activated",
  "subscription_cancelled",
  "subscription_changed",
  "subscription_created",
  "subscription_paused",
  "subscription_reactivated",
  "subscription_resumed",
  "subscription_cancellation_scheduled",
  "subscription_scheduled_cancellation_removed",
  "subscription_pause_scheduled",
  "subscription_scheduled_pause_removed",
  "subscription_started",
].sort();
const EXPECTED_INDIVIDUAL_DESCRIPTION =
  "Perfect for solo riders, airport transfers, nights out, and repeat rides.";
const COMPLIMENTARY_PRICE_ENVS = [
  "CHARGEBEE_INSIDER_INDIVIDUAL_MONTHLY_PRICE_ID",
  "CHARGEBEE_INSIDER_FAMILY_MONTHLY_PRICE_ID",
];

const site = required("CHARGEBEE_SITE");
const apiKey = required("CHARGEBEE_API_KEY");
const webhookId = required("CHARGEBEE_INSIDER_WEBHOOK_ID");
const authorization = `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;
let failures = 0;

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`✗ Missing ${name}`);
    process.exit(2);
  }
  return value;
}

function result(ok, label, detail = "") {
  console.log(`${ok ? "✓" : "✗"} ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures += 1;
}

async function chargebee(path) {
  const response = await fetch(`https://${site}.chargebee.com/api/v2${path}`, {
    headers: { authorization },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      `${path} returned HTTP ${response.status}${
        payload.api_error_code ? ` (${payload.api_error_code})` : ""
      }`,
    );
  }
  return payload;
}

async function auditPrices() {
  console.log("\nChargebee Insider catalog");
  let individualItemId = null;

  for (const expected of EXPECTED_PRICES) {
    const id = required(expected.env);
    const payload = await chargebee(`/item_prices/${encodeURIComponent(id)}`);
    const itemPrice = payload.item_price || {};
    const actual = Number(itemPrice.price);
    const amountMatches = actual === expected.amount;
    const metadataMatches =
      itemPrice.currency_code === "USD" &&
      itemPrice.period_unit === expected.period &&
      itemPrice.status === "active";

    result(
      amountMatches && metadataMatches,
      expected.label,
      `$${(actual / 100).toFixed(2)} / ${itemPrice.period_unit || "?"}; ${
        itemPrice.status || "unknown"
      }`,
    );

    if (
      expected.env === "CHARGEBEE_INSIDER_INDIVIDUAL_MONTHLY_PRICE_ID"
    ) {
      individualItemId = itemPrice.item_id || null;
    }
  }

  if (!individualItemId) {
    result(false, "Individual plan description", "item ID missing");
    return;
  }

  const itemPayload = await chargebee(
    `/items/${encodeURIComponent(individualItemId)}`,
  );
  result(
    itemPayload.item?.description === EXPECTED_INDIVIDUAL_DESCRIPTION,
    "Individual plan description",
    itemPayload.item?.description === EXPECTED_INDIVIDUAL_DESCRIPTION
      ? "approved individual copy"
      : "does not match approved individual copy",
  );
}

async function listActiveSubscriptions() {
  const subscriptions = [];
  let offset = null;

  do {
    const params = new URLSearchParams({
      limit: "100",
      "status[is]": "active",
    });
    if (offset) params.set("offset", offset);

    const payload = await chargebee(`/subscriptions?${params.toString()}`);
    subscriptions.push(
      ...(Array.isArray(payload.list)
        ? payload.list.map((entry) => entry.subscription).filter(Boolean)
        : []),
    );
    offset = payload.next_offset || null;
  } while (offset);

  return subscriptions;
}

function activeZeroPricedPlans(subscriptions) {
  return subscriptions.flatMap((subscription) =>
    (Array.isArray(subscription.subscription_items)
      ? subscription.subscription_items
      : []
    )
      .filter(
        (item) =>
          item.item_type === "plan" && Number(item.unit_price) === 0,
      )
      .map((item) => ({ subscription, item })),
  );
}

async function auditComplimentarySubscriptions() {
  console.log("\nChargebee permanent complimentary memberships");

  const expectedPriceIds = COMPLIMENTARY_PRICE_ENVS.map(required).sort();
  const complimentaryPlans = activeZeroPricedPlans(
    await listActiveSubscriptions(),
  );

  result(
    complimentaryPlans.length === 2,
    "Exactly two active zero-priced plan subscriptions",
    `${complimentaryPlans.length} found`,
  );

  const actualPriceIds = complimentaryPlans
    .map(({ item }) => item.item_price_id)
    .sort();
  result(
    JSON.stringify(actualPriceIds) === JSON.stringify(expectedPriceIds),
    "Complimentary plan IDs",
    actualPriceIds.length === expectedPriceIds.length &&
      actualPriceIds.every((id, index) => id === expectedPriceIds[index])
      ? "approved Individual monthly and Family monthly plans"
      : "do not match the two approved complimentary plans",
  );

  for (const [index, { subscription, item }] of complimentaryPlans.entries()) {
    const coupons = Array.isArray(subscription.coupons)
      ? subscription.coupons
      : [];
    const discounts = Array.isArray(subscription.discounts)
      ? subscription.discounts
      : [];
    const safeLabel = `Complimentary membership ${index + 1}`;

    result(subscription.status === "active", `${safeLabel} is active`);
    result(
      Number(item.unit_price) === 0,
      `${safeLabel} unit price`,
      Number(item.unit_price) === 0 ? "$0.00" : "not $0.00",
    );
    result(
      Number(item.amount) === 0,
      `${safeLabel} amount`,
      Number(item.amount) === 0 ? "$0.00" : "not $0.00",
    );
    result(coupons.length === 0, `${safeLabel} has no coupons`);
    result(
      discounts.length === 0 &&
        Number(item.discount_amount || 0) === 0,
      `${safeLabel} has no discounts`,
    );
  }
}

async function auditWebhook() {
  console.log("\nChargebee Insider webhook");
  const payload = await chargebee(
    `/webhook_endpoints/${encodeURIComponent(webhookId)}`,
  );
  const webhook = payload.webhook_endpoint || {};

  result(webhook.disabled === false, "Webhook enabled");
  result(webhook.primary_url === true, "Webhook is primary");
  result(webhook.api_version === "v2", "Webhook uses API v2");
  result(webhook.send_card_resource === false, "Card resources excluded");
  result(
    webhook.url === "https://www.lakeridepros.com/api/chargebee/webhook",
    "Webhook URL",
    webhook.url || "missing",
  );

  const enabledEvents = Array.isArray(webhook.enabled_events)
    ? [...webhook.enabled_events].sort()
    : null;
  result(
    enabledEvents !== null &&
      JSON.stringify(enabledEvents) === JSON.stringify(EXPECTED_EVENTS),
    "Webhook event allowlist",
    enabledEvents
      ? `${enabledEvents.length} configured`
      : "All Events is currently enabled",
  );
}

try {
  await auditPrices();
  await auditComplimentarySubscriptions();
  await auditWebhook();
} catch (error) {
  console.error(`\n✗ Chargebee audit failed: ${error.message}`);
  process.exit(2);
}

console.log(
  failures
    ? `\nChargebee Insider audit found ${failures} blocking issue(s).`
    : "\nChargebee Insider audit passed.",
);
process.exitCode = failures ? 1 : 0;
