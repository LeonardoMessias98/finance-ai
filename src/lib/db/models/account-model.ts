import { type Model, Schema, type Types, model, models } from "mongoose";

import { accountTypeValues, type AccountType } from "@/features/accounts/types/account";

export type AccountDocument = {
  userId: Types.ObjectId;
  name: string;
  type: AccountType;
  initialBalance: number;
  isActive: boolean;
  color?: string;
  icon?: string;
};

const accountSchema = new Schema<AccountDocument>(
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
      enum: accountTypeValues,
      required: true
    },
    initialBalance: {
      type: Number,
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
    collection: "accounts",
    versionKey: false
  }
);

accountSchema.index({
  userId: 1,
  isActive: 1,
  type: 1,
  name: 1
});

export const AccountModel: Model<AccountDocument> =
  (models.Account as Model<AccountDocument> | undefined) ?? model<AccountDocument>("Account", accountSchema);
