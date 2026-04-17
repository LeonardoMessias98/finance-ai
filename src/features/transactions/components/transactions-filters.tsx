import Link from "next/link";

import { CompetencyMonthSwitcher } from "@/components/filters/competency-month-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { Account } from "@/features/accounts/types/account";
import { getAccountTypeLabel } from "@/features/accounts/utils/account-formatters";
import type { Category } from "@/features/categories/types/category";
import { getCategoryTypeLabel } from "@/features/categories/utils/category-formatters";
import { TransactionTypeFilter } from "@/features/transactions/components/transaction-type-filter";
import type { TransactionType } from "@/features/transactions/types/transaction";
import { buildTransactionsHref } from "@/features/transactions/utils/build-transactions-href";
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
  fieldPrefix?: string;
};

export function TransactionsFiltersPanel({
  accounts,
  categories,
  filters,
  fieldPrefix = "transactions-filters"
}: TransactionsFiltersProps) {
  const hiddenFields = [
    filters.accountId ? { name: "accountId", value: filters.accountId } : null,
    filters.categoryId ? { name: "categoryId", value: filters.categoryId } : null,
    filters.type ? { name: "type", value: filters.type } : null
  ].filter((field): field is { name: string; value: string } => Boolean(field));

  const clearSecondaryFiltersHref = buildTransactionsHref({
    competencyMonth: filters.competencyMonth,
    type: filters.type
  });
  const accountFieldId = `${fieldPrefix}-account`;
  const categoryFieldId = `${fieldPrefix}-category`;

  return (
    <div className="space-y-5">
      <TransactionTypeFilter
        buildHref={(type) =>
          buildTransactionsHref({
            competencyMonth: filters.competencyMonth,
            accountId: filters.accountId,
            categoryId: filters.categoryId,
            type
          })
        }
        selectedType={filters.type}
      />

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
        inputLabel="Mês"
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
        submitLabel="Ir"
      />

      <form action="/transactions" className="space-y-4" method="get">
        <input name="competencyMonth" type="hidden" value={filters.competencyMonth} />
        {filters.type ? <input name="type" type="hidden" value={filters.type} /> : null}

        <div className="space-y-2">
          <Label htmlFor={accountFieldId}>Conta</Label>
          <Select defaultValue={filters.accountId} id={accountFieldId} name="accountId">
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
          <Label htmlFor={categoryFieldId}>Categoria</Label>
          <Select defaultValue={filters.categoryId} id={categoryFieldId} name="categoryId">
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {getCategoryTypeLabel(category.type)} · {category.name}
                {category.isActive ? "" : " · Inativa"}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit">Aplicar</Button>
          <Button asChild type="button" variant="outline">
            <Link href={clearSecondaryFiltersHref}>Limpar</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}

export function TransactionsFiltersSidebar({ accounts, categories, filters }: TransactionsFiltersProps) {
  return (
    <Card className="border-primary/10 bg-card/85">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        <TransactionsFiltersPanel
          accounts={accounts}
          categories={categories}
          fieldPrefix="transactions-sidebar"
          filters={filters}
        />
      </CardContent>
    </Card>
  );
}
