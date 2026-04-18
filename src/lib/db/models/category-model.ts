import { type Model, Schema, type Types, model, models } from "mongoose";

import { categoryTypeValues, type CategoryType } from "@/features/categories/types/category";

export type CategoryDocument = {
  userId: Types.ObjectId;
  name: string;
  type: CategoryType;
  isActive: boolean;
  color?: string;
  icon?: string;
};

const categorySchema = new Schema<CategoryDocument>(
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
    type: {
      type: String,
      enum: categoryTypeValues,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    },
    color: {
      type: String,
      trim: true,
      maxlength: 7
    },
    icon: {
      type: String,
      trim: true,
      maxlength: 40
    }
  },
  {
    collection: "categories",
    versionKey: false
  }
);

categorySchema.index({
  userId: 1,
  type: 1,
  isActive: 1,
  name: 1
});

categorySchema.index(
  {
    userId: 1,
    type: 1,
    name: 1
  },
  {
    unique: true,
    collation: {
      locale: "en",
      strength: 2
    }
  }
);

export const CategoryModel: Model<CategoryDocument> =
  (models.Category as Model<CategoryDocument> | undefined) ?? model<CategoryDocument>("Category", categorySchema);
