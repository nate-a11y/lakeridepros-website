#!/usr/bin/env node

import { randomUUID } from "node:crypto";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const EXPECTED_PLANS = new Map([
  [
    "Individual-VIP-Membership",
    {
      label: "Individual",
      prices: new Map([
        ["1:month:USD", 9.99],
        ["1:year:USD", 99],
      ]),
    },
  ],
  [
    "Family-Insider-Membership",
    {
      label: "Family",
      prices: new Map([
        ["1:month:USD", 19.99],
        ["1:year:USD", 199],
      ]),
    },
  ],
  [
    "Business-VIP-Membership",
    {
      label: "Business",
      prices: new Map([
        ["1:month:USD", 29.99],
        ["1:year:USD", 299],
      ]),
    },
  ],
]);

const site = required("CHARGEBEE_SITE");
const apiKey = required("CHARGEBEE_API_KEY");
const pricingTableKey = required("CHARGEBEE_INSIDER_PRICING_TABLE_KEY");
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

function trustedSessionUrl(value) {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.hostname !== "app.retention.chargebee.com" ||
    !/^\/pricing\/session\/[a-z0-9-]+$/i.test(url.pathname)
  ) {
    throw new Error("Chargebee returned an untrusted Growth session URL");
  }
  return url;
}

async function createPricingSession() {
  const response = await fetch(
    `https://${site}.chargebee.com/api/v2/pricing_page_sessions/create_for_new_subscription`,
    {
      method: "POST",
      headers: {
        authorization,
        "chargebee-idempotency-key": randomUUID(),
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "pricing_page[id]": pricingTableKey,
        redirect_url: "https://www.lakeridepros.com/insiders",
      }),
    },
  );
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.pricing_page_session?.url) {
    throw new Error(
      `Chargebee Growth session failed (${response.status}): ${
        payload.message || "unknown error"
      }`,
    );
  }
  return trustedSessionUrl(payload.pricing_page_session.url);
}

async function retrieveRender(sessionUrl) {
  const response = await fetch(`${sessionUrl.toString()}/render`, {
    headers: { Accept: "application/json" },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Chargebee Growth render failed (${response.status})`);
  }
  return payload;
}

function priceKey(price) {
  return `${price.period}:${price.period_unit}:${price.currency}`;
}

function auditFrequencies(pricingElement) {
  const frequencies = pricingElement.frequencies ?? [];
  const monthly = frequencies.find(
    (frequency) => frequency.period === 1 && frequency.period_unit === "month",
  );
  const yearly = frequencies.find(
    (frequency) => frequency.period === 1 && frequency.period_unit === "year",
  );

  result(
    frequencies.length === 2 && Boolean(monthly) && Boolean(yearly),
    "Monthly and yearly frequencies only",
    `${frequencies.length} configured`,
  );
  result(
    monthly?.price_suffix === "per month",
    "Monthly suffix",
    monthly?.price_suffix || "missing",
  );
  result(
    yearly?.price_suffix === "per year",
    "Yearly suffix",
    yearly?.price_suffix || "missing",
  );
}

function auditPlans(pricingElement) {
  const attachedItems = (pricingElement.items ?? []).filter(
    (item) => item.is_attached,
  );
  result(
    attachedItems.length === EXPECTED_PLANS.size,
    "Exactly three attached plans",
    `${attachedItems.length} configured`,
  );

  for (const item of attachedItems) {
    const expected = EXPECTED_PLANS.get(item.billing_system_id);
    if (!expected) {
      result(
        false,
        "Unexpected Growth plan",
        item.billing_system_id || "unknown",
      );
      continue;
    }

    const attachedPrices = (item.prices ?? []).filter(
      (price) => price.active && price.is_attached,
    );
    result(
      attachedPrices.length === expected.prices.size,
      `${expected.label} monthly/yearly offers`,
      `${attachedPrices.length} configured`,
    );

    for (const price of attachedPrices) {
      const key = priceKey(price);
      const expectedAmount = expected.prices.get(key);
      const noOverride =
        Number(price.amount) === Number(price.billing_system_amount);
      const amountMatches =
        expectedAmount !== undefined &&
        Number(price.amount) === Number(expectedAmount);

      result(
        amountMatches && noOverride,
        `${expected.label} ${price.period_unit}`,
        `$${Number(price.amount).toFixed(2)}${
          noOverride ? "" : " (Growth override differs from Billing)"
        }`,
      );
    }

    for (const [key, expectedAmount] of expected.prices) {
      if (!attachedPrices.some((price) => priceKey(price) === key)) {
        result(
          false,
          `${expected.label} ${key.split(":")[1]}`,
          `missing approved $${expectedAmount.toFixed(2)} offer`,
        );
      }
    }
  }

  for (const [itemId, expected] of EXPECTED_PLANS) {
    if (!attachedItems.some((item) => item.billing_system_id === itemId)) {
      result(false, `${expected.label} plan`, "missing");
    }
  }
}

try {
  console.log("\nChargebee Growth Insider pricing table");
  const sessionUrl = await createPricingSession();
  const render = await retrieveRender(sessionUrl);
  const pricingElement =
    render.experience?.layout?.pricing_table?.pricing_element;

  result(
    render.pricing_page_key === pricingTableKey,
    "Pricing table key",
    render.pricing_page_key || "missing",
  );
  if (!pricingElement) {
    throw new Error("Chargebee Growth render has no pricing element");
  }

  auditFrequencies(pricingElement);
  auditPlans(pricingElement);
} catch (error) {
  console.error(`\n✗ Chargebee Growth audit failed: ${error.message}`);
  process.exit(2);
}

console.log(
  failures
    ? `\nChargebee Growth audit found ${failures} blocking issue(s).`
    : "\nChargebee Growth audit passed.",
);
process.exitCode = failures ? 1 : 0;
