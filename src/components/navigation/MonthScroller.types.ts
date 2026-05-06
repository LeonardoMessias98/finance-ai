export type MonthScrollerMonth = {
  value: string;
  label: string;
  hasData?: boolean;
};

export type MonthScrollerProps = {
  months: MonthScrollerMonth[];
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  ariaLabel: string;
};
