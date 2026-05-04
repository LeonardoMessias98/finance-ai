import { z } from "zod";

import { objectIdStringSchema } from "@/lib/db/object-id";

export const familyNameSchema = z
  .string()
  .trim()
  .min(1, "Informe o nome da família.")
  .max(80, "Use no máximo 80 caracteres.");

export const createFamilySchema = z.object({
  name: familyNameSchema,
  ownerUserId: objectIdStringSchema
});

export const createFamilyFormSchema = z.object({
  name: familyNameSchema
});

export const addFamilyMemberSchema = z.object({
  familyId: objectIdStringSchema,
  requesterUserId: objectIdStringSchema,
  memberUserId: objectIdStringSchema
});

export const addFamilyMemberFormSchema = z.object({
  familyId: objectIdStringSchema,
  memberUserId: objectIdStringSchema
});

export type CreateFamilyFormValues = z.input<typeof createFamilyFormSchema>;
export type ParsedCreateFamilyFormValues = z.output<typeof createFamilyFormSchema>;
export type AddFamilyMemberFormValues = z.input<typeof addFamilyMemberFormSchema>;
export type ParsedAddFamilyMemberFormValues = z.output<typeof addFamilyMemberFormSchema>;
