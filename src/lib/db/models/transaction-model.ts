import { type HydratedDocument, type Model, Schema, type Types, model, models } from "mongoose";

import {
  transactionStatusValues,
  transactionTypeValues,
  type TransactionStatus,
  type TransactionType
} from "@/features/transactions/types/transaction";

type TransactionInstallmentDocument = {
  current: number;
  total: number;
};

export type TransactionDocument = {
  description: string;
  amount: number;
  type: TransactionType;
  date: Date;
  competencyMonth: string;
  categoryId?: Types.ObjectId;
  accountId: Types.ObjectId;
  destinationAccountId?: Types.ObjectId;
  notes?: string;
  status: TransactionStatus;
  isRecurring: boolean;
  installment?: TransactionInstallmentDocument;
  parentTransactionId?: Types.ObjectId;
};

const installmentSchema = new Schema<TransactionInstallmentDocument>(
  {
    current: {
      type: Number,
      required: true,
      min: 1
    },
    total: {
      type: Number,
      required: true,
      min: 1
    }
  },
  {
    _id: false
  }
);

const validStatusByTransactionType: Record<TransactionType, readonly TransactionStatus[]> = {
  income: ["planned", "received", "overdue"],
  expense: ["planned", "paid", "overdue"],
  transfer: ["planned", "paid", "overdue"]
};

const transactionSchema = new Schema<TransactionDocument>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    type: {
      type: String,
      enum: transactionTypeValues,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    competencyMonth: {
      type: String,
      required: true,
      match: /^\d{4}-(0[1-9]|1[0-2])$/
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category"
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true
    },
    destinationAccountId: {
      type: Schema.Types.ObjectId,
      ref: "Account"
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    },
    status: {
      type: String,
      enum: transactionStatusValues,
      required: true
    },
    isRecurring: {
      type: Boolean,
      required: true,
      default: false
    },
    installment: {
      type: installmentSchema
    },
    parentTransactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction"
    }
  },
  {
    collection: "transactions",
    versionKey: false
  }
);

transactionSchema.pre("validate", function validateTransaction(next) {
  const transaction = this as HydratedDocument<TransactionDocument>;

  if (transaction.installment && transaction.installment.current > transaction.installment.total) {
    transaction.invalidate("installment.current", "Installment current value cannot exceed total.");
  }

  if (transaction.installment && transaction.installment.total > 1 && !transaction.parentTransactionId) {
    transaction.invalidate("parentTransactionId", "Installment transactions must define a series parent.");
  }

  if (transaction.type === "transfer") {
    if (!transaction.destinationAccountId) {
      transaction.invalidate("destinationAccountId", "Transfers require a destination account.");
    }

    if (
      transaction.destinationAccountId &&
      transaction.accountId &&
      transaction.destinationAccountId.equals(transaction.accountId)
    ) {
      transaction.invalidate("destinationAccountId", "Transfer destination account must be different from the source account.");
    }
  } else {
    if (!transaction.categoryId) {
      transaction.invalidate("categoryId", "Income and expense transactions require a category.");
    }

    if (transaction.destinationAccountId) {
      transaction.invalidate("destinationAccountId", "Only transfers may define a destination account.");
    }
  }

  if (!validStatusByTransactionType[transaction.type].includes(transaction.status)) {
    transaction.invalidate("status", `Status "${transaction.status}" is not valid for transaction type "${transaction.type}".`);
  }

  next();
});

transactionSchema.index({
  competencyMonth: 1,
  date: -1
});

transactionSchema.index({
  accountId: 1,
  date: -1
});

transactionSchema.index(
  {
    destinationAccountId: 1,
    date: -1
  },
  {
    partialFilterExpression: {
      destinationAccountId: {
        $exists: true
      }
    }
  }
);

transactionSchema.index(
  {
    categoryId: 1,
    competencyMonth: 1
  },
  {
    partialFilterExpression: {
      categoryId: {
        $exists: true
      }
    }
  }
);

transactionSchema.index({
  type: 1,
  status: 1,
  date: -1
});

transactionSchema.index(
  {
    parentTransactionId: 1
  },
  {
    partialFilterExpression: {
      parentTransactionId: {
        $exists: true
      }
    }
  }
);

export const TransactionModel: Model<TransactionDocument> =
  (models.Transaction as Model<TransactionDocument> | undefined) ??
  model<TransactionDocument>("Transaction", transactionSchema);
