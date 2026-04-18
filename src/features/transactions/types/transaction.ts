export const transactionTypeValues = ["income", "expense", "transfer"] as const;
export const transactionStatusValues = ["planned", "paid", "received", "overdue"] as const;

export type TransactionType = (typeof transactionTypeValues)[number];
export type TransactionStatus = (typeof transactionStatusValues)[number];
export type TransactionFieldName =
  | "description"
  | "amount"
  | "type"
  | "date"
  | "competencyMonth"
  | "installmentCount"
  | "categoryId"
  | "accountId"
  | "destinationAccountId"
  | "notes"
  | "status"
  | "isRecurring";

export type TransactionInstallment = {
  current: number;
  total: number;
};

// Monetary values use the smallest currency unit, such as cents.
export type Transaction = {
  id: string;
  userId: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: Date;
  competencyMonth: string;
  categoryId?: string;
  accountId: string;
  destinationAccountId?: string;
  notes?: string;
  status: TransactionStatus;
  isRecurring: boolean;
  installment?: TransactionInstallment;
  parentTransactionId?: string;
};

export type CreateTransactionInput = {
  userId: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: Date;
  competencyMonth: string;
  categoryId?: string;
  accountId: string;
  destinationAccountId?: string;
  notes?: string;
  status: TransactionStatus;
  isRecurring?: boolean;
  installment?: TransactionInstallment;
  parentTransactionId?: string;
};

export type UpdateTransactionInput = Omit<CreateTransactionInput, "isRecurring"> & {
  id: string;
  isRecurring: boolean;
};

export type TransactionFilters = {
  userId: string;
  competencyMonth?: string;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
};

export type DeleteTransactionInput = {
  transactionId: string;
};

export type TransactionActionResult =
  | {
      status: "success";
      message: string;
    }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<TransactionFieldName, string[]>>;
    };
