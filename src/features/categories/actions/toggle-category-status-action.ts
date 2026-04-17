"use server";

import { revalidatePath } from "next/cache";

import { toggleCategoryStatusSchema } from "@/features/categories/schemas/category-schema";
import { toggleCategoryStatus } from "@/features/categories/services/toggle-category-status-service";
import type { CategoryActionResult } from "@/features/categories/types/category";

export async function toggleCategoryStatusAction(input: {
  categoryId: string;
  isActive: boolean;
}): Promise<CategoryActionResult> {
  const parsedInput = toggleCategoryStatusSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      status: "error",
      message: "Não foi possível alterar o status da categoria."
    };
  }

  try {
    const updatedCategory = await toggleCategoryStatus(parsedInput.data.categoryId, parsedInput.data.isActive);

    if (!updatedCategory) {
      return {
        status: "error",
        message: "Categoria não encontrada para atualização."
      };
    }

    revalidatePath("/categories");

    return {
      status: "success",
      message: parsedInput.data.isActive ? "Categoria ativada com sucesso." : "Categoria desativada com sucesso."
    };
  } catch (error) {
    console.error("Failed to toggle category status.", error);

    return {
      status: "error",
      message: "Não foi possível alterar o status da categoria agora."
    };
  }
}
