import { type Model, Schema, type Types, model, models } from "mongoose";

export type RefreshTokenDocument = {
  userId: Types.ObjectId;
  sessionId: string;
  tokenHash: string;
  ip: string;
  location?: string;
  userAgent: string;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const refreshTokenSchema = new Schema<RefreshTokenDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    sessionId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    tokenHash: {
      type: String,
      required: true,
      trim: true,
      minlength: 64,
      maxlength: 64
    },
    ip: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    location: {
      type: String,
      trim: true,
      maxlength: 160
    },
    userAgent: {
      type: String,
      required: true,
      trim: true,
      maxlength: 400
    },
    expiresAt: {
      type: Date,
      required: true
    },
    revokedAt: {
      type: Date
    }
  },
  {
    collection: "refresh_tokens",
    versionKey: false,
    timestamps: true
  }
);

refreshTokenSchema.index(
  {
    expiresAt: 1
  },
  {
    expireAfterSeconds: 0
  }
);

refreshTokenSchema.index({
  userId: 1
});

refreshTokenSchema.index({
  tokenHash: 1
});

refreshTokenSchema.index({
  userId: 1,
  sessionId: 1,
  revokedAt: 1
});

refreshTokenSchema.index({
  userId: 1,
  expiresAt: -1
});

export const RefreshTokenModel: Model<RefreshTokenDocument> =
  (models.RefreshToken as Model<RefreshTokenDocument> | undefined) ??
  model<RefreshTokenDocument>("RefreshToken", refreshTokenSchema);
