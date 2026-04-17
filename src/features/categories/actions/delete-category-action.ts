"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { CategoryHasTransactionsError } from "@/features/categories/services/category-errors";
import { deleteCategory } from "@/features/categories/services/delete-category-service";
import type { CategoryActionResult } from "@/features/categories/types/category";
import { objectIdStringSchema } from "@/lib/db/object-id";

const deleteCategoryActionSchema = z.object({
  categoryId: objectIdStringSchema
});

export async function deleteCategoryAction(input: { categoryId: string }): Promise<CategoryActionResult> {
  const parsedInput = deleteCategoryActionSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      status: "error",
      message: "Categoria inválida para exclusão."
    };
  }

  try {
    const deletedCategory = await deleteCategory(parsedInput.data.categoryId);

    if (!deletedCategory) {
      return {
        status: "error",
        message: "Categoria não encontrada para exclusão."
      };
    }

    revalidatePath("/categories");

    return {
      status: "success",
      message: "Categoria excluída com sucesso."
    };
  } catch (error) {
    if (error instanceof CategoryHasTransactionsError) {
      return {
        status: "error",
        message: error.message
      };
    }

    console.error("Failed to delete category.", error);

    return {
      status: "error",
      message: "Não foi possível excluir a categoria agora."
    };
  }
}
