import type { TransactionFieldName } from "@/features/transactions/types/transaction";

type TransactionFieldErrors = Partial<Record<TransactionFieldName, string[]>>;

export class TransactionBusinessError extends Error {
  readonly fieldErrors?: TransactionFieldErrors;

  constructor(message: string, fieldErrors?: TransactionFieldErrors) {
    super(message);
    this.name = "TransactionBusinessError";
    this.fieldErrors = fieldErrors;
  }
}

export function createTransactionFieldError(
  fieldName: TransactionFieldName,
  message: string
): TransactionBusinessError {
  return new TransactionBusinessError(message, {
    [fieldName]: [message]
  });
}

export class InstallmentSeriesUpdateNotSupportedError extends TransactionBusinessError {
  constructor(
    message = "A edição isolada de parcelas ainda não está disponível. Exclua a série inteira e recrie, se necessário."
  ) {
    super(message);
    this.name = "InstallmentSeriesUpdateNotSupportedError";
  }
}
