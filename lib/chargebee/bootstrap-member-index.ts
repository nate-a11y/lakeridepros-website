import {
  normalizeLegacyInsiderMemberRows,
  shouldUseLegacyInsiderMemberIndex,
  type LegacyInsiderMemberRow,
  type SupabaseReadError,
} from "./bootstrap-schema-errors";

export interface InsiderBootstrapMemberRow extends LegacyInsiderMemberRow {
  chargebee_customer_id: string | null;
}

export interface InsiderBootstrapMemberIndexPage {
  data:
    InsiderBootstrapMemberRow[] | LegacyInsiderMemberRow[] | null | undefined;
  error: SupabaseReadError | null;
}

export type ReadInsiderBootstrapMemberIndexPage = (options: {
  includeChargebeeCustomerId: boolean;
  from: number;
  to: number;
}) => Promise<InsiderBootstrapMemberIndexPage>;

export async function loadInsiderBootstrapMemberIndex(options: {
  apply: boolean;
  readPage: ReadInsiderBootstrapMemberIndexPage;
  pageSize?: number;
}): Promise<{
  members: InsiderBootstrapMemberRow[];
  legacyMemberIndex: boolean;
}> {
  const pageSize = options.pageSize ?? 1000;

  async function readAll(includeChargebeeCustomerId: boolean) {
    const rows: Array<InsiderBootstrapMemberRow | LegacyInsiderMemberRow> = [];

    for (let from = 0; ; from += pageSize) {
      const page = await options.readPage({
        includeChargebeeCustomerId,
        from,
        to: from + pageSize - 1,
      });
      if (page.error) return { rows: [], error: page.error };

      rows.push(...(page.data ?? []));
      if ((page.data?.length ?? 0) < pageSize) {
        return { rows, error: null };
      }
    }
  }

  const currentIndex = await readAll(true);
  if (!currentIndex.error) {
    return {
      members: currentIndex.rows as InsiderBootstrapMemberRow[],
      legacyMemberIndex: false,
    };
  }

  if (
    !shouldUseLegacyInsiderMemberIndex({
      apply: options.apply,
      error: currentIndex.error,
    })
  ) {
    throw new Error("Member index unavailable");
  }

  const legacyIndex = await readAll(false);
  if (legacyIndex.error) {
    throw new Error("Legacy member index unavailable");
  }

  return {
    members: normalizeLegacyInsiderMemberRows(
      legacyIndex.rows as LegacyInsiderMemberRow[],
    ),
    legacyMemberIndex: true,
  };
}
