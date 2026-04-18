import { type HydratedDocument, type Model, Schema, type Types, model, models } from "mongoose";

export type GoalDocument = {
  userId: Types.ObjectId;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  isCompleted: boolean;
};

const goalSchema = new Schema<GoalDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 1
    },
    currentAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    targetDate: {
      type: Date
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    collection: "goals",
    versionKey: false
  }
);

goalSchema.pre("validate", function validateGoal(next) {
  const goal = this as HydratedDocument<GoalDocument>;

  goal.isCompleted = goal.currentAmount >= goal.targetAmount;

  next();
});

goalSchema.index({
  userId: 1,
  isCompleted: 1,
  targetDate: 1
});

goalSchema.index({
  userId: 1,
  name: 1
});

export const GoalModel: Model<GoalDocument> =
  (models.Goal as Model<GoalDocument> | undefined) ?? model<GoalDocument>("Goal", goalSchema);
