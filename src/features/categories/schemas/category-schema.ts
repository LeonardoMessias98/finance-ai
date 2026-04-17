import { z } from "zod";

import { objectIdStringSchema } from "@/lib/db/object-id";
import { categoryTypeValues } from "@/features/categories/types/category";

function emptyStringToUndefined(value: unknown) {
  return typeof value === "string" && value.trim().length === 0 ? undefined : value;
}

const categoryColorSchema = z
  .string()
  .trim()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Informe uma cor hexadecimal válida.");

const categoryIconSchema = z.string().trim().min(1).max(40);

const optionalCategoryColorSchema = z.preprocess(emptyStringToUndefined, categoryColorSchema.optional());
const optionalCategoryIconSchema = z.preprocess(emptyStringToUndefined, categoryIconSchema.optional());

const categoryMutationFieldsSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da categoria.").max(80, "Use no máximo 80 caracteres."),
  type: z.enum(categoryTypeValues, {
    errorMap: () => ({
      message: "Selecione um tipo de categoria válido."
    })
  }),
  isActive: z.boolean().default(true),
  color: optionalCategoryColorSchema,
  icon: optionalCategoryIconSchema
});

export const createCategorySchema = categoryMutationFieldsSchema;

export const updateCategorySchema = categoryMutationFieldsSchema.extend({
  id: objectIdStringSchema
});

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da categoria.").max(80, "Use no máximo 80 caracteres."),
  type: z.enum(categoryTypeValues, {
    errorMap: () => ({
      message: "Selecione um tipo de categoria válido."
    })
  }),
  isActive: z.boolean().default(true),
  color: optionalCategoryColorSchema,
  icon: optionalCategoryIconSchema
});

export const toggleCategoryStatusSchema = z.object({
  categoryId: objectIdStringSchema,
  isActive: z.boolean()
});

export const categorySchema = createCategorySchema.extend({
  id: z.string()
});

export type CategoryFormValues = z.input<typeof categoryFormSchema>;
export type ParsedCategoryFormValues = z.output<typeof categoryFormSchema>;
