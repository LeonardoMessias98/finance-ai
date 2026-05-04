import type { AccountFormValues } from "@/features/accounts/schemas/account-schema";
import type { Account } from "@/features/accounts/types/account";
import { isCreditAccount } from "@/features/accounts/utils/account-type-compatibility";

export function getAccountFormDefaultValues(account?: Account | null): AccountFormValues {
  const accountType = account && isCreditAccount(account.type) ? "credit" : "debit";

  return {
    name: account?.name ?? "",
    type: accountType,
    initialBalance: accountType === "credit" ? 0 : (account?.initialBalance ?? 0) / 100,
    isActive: account?.isActive ?? true,
    color: account?.color ?? "",
    icon: account?.icon ?? ""
  };
}
