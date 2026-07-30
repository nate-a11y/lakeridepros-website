#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const APPLY = process.argv.includes("--apply");
const EXPECTED_WEBHOOK_URL =
  "https://www.lakeridepros.com/api/chargebee/webhook";
const PRICE_UPDATES = [
  {
    env: "CHARGEBEE_INSIDER_INDIVIDUAL_ANNUAL_PRICE_ID",
    label: "Individual annual",
    from: 10989,
    to: 9900,
  },
  {
    env: "CHARGEBEE_INSIDER_FAMILY_ANNUAL_PRICE_ID",
    label: "Family annual",
    from: 21989,
    to: 19900,
  },
  {
    env: "CHARGEBEE_INSIDER_BUSINESS_ANNUAL_PRICE_ID",
    label: "Business annual",
    from: 32989,
    to: 29900,
  },
];
const EXPECTED_EVENTS = [
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
].sort();

const site = required("CHARGEBEE_SITE");
const apiKey = required("CHARGEBEE_API_KEY");
const webhookId = required("CHARGEBEE_INSIDER_WEBHOOK_ID");
const webhookUsername = required("CHARGEBEE_WEBHOOK_USERNAME");
const webhookPassword = required("CHARGEBEE_WEBHOOK_PASSWORD");
const authorization = `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function dollars(value) {
  return `$${(Number(value) / 100).toFixed(2)}`;
}

async function chargebee(path, options = {}) {
  const response = await fetch(`https://${site}.chargebee.com/api/v2${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      authorization,
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      `${path} returned HTTP ${response.status}${
        payload.api_error_code ? ` (${payload.api_error_code})` : ""
      }${payload.message ? `: ${payload.message}` : ""}`,
    );
  }
  return payload;
}

function assertAnnualPrice(itemPrice, update) {
  if (
    !itemPrice ||
    itemPrice.currency_code !== "USD" ||
    itemPrice.period !== 1 ||
    itemPrice.period_unit !== "year" ||
    itemPrice.item_type !== "plan" ||
    itemPrice.status !== "active"
  ) {
    throw new Error(
      `${update.label} does not match the expected active USD plan`,
    );
  }

  if (![update.from, update.to].includes(Number(itemPrice.price))) {
    throw new Error(
      `${update.label} is ${dollars(itemPrice.price)}, not the reviewed ${dollars(
        update.from,
      )} or approved ${dollars(update.to)}`,
    );
  }
}

function assertWebhook(webhook) {
  if (
    !webhook ||
    webhook.id !== webhookId ||
    webhook.url !== EXPECTED_WEBHOOK_URL ||
    webhook.api_version !== "v2" ||
    webhook.disabled !== false ||
    webhook.primary_url !== true ||
    webhook.send_card_resource !== false
  ) {
    throw new Error(
      "Webhook does not match the reviewed enabled, primary, API v2 Insider endpoint",
    );
  }
}

function safeSnapshot(itemPrices, webhook) {
  return {
    capturedAt: new Date().toISOString(),
    site,
    itemPrices: itemPrices.map((itemPrice) => ({
      id: itemPrice.id,
      itemId: itemPrice.item_id,
      name: itemPrice.name,
      externalName: itemPrice.external_name,
      price: itemPrice.price,
      currencyCode: itemPrice.currency_code,
      period: itemPrice.period,
      periodUnit: itemPrice.period_unit,
      status: itemPrice.status,
      resourceVersion: itemPrice.resource_version,
      updatedAt: itemPrice.updated_at,
    })),
    webhook: {
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      apiVersion: webhook.api_version,
      enabledEvents: webhook.enabled_events ?? null,
      primaryUrl: webhook.primary_url,
      sendCardResource: webhook.send_card_resource,
      disabled: webhook.disabled,
      basicAuthenticationConfigured: Boolean(webhook.basic_auth_username),
      resourceVersion: webhook.resource_version,
    },
  };
}

