import type { ParsedAccountFormValues } from "@/features/accounts/schemas/account-schema";
import type { CreateAccountInput } from "@/features/accounts/types/account";

function normalizeOptionalValue(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

export function normalizeAccountFormValues(values: ParsedAccountFormValues): CreateAccountInput {
  return {
    name: values.name.trim(),
    type: values.type,
    initialBalance: Math.round(values.initialBalance * 100),
    isActive: values.isActive,
    color: normalizeOptionalValue(values.color),
    icon: normalizeOptionalValue(values.icon)
  };
}
