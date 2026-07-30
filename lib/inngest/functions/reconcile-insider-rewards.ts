import { getSupabaseServerClient } from "@/lib/supabase/client";
import {
  runInsiderRewardsReconciliation,
  type InsiderReconciliationRpcClient,
} from "@/lib/insiders/reconciliation";
import { inngest } from "../client";

export const reconcileInsiderRewards = inngest.createFunction(
  {
    id: "reconcile-insider-rewards",
    name: "Reconcile Insider Rewards",
    retries: 3,
    concurrency: {
      limit: 1,
    },
    triggers: [{ cron: "15 9 * * *" }],
  },
  async ({ step }) => {
    return step.run("reconcile-insider-rewards", async () => {
      return runInsiderRewardsReconciliation({
        supabase:
          getSupabaseServerClient() as unknown as InsiderReconciliationRpcClient,
      });
    });
  },
);
