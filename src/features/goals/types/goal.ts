export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  isCompleted: boolean;
};

export type GoalFieldName = "name" | "targetAmount" | "currentAmount" | "targetDate";

export type CreateGoalInput = {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  targetDate?: Date;
  isCompleted?: boolean;
};

export type UpdateGoalInput = CreateGoalInput & {
  id: string;
};

export type GoalFilters = {
  isCompleted?: boolean;
};

export type GoalListItem = Goal & {
  progressPercentage: number;
  cappedProgressPercentage: number;
  remainingAmount: number;
};

export type GoalActionResult =
  | {
      status: "success";
      message: string;
    }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<GoalFieldName, string[]>>;
    };
