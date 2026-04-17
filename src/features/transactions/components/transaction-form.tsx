"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Account } from "@/features/accounts/types/account";
import { getAccountTypeLabel } from "@/features/accounts/utils/account-formatters";
import type { Category } from "@/features/categories/types/category";
import { createTransactionAction } from "@/features/transactions/actions/create-transaction-action";
import { updateTransactionAction } from "@/features/transactions/actions/update-transaction-action";
import {
  transactionFormSchema,
  type TransactionFormValues
} from "@/features/transactions/schemas/transaction-schema";
import type { Transaction, TransactionType } from "@/features/transactions/types/transaction";
import {
  getDefaultTransactionStatus,
  getTransactionStatusLabel,
  getTransactionStatusOptions,
  getTransactionTypeLabel
} from "@/features/transactions/utils/transaction-formatters";
import {
  formatTransactionCurrencyInput,
  parseTransactionCurrencyInput
} from "@/features/transactions/utils/transaction-currency";
import {
  getDefaultTransactionAccountId,
  getDefaultTransactionFormValues,
  shouldOpenAdvancedTransactionFields
} from "@/features/transactions/utils/transaction-form-defaults";
import { getCompetencyMonthFromDateInput } from "@/lib/dates/competency-month";
import { cn } from "@/lib/utils";

type TransactionFormProps = {
  transaction?: Transaction | null;
  accounts: Account[];
  categories: Category[];
  returnHref: string;
  defaultType?: TransactionType;
  defaultCompetencyMonth?: string;
  closeOnSuccess?: boolean;
  showCard?: boolean;
};

const transactionTypeOptions: TransactionType[] = ["expense", "income", "transfer"];

