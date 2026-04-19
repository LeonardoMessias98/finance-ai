import type { UseFormReturn } from "react-hook-form";

import { FieldErrorMessage } from "@/components/forms/field-error-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { TransactionType } from "@/features/transactions/types/transaction";
import type { TransactionFormValues } from "@/features/transactions/schemas/transaction-schema";
import { getTransactionStatusLabel } from "@/features/transactions/utils/transaction-formatters";
import { cn } from "@/lib/utils";

type TransactionAdvancedFieldsProps = {
  form: UseFormReturn<TransactionFormValues>;
  isPending: boolean;
  isEditing: boolean;
  isInstallmentSeries: boolean;
  showAdvancedFields: boolean;
  setShowAdvancedFields: (value: boolean | ((current: boolean) => boolean)) => void;
  statusOptions: readonly TransactionFormValues["status"][];
  transactionType: TransactionType;
};

export function TransactionAdvancedFields({
  form,
  isPending,
  isEditing,
  isInstallmentSeries,
  showAdvancedFields,
  setShowAdvancedFields,
  statusOptions,
  transactionType
}: TransactionAdvancedFieldsProps) {
  return (
    <div className="space-y-3 border-t border-border/70 pt-4">
      <Button className="h-auto px-0 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground" disabled={isPending} onClick={() => setShowAdvancedFields((currentValue) => !currentValue)} type="button" variant="ghost">
        {showAdvancedFields ? "Ocultar opções" : "Mais opções"}
      </Button>
      <div aria-hidden={!showAdvancedFields} className={cn("space-y-4", !showAdvancedFields && "hidden")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="competencyMonth">Competência</Label>
            <Input aria-invalid={Boolean(form.formState.errors.competencyMonth)} disabled={isPending || isInstallmentSeries} id="competencyMonth" type="month" {...form.register("competencyMonth")} />
            <FieldErrorMessage message={form.formState.errors.competencyMonth?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select aria-invalid={Boolean(form.formState.errors.status)} disabled={isPending || isInstallmentSeries} id="status" {...form.register("status")}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {getTransactionStatusLabel(status)}
                </option>
              ))}
            </Select>
            <FieldErrorMessage message={form.formState.errors.status?.message} />
          </div>
        </div>

        {transactionType === "expense" && !isEditing ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="installmentCount">Parcelas</Label>
              <Input aria-invalid={Boolean(form.formState.errors.installmentCount)} disabled={isPending || isInstallmentSeries} id="installmentCount" min={1} step={1} type="number" {...form.register("installmentCount", { valueAsNumber: true })} />
              <FieldErrorMessage message={form.formState.errors.installmentCount?.message} />
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="notes">Observação</Label>
          <Textarea aria-invalid={Boolean(form.formState.errors.notes)} disabled={isPending || isInstallmentSeries} id="notes" placeholder="Opcional" rows={3} {...form.register("notes")} />
          <FieldErrorMessage message={form.formState.errors.notes?.message} />
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground">
          <input className="h-4 w-4 rounded border-input bg-secondary text-primary" disabled={isPending || isInstallmentSeries} type="checkbox" {...form.register("isRecurring")} />
          Recorrente
        </label>
      </div>
    </div>
  );
}
