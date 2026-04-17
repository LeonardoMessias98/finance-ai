import Link from "next/link";

import { CompetencyMonthSwitcher } from "@/components/filters/competency-month-switcher";
import type { Account } from "@/features/accounts/types/account";
import { getAccountTypeLabel } from "@/features/accounts/utils/account-formatters";
import type { Category } from "@/features/categories/types/category";
import { getCategoryTypeLabel } from "@/features/categories/utils/category-formatters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { TransactionType } from "@/features/transactions/types/transaction";
import { transactionTypeValues } from "@/features/transactions/types/transaction";
import { buildTransactionsHref } from "@/features/transactions/utils/build-transactions-href";
import { getTransactionTypeLabel } from "@/features/transactions/utils/transaction-formatters";
import { getCurrentCompetencyMonth, shiftCompetencyMonth } from "@/lib/dates/competency-month";

type TransactionsFiltersProps = {
  accounts: Account[];
  categories: Category[];
  filters: {
    competencyMonth: string;
    accountId?: string;
    categoryId?: string;
    type?: TransactionType;
  };
};

export function TransactionsFilters({ accounts, categories, filters }: TransactionsFiltersProps) {
  const hiddenFields = [
    filters.accountId ? { name: "accountId", value: filters.accountId } : null,
    filters.categoryId ? { name: "categoryId", value: filters.categoryId } : null,
    filters.type ? { name: "type", value: filters.type } : null
  ].filter((field): field is { name: string; value: string } => Boolean(field));

  const clearSecondaryFiltersHref = buildTransactionsHref({
    competencyMonth: filters.competencyMonth
  });

  return (
    <Card className="border-primary/10 bg-card/85">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Mês e filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <CompetencyMonthSwitcher
          competencyMonth={filters.competencyMonth}
          currentHref={buildTransactionsHref({
            competencyMonth: getCurrentCompetencyMonth(),
            accountId: filters.accountId,
            categoryId: filters.categoryId,
            type: filters.type
          })}
          formAction="/transactions"
          hiddenFields={hiddenFields}
          inputLabel="Competência da listagem"
          nextHref={buildTransactionsHref({
            competencyMonth: shiftCompetencyMonth(filters.competencyMonth, 1),
            accountId: filters.accountId,
            categoryId: filters.categoryId,
            type: filters.type
          })}
          previousHref={buildTransactionsHref({
            competencyMonth: shiftCompetencyMonth(filters.competencyMonth, -1),
            accountId: filters.accountId,
            categoryId: filters.categoryId,
            type: filters.type
          })}
          submitLabel="Aplicar mês"
        />

        <form action="/transactions" className="grid gap-4 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]" method="get">
          <input name="competencyMonth" type="hidden" value={filters.competencyMonth} />
          <div className="space-y-2">
            <Label htmlFor="accountId">Conta</Label>
            <Select defaultValue={filters.accountId} id="accountId" name="accountId">
              <option value="">Todas as contas</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} · {getAccountTypeLabel(account.type)}
                  {account.isActive ? "" : " · Inativa"}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria</Label>
            <Select defaultValue={filters.categoryId} id="categoryId" name="categoryId">
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryTypeLabel(category.type)} · {category.name}
                  {category.isActive ? "" : " · Inativa"}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select defaultValue={filters.type} id="type" name="type">
              <option value="">Todos os tipos</option>
              {transactionTypeValues.map((transactionType) => (
                <option key={transactionType} value={transactionType}>
                  {getTransactionTypeLabel(transactionType)}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <Button type="submit">Aplicar extras</Button>
            <Button asChild type="button" variant="outline">
              <Link href={clearSecondaryFiltersHref}>Limpar extras</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
