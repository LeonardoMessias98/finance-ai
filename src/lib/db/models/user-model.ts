import { type Model, Schema, model, models } from "mongoose";

export type UserDocument = {
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  passwordHash: string;
  lastLoginIp?: string;
  lastLoginLocation?: string;
  activeSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserDocument>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    birthDate: {
      type: Date,
      required: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160
    },
    passwordHash: {
      type: String,
      required: true,
      trim: true,
      minlength: 64,
      maxlength: 64
    },
    lastLoginIp: {
      type: String,
      trim: true,
      maxlength: 120
    },
    lastLoginLocation: {
      type: String,
      trim: true,
      maxlength: 160
    },
    activeSessionId: {
      type: String,
      trim: true,
      maxlength: 120
    }
  },
  {
    collection: "users",
    versionKey: false,
    timestamps: true
  }
);

userSchema.index(
  {
    email: 1
  },
  {
    unique: true,
    collation: {
      locale: "en",
      strength: 2
    }
  }
);

export const UserModel: Model<UserDocument> =
  (models.User as Model<UserDocument> | undefined) ?? model<UserDocument>("User", userSchema);
