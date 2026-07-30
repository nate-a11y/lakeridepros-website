import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  readInsiderMonthlyRecapSettings,
  runInsiderMonthlyRecaps,
} from "../monthly-recap";

function summary(overrides: Record<string, unknown> = {}) {
  return {
    enabled: true,
    dryRun: true,
    periodStart: "2026-06-01",
    periodEnd: "2026-07-01",
    eligibleMembers: 20,
    recapsPending: 18,
    recapsGenerated: 0,
    ...overrides,
  };
}

describe("Insider monthly value recaps", () => {
  const rpc = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not touch Supabase when the worker is off", async () => {
    await expect(
      runInsiderMonthlyRecaps({
        supabase: { rpc },
        env: { INSIDERS_MONTHLY_RECAP_MODE: "off" },
      }),
    ).resolves.toEqual({ workerEnabled: false, mode: "off" });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("previews without writing in dry-run mode", async () => {
    rpc.mockResolvedValueOnce({ data: summary(), error: null });

    const result = await runInsiderMonthlyRecaps({
      supabase: { rpc },
      env: { INSIDERS_MONTHLY_RECAP_MODE: "dry-run" },
    });

    expect(result).toEqual(
      expect.objectContaining({ applied: false, mode: "dry-run" }),
    );
    expect(rpc).toHaveBeenCalledOnce();
    expect(rpc).toHaveBeenCalledWith(
      "generate_insider_monthly_value_recaps",
      { apply_changes: false },
    );
  });

  it("does not apply when the program setting is disabled", async () => {
    rpc.mockResolvedValueOnce({
      data: summary({ enabled: false, recapsPending: 0 }),
      error: null,
    });

    const result = await runInsiderMonthlyRecaps({
      supabase: { rpc },
      env: { INSIDERS_MONTHLY_RECAP_MODE: "apply" },
    });

    expect(result).toEqual(expect.objectContaining({ applied: false }));
    expect(rpc).toHaveBeenCalledOnce();
  });

  it("previews then applies an approved-size batch", async () => {
    rpc
      .mockResolvedValueOnce({ data: summary(), error: null })
      .mockResolvedValueOnce({
        data: summary({
          dryRun: false,
          recapsPending: 18,
          recapsGenerated: 18,
        }),
        error: null,
      });

    const result = await runInsiderMonthlyRecaps({
      supabase: { rpc },
      env: {
        INSIDERS_MONTHLY_RECAP_MODE: "apply",
        INSIDERS_MONTHLY_RECAP_MAX_RECIPIENTS: "20",
      },
    });

    expect(result).toEqual(
      expect.objectContaining({ applied: true, mode: "apply" }),
    );
    expect(rpc).toHaveBeenNthCalledWith(
      2,
      "generate_insider_monthly_value_recaps",
      { apply_changes: true },
    );
  });

  it("blocks oversized recap batches", async () => {
    rpc.mockResolvedValueOnce({
      data: summary({ recapsPending: 21 }),
      error: null,
    });

    const result = await runInsiderMonthlyRecaps({
      supabase: { rpc },
      env: {
        INSIDERS_MONTHLY_RECAP_MODE: "apply",
        INSIDERS_MONTHLY_RECAP_MAX_RECIPIENTS: "20",
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        applied: false,
        blockedReason: expect.stringContaining("exceed"),
      }),
    );
    expect(rpc).toHaveBeenCalledOnce();
  });

  it("rejects invalid worker settings", () => {
    expect(() =>
      readInsiderMonthlyRecapSettings({
        INSIDERS_MONTHLY_RECAP_MODE: "send",
      }),
    ).toThrow(/off, dry-run, or apply/);
    expect(() =>
      readInsiderMonthlyRecapSettings({
        INSIDERS_MONTHLY_RECAP_MAX_RECIPIENTS: "0",
      }),
    ).toThrow(/positive integer/);
  });
});