async function postForm(path, fields, idempotencyKey) {
  return chargebee(path, {
    method: "POST",
    headers: {
      "chargebee-idempotency-key": idempotencyKey,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(fields),
  });
}

async function main() {
  const currentPrices = [];
  for (const update of PRICE_UPDATES) {
    const id = required(update.env);
    const payload = await chargebee(`/item_prices/${encodeURIComponent(id)}`);
    const itemPrice = payload.item_price;
    assertAnnualPrice(itemPrice, update);
    currentPrices.push(itemPrice);
  }

  const webhookPayload = await chargebee(
    `/webhook_endpoints/${encodeURIComponent(webhookId)}`,
  );
  const currentWebhook = webhookPayload.webhook_endpoint;
  assertWebhook(currentWebhook);

  const snapshotPath = join(
    tmpdir(),
    `lakeridepros-chargebee-insiders-before-${Date.now()}.json`,
  );
  await writeFile(
    snapshotPath,
    `${JSON.stringify(safeSnapshot(currentPrices, currentWebhook), null, 2)}\n`,
    { mode: 0o600 },
  );

  console.log(`Chargebee pre-change snapshot: ${snapshotPath}`);
  for (const [index, update] of PRICE_UPDATES.entries()) {
    console.log(
      `${update.label}: ${dollars(currentPrices[index].price)} → ${dollars(
        update.to,
      )}`,
    );
  }
  console.log(
    `Webhook: ${
      Array.isArray(currentWebhook.enabled_events)
        ? `${currentWebhook.enabled_events.length} current events`
        : "All Events"
    } → ${EXPECTED_EVENTS.length} approved events`,
  );
  console.log("Webhook Basic Auth: configured from server-only environment");

  if (!APPLY) {
    console.log(
      "\nDry run only. Re-run with --apply to make these live changes.",
    );
    return;
  }

  for (const [index, update] of PRICE_UPDATES.entries()) {
    if (Number(currentPrices[index].price) === update.to) {
      console.log(`✓ ${update.label} already ${dollars(update.to)}`);
      continue;
    }

    const id = required(update.env);
    const result = await postForm(
      `/item_prices/${encodeURIComponent(id)}`,
      { price: String(update.to) },
      `lrp-insiders-20260729-${id}-${update.to}`,
    );
    assertAnnualPrice(result.item_price, update);
    if (Number(result.item_price.price) !== update.to) {
      throw new Error(`${update.label} update did not persist`);
    }
    console.log(`✓ ${update.label} updated to ${dollars(update.to)}`);
  }

  const webhookFields = {
    basic_auth_username: webhookUsername,
    basic_auth_password: webhookPassword,
  };
  EXPECTED_EVENTS.forEach((event, index) => {
    webhookFields[`enabled_events[${index}]`] = event;
  });

  const webhookResult = await postForm(
    `/webhook_endpoints/${encodeURIComponent(webhookId)}`,
    webhookFields,
    `lrp-insiders-20260729-${webhookId}-events-v2`,
  );
  assertWebhook(webhookResult.webhook_endpoint);

  const configuredEvents = [
    ...(webhookResult.webhook_endpoint.enabled_events ?? []),
  ].sort();
  if (JSON.stringify(configuredEvents) !== JSON.stringify(EXPECTED_EVENTS)) {
    throw new Error(
      `Webhook returned ${configuredEvents.length} events instead of the approved ${EXPECTED_EVENTS.length}`,
    );
  }
  console.log(
    `✓ Webhook narrowed to ${configuredEvents.length} approved events`,
  );
  console.log("✓ Webhook Basic Auth credentials updated");

  const verifiedPrices = [];
  for (const update of PRICE_UPDATES) {
    const id = required(update.env);
    const payload = await chargebee(`/item_prices/${encodeURIComponent(id)}`);
    assertAnnualPrice(payload.item_price, update);
    if (Number(payload.item_price.price) !== update.to) {
      throw new Error(`${update.label} verification failed`);
    }
    verifiedPrices.push(payload.item_price);
  }

  const verifiedWebhook = (
    await chargebee(`/webhook_endpoints/${encodeURIComponent(webhookId)}`)
  ).webhook_endpoint;
  assertWebhook(verifiedWebhook);
  const verifiedEvents = [...(verifiedWebhook.enabled_events ?? [])].sort();
  if (JSON.stringify(verifiedEvents) !== JSON.stringify(EXPECTED_EVENTS)) {
    throw new Error("Webhook event verification failed");
  }

  const afterPath = join(
    tmpdir(),
    `lakeridepros-chargebee-insiders-after-${Date.now()}.json`,
  );
  await writeFile(
    afterPath,
    `${JSON.stringify(safeSnapshot(verifiedPrices, verifiedWebhook), null, 2)}\n`,
    { mode: 0o600 },
  );
  console.log(`Chargebee post-change snapshot: ${afterPath}`);
  console.log("\nChargebee Insider billing fixes applied and verified.");
}

main().catch((error) => {
  console.error(`\n✗ ${error.message}`);
  process.exitCode = 1;
});
