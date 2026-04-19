export const categoryTypeValues = ["income", "expense"] as const;

export type CategoryType = (typeof categoryTypeValues)[number];
export type CategoryFieldName = "name" | "type" | "isActive" | "color" | "icon";

export type Category = {
  id: string;
  userId: string;
  name: string;
  type: CategoryType;
  isActive: boolean;
  color?: string;
  icon?: string;
};

export type CreateCategoryInput = {
  userId: string;
  name: string;
  type: CategoryType;
  isActive: boolean;
  color?: string;
  icon?: string;
};

export type UpdateCategoryInput = CreateCategoryInput & {
  id: string;
};

export type CategoryFilters = {
  userId: string;
  type?: CategoryType;
  isActive?: boolean;
};

export type ToggleCategoryStatusInput = {
  categoryId: string;
  isActive: boolean;
};

export type CategoryActionResult =
  | {
      status: "success";
      message: string;
    }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<CategoryFieldName, string[]>>;
    };
