"use client";

import { FormCardShell } from "@/components/forms/form-card-shell";
import { FormFeedbackMessage } from "@/components/forms/form-feedback-message";
import {
  TransactionFormActions,
  TransactionFormAlerts
} from "@/features/transactions/components/transaction-form.actions";
import { TransactionAdvancedFields } from "@/features/transactions/components/transaction-form.advanced-fields";
import { useTransactionFormController } from "@/features/transactions/components/transaction-form.hooks";
import {
  transactionTypeOptions
} from "@/features/transactions/components/transaction-form.helpers";
import {
  TransactionPrimaryFields,
  TransactionTypeSelector
} from "@/features/transactions/components/transaction-form.primary-fields";
import type { TransactionFormProps } from "@/features/transactions/components/transaction-form.types";

export function TransactionForm({
  transaction,
  accounts,
  categories,
  returnHref,
  defaultType,
  defaultCompetencyMonth,
  closeOnSuccess = false,
  showCard = true,
  onCancel,
  onSuccess
}: TransactionFormProps) {
  const {
    availableAccounts,
    categoryOptions,
    feedback,
    form,
    handleSubmit,
    isEditing,
    isInstallmentSeries,
    isPending,
    isSubmitBlocked,
    resetForm,
    setShowAdvancedFields,
    showAdvancedFields,
    statusOptions,
    transactionType
  } = useTransactionFormController({
    transaction,
    accounts,
    categories,
    defaultType,
    defaultCompetencyMonth,
    closeOnSuccess,
    onSuccess,
    returnHref
  });

  const formContent = (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <input type="hidden" {...form.register("type")} />
      <TransactionTypeSelector
        form={form}
        isInstallmentSeries={isInstallmentSeries}
        isPending={isPending}
        transactionType={transactionType}
        transactionTypeOptions={transactionTypeOptions}
      />
      <TransactionPrimaryFields
        availableAccounts={availableAccounts}
        categoryOptions={categoryOptions}
        form={form}
        isInstallmentSeries={isInstallmentSeries}
        isPending={isPending}
      />
      <TransactionAdvancedFields
        form={form}
        isEditing={isEditing}
        isInstallmentSeries={isInstallmentSeries}
        isPending={isPending}
        setShowAdvancedFields={setShowAdvancedFields}
        showAdvancedFields={showAdvancedFields}
        statusOptions={statusOptions}
        transactionType={transactionType}
      />
      <TransactionFormAlerts
        availableAccountsCount={availableAccounts.length}
        categoryOptionsCount={categoryOptions.length}
        isInstallmentSeries={isInstallmentSeries}
        transactionType={transactionType}
      />
      <FormFeedbackMessage message={feedback?.message} status={feedback?.status} />
      <TransactionFormActions
        isEditing={isEditing}
        isPending={isPending}
        isSubmitBlocked={isSubmitBlocked}
        onCancel={onCancel}
        onReset={resetForm}
        returnHref={returnHref}
      />
    </form>
  );

  return (
    <FormCardShell showCard={showCard} title={isEditing ? "Editar transação" : "Nova transação"}>
      {formContent}
    </FormCardShell>
  );
}
