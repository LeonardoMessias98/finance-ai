import { CompetencyMonthSwitcher } from "@/components/filters/competency-month-switcher";
import { FilterPanel } from "@/components/filters/filter-panel";
import { buildBudgetsHref } from "@/features/budgets/utils/build-budgets-href";
import { getCurrentCompetencyMonth, shiftCompetencyMonth } from "@/lib/dates/competency-month";

type BudgetsMonthFilterProps = {
  competencyMonth: string;
};

export function BudgetsMonthFilter({ competencyMonth }: BudgetsMonthFilterProps) {
  return (
    <FilterPanel>
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
    </FilterPanel>
  );
}
