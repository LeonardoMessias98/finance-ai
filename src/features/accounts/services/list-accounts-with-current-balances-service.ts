import "server-only";

import { listAccounts } from "@/features/accounts/repositories/account-repository";
import { buildAccountsWithCurrentBalances } from "@/features/accounts/utils/build-account-current-balances";
import { listTransactions } from "@/features/transactions/repositories/transaction-repository";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function listAccountsWithCurrentBalances() {
  const user = await requireAuthenticatedAppUser();
  const [accounts, transactions] = await Promise.all([
    listAccounts({
      userId: user.id
    }),
    listTransactions({
      userId: user.id
    })
  ]);

  return buildAccountsWithCurrentBalances(accounts, transactions);
}
