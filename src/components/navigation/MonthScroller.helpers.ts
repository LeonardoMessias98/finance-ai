import type { MonthScrollerMonth } from "@/components/navigation/MonthScroller.types";

export function isSelectedMonth(month: MonthScrollerMonth, selectedMonth: string): boolean {
  return month.value === selectedMonth;
}

export function getMonthButtonLabel(month: MonthScrollerMonth): string {
  return month.hasData ? `${month.label}, com movimentação` : month.label;
}
