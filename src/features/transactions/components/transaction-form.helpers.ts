import type { MutableRefObject } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { Account } from "@/features/accounts/types/account";
import type { Category } from "@/features/categories/types/category";
import type { TransactionType } from "@/features/transactions/types/transaction";
import type { TransactionFormValues } from "@/features/transactions/schemas/transaction-schema";
import {
  getDefaultTransactionAccountId,
  shouldOpenAdvancedTransactionFields
} from "@/features/transactions/utils/transaction-form-defaults";
import { getCompetencyMonthFromDateInput } from "@/lib/dates/competency-month";

export const transactionTypeOptions: TransactionType[] = ["expense", "income"];

export function getAutoDerivedCompetencyMonth(date: string, competencyMonth: string): string | undefined {
  const derivedCompetencyMonth = getCompetencyMonthFromDateInput(date);

  return derivedCompetencyMonth && competencyMonth === derivedCompetencyMonth ? derivedCompetencyMonth : undefined;
}

export function getAvailableTransactionAccounts(accounts: Account[], selectedAccountId?: string): Account[] {
  return accounts.filter((account) => account.isActive || account.id === selectedAccountId);
}

export function getAvailableTransactionCategories(categories: Category[], selectedCategoryId?: string): Category[] {
  return categories.filter((category) => category.isActive || category.id === selectedCategoryId);
}

export function focusTransactionAmountField(form: UseFormReturn<TransactionFormValues>) {
  requestAnimationFrame(() => {
    form.setFocus("amount");
  });
}

export function resetTransactionFormState(input: {
  form: UseFormReturn<TransactionFormValues>;
  defaultValues: TransactionFormValues;
  autoDerivedCompetencyMonthRef: MutableRefObject<string | undefined>;
  setShowAdvancedFields: (value: boolean) => void;
}) {
  input.form.reset(input.defaultValues);
  input.setShowAdvancedFields(shouldOpenAdvancedTransactionFields(input.defaultValues));
  input.autoDerivedCompetencyMonthRef.current = getAutoDerivedCompetencyMonth(
    input.defaultValues.date,
    input.defaultValues.competencyMonth
  );
}

export function syncTransactionFormAccount(
  form: UseFormReturn<TransactionFormValues>,
  availableAccounts: Account[]
) {
  const currentAccountId = form.getValues("accountId");
  const nextAccountId = getDefaultTransactionAccountId(availableAccounts, currentAccountId);

  if (!nextAccountId || currentAccountId === nextAccountId) {
    return;
  }

  form.setValue("accountId", nextAccountId, {
    shouldDirty: Boolean(currentAccountId),
    shouldValidate: true
  });
}

export function syncTransactionFormCategory(
  form: UseFormReturn<TransactionFormValues>,
  categoryOptions: Category[]
) {
  const currentCategoryId = form.getValues("categoryId");
  const validCategoryIds = new Set(categoryOptions.map((category) => category.id));

  if (currentCategoryId && validCategoryIds.has(currentCategoryId)) {
    return;
  }

  const nextCategoryId = categoryOptions.length === 1 ? categoryOptions[0].id : "";

  if (currentCategoryId === nextCategoryId) {
    return;
  }

  form.setValue("categoryId", nextCategoryId, {
    shouldDirty: Boolean(currentCategoryId),
    shouldValidate: true
  });
}
