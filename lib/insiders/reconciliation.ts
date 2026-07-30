export type InsiderReconciliationMode = "off" | "dry-run" | "apply";

export type InsiderReconciliationSummary = {
  dryRun: boolean;
  matchedTrips: number;
  unmatchedTrips: number;
  unscoredTrips: number;
  ambiguousTrips: number;
  awardsPending: number;
  awardsInserted: number;
  reversalsInserted: number;
};

export type InsiderLaunchBonusSummary = {
  enabled: boolean;
  dryRun: boolean;
  cohortMembers: number;
  desiredBonuses: number;
  bonusesPending: number;
  reversalsPending: number;
  bonusesInserted: number;
  reversalsInserted: number;
};

export type InsiderReconciliationRpcClient = {
  rpc(
    functionName: string,
    parameters: Record<string, unknown>,
  ): PromiseLike<{
    data: unknown;
    error: { message?: string } | null;
  }>;
};

type ReconciliationEnvironment = Record<string, string | undefined>;

export type InsiderReconciliationRunResult =
  | {
      enabled: false;
      mode: "off";
    }
  | {
      enabled: true;
      mode: "dry-run";
      applied: false;
      preview: InsiderReconciliationSummary;
      launchBonuses: InsiderLaunchBonusSummary;
    }
  | {
      enabled: true;
      mode: "apply";
      applied: false;
      blockedReason: string;
      preview: InsiderReconciliationSummary;
      launchBonuses: InsiderLaunchBonusSummary;
    }
  | {
      enabled: true;
      mode: "apply";
      applied: true;
      preview: InsiderReconciliationSummary;
      result: InsiderReconciliationSummary;
      launchBonuses: InsiderLaunchBonusSummary;
      launchBonusesApplied: boolean;
      launchBonusBlockedReason?: string;
    };

function nonnegativeInteger(value: unknown, field: string): number {
  const numberValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;

  if (!Number.isSafeInteger(numberValue) || numberValue < 0) {
    throw new Error(`Invalid Insider reconciliation result: ${field}`);
  }

  return numberValue;
}

export function parseInsiderReconciliationSummary(
  value: unknown,
): InsiderReconciliationSummary {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid Insider reconciliation result");
  }

  const data = value as Record<string, unknown>;

  return {
    dryRun: data.dryRun === true,
    matchedTrips: nonnegativeInteger(data.matchedTrips, "matchedTrips"),
    unmatchedTrips: nonnegativeInteger(data.unmatchedTrips, "unmatchedTrips"),
    unscoredTrips: nonnegativeInteger(data.unscoredTrips, "unscoredTrips"),
    ambiguousTrips: nonnegativeInteger(data.ambiguousTrips, "ambiguousTrips"),
    awardsPending: nonnegativeInteger(data.awardsPending, "awardsPending"),
    awardsInserted: nonnegativeInteger(data.awardsInserted, "awardsInserted"),
    reversalsInserted: nonnegativeInteger(
      data.reversalsInserted,
      "reversalsInserted",
    ),
  };
}

export function parseInsiderLaunchBonusSummary(
  value: unknown,
): InsiderLaunchBonusSummary {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid Insider launch bonus result");
  }

  const data = value as Record<string, unknown>;

  return {
    enabled: data.enabled === true,
    dryRun: data.dryRun === true,
    cohortMembers: nonnegativeInteger(
      data.cohortMembers,
      "cohortMembers",
    ),
    desiredBonuses: nonnegativeInteger(
      data.desiredBonuses,
      "desiredBonuses",
    ),
    bonusesPending: nonnegativeInteger(
      data.bonusesPending,
      "bonusesPending",
    ),
    reversalsPending: nonnegativeInteger(
      data.reversalsPending,
      "launchReversalsPending",
    ),
    bonusesInserted: nonnegativeInteger(
      data.bonusesInserted,
      "bonusesInserted",
    ),
    reversalsInserted: nonnegativeInteger(
      data.reversalsInserted,
      "launchReversalsInserted",
    ),
  };
}

