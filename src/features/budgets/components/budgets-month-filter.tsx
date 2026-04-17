import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompetencyMonthSwitcher } from "@/components/filters/competency-month-switcher";
import { buildBudgetsHref } from "@/features/budgets/utils/build-budgets-href";
import { getCurrentCompetencyMonth, shiftCompetencyMonth } from "@/lib/dates/competency-month";

type BudgetsMonthFilterProps = {
  competencyMonth: string;
};

export function BudgetsMonthFilter({ competencyMonth }: BudgetsMonthFilterProps) {
  return (
    <Card className="border-primary/10 bg-card/85">
      <CardHeader className="space-y-1">
        <CardTitle className="font-display text-3xl">Competência dos orçamentos</CardTitle>
        <CardDescription>Veja e gerencie os limites de gasto de uma competência por vez.</CardDescription>
      </CardHeader>
      <CardContent>
        <CompetencyMonthSwitcher
          competencyMonth={competencyMonth}
          currentHref={buildBudgetsHref({
            competencyMonth: getCurrentCompetencyMonth()
          })}
          formAction="/budgets"
          inputLabel="Mês"
          nextHref={buildBudgetsHref({
            competencyMonth: shiftCompetencyMonth(competencyMonth, 1)
          })}
          previousHref={buildBudgetsHref({
            competencyMonth: shiftCompetencyMonth(competencyMonth, -1)
          })}
          submitLabel="Aplicar competência"
        />
      </CardContent>
    </Card>
  );
}
