import { z } from "zod";

import { competencyMonthRegex } from "@/lib/dates/competency-month";
import { objectIdStringSchema } from "@/lib/db/object-id";
import {
  transactionStatusValues,
  transactionTypeValues,
  type TransactionStatus,
  type TransactionType
} from "@/features/transactions/types/transaction";

const dateInputRegex = /^\d{4}-\d{2}-\d{2}$/;

function isValidOptionalObjectId(value: string): boolean {
  const trimmedValue = value.trim();

  return trimmedValue.length === 0 || objectIdStringSchema.safeParse(trimmedValue).success;
}

function isValidDateInput(value: string): boolean {
  if (!dateInputRegex.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day, 12));

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  );
}

const installmentSchema = z
  .object({
    current: z.number().int().min(1),
    total: z.number().int().min(1)
  })
  .refine((value) => value.current <= value.total, {
    message: "A parcela atual não pode ser maior que o total.",
    path: ["current"]
  });

const transactionFieldsSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Informe a descrição da transação.")
    .max(120, "Use no máximo 120 caracteres."),
  amount: z.number().int().positive(),
  type: z.enum(transactionTypeValues, {
    errorMap: () => ({
      message: "Selecione um tipo de transação válido."
    })
  }),
  date: z.date({
    invalid_type_error: "Informe uma data válida."
  }),
  competencyMonth: z.string().regex(competencyMonthRegex, "Informe a competência no formato YYYY-MM."),
  categoryId: objectIdStringSchema.optional(),
  accountId: objectIdStringSchema,
  destinationAccountId: objectIdStringSchema.optional(),
  notes: z.string().trim().max(500, "Use no máximo 500 caracteres nas observações.").optional(),
  status: z.enum(transactionStatusValues, {
    errorMap: () => ({
      message: "Selecione um status válido."
    })
  }),
  isRecurring: z.boolean().default(false),
  installment: installmentSchema.optional(),
  parentTransactionId: objectIdStringSchema.optional()
});

export const statusByTransactionType: Record<TransactionType, readonly TransactionStatus[]> = {
  income: ["planned", "received", "overdue"],
  expense: ["planned", "paid", "overdue"],
  transfer: ["planned", "paid", "overdue"]
};

function validateTransactionRules(
  value: {
    type: TransactionType;
    status: TransactionStatus;
    categoryId?: string;
    accountId: string;
    destinationAccountId?: string;
    installment?: {
      current: number;
      total: number;
    };
    parentTransactionId?: string;
  },
  context: z.RefinementCtx
) {
  const allowedStatuses = statusByTransactionType[value.type];

  if (!allowedStatuses.includes(value.status)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["status"],
      message: `O status "${value.status}" não é válido para o tipo "${value.type}".`
    });
  }

  if (value.type === "transfer") {
    if (!value.destinationAccountId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["destinationAccountId"],
        message: "Transferências exigem uma conta de destino."
      });
    }

    if (value.destinationAccountId && value.destinationAccountId === value.accountId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["destinationAccountId"],
        message: "A conta de destino deve ser diferente da conta de origem."
      });
    }
  } else {
    if (!value.categoryId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["categoryId"],
        message: "Receitas e despesas exigem uma categoria."
      });
    }

    if (value.destinationAccountId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["destinationAccountId"],
        message: "Apenas transferências podem definir conta de destino."
      });
    }
  }

  if (value.installment && value.installment.total > 1) {
    if (value.type !== "expense") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["type"],
        message: "A criação parcelada está disponível apenas para despesas."
      });
    }

    if (!value.parentTransactionId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["parentTransactionId"],
        message: "Transações parceladas precisam manter o vínculo da série."
      });
    }
  }
}

export const createTransactionSchema = transactionFieldsSchema.superRefine(validateTransactionRules);

export const updateTransactionSchema = transactionFieldsSchema
  .extend({
    id: objectIdStringSchema
  })
  .superRefine(validateTransactionRules);

export const transactionFormSchema = z
  .object({
    description: z
      .string()
      .trim()
      .min(1, "Informe a descrição da transação.")
      .max(120, "Use no máximo 120 caracteres."),
    amount: z
      .number({
        invalid_type_error: "Informe um valor válido."
      })
      .positive("O valor deve ser maior que zero.")
      .max(9_999_999, "Use um valor menor que 9.999.999,00."),
    type: z.enum(transactionTypeValues, {
      errorMap: () => ({
        message: "Selecione um tipo de transação válido."
      })
    }),
    date: z
      .string()
      .trim()
      .regex(dateInputRegex, "Informe a data no formato YYYY-MM-DD.")
      .refine(isValidDateInput, "Informe uma data válida."),
    competencyMonth: z
      .string()
      .trim()
      .regex(competencyMonthRegex, "Informe a competência no formato YYYY-MM."),
    installmentCount: z
      .number({
        invalid_type_error: "Informe um número de parcelas válido."
      })
      .int("Informe um número inteiro de parcelas.")
      .min(1, "Use pelo menos 1 parcela.")
      .max(60, "Use no máximo 60 parcelas."),
    categoryId: z
      .string()
      .trim()
      .refine(isValidOptionalObjectId, "Selecione uma categoria válida."),
    accountId: objectIdStringSchema,
    destinationAccountId: z
      .string()
      .trim()
      .refine(isValidOptionalObjectId, "Selecione uma conta de destino válida."),
    notes: z.string().trim().max(500, "Use no máximo 500 caracteres nas observações."),
    status: z.enum(transactionStatusValues, {
      errorMap: () => ({
        message: "Selecione um status válido."
      })
    }),
    isRecurring: z.boolean()
  })
  .superRefine((value, context) => {
    validateTransactionRules(
      {
        type: value.type,
        status: value.status,
        categoryId: value.categoryId || undefined,
        accountId: value.accountId,
        destinationAccountId: value.destinationAccountId || undefined
      },
      context
    );

    if (value.installmentCount > 1 && value.type !== "expense") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["installmentCount"],
        message: "A criação parcelada está disponível apenas para despesas."
      });
    }
  });

export const transactionSchema = transactionFieldsSchema.extend({
  id: z.string()
});

export type TransactionFormValues = {
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  competencyMonth: string;
  installmentCount: number;
  categoryId: string;
  accountId: string;
  destinationAccountId: string;
  notes: string;
  status: TransactionStatus;
  isRecurring: boolean;
};

export type ParsedTransactionFormValues = z.output<typeof transactionFormSchema>;
