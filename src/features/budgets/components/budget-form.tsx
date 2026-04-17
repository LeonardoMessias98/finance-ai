"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createBudgetAction } from "@/features/budgets/actions/create-budget-action";
import { updateBudgetAction } from "@/features/budgets/actions/update-budget-action";
import { budgetFormSchema, type BudgetFormValues } from "@/features/budgets/schemas/budget-schema";
import type { Budget } from "@/features/budgets/types/budget";
import type { Category } from "@/features/categories/types/category";
import { cn } from "@/lib/utils";

type BudgetFormProps = {
  budget?: Budget | null;
  categories: Category[];
  defaultCompetencyMonth: string;
  returnHref: string;
};

function getDefaultValues(budget?: Budget | null, defaultCompetencyMonth?: string): BudgetFormValues {
  return {
    competencyMonth: budget?.competencyMonth ?? defaultCompetencyMonth ?? "",
    categoryId: budget?.categoryId ?? "",
    limitAmount: budget ? budget.limitAmount / 100 : 0
  };
}

function FieldErrorMessage({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-destructive">{message}</p>;
}

export function BudgetForm({ budget, categories, defaultCompetencyMonth, returnHref }: BudgetFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  const defaultValues = useMemo(() => getDefaultValues(budget, defaultCompetencyMonth), [budget, defaultCompetencyMonth]);

  const selectedCategoryIds = useMemo(() => {
    return new Set([budget?.categoryId].filter((value): value is string => Boolean(value)));
  }, [budget?.categoryId]);

  const availableCategories = useMemo(() => {
    return categories.filter((category) => category.isActive || selectedCategoryIds.has(category.id));
  }, [categories, selectedCategoryIds]);

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

        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([fieldName, messages]) => {
            if (!messages || messages.length === 0) {
              return;
            }

            form.setError(fieldName as keyof BudgetFormValues, {
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

      if (isEditing) {
        router.push(returnHref);
      } else {
        form.reset(getDefaultValues(undefined, defaultCompetencyMonth));
      }

      router.refresh();
    });
  });

  return (
    <Card className="border-primary/10 bg-card/95">
      <CardHeader>
        <CardTitle className="text-xl">{isEditing ? "Editar orçamento" : "Novo orçamento"}</CardTitle>
      </CardHeader>
      <CardContent>
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

          {feedback ? (
            <p
              className={cn(
                "rounded-2xl px-4 py-3 text-sm",
                feedback.status === "success" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
              )}
            >
              {feedback.message}
            </p>
          ) : null}

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
                  form.reset(getDefaultValues(undefined, defaultCompetencyMonth));
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
      </CardContent>
    </Card>
  );
}
