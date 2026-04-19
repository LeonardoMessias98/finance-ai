"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";

import { FieldErrorMessage } from "@/components/forms/field-error-message";
import { FormCardShell } from "@/components/forms/form-card-shell";
import { FormFeedbackMessage } from "@/components/forms/form-feedback-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createBudgetAction } from "@/features/budgets/actions/create-budget-action";
import {
  getAvailableBudgetCategories,
  getBudgetFormDefaultValues
} from "@/features/budgets/components/budget-form.helpers";
import { updateBudgetAction } from "@/features/budgets/actions/update-budget-action";
import { budgetFormSchema, type BudgetFormValues } from "@/features/budgets/schemas/budget-schema";
import type { Budget } from "@/features/budgets/types/budget";
import type { Category } from "@/features/categories/types/category";
import { applyFormActionFieldErrors, type FormActionFeedback } from "@/lib/forms/form-action-feedback";

type BudgetFormProps = {
  budget?: Budget | null;
  categories: Category[];
  defaultCompetencyMonth: string;
  closeOnSuccess?: boolean;
  returnHref: string;
  showCard?: boolean;
};

export function BudgetForm({
  budget,
  categories,
  defaultCompetencyMonth,
  closeOnSuccess = false,
  returnHref,
  showCard = true
}: BudgetFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<FormActionFeedback | null>(null);

  const defaultValues = useMemo(
    () => getBudgetFormDefaultValues(budget, defaultCompetencyMonth),
    [budget, defaultCompetencyMonth]
  );
  const availableCategories = useMemo(
    () => getAvailableBudgetCategories(categories, budget?.categoryId),
    [budget?.categoryId, categories]
  );

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const isEditing = Boolean(budget);

  const handleSubmit = form.handleSubmit((values) => {
    setFeedback(null);
    form.clearErrors();

    startTransition(async () => {
      const result =
        isEditing && budget
          ? await updateBudgetAction({
              budgetId: budget.id,
              values
            })
          : await createBudgetAction(values);

      if (result.status === "error") {
        setFeedback({
          status: "error",
          message: result.message
        });
        applyFormActionFieldErrors(form, result);

        return;
      }

      setFeedback({
        status: "success",
        message: result.message
      });

      if (isEditing || closeOnSuccess) {
        router.push(returnHref);
      } else {
        form.reset(getBudgetFormDefaultValues(undefined, defaultCompetencyMonth));
      }

      router.refresh();
    });
  });

  const formContent = (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="competencyMonth">Competência</Label>
        <Input disabled={isPending} id="competencyMonth" type="month" {...form.register("competencyMonth")} />
        <FieldErrorMessage message={form.formState.errors.competencyMonth?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Categoria</Label>
        <Select disabled={isPending || availableCategories.length === 0} id="categoryId" {...form.register("categoryId")}>
          <option value="">Selecione uma categoria</option>
          {availableCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
              {category.isActive ? "" : " · Inativa"}
            </option>
          ))}
        </Select>
        <FieldErrorMessage message={form.formState.errors.categoryId?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="limitAmount">Limite mensal</Label>
        <Input
          disabled={isPending}
          id="limitAmount"
          inputMode="decimal"
          step="0.01"
          type="number"
          {...form.register("limitAmount", {
            valueAsNumber: true
          })}
        />
        <FieldErrorMessage message={form.formState.errors.limitAmount?.message} />
      </div>

      {availableCategories.length === 0 ? (
        <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Cadastre pelo menos uma categoria de despesa antes de criar orçamentos.
        </p>
      ) : null}

      <FormFeedbackMessage message={feedback?.message} status={feedback?.status} className="rounded-2xl" />

      <div className="flex flex-wrap gap-3">
        <Button disabled={isPending || availableCategories.length === 0} type="submit">
          {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {isEditing ? "Salvar" : "Criar orçamento"}
        </Button>
        {isEditing ? (
          <Button asChild type="button" variant="outline">
            <Link href={returnHref}>Cancelar</Link>
          </Button>
        ) : (
          <Button
            disabled={isPending}
            onClick={() => {
              form.reset(getBudgetFormDefaultValues(undefined, defaultCompetencyMonth));
              setFeedback(null);
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

  return (
    <FormCardShell showCard={showCard} title={isEditing ? "Editar orçamento" : "Novo orçamento"}>
      {formContent}
    </FormCardShell>
  );
}
