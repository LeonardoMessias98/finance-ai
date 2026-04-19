import Link from "next/link";
import { PencilLine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { BudgetListItem } from "@/features/budgets/types/budget";
import { buildBudgetsHref } from "@/features/budgets/utils/build-budgets-href";
import { getBudgetConsumptionStatusLabel } from "@/features/budgets/utils/budget-consumption";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";
import { cn } from "@/lib/utils";

type BudgetsListProps = {
  budgets: BudgetListItem[];
  editingBudgetId?: string;
  competencyMonth: string;
};

function getConsumptionBadgeClassName(status: BudgetListItem["consumptionStatus"]): string {
  if (status === "exceeded") {
    return "bg-destructive/10 text-destructive";
  }

  if (status === "warning") {
    return "bg-accent/10 text-accent";
  }

  return "bg-primary/10 text-primary";
}

function getProgressBarClassName(status: BudgetListItem["consumptionStatus"]): string {
  if (status === "exceeded") {
    return "bg-destructive";
  }

  if (status === "warning") {
    return "bg-accent";
  }

  return "bg-primary";
}

export function BudgetsList({ budgets, editingBudgetId, competencyMonth }: BudgetsListProps) {
  return (
    <Card className="border-primary/10 bg-card/85">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Orçamentos</CardTitle>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <EmptyState className="bg-background/60" message="Nenhum orçamento nesta competência." />
        ) : (
          <div className="space-y-3">
            {budgets.map((budget) => (
              <div
                className={cn(
                  "space-y-4 rounded-[1.5rem] border border-border/80 bg-background/70 p-4",
                  editingBudgetId === budget.id ? "border-primary/40 bg-primary/5" : ""
                )}
                key={budget.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-foreground">{budget.categoryName}</p>
                      <Badge className={getConsumptionBadgeClassName(budget.consumptionStatus)}>
                        {getBudgetConsumptionStatusLabel(budget.consumptionStatus)}
                      </Badge>
                      {!budget.categoryIsActive ? <Badge variant="secondary">Categoria inativa</Badge> : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>Gasto {formatAccountBalanceFromCents(budget.spentAmount)}</span>
                      <span>Limite {formatAccountBalanceFromCents(budget.limitAmount)}</span>
                      <span>Restante {formatAccountBalanceFromCents(budget.remainingAmount)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-start gap-3">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">{budget.usedPercentage.toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">do limite usado</p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link
                        href={buildBudgetsHref({
                          budgetId: budget.id,
                          competencyMonth
                        })}
                      >
                        <PencilLine className="h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-3 overflow-hidden rounded-full bg-secondary/80">
                    <div
                      className={cn("h-full rounded-full transition-[width]", getProgressBarClassName(budget.consumptionStatus))}
                      style={{
                        width: `${budget.progressPercentage}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
