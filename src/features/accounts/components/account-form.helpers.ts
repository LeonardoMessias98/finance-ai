import type { AccountFormValues } from "@/features/accounts/schemas/account-schema";
import type { Account } from "@/features/accounts/types/account";

export function getAccountFormDefaultValues(account?: Account | null): AccountFormValues {
  return {
    name: account?.name ?? "",
    type: account?.type ?? "checking",
    initialBalance: account ? account.initialBalance / 100 : 0,
    isActive: account?.isActive ?? true,
    color: account?.color ?? "",
    icon: account?.icon ?? ""
  };
}
