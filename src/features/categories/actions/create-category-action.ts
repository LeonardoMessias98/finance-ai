"use server";

import { revalidatePath } from "next/cache";

import { categoryFormSchema, type CategoryFormValues } from "@/features/categories/schemas/category-schema";
import { DuplicateCategoryError } from "@/features/categories/services/category-errors";
import { createCategory } from "@/features/categories/services/create-category-service";
import type { CategoryActionResult } from "@/features/categories/types/category";

export async function createCategoryAction(values: CategoryFormValues): Promise<CategoryActionResult> {
  const parsedValues = categoryFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return {
      status: "error",
      message: "Revise os campos da categoria e tente novamente.",
      fieldErrors: parsedValues.error.flatten().fieldErrors
    };
  }

  try {
    await createCategory(parsedValues.data);
    revalidatePath("/categories");

    return {
      status: "success",
      message: "Categoria criada com sucesso."
    };
  } catch (error) {
    if (error instanceof DuplicateCategoryError) {
      return {
        status: "error",
        message: error.message,
        fieldErrors: {
          name: [error.message]
        }
      };
    }

    console.error("Failed to create category.", error);

    return {
      status: "error",
      message: "Não foi possível criar a categoria agora."
    };
  }
}
