import { z } from "zod";

import { objectIdStringSchema } from "@/lib/db/object-id";
import { accountMutationTypeValues, accountTypeValues } from "@/features/accounts/types/account";

function emptyStringToUndefined(value: unknown) {
  return typeof value === "string" && value.trim().length === 0 ? undefined : value;
}

const accountColorSchema = z
  .string()
  .trim()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Informe uma cor hexadecimal válida.");

const accountIconSchema = z.string().trim().min(1).max(40);

const optionalAccountColorSchema = z.preprocess(emptyStringToUndefined, accountColorSchema.optional());
const optionalAccountIconSchema = z.preprocess(emptyStringToUndefined, accountIconSchema.optional());
const accountMutationTypeSchema = z.enum(accountMutationTypeValues, {
  errorMap: () => ({
    message: "Selecione Débito ou Crédito."
  })
});

const accountInitialBalanceSchema = z
  .number({
    invalid_type_error: "Informe um saldo inicial válido."
  })
  .min(-999_999_999, "Use um valor maior que -9.999.999,99.")
  .max(999_999_999, "Use um valor menor que 9.999.999,99.");

function enforceCreditInitialBalance(payload: { type: string; initialBalance: number }, context: z.RefinementCtx) {
  if (payload.type === "credit" && payload.initialBalance !== 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["initialBalance"],
      message: "Conta de crédito deve ter saldo inicial zero."
    });
  }
}

const accountMutationFieldsSchema = z.object({
  userId: objectIdStringSchema,
  name: z.string().trim().min(1, "Informe o nome da conta.").max(80, "Use no máximo 80 caracteres."),
  type: accountMutationTypeSchema,
  initialBalance: z.number().int(),
  isActive: z.boolean().default(true),
  color: optionalAccountColorSchema,
  icon: optionalAccountIconSchema
});

export const createAccountSchema = accountMutationFieldsSchema.superRefine(enforceCreditInitialBalance);

export const updateAccountSchema = accountMutationFieldsSchema
  .extend({
    id: objectIdStringSchema
  })
  .superRefine(enforceCreditInitialBalance);

export const accountFormSchema = z
  .object({
    name: z.string().trim().min(1, "Informe o nome da conta.").max(80, "Use no máximo 80 caracteres."),
    type: accountMutationTypeSchema,
    initialBalance: accountInitialBalanceSchema,
    isActive: z.boolean().default(true),
    color: optionalAccountColorSchema,
    icon: optionalAccountIconSchema
  })
  .superRefine(enforceCreditInitialBalance);

export const toggleAccountStatusSchema = z.object({
  accountId: objectIdStringSchema,
  isActive: z.boolean()
});

export const accountSchema = z.object({
  id: z.string(),
  userId: objectIdStringSchema,
  name: z.string().trim().min(1).max(80),
  type: z.enum(accountTypeValues),
  initialBalance: z.number().int(),
  isActive: z.boolean(),
  color: optionalAccountColorSchema,
  icon: optionalAccountIconSchema
});

export type AccountFormValues = z.input<typeof accountFormSchema>;
export type ParsedAccountFormValues = z.output<typeof accountFormSchema>;
