import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DashboardMonthFilter } from "@/features/dashboard/components/dashboard-month-filter";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock
  })
}));

describe("DashboardMonthFilter", () => {
  beforeEach(() => {
    pushMock.mockReset();
  });

  it("renders a horizontal month list", () => {
    render(
      <DashboardMonthFilter
        competencyMonth="2026-05"
        months={["2026-04", "2026-05", "2026-06"]}
      />
    );

    const navigation = screen.getByRole("navigation", {
      name: "Navegação mensal"
    });

    expect(navigation).toHaveClass("overflow-x-auto");
    expect(within(navigation).getByRole("button", { name: "Abril/26" })).toBeInTheDocument();
    expect(within(navigation).getByRole("button", { name: "Maio/26" })).toBeInTheDocument();
    expect(within(navigation).getByRole("button", { name: "Junho/26" })).toBeInTheDocument();
  });

  it("highlights the active month", () => {
    render(
      <DashboardMonthFilter
        competencyMonth="2026-05"
        months={["2026-04", "2026-05", "2026-06"]}
      />
    );

    const activeMonth = screen.getByRole("button", {
      current: "page",
      name: "Maio/26"
    });

    expect(activeMonth).toHaveClass("bg-primary");
  });

  it("navigates to the selected competency", async () => {
    const user = userEvent.setup();

    render(
      <DashboardMonthFilter
        competencyMonth="2026-05"
        months={["2026-04", "2026-05", "2026-06"]}
        selectedType="expense"
      />
    );

    await user.click(screen.getByRole("button", { name: "Junho/26" }));

    expect(pushMock).toHaveBeenCalledWith("/?competencyMonth=2026-06&type=expense");
  });

  it("marks months with movement", () => {
    render(
      <DashboardMonthFilter
        competencyMonth="2026-05"
        dataMonths={["2026-04"]}
        months={["2026-04", "2026-05", "2026-06"]}
      />
    );

    expect(screen.getByRole("button", { name: "Abril/26, com movimentação" })).toBeInTheDocument();
    expect(screen.getByTestId("month-data-indicator-2026-04")).toBeInTheDocument();
  });
});
