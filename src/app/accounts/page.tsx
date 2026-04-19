import { redirect } from "next/navigation";

import { AccountsPage } from "@/features/accounts/components/accounts-page";
import { getOptionalAuthenticatedAppUser } from "@/lib/auth/session";
import { isTruthySearchParam } from "@/lib/search-params";

type AccountsRoutePageProps = {
  searchParams?: Promise<{
    accountId?: string | string[];
    create?: string | string[];
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
  const isCreateModalOpen = isTruthySearchParam(resolvedSearchParams.create);

  return <AccountsPage editingAccountId={editingAccountId} isCreateModalOpen={isCreateModalOpen} />;
}
