import { Card, CardContent } from "@/components/ui/card";
import { CompetencyMonthSwitcher } from "@/components/filters/competency-month-switcher";
import { buildBudgetsHref } from "@/features/budgets/utils/build-budgets-href";
import { getCurrentCompetencyMonth, shiftCompetencyMonth } from "@/lib/dates/competency-month";

type BudgetsMonthFilterProps = {
  competencyMonth: string;
};

export function BudgetsMonthFilter({ competencyMonth }: BudgetsMonthFilterProps) {
  return (
    <Card className="border-primary/10 bg-card/85">
      <CardContent className="pt-6">
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
          submitLabel="Ir"
        />
      </CardContent>
    </Card>
  );
}
