import { CompetencyMonthSwitcher } from "@/components/filters/competency-month-switcher";
import { FilterPanel } from "@/components/filters/filter-panel";
import { buildFamilyHref } from "@/features/families/utils/build-family-href";
import { getCurrentCompetencyMonth, shiftCompetencyMonth } from "@/lib/dates/competency-month";

type FamilyMonthFilterProps = {
  competencyMonth: string;
};

export function FamilyMonthFilter({ competencyMonth }: FamilyMonthFilterProps) {
  return (
    <FilterPanel>
      <CompetencyMonthSwitcher
        competencyMonth={competencyMonth}
        currentHref={buildFamilyHref({
          competencyMonth: getCurrentCompetencyMonth()
        })}
        formAction="/family"
        inputLabel="Mês exibido"
        nextHref={buildFamilyHref({
          competencyMonth: shiftCompetencyMonth(competencyMonth, 1)
        })}
        previousHref={buildFamilyHref({
          competencyMonth: shiftCompetencyMonth(competencyMonth, -1)
        })}
      />
    </FilterPanel>
  );
}
