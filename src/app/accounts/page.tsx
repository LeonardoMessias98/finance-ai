import { AccountsPage } from "@/features/accounts/components/accounts-page";

type AccountsRoutePageProps = {
  searchParams?: Promise<{
    accountId?: string | string[];
  }>;
};

export default async function AccountsRoutePage({ searchParams }: AccountsRoutePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const editingAccountId =
    typeof resolvedSearchParams.accountId === "string" ? resolvedSearchParams.accountId : undefined;

  return <AccountsPage editingAccountId={editingAccountId} />;
}
