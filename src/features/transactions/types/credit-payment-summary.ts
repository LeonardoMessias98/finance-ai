import type { AccountType } from "@/features/accounts/types/account";
import type { TransactionStatus } from "@/features/transactions/types/transaction";

export type CreditPaymentSummaryTransaction = {
  id: string;
  description: string;
  amount: number;
  date: Date;
  competencyMonth: string;
  creditPaymentMonth?: string;
  status: TransactionStatus;
};

export type CreditPaymentSummaryAccountGroup = {
  accountId: string;
  accountName: string;
  accountType: AccountType;
  totalAmount: number;
  transactions: CreditPaymentSummaryTransaction[];
};

export type CreditPaymentSummary = {
  creditPaymentMonth: string;
  totalAmount: number;
  accountGroups: CreditPaymentSummaryAccountGroup[];
  transactions: CreditPaymentSummaryTransaction[];
};
