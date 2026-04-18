import { z } from "zod";

import { competencyMonthRegex } from "@/lib/dates/competency-month";
import { objectIdStringSchema } from "@/lib/db/object-id";

function normalizeAlertThresholds(values?: number[]): number[] | undefined {
  if (!values || values.length === 0) {
    return undefined;
  }

  return [...values].sort((left, right) => left - right);
}

const alertThresholdsSchema = z
  .array(z.number().int().min(1).max(100))
  .refine((values) => new Set(values).size === values.length, {
    message: "Alert thresholds must be unique."
  })
  .optional();

export const createBudgetSchema = z.object({
  userId: objectIdStringSchema,
  competencyMonth: z.string().regex(competencyMonthRegex, "Competency month must be formatted as YYYY-MM."),
  categoryId: objectIdStringSchema,
  limitAmount: z.number().int().positive(),
  alertThresholds: alertThresholdsSchema.transform(normalizeAlertThresholds)
});

export const updateBudgetSchema = createBudgetSchema.extend({
  id: objectIdStringSchema
});

export const budgetFormSchema = z.object({
  competencyMonth: z.string().regex(competencyMonthRegex, "Informe a competência no formato YYYY-MM."),
  categoryId: objectIdStringSchema,
  limitAmount: z
    .number({
      invalid_type_error: "Informe um limite mensal válido."
    })
    .positive("O limite deve ser maior que zero.")
    .max(9_999_999, "Use um valor menor que 9.999.999,00.")
});

export const budgetSchema = createBudgetSchema.extend({
  id: z.string()
});

export type BudgetFormValues = {
  competencyMonth: string;
  categoryId: string;
  limitAmount: number;
};

export type ParsedBudgetFormValues = z.output<typeof budgetFormSchema>;
