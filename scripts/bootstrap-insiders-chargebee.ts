#!/usr/bin/env node

import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import {
  assertBootstrapApplyGuard,
  createChargebeeBootstrapClient,
  INSIDER_BOOTSTRAP_CONFIRMATION,
  parseBootstrapArguments,
  runInsiderChargebeeBootstrap,
  type ExistingInsiderMember,
} from "../lib/chargebee/insider-bootstrap";
import {
  shouldUseEmptyInsiderBootstrapIndex,
  type InsiderBootstrapIndexTable,
  type SupabaseReadError,
} from "../lib/chargebee/bootstrap-schema-errors";
import { loadInsiderBootstrapMemberIndex } from "../lib/chargebee/bootstrap-member-index";
import {
  InsiderBootstrapOperatorError,
  safeInsiderBootstrapOperatorFailure,
  type InsiderBootstrapOperatorStage,
} from "../lib/chargebee/bootstrap-operator-errors";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

function printHelp() {
  console.log(`Chargebee Insider bootstrap/backfill

Default (read-only dry-run):
  npm run bootstrap:insiders-chargebee

Apply (all guards are required):
  INSIDERS_CHARGEBEE_BOOTSTRAP_MODE=apply INSIDERS_CHARGEBEE_SYNC_MODE=off \\
  npm run bootstrap:insiders-chargebee -- \\
    --apply \\
    --confirm=${INSIDER_BOOTSTRAP_CONFIRMATION} \\
    --target-chargebee-site=<expected-chargebee-site> \\
    --target-project-ref=<expected-supabase-project-ref>

The command never prints names, emails, phone numbers, raw customer IDs,
subscription IDs, invoice IDs, API keys, or database credentials.`);
}

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function main() {
  let operatorStage: InsiderBootstrapOperatorStage = "config";
  try {
    const args = parseBootstrapArguments(process.argv.slice(2));
    if (args.help) {
      printHelp();
      return;
    }
    assertBootstrapApplyGuard(args, process.env);

    const chargebee = createChargebeeBootstrapClient();
    const supabase = createClient(
      required("NEXT_PUBLIC_SUPABASE_URL"),
      required("SUPABASE_SERVICE_ROLE_KEY"),
      {
        auth: { autoRefreshToken: false, persistSession: false },
      },
    );

    operatorStage = "member_index";
    const { members: memberRows, legacyMemberIndex } =
      await loadInsiderBootstrapMemberIndex({
        apply: args.apply,
        readPage: async ({ includeChargebeeCustomerId, from, to }) => {
          const { data, error } = await supabase
            .from("insider_members")
            .select(
              includeChargebeeCustomerId
                ? "id,email,phone,chargebee_customer_id,is_active"
                : "id,email,phone,is_active",
            )
            .order("id")
            .range(from, to);
          return {
            data: (data ?? []) as ExistingInsiderMember[],
            error,
          };
        },
      });

    operatorStage = "billing_index";
    const existingEventIds = new Set<string>();
    const existingPaymentTerms = new Set<string>();
    const existingSubscriptionVersions = new Map<string, number>();
    const missingPreflightTables = new Set<InsiderBootstrapIndexTable>();
    let billingEventIndexAvailable = true;

    function acceptMissingTableAsEmptyIndex(
      error: SupabaseReadError,
      table: InsiderBootstrapIndexTable,
    ): boolean {
      if (
        !shouldUseEmptyInsiderBootstrapIndex({
          apply: args.apply,
          error,
          table,
        })
      ) {
        return false;
      }
      missingPreflightTables.add(table);
      return true;
    }

    // Read known bootstrap IDs in bounded pages without ever logging them.
    for (let from = 0; ; from += 1000) {
      const { data, error } = await supabase
        .from("insider_billing_events")
        .select("chargebee_event_id")
        .like("chargebee_event_id", "backfill:chargebee:%")
        .order("chargebee_event_id")
        .range(from, from + 999);
      if (error) {
        if (acceptMissingTableAsEmptyIndex(error, "insider_billing_events")) {
          billingEventIndexAvailable = false;
          break;
        }
        throw new Error("Unable to read existing bootstrap event index");
      }
      for (const row of data ?? []) {
        if (row.chargebee_event_id)
          existingEventIds.add(row.chargebee_event_id);
      }
      if ((data?.length ?? 0) < 1000) break;
    }

    if (billingEventIndexAvailable) {
      for (let from = 0; ; from += 1000) {
        const { data, error } = await supabase
          .from("insider_billing_events")
          .select("chargebee_subscription_id,subscription_term_start")
          .eq("event_type", "payment_succeeded")
          .eq("status", "processed")
          .not("chargebee_subscription_id", "is", null)
          .not("subscription_term_start", "is", null)
          .order("id")
          .range(from, from + 999);
        if (error) {
          if (acceptMissingTableAsEmptyIndex(error, "insider_billing_events")) {
            break;
          }
          throw new Error("Unable to read existing paid-term index");
        }
        for (const row of data ?? []) {
          if (row.chargebee_subscription_id && row.subscription_term_start) {
            existingPaymentTerms.add(
              `${row.chargebee_subscription_id}:${new Date(
                row.subscription_term_start,
              ).toISOString()}`,
            );
          }
        }
        if ((data?.length ?? 0) < 1000) break;
      }
    }

    for (let from = 0; ; from += 1000) {
      const { data, error } = await supabase
        .from("insider_subscriptions")
        .select("chargebee_subscription_id,resource_version")
        .order("chargebee_subscription_id")
        .range(from, from + 999);
      if (error) {
        if (acceptMissingTableAsEmptyIndex(error, "insider_subscriptions")) {
          break;
        }
        throw new Error("Unable to read existing subscription version index");
      }
      for (const row of data ?? []) {
        existingSubscriptionVersions.set(
          row.chargebee_subscription_id,
          Number(row.resource_version),
        );
      }
      if ((data?.length ?? 0) < 1000) break;
    }

    operatorStage = "chargebee_enumeration";
    const summary = await runInsiderChargebeeBootstrap({
      apply: args.apply,
      chargebee,
      members: memberRows,
      existingEventIds,
      existingPaymentTerms,
      existingSubscriptionVersions,
      supabase: args.apply ? supabase : undefined,
      planEnv: process.env,
    });

    if (missingPreflightTables.size > 0) {
      console.log(
        `\nPre-migration dry-run: ${[...missingPreflightTables].join(
          ", ",
        )} not installed; using empty reconciliation indexes.`,
      );
    }
    if (legacyMemberIndex) {
      console.log(
        "\nPre-migration dry-run: legacy member index detected; using normalized email/phone member matching.",
      );
    }

    console.log("\nChargebee Insider bootstrap reconciliation");
    console.log(`Mode: ${summary.mode}`);
    console.log(`Subscriptions enumerated: ${summary.subscriptionsEnumerated}`);
    console.log(`Subscriptions evaluated: ${summary.subscriptionsEvaluated}`);
    console.log(
      `Cancelled subscriptions skipped: ${summary.subscriptionsSkippedCancelled}`,
    );
    console.log(`Subscriptions ready: ${summary.subscriptionsReady}`);
    console.log(`Subscriptions blocked: ${summary.subscriptionsBlocked}`);
    console.log(`Existing members matched: ${summary.membersMatched}`);
    console.log(`Historical payment terms: ${summary.historicalPaymentEvents}`);
    console.log(`Current snapshots: ${summary.currentSnapshotEvents}`);
    console.log(`Already applied events: ${summary.alreadyAppliedEvents}`);
    console.log(`Events pending: ${summary.eventsToApply}`);
    console.log(`Events applied: ${summary.eventsApplied}`);
    console.log(`Duplicate events: ${summary.duplicateEvents}`);
    console.log(`Anniversary trigger terms: ${summary.anniversaryTriggers}`);
    console.log(
      `Partial terms skipped (partial_terms_skipped): ${summary.partialTermsSkipped}`,
    );
    console.log(`Failures: ${summary.failures}`);

    const historyIssueCounts = Object.entries(summary.historyIssueCounts).sort(
      ([left], [right]) => left.localeCompare(right),
    );
    if (historyIssueCounts.length > 0) {
      console.log("\nHistory validation reason counts");
      for (const [reason, count] of historyIssueCounts) {
        console.log(`- ${reason}: ${count}`);
      }
    }

    if (summary.issues.length > 0) {
      console.log("\nBlocked/review items (opaque references only)");
      for (const issue of summary.issues) {
        const reason = issue.historyReason ? `/${issue.historyReason}` : "";
        console.log(`- ${issue.ref}: ${issue.code}${reason} — ${issue.detail}`);
      }
    }

    if (summary.subscriptionsBlocked > 0 || summary.failures > 0) {
      process.exitCode = 1;
    }
  } catch {
    const code =
      operatorStage === "config"
        ? "invalid_configuration"
        : operatorStage === "member_index"
          ? "member_index_read_failed"
          : operatorStage === "billing_index"
            ? "billing_index_read_failed"
            : "chargebee_enumeration_failed";
    throw new InsiderBootstrapOperatorError(operatorStage, code);
  }
}

main().catch((error) => {
  console.error(safeInsiderBootstrapOperatorFailure(error));
  process.exitCode = 1;
});
