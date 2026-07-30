import { getSupabaseServerClient } from "@/lib/supabase/client";
import {
  runInsiderMonthlyRecaps,
  type InsiderMonthlyRecapRpcClient,
} from "@/lib/insiders/monthly-recap";
import { inngest } from "../client";

export const generateInsiderMonthlyRecaps = inngest.createFunction(
  {
    id: "generate-insider-monthly-recaps",
    name: "Generate Insider Monthly Value Recaps",
    retries: 3,
    concurrency: {
      limit: 1,
    },
    // The database setting controls the approved day (1-28) and the unique
    // monthly snapshot makes this safe to evaluate daily.
    triggers: [{ cron: "30 11 * * *" }],
  },
  async ({ step }) => {
    return step.run("generate-insider-monthly-recaps", async () => {
      return runInsiderMonthlyRecaps({
        supabase:
          getSupabaseServerClient() as unknown as InsiderMonthlyRecapRpcClient,
      });
    });
  },
);
