"use client";

import {
  getMonthButtonLabel,
  isSelectedMonth
} from "@/components/navigation/MonthScroller.helpers";
import { getMonthButtonClassName, monthScrollerStyles } from "@/components/navigation/MonthScroller.styles";
import type { MonthScrollerProps } from "@/components/navigation/MonthScroller.types";

export function MonthScroller({
  months,
  selectedMonth,
  onSelectMonth,
  ariaLabel
}: MonthScrollerProps) {
  return (
    <nav aria-label={ariaLabel} className={monthScrollerStyles.navigation}>
      <div className={monthScrollerStyles.list}>
        {months.map((month) => {
          const isSelected = isSelectedMonth(month, selectedMonth);

          return (
            <button
              aria-current={isSelected ? "page" : undefined}
              aria-label={getMonthButtonLabel(month)}
              className={getMonthButtonClassName(isSelected)}
              key={month.value}
              onClick={() => onSelectMonth(month.value)}
              type="button"
            >
              <span>{month.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
