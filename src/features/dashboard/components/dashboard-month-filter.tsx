"use client";

import { useRouter } from "next/navigation";

import { MonthScroller } from "@/components/navigation/MonthScroller";
import type { MonthScrollerMonth } from "@/components/navigation/MonthScroller.types";
import { buildDashboardHref } from "@/features/dashboard/utils/build-dashboard-href";
import { formatDashboardMonthNavigationLabel } from "@/features/dashboard/utils/dashboard-month-navigation";
import type { TransactionType } from "@/features/transactions/types/transaction";

type DashboardMonthFilterProps = {
  competencyMonth: string;
  months: string[];
  dataMonths?: string[];
  selectedType?: TransactionType;
};

export function DashboardMonthFilter({ competencyMonth, months, dataMonths = [], selectedType }: DashboardMonthFilterProps) {
  const router = useRouter();
  const dataMonthSet = new Set(dataMonths);
  const scrollerMonths: MonthScrollerMonth[] = months.map((month) => ({
    value: month,
    label: formatDashboardMonthNavigationLabel(month),
    hasData: dataMonthSet.has(month)
  }));

  return (
    <MonthScroller
      ariaLabel="Navegação mensal"
      months={scrollerMonths}
      onSelectMonth={(month) => {
        router.push(
          buildDashboardHref({
            competencyMonth: month,
            type: selectedType
          })
        );
      }}
      selectedMonth={competencyMonth}
    />
  );
}
