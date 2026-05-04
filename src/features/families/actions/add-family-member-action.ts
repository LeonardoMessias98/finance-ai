"use server";

import { revalidatePath } from "next/cache";

import {
  addFamilyMemberFormSchema,
  type AddFamilyMemberFormValues
} from "@/features/families/schemas/family-schema";
import {
  FamilyBusinessError
} from "@/features/families/services/family-errors";
import { addFamilyMember } from "@/features/families/services/add-family-member-service";
import type { FamilyActionResult } from "@/features/families/types/family";

export async function addFamilyMemberAction(values: AddFamilyMemberFormValues): Promise<FamilyActionResult> {
  const parsedValues = addFamilyMemberFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return {
      status: "error",
      message: "Revise os campos do membro e tente novamente.",
      fieldErrors: parsedValues.error.flatten().fieldErrors
    };
  }

  try {
    await addFamilyMember(parsedValues.data);
    revalidatePath("/families");

    return {
      status: "success",
      message: "Membro adicionado com sucesso."
    };
  } catch (error) {
    if (error instanceof FamilyBusinessError) {
      return {
        status: "error",
        message: error.message,
        fieldErrors: error.fieldErrors
      };
    }

    console.error("Failed to add family member.", error);

    return {
      status: "error",
      message: "Não foi possível adicionar o membro agora."
    };
  }
}
