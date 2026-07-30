export type InsiderBootstrapIndexTable =
  "insider_billing_events" | "insider_subscriptions";

export interface SupabaseReadError {
  code?: string | null;
  message?: string | null;
}

export interface LegacyInsiderMemberRow {
  id: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function isMissingInsiderBootstrapTableError(
  error: SupabaseReadError | null | undefined,
  table: InsiderBootstrapIndexTable,
): boolean {
  const code = error?.code?.trim();
  const message = error?.message?.trim();
  if (!code || !message) return false;

  const escapedTable = escapeRegExp(table);
  if (code === "42P01") {
    return new RegExp(
      `^relation "(?:public\\.)?${escapedTable}" does not exist$`,
      "i",
    ).test(message);
  }

  if (code === "PGRST205") {
    return new RegExp(
      `^Could not find the table 'public\\.${escapedTable}' in the schema cache$`,
      "i",
    ).test(message);
  }

  return false;
}

export function shouldUseEmptyInsiderBootstrapIndex(options: {
  apply: boolean;
  error: SupabaseReadError | null | undefined;
  table: InsiderBootstrapIndexTable;
}): boolean {
  return (
    !options.apply &&
    isMissingInsiderBootstrapTableError(options.error, options.table)
  );
}

export function isMissingLegacyMemberCustomerIdColumnError(
  error: SupabaseReadError | null | undefined,
): boolean {
  const code = error?.code?.trim();
  const message = error?.message?.trim();
  if (!code || !message) return false;

  if (code === "42703") {
    return /^column (?:(?:public\.)?insider_members\.)?"?chargebee_customer_id"? does not exist$/i.test(
      message,
    );
  }

  if (code === "PGRST204") {
    return /^Could not find the 'chargebee_customer_id' column of 'insider_members' in the schema cache$/i.test(
      message,
    );
  }

  return false;
}

export function shouldUseLegacyInsiderMemberIndex(options: {
  apply: boolean;
  error: SupabaseReadError | null | undefined;
}): boolean {
  return (
    !options.apply && isMissingLegacyMemberCustomerIdColumnError(options.error)
  );
}

export function normalizeLegacyInsiderMemberRows(
  rows: LegacyInsiderMemberRow[],
): Array<LegacyInsiderMemberRow & { chargebee_customer_id: null }> {
  return rows.map((row) => ({
    ...row,
    chargebee_customer_id: null,
  }));
}