function FieldErrorMessage({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}

function getAutoDerivedCompetencyMonth(date: string, competencyMonth: string): string | undefined {
  const derivedCompetencyMonth = getCompetencyMonthFromDateInput(date);

  return derivedCompetencyMonth && competencyMonth === derivedCompetencyMonth ? derivedCompetencyMonth : undefined;
}

export function TransactionForm({
  transaction,
  accounts,
  categories,
  returnHref,
  defaultType,
  defaultCompetencyMonth,
  closeOnSuccess = false,
  showCard = true
}: TransactionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  const defaultValues = useMemo(
    () =>
      getDefaultTransactionFormValues({
        transaction,
        accounts,
        defaultType,
        defaultCompetencyMonth
      }),
    [accounts, defaultCompetencyMonth, defaultType, transaction]
  );

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues
  });

  const autoDerivedCompetencyMonthRef = useRef<string | undefined>(undefined);
  const [showAdvancedFields, setShowAdvancedFields] = useState(() =>
    shouldOpenAdvancedTransactionFields(defaultValues)
  );

  const isEditing = Boolean(transaction);
  const isInstallmentSeries = Boolean(transaction?.installment && transaction.installment.total > 1);
  const transactionType = form.watch("type");
  const transactionDate = form.watch("date");
  const competencyMonth = form.watch("competencyMonth");
  const sourceAccountId = form.watch("accountId");

  const selectedAccountIds = useMemo(() => {
    return new Set(
      [transaction?.accountId, transaction?.destinationAccountId].filter((value): value is string => Boolean(value))
    );
  }, [transaction?.accountId, transaction?.destinationAccountId]);

  const selectedCategoryIds = useMemo(() => {
    return new Set([transaction?.categoryId].filter((value): value is string => Boolean(value)));
  }, [transaction?.categoryId]);

  const availableAccounts = useMemo(() => {
    return accounts.filter((account) => account.isActive || selectedAccountIds.has(account.id));
  }, [accounts, selectedAccountIds]);

  const availableCategories = useMemo(() => {
    return categories.filter((category) => category.isActive || selectedCategoryIds.has(category.id));
  }, [categories, selectedCategoryIds]);

  const categoryOptions = useMemo(() => {
    return availableCategories.filter((category) => category.type === transactionType);
  }, [availableCategories, transactionType]);

  const destinationAccountOptions = useMemo(() => {
    return availableAccounts.filter((account) => account.id !== sourceAccountId);
  }, [availableAccounts, sourceAccountId]);

  const statusOptions = getTransactionStatusOptions(transactionType);
  const needsCategory = transactionType !== "transfer";
  const isSubmitBlocked =
    isInstallmentSeries ||
    availableAccounts.length === 0 ||
    (needsCategory && categoryOptions.length === 0) ||
    (transactionType === "transfer" && destinationAccountOptions.length === 0);

  useEffect(() => {
    form.reset(defaultValues);
    setShowAdvancedFields(shouldOpenAdvancedTransactionFields(defaultValues));
    autoDerivedCompetencyMonthRef.current = getAutoDerivedCompetencyMonth(
      defaultValues.date,
      defaultValues.competencyMonth
    );
  }, [defaultValues, form]);

  useEffect(() => {
    if (isEditing) {
      return;
    }

    const focusFrame = requestAnimationFrame(() => {
      form.setFocus("amount");
    });

    return () => cancelAnimationFrame(focusFrame);
  }, [defaultValues, form, isEditing]);

  useEffect(() => {
    const currentStatus = form.getValues("status");

    if (!statusOptions.includes(currentStatus)) {
      form.setValue("status", getDefaultTransactionStatus(transactionType), {
        shouldValidate: true
      });
    }
  }, [form, statusOptions, transactionType]);

  useEffect(() => {
    if (transactionType !== "transfer" && form.getValues("destinationAccountId")) {
      form.setValue("destinationAccountId", "", {
        shouldValidate: true
      });
    }
  }, [form, transactionType]);

  useEffect(() => {
    if (transactionType !== "expense" && form.getValues("installmentCount") !== 1) {
      form.setValue("installmentCount", 1, {
        shouldValidate: true
      });
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
    const currentAccountId = form.getValues("accountId");
    const nextAccountId = getDefaultTransactionAccountId(availableAccounts, currentAccountId);

    if (!nextAccountId || currentAccountId === nextAccountId) {
      return;
    }

    form.setValue("accountId", nextAccountId, {
      shouldDirty: Boolean(currentAccountId),
      shouldValidate: true
    });
  }, [availableAccounts, form]);

  useEffect(() => {
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
  }, [categoryOptions, form]);

  useEffect(() => {
    if (transactionType !== "transfer") {
      return;
    }

    const currentDestinationAccountId = form.getValues("destinationAccountId");
    const validDestinationIds = new Set(destinationAccountOptions.map((account) => account.id));

    if (currentDestinationAccountId && validDestinationIds.has(currentDestinationAccountId)) {
      return;
    }

    const nextDestinationAccountId = destinationAccountOptions.length === 1 ? destinationAccountOptions[0].id : "";

    if (currentDestinationAccountId === nextDestinationAccountId) {
      return;
    }

    form.setValue("destinationAccountId", nextDestinationAccountId, {
      shouldDirty: Boolean(currentDestinationAccountId),
      shouldValidate: true
    });
  }, [destinationAccountOptions, form, transactionType]);

  useEffect(() => {
    if (
      form.formState.errors.competencyMonth ||
      form.formState.errors.installmentCount ||
      form.formState.errors.notes ||
      form.formState.errors.status
    ) {
      setShowAdvancedFields(true);
    }
  }, [form.formState.errors.competencyMonth, form.formState.errors.installmentCount, form.formState.errors.notes, form.formState.errors.status]);

  const handleSubmit = form.handleSubmit((values) => {
    setFeedback(null);
    form.clearErrors();

    startTransition(async () => {
      const result =
        isEditing && transaction
          ? await updateTransactionAction({
              transactionId: transaction.id,
              values
            })
          : await createTransactionAction(values);

      if (result.status === "error") {
        setFeedback({
          status: "error",
          message: result.message
        });

        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([fieldName, messages]) => {
            if (!messages || messages.length === 0) {
              return;
            }

            form.setError(fieldName as keyof TransactionFormValues, {
              type: "server",
              message: messages[0]
            });
          });
        }

        return;
      }

      setFeedback({
        status: "success",
        message: result.message
      });

      if (isEditing || closeOnSuccess) {
        router.replace(returnHref);
        router.refresh();
        return;
      }

      form.reset(defaultValues);
      setShowAdvancedFields(shouldOpenAdvancedTransactionFields(defaultValues));
      autoDerivedCompetencyMonthRef.current = getAutoDerivedCompetencyMonth(
        defaultValues.date,
        defaultValues.competencyMonth
      );

      requestAnimationFrame(() => {
        form.setFocus("amount");
      });

      router.refresh();
    });
  });

  const formContent = (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <input type="hidden" {...form.register("type")} />

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

      {transactionType === "transfer" ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              aria-invalid={Boolean(form.formState.errors.date)}
              disabled={isPending || isInstallmentSeries}
              id="date"
              type="date"
              {...form.register("date")}
            />
            <FieldErrorMessage message={form.formState.errors.date?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountId">Origem</Label>
            <Select
              aria-invalid={Boolean(form.formState.errors.accountId)}
              disabled={isPending || isInstallmentSeries || availableAccounts.length === 0}
              id="accountId"
              {...form.register("accountId")}
            >
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

          <div className="space-y-2">
            <Label htmlFor="destinationAccountId">Destino</Label>
            <Select
              aria-invalid={Boolean(form.formState.errors.destinationAccountId)}
              disabled={isPending || isInstallmentSeries || destinationAccountOptions.length === 0}
              id="destinationAccountId"
              {...form.register("destinationAccountId")}
            >
              <option value="">Selecione</option>
              {destinationAccountOptions.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} · {getAccountTypeLabel(account.type)}
                  {account.isActive ? "" : " · Inativa"}
                </option>
              ))}
            </Select>
            <FieldErrorMessage message={form.formState.errors.destinationAccountId?.message} />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              aria-invalid={Boolean(form.formState.errors.date)}
              disabled={isPending || isInstallmentSeries}
              id="date"
              type="date"
              {...form.register("date")}
            />
            <FieldErrorMessage message={form.formState.errors.date?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria</Label>
            <Select
              aria-invalid={Boolean(form.formState.errors.categoryId)}
              disabled={isPending || isInstallmentSeries || categoryOptions.length === 0}
              id="categoryId"
              {...form.register("categoryId")}
            >
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
            <Select
              aria-invalid={Boolean(form.formState.errors.accountId)}
              disabled={isPending || isInstallmentSeries || availableAccounts.length === 0}
              id="accountId"
              {...form.register("accountId")}
            >
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
      )}

      <div className="space-y-3 border-t border-border/70 pt-4">
        <Button
          className="h-auto px-0 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground"
          disabled={isPending}
          onClick={() => {
            setShowAdvancedFields((currentValue) => !currentValue);
          }}
          type="button"
          variant="ghost"
        >
          {showAdvancedFields ? "Ocultar opções" : "Mais opções"}
        </Button>

        <div aria-hidden={!showAdvancedFields} className={cn("space-y-4", !showAdvancedFields && "hidden")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="competencyMonth">Competência</Label>
              <Input
                aria-invalid={Boolean(form.formState.errors.competencyMonth)}
                disabled={isPending || isInstallmentSeries}
                id="competencyMonth"
                type="month"
                {...form.register("competencyMonth")}
              />
              <FieldErrorMessage message={form.formState.errors.competencyMonth?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                aria-invalid={Boolean(form.formState.errors.status)}
                disabled={isPending || isInstallmentSeries}
                id="status"
                {...form.register("status")}
              >
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
                <Input
                  aria-invalid={Boolean(form.formState.errors.installmentCount)}
                  disabled={isPending || isInstallmentSeries}
                  id="installmentCount"
                  min={1}
                  step={1}
                  type="number"
                  {...form.register("installmentCount", {
                    valueAsNumber: true
                  })}
                />
                <FieldErrorMessage message={form.formState.errors.installmentCount?.message} />
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="notes">Observação</Label>
            <Textarea
              aria-invalid={Boolean(form.formState.errors.notes)}
              disabled={isPending || isInstallmentSeries}
              id="notes"
              placeholder="Opcional"
              rows={3}
              {...form.register("notes")}
            />
            <FieldErrorMessage message={form.formState.errors.notes?.message} />
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground">
            <input
              className="h-4 w-4 rounded border-input bg-secondary text-primary"
              disabled={isPending || isInstallmentSeries}
              type="checkbox"
              {...form.register("isRecurring")}
            />
            Recorrente
          </label>
        </div>
      </div>

      {isInstallmentSeries ? (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          Parcelas em série ainda não podem ser editadas individualmente.
        </p>
      ) : null}

      {availableAccounts.length === 0 ? (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          Cadastre uma conta antes de lançar transações.
        </p>
      ) : null}

      {needsCategory && categoryOptions.length === 0 ? (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          Não há categorias ativas para {getTransactionTypeLabel(transactionType).toLowerCase()}.
        </p>
      ) : null}

      {transactionType === "transfer" && destinationAccountOptions.length === 0 ? (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          Transferências exigem duas contas disponíveis.
        </p>
      ) : null}

      {feedback ? (
        <p
          aria-live="polite"
          className={cn(
            "rounded-xl px-4 py-3 text-sm",
            feedback.status === "success" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
          )}
          role={feedback.status === "error" ? "alert" : "status"}
        >
          {feedback.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button className="sm:min-w-[12rem]" disabled={isPending || isSubmitBlocked} type="submit">
          {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {isEditing ? "Salvar" : "Registrar transação"}
        </Button>

        {isEditing ? (
          <Button asChild type="button" variant="outline">
            <Link href={returnHref}>Cancelar</Link>
          </Button>
        ) : (
          <Button
            disabled={isPending}
            onClick={() => {
              form.reset(defaultValues);
              setShowAdvancedFields(shouldOpenAdvancedTransactionFields(defaultValues));
              autoDerivedCompetencyMonthRef.current = getAutoDerivedCompetencyMonth(
                defaultValues.date,
                defaultValues.competencyMonth
              );
              setFeedback(null);

              requestAnimationFrame(() => {
                form.setFocus("amount");
              });
            }}
            type="button"
            variant="outline"
          >
            Limpar
          </Button>
        )}
      </div>
    </form>
  );

  if (!showCard) {
    return formContent;
  }

  return (
    <Card className="border-primary/10 bg-card/95">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">{isEditing ? "Editar transação" : "Nova transação"}</CardTitle>
      </CardHeader>

      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  );
}
