import { Card, CardContent } from "@/components/ui/card";
import { CompetencyMonthSwitcher } from "@/components/filters/competency-month-switcher";
import { buildDashboardHref } from "@/features/dashboard/utils/build-dashboard-href";
import { getCurrentCompetencyMonth, shiftCompetencyMonth } from "@/lib/dates/competency-month";

type DashboardMonthFilterProps = {
  competencyMonth: string;
};

export function DashboardMonthFilter({ competencyMonth }: DashboardMonthFilterProps) {
  return (
    <Card className="border-primary/10 bg-card/85">
      <CardContent className="pt-6">
        <CompetencyMonthSwitcher
          competencyMonth={competencyMonth}
          currentHref={buildDashboardHref({
            competencyMonth: getCurrentCompetencyMonth()
          })}
          formAction="/"
          inputLabel="Mês exibido"
          nextHref={buildDashboardHref({
            competencyMonth: shiftCompetencyMonth(competencyMonth, 1)
          })}
          previousHref={buildDashboardHref({
            competencyMonth: shiftCompetencyMonth(competencyMonth, -1)
          })}
        />
      </CardContent>
    </Card>
  );
}