export function readInsiderReconciliationSettings(
  env: ReconciliationEnvironment = process.env,
): {
  mode: InsiderReconciliationMode;
  maxAwards: number;
  maxLaunchBonusChanges: number;
} {
  const mode = env.INSIDERS_REWARDS_RECONCILIATION_MODE ?? "off";

  if (!["off", "dry-run", "apply"].includes(mode)) {
    throw new Error(
      "INSIDERS_REWARDS_RECONCILIATION_MODE must be off, dry-run, or apply",
    );
  }

  const maxAwards = Number(
    env.INSIDERS_REWARDS_RECONCILIATION_MAX_AWARDS ?? "250",
  );

  if (!Number.isSafeInteger(maxAwards) || maxAwards < 1) {
    throw new Error(
      "INSIDERS_REWARDS_RECONCILIATION_MAX_AWARDS must be a positive integer",
    );
  }

  const maxLaunchBonusChanges = Number(
    env.INSIDERS_REWARDS_RECONCILIATION_MAX_LAUNCH_BONUS_CHANGES ?? "250",
  );

  if (
    !Number.isSafeInteger(maxLaunchBonusChanges) ||
    maxLaunchBonusChanges < 1
  ) {
    throw new Error(
      "INSIDERS_REWARDS_RECONCILIATION_MAX_LAUNCH_BONUS_CHANGES " +
        "must be a positive integer",
    );
  }

  return {
    mode: mode as InsiderReconciliationMode,
    maxAwards,
    maxLaunchBonusChanges,
  };
}

async function callReconciliation(
  supabase: InsiderReconciliationRpcClient,
  applyChanges: boolean,
): Promise<InsiderReconciliationSummary> {
  const { data, error } = await supabase.rpc("reconcile_insider_trip_rewards", {
    apply_changes: applyChanges,
  });

  if (error) {
    throw new Error(
      `Insider reward reconciliation failed: ${error.message || "unknown error"}`,
    );
  }

  return parseInsiderReconciliationSummary(data);
}

async function callLaunchBonusReconciliation(
  supabase: InsiderReconciliationRpcClient,
  applyChanges: boolean,
): Promise<InsiderLaunchBonusSummary> {
  const { data, error } = await supabase.rpc(
    "reconcile_insider_launch_bonuses",
    {
      apply_changes: applyChanges,
    },
  );

  if (error) {
    throw new Error(
      `Insider launch bonus reconciliation failed: ${
        error.message || "unknown error"
      }`,
    );
  }

  return parseInsiderLaunchBonusSummary(data);
}

export async function runInsiderRewardsReconciliation({
  supabase,
  env = process.env,
}: {
  supabase: InsiderReconciliationRpcClient;
  env?: ReconciliationEnvironment;
}): Promise<InsiderReconciliationRunResult> {
  const { mode, maxAwards, maxLaunchBonusChanges } =
    readInsiderReconciliationSettings(env);

  if (mode === "off") {
    return {
      enabled: false,
      mode,
    };
  }

  const preview = await callReconciliation(supabase, false);
  const launchBonuses = await callLaunchBonusReconciliation(supabase, false);

  if (mode === "dry-run") {
    return {
      enabled: true,
      mode,
      applied: false,
      preview,
      launchBonuses,
    };
  }

  if (preview.awardsPending > maxAwards) {
    return {
      enabled: true,
      mode,
      applied: false,
      blockedReason:
        `Pending awards (${preview.awardsPending}) exceed the configured ` +
        `safety limit (${maxAwards})`,
      preview,
      launchBonuses,
    };
  }

  const result = await callReconciliation(supabase, true);
  const refreshedLaunchBonuses = await callLaunchBonusReconciliation(
    supabase,
    false,
  );
  const launchBonusChanges =
    refreshedLaunchBonuses.bonusesPending +
    refreshedLaunchBonuses.reversalsPending;

  if (launchBonusChanges > maxLaunchBonusChanges) {
    return {
      enabled: true,
      mode,
      applied: true,
      preview,
      result,
      launchBonuses: refreshedLaunchBonuses,
      launchBonusesApplied: false,
      launchBonusBlockedReason:
        `Pending launch bonus changes (${launchBonusChanges}) exceed the ` +
        `configured safety limit (${maxLaunchBonusChanges})`,
    };
  }

  const launchBonusResult = await callLaunchBonusReconciliation(
    supabase,
    true,
  );

  return {
    enabled: true,
    mode,
    applied: true,
    preview,
    result,
    launchBonuses: launchBonusResult,
    launchBonusesApplied: true,
  };
}
