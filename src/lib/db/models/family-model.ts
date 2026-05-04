import { type Model, Schema, type Types, model, models } from "mongoose";

import { familyMemberRoleValues, type FamilyMemberRole } from "@/features/families/types/family";

type FamilyMemberDocument = {
  userId: Types.ObjectId;
  role: FamilyMemberRole;
  canView: boolean;
};

export type FamilyDocument = {
  name: string;
  ownerUserId: Types.ObjectId;
  members: FamilyMemberDocument[];
  createdAt: Date;
  updatedAt: Date;
};

const familyMemberSchema = new Schema<FamilyMemberDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String,
      enum: familyMemberRoleValues,
      required: true
    },
    canView: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  {
    _id: false
  }
);

const familySchema = new Schema<FamilyDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    ownerUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    members: {
      type: [familyMemberSchema],
      required: true,
      default: []
    }
  },
  {
    collection: "families",
    versionKey: false,
    timestamps: true
  }
);

familySchema.index({
  ownerUserId: 1,
  name: 1
});

familySchema.index({
  "members.userId": 1
});

export const FamilyModel: Model<FamilyDocument> =
  (models.Family as Model<FamilyDocument> | undefined) ?? model<FamilyDocument>("Family", familySchema);
