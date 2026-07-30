export type InsiderBootstrapOperatorStage =
  "config" | "member_index" | "billing_index" | "chargebee_enumeration";

export type InsiderBootstrapOperatorCode =
  | "invalid_configuration"
  | "member_index_read_failed"
  | "billing_index_read_failed"
  | "chargebee_enumeration_failed";

export class InsiderBootstrapOperatorError extends Error {
  readonly stage: InsiderBootstrapOperatorStage;
  readonly operatorCode: InsiderBootstrapOperatorCode;

  constructor(
    stage: InsiderBootstrapOperatorStage,
    operatorCode: InsiderBootstrapOperatorCode,
  ) {
    super("Insider bootstrap operator failure");
    this.name = "InsiderBootstrapOperatorError";
    this.stage = stage;
    this.operatorCode = operatorCode;
  }
}

export function safeInsiderBootstrapOperatorFailure(error: unknown): string {
  if (error instanceof InsiderBootstrapOperatorError) {
    return `Chargebee Insider bootstrap failed [stage=${error.stage}] [code=${error.operatorCode}]`;
  }
  return "Chargebee Insider bootstrap failed [stage=config] [code=invalid_configuration]";
}
