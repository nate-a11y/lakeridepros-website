export type InsiderMonthlyRecapMode = "off" | "dry-run" | "apply";

export type InsiderMonthlyRecapSummary = {
  enabled: boolean;
  dryRun: boolean;
  periodStart: string;
  periodEnd: string;
  eligibleMembers: number;
  recapsPending: number;
  recapsGenerated: number;
};

export interface InsiderMonthlyRecapRpcClient {
  rpc(
    functionName: string,
    parameters: Record<string, unknown>,
  ): PromiseLike<{
    data: unknown;
    error: { message?: string } | null;
  }>;
}

type MonthlyRecapEnvironment = Record<string, string | undefined>;

function nonnegativeInteger(value: unknown, field: string) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error(`Invalid Insider monthly recap result: ${field}`);
  }
  return parsed;
}

function dateString(value: unknown, field: string) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    throw new Error(`Invalid Insider monthly recap result: ${field}`);
  }
  return value;
}

export function parseInsiderMonthlyRecapSummary(
  value: unknown,
): InsiderMonthlyRecapSummary {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid Insider monthly recap result");
  }

  const data = value as Record<string, unknown>;
  return {
    enabled: data.enabled === true,
    dryRun: data.dryRun === true,
    periodStart: dateString(data.periodStart, "periodStart"),
    periodEnd: dateString(data.periodEnd, "periodEnd"),
    eligibleMembers: nonnegativeInteger(
      data.eligibleMembers,
      "eligibleMembers",
    ),
    recapsPending: nonnegativeInteger(data.recapsPending, "recapsPending"),
    recapsGenerated: nonnegativeInteger(
      data.recapsGenerated,
      "recapsGenerated",
    ),
  };
}

export function readInsiderMonthlyRecapSettings(
  env: MonthlyRecapEnvironment = process.env,
) {
  const mode = env.INSIDERS_MONTHLY_RECAP_MODE ?? "off";
  if (!["off", "dry-run", "apply"].includes(mode)) {
    throw new Error(
      "INSIDERS_MONTHLY_RECAP_MODE must be off, dry-run, or apply",
    );
  }

  const maxRecaps = Number(env.INSIDERS_MONTHLY_RECAP_MAX_RECIPIENTS ?? "500");
  if (!Number.isSafeInteger(maxRecaps) || maxRecaps < 1) {
    throw new Error(
      "INSIDERS_MONTHLY_RECAP_MAX_RECIPIENTS must be a positive integer",
    );
  }

  return {
    mode: mode as InsiderMonthlyRecapMode,
    maxRecaps,
  };
}

async function callMonthlyRecaps(
  supabase: InsiderMonthlyRecapRpcClient,
  applyChanges: boolean,
) {
  const { data, error } = await supabase.rpc(
    "generate_insider_monthly_value_recaps",
    {
      apply_changes: applyChanges,
    },
  );

  if (error) {
    throw new Error(
      `Insider monthly recap generation failed: ${
        error.message || "unknown error"
      }`,
    );
  }

  return parseInsiderMonthlyRecapSummary(data);
}

export async function runInsiderMonthlyRecaps({
  supabase,
  env = process.env,
}: {
  supabase: InsiderMonthlyRecapRpcClient;
  env?: MonthlyRecapEnvironment;
}) {
  const { mode, maxRecaps } = readInsiderMonthlyRecapSettings(env);

  if (mode === "off") {
    return { workerEnabled: false, mode } as const;
  }

  const preview = await callMonthlyRecaps(supabase, false);
  if (mode === "dry-run" || !preview.enabled) {
    return {
      workerEnabled: true,
      mode,
      applied: false,
      preview,
    } as const;
  }

  if (preview.recapsPending > maxRecaps) {
    return {
      workerEnabled: true,
      mode,
      applied: false,
      blockedReason:
        `Pending monthly recaps (${preview.recapsPending}) exceed the ` +
        `configured safety limit (${maxRecaps})`,
      preview,
    } as const;
  }

  const result = await callMonthlyRecaps(supabase, true);
  return {
    workerEnabled: true,
    mode,
    applied: true,
    preview,
    result,
  } as const;
}
