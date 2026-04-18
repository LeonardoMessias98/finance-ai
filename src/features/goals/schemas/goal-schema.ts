import { z } from "zod";

import { objectIdStringSchema } from "@/lib/db/object-id";

const dateInputRegex = /^\d{4}-\d{2}-\d{2}$/;

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

const goalMutationFieldsSchema = z.object({
  userId: objectIdStringSchema,
  name: z.string().trim().min(1, "Informe o nome da meta.").max(80, "Use no máximo 80 caracteres."),
  targetAmount: z.number().int().positive(),
  currentAmount: z.number().int().min(0).default(0),
  targetDate: z.date().optional()
});

export const createGoalSchema = goalMutationFieldsSchema.transform((value) => ({
  ...value,
  isCompleted: value.currentAmount >= value.targetAmount
}));

export const updateGoalSchema = goalMutationFieldsSchema
  .extend({
    id: objectIdStringSchema
  })
  .transform((value) => ({
    ...value,
    isCompleted: value.currentAmount >= value.targetAmount
  }));

export const goalFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da meta.").max(80, "Use no máximo 80 caracteres."),
  targetAmount: z
    .number({
      invalid_type_error: "Informe um valor alvo válido."
    })
    .positive("O valor alvo deve ser maior que zero.")
    .max(9_999_999, "Use um valor menor que 9.999.999,00."),
  currentAmount: z
    .number({
      invalid_type_error: "Informe um valor acumulado válido."
    })
    .min(0, "O valor acumulado não pode ser negativo.")
    .max(9_999_999, "Use um valor menor que 9.999.999,00."),
  targetDate: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || dateInputRegex.test(value), "Informe a data no formato YYYY-MM-DD.")
    .refine((value) => value.length === 0 || isValidDateInput(value), "Informe uma data válida.")
});

export const goalSchema = goalMutationFieldsSchema.extend({
  isCompleted: z.boolean(),
  id: z.string()
});

export type GoalFormValues = {
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
};

export type ParsedGoalFormValues = z.output<typeof goalFormSchema>;
