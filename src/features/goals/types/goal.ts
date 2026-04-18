export type Goal = {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  isCompleted: boolean;
};

export type GoalFieldName = "name" | "targetAmount" | "currentAmount" | "targetDate";

export type CreateGoalInput = {
  userId: string;
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
  userId: string;
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
