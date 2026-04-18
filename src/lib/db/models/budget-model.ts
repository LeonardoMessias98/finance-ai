import { type Model, Schema, type Types, model, models } from "mongoose";

export type BudgetDocument = {
  userId: Types.ObjectId;
  competencyMonth: string;
  categoryId: Types.ObjectId;
  limitAmount: number;
  alertThresholds?: number[];
};

const budgetSchema = new Schema<BudgetDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    competencyMonth: {
      type: String,
      required: true,
      match: /^\d{4}-(0[1-9]|1[0-2])$/
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    limitAmount: {
      type: Number,
      required: true,
      min: 1
    },
    alertThresholds: {
      type: [
        {
          type: Number,
          min: 1,
          max: 100
        }
      ],
      validate: {
        validator: (values: number[] | undefined) => !values || new Set(values).size === values.length,
        message: "Alert thresholds must be unique."
      }
    }
  },
  {
    collection: "budgets",
    versionKey: false
  }
);

budgetSchema.index(
  {
    userId: 1,
    competencyMonth: 1,
    categoryId: 1
  },
  {
    unique: true
  }
);

budgetSchema.index({
  userId: 1,
  competencyMonth: 1
});

export const BudgetModel: Model<BudgetDocument> =
  (models.Budget as Model<BudgetDocument> | undefined) ?? model<BudgetDocument>("Budget", budgetSchema);
