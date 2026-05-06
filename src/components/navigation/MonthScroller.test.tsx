import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MonthScroller } from "@/components/navigation/MonthScroller";
import type { MonthScrollerMonth } from "@/components/navigation/MonthScroller.types";

const months: MonthScrollerMonth[] = [
  {
    value: "2026-04",
    label: "Abril/26",
    hasData: true
  },
  {
    value: "2026-05",
    label: "Maio/26"
  },
  {
    value: "2026-06",
    label: "Junho/26"
  }
];

describe("MonthScroller", () => {
  it("renders months", () => {
    render(<MonthScroller ariaLabel="Meses" months={months} onSelectMonth={() => {}} selectedMonth="2026-05" />);

    const navigation = screen.getByRole("navigation", { name: "Meses" });

    expect(navigation).toHaveClass("overflow-x-auto");
    expect(within(navigation).getByRole("button", { name: "Abril/26, com movimentação" })).toBeInTheDocument();
    expect(within(navigation).getByRole("button", { name: "Maio/26" })).toBeInTheDocument();
    expect(within(navigation).getByRole("button", { name: "Junho/26" })).toBeInTheDocument();
  });

  it("highlights selectedMonth", () => {
    render(<MonthScroller ariaLabel="Meses" months={months} onSelectMonth={() => {}} selectedMonth="2026-05" />);

    expect(screen.getByRole("button", { current: "page", name: "Maio/26" })).toHaveClass("bg-primary");
  });

  it("calls onSelectMonth when a month is clicked", async () => {
    const user = userEvent.setup();
    const onSelectMonth = vi.fn();

    render(<MonthScroller ariaLabel="Meses" months={months} onSelectMonth={onSelectMonth} selectedMonth="2026-05" />);
    await user.click(screen.getByRole("button", { name: "Junho/26" }));

    expect(onSelectMonth).toHaveBeenCalledWith("2026-06");
  });

  it("renders a data indicator when the month has data", () => {
    render(<MonthScroller ariaLabel="Meses" months={months} onSelectMonth={() => {}} selectedMonth="2026-05" />);

    expect(screen.getByTestId("month-data-indicator-2026-04")).toBeInTheDocument();
    expect(screen.queryByTestId("month-data-indicator-2026-05")).not.toBeInTheDocument();
  });

  it("keeps basic accessibility attributes", () => {
    render(<MonthScroller ariaLabel="Meses" months={months} onSelectMonth={() => {}} selectedMonth="2026-05" />);

    expect(screen.getByRole("navigation", { name: "Meses" })).toBeInTheDocument();
    expect(screen.getByRole("button", { current: "page", name: "Maio/26" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });
});
