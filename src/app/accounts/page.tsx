import { redirect } from "next/navigation";

import { AccountsPage } from "@/features/accounts/components/accounts-page";
import { getOptionalAuthenticatedAppUser } from "@/lib/auth/session";

type AccountsRoutePageProps = {
  searchParams?: Promise<{
    accountId?: string | string[];
  }>;
};

export default async function AccountsRoutePage({ searchParams }: AccountsRoutePageProps) {
  const user = await getOptionalAuthenticatedAppUser();

  if (!user) {
    redirect("/login?next=/accounts");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const editingAccountId =
    typeof resolvedSearchParams.accountId === "string" ? resolvedSearchParams.accountId : undefined;

  return <AccountsPage editingAccountId={editingAccountId} />;
}
