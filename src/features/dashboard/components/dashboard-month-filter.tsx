import { CompetencyMonthSwitcher } from "@/components/filters/competency-month-switcher";
import { FilterPanel } from "@/components/filters/filter-panel";
import { buildDashboardHref } from "@/features/dashboard/utils/build-dashboard-href";
import type { TransactionType } from "@/features/transactions/types/transaction";
import { getCurrentCompetencyMonth, shiftCompetencyMonth } from "@/lib/dates/competency-month";

type DashboardMonthFilterProps = {
  competencyMonth: string;
  selectedType?: TransactionType;
};

export function DashboardMonthFilter({ competencyMonth, selectedType }: DashboardMonthFilterProps) {
  return (
    <FilterPanel>
      <CompetencyMonthSwitcher
        competencyMonth={competencyMonth}
        currentHref={buildDashboardHref({
          competencyMonth: getCurrentCompetencyMonth(),
          type: selectedType
        })}
        formAction="/"
        hiddenFields={selectedType ? [{ name: "type", value: selectedType }] : []}
        inputLabel="Mês exibido"
        nextHref={buildDashboardHref({
          competencyMonth: shiftCompetencyMonth(competencyMonth, 1),
          type: selectedType
        })}
        previousHref={buildDashboardHref({
          competencyMonth: shiftCompetencyMonth(competencyMonth, -1),
          type: selectedType
        })}
      />
    </FilterPanel>
  );
}
