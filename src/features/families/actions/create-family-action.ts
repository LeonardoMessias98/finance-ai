"use server";

import { revalidatePath } from "next/cache";

import {
  createFamilyFormSchema,
  type CreateFamilyFormValues
} from "@/features/families/schemas/family-schema";
import { createFamily } from "@/features/families/services/create-family-service";
import type { FamilyActionResult } from "@/features/families/types/family";

export async function createFamilyAction(values: CreateFamilyFormValues): Promise<FamilyActionResult> {
  const parsedValues = createFamilyFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return {
      status: "error",
      message: "Revise os campos da família e tente novamente.",
      fieldErrors: parsedValues.error.flatten().fieldErrors
    };
  }

  try {
    await createFamily(parsedValues.data);
    revalidatePath("/families");

    return {
      status: "success",
      message: "Família criada com sucesso."
    };
  } catch (error) {
    console.error("Failed to create family.", error);

    return {
      status: "error",
      message: "Não foi possível criar a família agora."
    };
  }
}
