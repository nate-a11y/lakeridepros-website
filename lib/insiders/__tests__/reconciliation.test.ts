import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  readInsiderReconciliationSettings,
  runInsiderRewardsReconciliation,
} from "../reconciliation";

function summary(overrides: Record<string, unknown> = {}) {
  return {
    dryRun: true,
    matchedTrips: 12,
    unmatchedTrips: 1,
    unscoredTrips: 2,
    ambiguousTrips: 0,
    awardsPending: 4,
    awardsInserted: 0,
    reversalsInserted: 0,
    ...overrides,
  };
}

function launchSummary(overrides: Record<string, unknown> = {}) {
  return {
    enabled: true,
    dryRun: true,
    cohortMembers: 3,
    desiredBonuses: 4,
    bonusesPending: 2,
    reversalsPending: 0,
    bonusesInserted: 0,
    reversalsInserted: 0,
    ...overrides,
  };
}

describe("Insider reward reconciliation", () => {
  const rpc = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not touch Supabase when reconciliation is off", async () => {
    const result = await runInsiderRewardsReconciliation({
      supabase: { rpc },
      env: {
        INSIDERS_REWARDS_RECONCILIATION_MODE: "off",
      },
    });

    expect(result).toEqual({
      enabled: false,
      mode: "off",
    });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("runs only a preview in dry-run mode", async () => {
    rpc
      .mockResolvedValueOnce({
        data: summary(),
        error: null,
      })
      .mockResolvedValueOnce({
        data: launchSummary(),
        error: null,
      });

    const result = await runInsiderRewardsReconciliation({
      supabase: { rpc },
      env: {
        INSIDERS_REWARDS_RECONCILIATION_MODE: "dry-run",
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        enabled: true,
        mode: "dry-run",
        applied: false,
      }),
    );
    expect(rpc).toHaveBeenCalledTimes(2);
    expect(rpc).toHaveBeenNthCalledWith(1, "reconcile_insider_trip_rewards", {
      apply_changes: false,
    });
    expect(rpc).toHaveBeenNthCalledWith(
      2,
      "reconcile_insider_launch_bonuses",
      {
        apply_changes: false,
      },
    );
  });

  it("previews and then applies an approved-size batch", async () => {
    rpc
      .mockResolvedValueOnce({
        data: summary(),
        error: null,
      })
      .mockResolvedValueOnce({
        data: launchSummary(),
        error: null,
      })
      .mockResolvedValueOnce({
        data: summary({
          dryRun: false,
          awardsPending: 0,
          awardsInserted: 4,
        }),
        error: null,
      })
      .mockResolvedValueOnce({
        data: launchSummary({ bonusesPending: 3 }),
        error: null,
      })
      .mockResolvedValueOnce({
        data: launchSummary({
          dryRun: false,
          bonusesPending: 3,
          bonusesInserted: 3,
        }),
        error: null,
      });

    const result = await runInsiderRewardsReconciliation({
      supabase: { rpc },
      env: {
        INSIDERS_REWARDS_RECONCILIATION_MODE: "apply",
        INSIDERS_REWARDS_RECONCILIATION_MAX_AWARDS: "10",
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        enabled: true,
        mode: "apply",
        applied: true,
      }),
    );
    expect(rpc).toHaveBeenNthCalledWith(3, "reconcile_insider_trip_rewards", {
      apply_changes: true,
    });
    expect(rpc).toHaveBeenNthCalledWith(
      5,
      "reconcile_insider_launch_bonuses",
      {
        apply_changes: true,
      },
    );
  });

  it("blocks an unexpectedly large award batch", async () => {
    rpc
      .mockResolvedValueOnce({
        data: summary({ awardsPending: 11 }),
        error: null,
      })
      .mockResolvedValueOnce({
        data: launchSummary(),
        error: null,
      });

    const result = await runInsiderRewardsReconciliation({
      supabase: { rpc },
      env: {
        INSIDERS_REWARDS_RECONCILIATION_MODE: "apply",
        INSIDERS_REWARDS_RECONCILIATION_MAX_AWARDS: "10",
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        enabled: true,
        mode: "apply",
        applied: false,
        blockedReason: expect.stringContaining("exceed"),
      }),
    );
    expect(rpc).toHaveBeenCalledTimes(2);
  });

  it("applies base rewards but blocks an unexpectedly large launch batch", async () => {
    rpc
      .mockResolvedValueOnce({
        data: summary({ awardsPending: 2 }),
        error: null,
      })
      .mockResolvedValueOnce({
        data: launchSummary({ bonusesPending: 1 }),
        error: null,
      })
      .mockResolvedValueOnce({
        data: summary({ dryRun: false, awardsInserted: 2 }),
        error: null,
      })
      .mockResolvedValueOnce({
        data: launchSummary({
          bonusesPending: 7,
          reversalsPending: 4,
        }),
        error: null,
      });

    const result = await runInsiderRewardsReconciliation({
      supabase: { rpc },
      env: {
        INSIDERS_REWARDS_RECONCILIATION_MODE: "apply",
        INSIDERS_REWARDS_RECONCILIATION_MAX_AWARDS: "10",
        INSIDERS_REWARDS_RECONCILIATION_MAX_LAUNCH_BONUS_CHANGES: "10",
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        enabled: true,
        applied: true,
        launchBonusesApplied: false,
        launchBonusBlockedReason: expect.stringContaining("exceed"),
      }),
    );
    expect(rpc).toHaveBeenCalledTimes(4);
  });

  it("rejects invalid settings", () => {
    expect(() =>
      readInsiderReconciliationSettings({
        INSIDERS_REWARDS_RECONCILIATION_MODE: "yes",
      }),
    ).toThrow(/must be off, dry-run, or apply/);

    expect(() =>
      readInsiderReconciliationSettings({
        INSIDERS_REWARDS_RECONCILIATION_MAX_LAUNCH_BONUS_CHANGES: "0",
      }),
    ).toThrow(/MAX_LAUNCH_BONUS_CHANGES/);
  });
});
