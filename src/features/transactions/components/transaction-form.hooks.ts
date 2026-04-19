"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createTransactionAction } from "@/features/transactions/actions/create-transaction-action";
import { updateTransactionAction } from "@/features/transactions/actions/update-transaction-action";
import {
  focusTransactionAmountField,
  getAutoDerivedCompetencyMonth,
  getAvailableTransactionAccounts,
  getAvailableTransactionCategories,
  resetTransactionFormState,
  syncTransactionFormAccount,
  syncTransactionFormCategory
} from "@/features/transactions/components/transaction-form.helpers";
import type { TransactionFormProps } from "@/features/transactions/components/transaction-form.types";
import { transactionFormSchema, type TransactionFormValues } from "@/features/transactions/schemas/transaction-schema";
import { getDefaultTransactionStatus, getTransactionStatusOptions } from "@/features/transactions/utils/transaction-formatters";
import { getDefaultTransactionFormValues } from "@/features/transactions/utils/transaction-form-defaults";
import { getCompetencyMonthFromDateInput } from "@/lib/dates/competency-month";
import { applyFormActionFieldErrors, type FormActionFeedback } from "@/lib/forms/form-action-feedback";

export function useTransactionFormController({
  transaction,
  accounts,
  categories,
  defaultType,
  defaultCompetencyMonth,
  closeOnSuccess = false,
  onSuccess,
  returnHref
}: TransactionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<FormActionFeedback | null>(null);
  const defaultValues = useMemo(
    () => getDefaultTransactionFormValues({ transaction, accounts, defaultType, defaultCompetencyMonth }),
    [accounts, defaultCompetencyMonth, defaultType, transaction]
  );
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues
  });
  const autoDerivedCompetencyMonthRef = useRef<string | undefined>(undefined);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const isEditing = Boolean(transaction);
  const isInstallmentSeries = Boolean(transaction?.installment && transaction.installment.total > 1);
  const transactionType = form.watch("type");
  const transactionDate = form.watch("date");
  const competencyMonth = form.watch("competencyMonth");
  const availableAccounts = useMemo(
    () => getAvailableTransactionAccounts(accounts, transaction?.accountId),
    [accounts, transaction?.accountId]
  );
  const availableCategories = useMemo(
    () => getAvailableTransactionCategories(categories, transaction?.categoryId),
    [categories, transaction?.categoryId]
  );
  const categoryOptions = useMemo(
    () => availableCategories.filter((category) => category.type === transactionType),
    [availableCategories, transactionType]
  );
  const statusOptions = getTransactionStatusOptions(transactionType);
  const isSubmitBlocked = isInstallmentSeries || availableAccounts.length === 0 || categoryOptions.length === 0;

  useEffect(() => {
    resetTransactionFormState({ form, defaultValues, autoDerivedCompetencyMonthRef, setShowAdvancedFields });
  }, [defaultValues, form]);

  useEffect(() => {
    if (isEditing) {
      return;
    }

    focusTransactionAmountField(form);
  }, [defaultValues, form, isEditing]);

  useEffect(() => {
    const currentStatus = form.getValues("status");
    if (!statusOptions.includes(currentStatus)) {
      form.setValue("status", getDefaultTransactionStatus(transactionType), { shouldValidate: true });
    }
  }, [form, statusOptions, transactionType]);

  useEffect(() => {
    if (transactionType !== "expense" && form.getValues("installmentCount") !== 1) {
      form.setValue("installmentCount", 1, { shouldValidate: true });
    }
  }, [form, transactionType]);

  useEffect(() => {
    const derivedCompetencyMonth = getCompetencyMonthFromDateInput(transactionDate);
    if (!derivedCompetencyMonth) {
      return;
    }
    if (competencyMonth === derivedCompetencyMonth) {
      autoDerivedCompetencyMonthRef.current = derivedCompetencyMonth;
      return;
    }
    if (!competencyMonth || competencyMonth === autoDerivedCompetencyMonthRef.current) {
      autoDerivedCompetencyMonthRef.current = derivedCompetencyMonth;
      form.setValue("competencyMonth", derivedCompetencyMonth, {
        shouldDirty: Boolean(competencyMonth),
        shouldValidate: true
      });
    }
  }, [competencyMonth, form, transactionDate]);

  useEffect(() => {
    syncTransactionFormAccount(form, availableAccounts);
  }, [availableAccounts, form]);

  useEffect(() => {
    syncTransactionFormCategory(form, categoryOptions);
  }, [categoryOptions, form]);

  useEffect(() => {
    if (form.formState.errors.competencyMonth || form.formState.errors.installmentCount || form.formState.errors.notes || form.formState.errors.status) {
      setShowAdvancedFields(true);
    }
  }, [
    form.formState.errors.competencyMonth,
    form.formState.errors.installmentCount,
    form.formState.errors.notes,
    form.formState.errors.status
  ]);

  const resetForm = () => {
    setFeedback(null);
    resetTransactionFormState({ form, defaultValues, autoDerivedCompetencyMonthRef, setShowAdvancedFields });
    focusTransactionAmountField(form);
  };

  const handleSubmit = form.handleSubmit((values) => {
    setFeedback(null);
    form.clearErrors();
    startTransition(async () => {
      const result =
        isEditing && transaction
          ? await updateTransactionAction({ transactionId: transaction.id, values })
          : await createTransactionAction(values);
      if (result.status === "error") {
        setFeedback({ status: "error", message: result.message });
        applyFormActionFieldErrors(form, result);
        return;
      }
      setFeedback({ status: "success", message: result.message });
      if (isEditing || closeOnSuccess) {
        if (onSuccess) {
          onSuccess();
        } else if (returnHref) {
          router.replace(returnHref);
        }
        router.refresh();
        return;
      }
      resetForm();
      autoDerivedCompetencyMonthRef.current = getAutoDerivedCompetencyMonth(
        defaultValues.date,
        defaultValues.competencyMonth
      );
      router.refresh();
    });
  });

  return {
    form,
    feedback,
    handleSubmit,
    isEditing,
    isInstallmentSeries,
    isPending,
    isSubmitBlocked,
    availableAccounts,
    categoryOptions,
    resetForm,
    setShowAdvancedFields,
    showAdvancedFields,
    statusOptions,
    transactionType
  };
}
