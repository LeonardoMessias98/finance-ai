"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { objectIdStringSchema } from "@/lib/db/object-id";
import { categoryFormSchema, type CategoryFormValues } from "@/features/categories/schemas/category-schema";
import { DuplicateCategoryError } from "@/features/categories/services/category-errors";
import { updateCategory } from "@/features/categories/services/update-category-service";
import type { CategoryActionResult } from "@/features/categories/types/category";

const updateCategoryActionSchema = z.object({
  categoryId: objectIdStringSchema
});

export async function updateCategoryAction(input: {
  categoryId: string;
  values: CategoryFormValues;
}): Promise<CategoryActionResult> {
  const parsedCategoryId = updateCategoryActionSchema.safeParse({
    categoryId: input.categoryId
  });

  if (!parsedCategoryId.success) {
    return {
      status: "error",
      message: "Categoria inválida para edição."
    };
  }

  const parsedValues = categoryFormSchema.safeParse(input.values);

  if (!parsedValues.success) {
    return {
      status: "error",
      message: "Revise os campos da categoria e tente novamente.",
      fieldErrors: parsedValues.error.flatten().fieldErrors
    };
  }

  try {
    const updatedCategory = await updateCategory(parsedCategoryId.data.categoryId, parsedValues.data);

    if (!updatedCategory) {
      return {
        status: "error",
        message: "Categoria não encontrada para edição."
      };
    }

    revalidatePath("/categories");

    return {
      status: "success",
      message: "Categoria atualizada com sucesso."
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

    console.error("Failed to update category.", error);

    return {
      status: "error",
      message: "Não foi possível atualizar a categoria agora."
    };
  }
}
