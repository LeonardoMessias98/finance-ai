import { Controller, type UseFormReturn } from "react-hook-form";

import { FieldErrorMessage } from "@/components/forms/field-error-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { Account } from "@/features/accounts/types/account";
import { getAccountTypeLabel } from "@/features/accounts/utils/account-formatters";
import type { Category } from "@/features/categories/types/category";
import type { TransactionType } from "@/features/transactions/types/transaction";
import type { TransactionFormValues } from "@/features/transactions/schemas/transaction-schema";
import { formatTransactionCurrencyInput, parseTransactionCurrencyInput } from "@/features/transactions/utils/transaction-currency";
import { getDefaultTransactionStatus, getTransactionTypeLabel } from "@/features/transactions/utils/transaction-formatters";

type TransactionTypeSelectorProps = {
  form: UseFormReturn<TransactionFormValues>;
  isPending: boolean;
  isInstallmentSeries: boolean;
  transactionType: TransactionType;
  transactionTypeOptions: TransactionType[];
};

export function TransactionTypeSelector({
  form,
  isPending,
  isInstallmentSeries,
  transactionType,
  transactionTypeOptions
}: TransactionTypeSelectorProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-foreground">Tipo</legend>
      <div className="grid grid-cols-3 gap-2">
        {transactionTypeOptions.map((option) => (
          <Button
            aria-pressed={transactionType === option}
            className="w-full"
            disabled={isPending || isInstallmentSeries}
            key={option}
            onClick={() => {
              form.setValue("type", option, {
                shouldDirty: true,
                shouldValidate: true
              });
              form.setValue("status", getDefaultTransactionStatus(option), {
                shouldDirty: true,
                shouldValidate: true
              });
            }}
            type="button"
            variant={transactionType === option ? "default" : "outline"}
          >
            {getTransactionTypeLabel(option)}
          </Button>
        ))}
      </div>
      <FieldErrorMessage message={form.formState.errors.type?.message} />
    </fieldset>
  );
}

type TransactionPrimaryFieldsProps = {
  form: UseFormReturn<TransactionFormValues>;
  isPending: boolean;
  isInstallmentSeries: boolean;
  availableAccounts: Account[];
  categoryOptions: Category[];
};

export function TransactionPrimaryFields({
  form,
  isPending,
  isInstallmentSeries,
  availableAccounts,
  categoryOptions
}: TransactionPrimaryFieldsProps) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
        <div className="space-y-2">
          <Label htmlFor="amount">Valor</Label>
          <Controller
            control={form.control}
            name="amount"
            render={({ field }) => (
              <Input
                aria-invalid={Boolean(form.formState.errors.amount)}
                autoComplete="off"
                className="h-11 text-base font-semibold"
                disabled={isPending || isInstallmentSeries}
                id="amount"
                inputMode="numeric"
                onBlur={field.onBlur}
                onChange={(event) => {
                  field.onChange(parseTransactionCurrencyInput(event.currentTarget.value));
                }}
                onFocus={(event) => {
                  event.currentTarget.select();
                }}
                ref={field.ref}
                type="text"
                value={formatTransactionCurrencyInput(field.value)}
              />
            )}
          />
          <FieldErrorMessage message={form.formState.errors.amount?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Input
            aria-invalid={Boolean(form.formState.errors.description)}
            className="h-11"
            disabled={isPending}
            id="description"
            placeholder="Ex.: Mercado, salário, aluguel"
            {...form.register("description")}
          />
          <FieldErrorMessage message={form.formState.errors.description?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input aria-invalid={Boolean(form.formState.errors.date)} disabled={isPending || isInstallmentSeries} id="date" type="date" {...form.register("date")} />
          <FieldErrorMessage message={form.formState.errors.date?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Categoria</Label>
          <Select aria-invalid={Boolean(form.formState.errors.categoryId)} disabled={isPending || isInstallmentSeries || categoryOptions.length === 0} id="categoryId" {...form.register("categoryId")}>
            <option value="">Selecione</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
                {category.isActive ? "" : " · Inativa"}
              </option>
            ))}
          </Select>
          <FieldErrorMessage message={form.formState.errors.categoryId?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="accountId">Conta</Label>
          <Select aria-invalid={Boolean(form.formState.errors.accountId)} disabled={isPending || isInstallmentSeries || availableAccounts.length === 0} id="accountId" {...form.register("accountId")}>
            <option value="">Selecione</option>
            {availableAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} · {getAccountTypeLabel(account.type)}
                {account.isActive ? "" : " · Inativa"}
              </option>
            ))}
          </Select>
          <FieldErrorMessage message={form.formState.errors.accountId?.message} />
        </div>
      </div>
    </>
  );
}
