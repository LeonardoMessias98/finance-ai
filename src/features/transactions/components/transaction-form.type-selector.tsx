import type { UseFormReturn } from "react-hook-form";

import { FieldErrorMessage } from "@/components/forms/field-error-message";
import { Button } from "@/components/ui/button";
import type { Account } from "@/features/accounts/types/account";
import type { TransactionFormValues } from "@/features/transactions/schemas/transaction-schema";
import type { TransactionType } from "@/features/transactions/types/transaction";
import {
  getDefaultTransactionStatus,
  getTransactionTypeLabel
} from "@/features/transactions/utils/transaction-formatters";

type TransactionTypeSelectorProps = {
  form: UseFormReturn<TransactionFormValues>;
  isPending: boolean;
  isInstallmentSeries: boolean;
  paymentCreditAccounts: Account[];
  selectedPaymentCreditAccountId: string;
  transactionType: TransactionType;
  transactionTypeOptions: TransactionType[];
};

export function TransactionTypeSelector({
  form,
  isPending,
  isInstallmentSeries,
  paymentCreditAccounts,
  selectedPaymentCreditAccountId,
  transactionType,
  transactionTypeOptions
}: TransactionTypeSelectorProps) {
  const isCreditPayment = transactionType === "expense" && Boolean(selectedPaymentCreditAccountId);

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-foreground">Tipo</legend>
      <div className="grid grid-cols-3 gap-2">
        {transactionTypeOptions.map((option) => (
          <Button
            aria-pressed={!isCreditPayment && transactionType === option}
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
              form.setValue("paymentForCreditAccountId", "", {
                shouldDirty: true,
                shouldValidate: true
              });
            }}
            type="button"
            variant={!isCreditPayment && transactionType === option ? "default" : "outline"}
          >
            {getTransactionTypeLabel(option)}
          </Button>
        ))}
        {paymentCreditAccounts.length > 0 ? (
          <Button
            aria-pressed={isCreditPayment}
            className="w-full"
            disabled={isPending || isInstallmentSeries}
            onClick={() => {
              form.setValue("type", "expense", {
                shouldDirty: true,
                shouldValidate: true
              });
              form.setValue("status", "paid", {
                shouldDirty: true,
                shouldValidate: true
              });
              form.setValue(
                "paymentForCreditAccountId",
                selectedPaymentCreditAccountId || paymentCreditAccounts[0].id,
                {
                  shouldDirty: true,
                  shouldValidate: true
                }
              );
            }}
            type="button"
            variant={isCreditPayment ? "default" : "outline"}
          >
            Pagamento
          </Button>
        ) : null}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Pagamentos de cartão saem de uma conta débito e entram nas saídas.
      </p>
      <FieldErrorMessage message={form.formState.errors.type?.message} />
    </fieldset>
  );
}
