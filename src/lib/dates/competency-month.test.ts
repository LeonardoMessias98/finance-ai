import { describe, expect, it } from "vitest";

import {
  formatDateAsInputValue,
  getDefaultDateInputForCompetencyMonth,
  getCompetencyMonthFromDate,
  getCompetencyMonthFromDateInput,
  getCurrentCompetencyMonth,
  isCompetencyMonth,
  shiftCompetencyMonth
} from "@/lib/dates/competency-month";

describe("competency-month", () => {
  it("validates the expected YYYY-MM format", () => {
    expect(isCompetencyMonth("2026-04")).toBe(true);
    expect(isCompetencyMonth("2026-4")).toBe(false);
    expect(isCompetencyMonth("2026-13")).toBe(false);
  });

  it("derives the competency month from a transaction date", () => {
    expect(getCompetencyMonthFromDate(new Date("2026-04-20T12:00:00.000Z"))).toBe("2026-04");
  });

  it("derives the current competency month using the project time zone", () => {
    expect(getCurrentCompetencyMonth(new Date("2026-05-01T02:30:00.000Z"))).toBe("2026-04");
  });

  it("formats the current date for HTML date inputs using the project time zone", () => {
    expect(formatDateAsInputValue(new Date("2026-05-01T02:30:00.000Z"))).toBe("2026-04-30");
  });

  it("shifts a competency month backward and forward", () => {
    expect(shiftCompetencyMonth("2026-01", -1)).toBe("2025-12");
    expect(shiftCompetencyMonth("2026-12", 1)).toBe("2027-01");
  });

  it("builds a default date inside the selected competency month", () => {
    expect(getDefaultDateInputForCompetencyMonth("2026-02", new Date("2026-03-31T12:00:00.000Z"))).toBe("2026-02-28");
    expect(getDefaultDateInputForCompetencyMonth("2026-03", new Date("2026-03-31T12:00:00.000Z"))).toBe("2026-03-31");
  });

  it("derives the competency month from a valid HTML date input", () => {
    expect(getCompetencyMonthFromDateInput("2026-04-17")).toBe("2026-04");
    expect(getCompetencyMonthFromDateInput("invalid")).toBeNull();
  });
});
