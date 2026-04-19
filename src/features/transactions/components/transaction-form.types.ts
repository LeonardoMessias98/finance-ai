import type { Account } from "@/features/accounts/types/account";
import type { Category } from "@/features/categories/types/category";
import type { Transaction, TransactionType } from "@/features/transactions/types/transaction";

export type TransactionFormProps = {
  transaction?: Transaction | null;
  accounts: Account[];
  categories: Category[];
  returnHref?: string;
  defaultType?: TransactionType;
  defaultCompetencyMonth?: string;
  closeOnSuccess?: boolean;
  showCard?: boolean;
  onCancel?: () => void;
  onSuccess?: () => void;
};
