import { describe, expect, it } from "vitest";

import { calculateGoalListItem } from "@/features/goals/utils/goal-progress";
import type { Goal } from "@/features/goals/types/goal";

describe("calculateGoalListItem", () => {
  it("caps the visual progress at 100 and preserves completed state", () => {
    const goal: Goal = {
      id: "goal-1",
      name: "Reserva de emergência",
      targetAmount: 10_000,
      currentAmount: 12_500,
      isCompleted: true
    };

    const result = calculateGoalListItem(goal);

    expect(result.progressPercentage).toBe(125);
    expect(result.cappedProgressPercentage).toBe(100);
    expect(result.remainingAmount).toBe(0);
  });
});
