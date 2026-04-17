export const competencyMonthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

const projectTimeZone = "America/Sao_Paulo";

type DatePart = "year" | "month" | "day";

function getDatePart(referenceDate: Date, type: DatePart): string {
  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: projectTimeZone,
    [type]: type === "year" ? "numeric" : "2-digit"
  }).formatToParts(referenceDate);

  const part = dateParts.find((item) => item.type === type);

  if (!part) {
    throw new Error(`Failed to resolve ${type} for competency month handling.`);
  }

  return part.value;
}

export function isCompetencyMonth(value: string): boolean {
  return competencyMonthRegex.test(value);
}

export function getCompetencyMonthFromDate(referenceDate: Date): string {
  const year = getDatePart(referenceDate, "year");
  const month = getDatePart(referenceDate, "month");

  return `${year}-${month}`;
}

export function getCurrentCompetencyMonth(referenceDate: Date = new Date()): string {
  return getCompetencyMonthFromDate(referenceDate);
}

function getLastDayOfCompetencyMonth(competencyMonth: string): number {
  const [year, month] = competencyMonth.split("-").map(Number);

  return new Date(Date.UTC(year, month, 0, 12)).getUTCDate();
}

export function formatDateAsInputValue(referenceDate: Date = new Date()): string {
  const year = getDatePart(referenceDate, "year");
  const month = getDatePart(referenceDate, "month");
  const day = getDatePart(referenceDate, "day");

  return `${year}-${month}-${day}`;
}

export function shiftCompetencyMonth(competencyMonth: string, monthDelta: number): string {
  if (!isCompetencyMonth(competencyMonth)) {
    throw new Error(`Invalid competency month: ${competencyMonth}`);
  }

  const [year, month] = competencyMonth.split("-").map(Number);
  const shiftedDate = new Date(Date.UTC(year, month - 1 + monthDelta, 1, 12));

  return getCompetencyMonthFromDate(shiftedDate);
}

export function getDefaultDateInputForCompetencyMonth(
  competencyMonth: string,
  referenceDate: Date = new Date()
): string {
  if (!isCompetencyMonth(competencyMonth)) {
    throw new Error(`Invalid competency month: ${competencyMonth}`);
  }

  const currentCompetencyMonth = getCurrentCompetencyMonth(referenceDate);

  if (competencyMonth === currentCompetencyMonth) {
    return formatDateAsInputValue(referenceDate);
  }

  const targetDay = Math.min(Number(getDatePart(referenceDate, "day")), getLastDayOfCompetencyMonth(competencyMonth));

  return `${competencyMonth}-${String(targetDay).padStart(2, "0")}`;
}

export function getCompetencyMonthFromDateInput(value: string): string | null {
  const trimmedValue = value.trim();
  const derivedCompetencyMonth = trimmedValue.slice(0, 7);

  return isCompetencyMonth(derivedCompetencyMonth) ? derivedCompetencyMonth : null;
}
