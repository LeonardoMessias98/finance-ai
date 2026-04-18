export const accountTypeValues = ["checking", "savings", "cash", "credit_card", "investment"] as const;

export type AccountType = (typeof accountTypeValues)[number];
export type AccountFieldName = "name" | "type" | "initialBalance" | "isActive" | "color" | "icon";

// Monetary values use the smallest currency unit, such as cents.
export type Account = {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  initialBalance: number;
  isActive: boolean;
  color?: string;
  icon?: string;
};

export type CreateAccountInput = {
  userId: string;
  name: string;
  type: AccountType;
  initialBalance: number;
  isActive: boolean;
  color?: string;
  icon?: string;
};

export type UpdateAccountInput = CreateAccountInput & {
  id: string;
};

export type AccountFilters = {
  userId: string;
  type?: AccountType;
  isActive?: boolean;
};

export type ToggleAccountStatusInput = {
  accountId: string;
  isActive: boolean;
};

export type AccountActionResult =
  | {
      status: "success";
      message: string;
    }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<AccountFieldName, string[]>>;
    };
