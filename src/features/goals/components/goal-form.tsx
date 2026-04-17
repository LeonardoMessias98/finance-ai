"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGoalAction } from "@/features/goals/actions/create-goal-action";
import { updateGoalAction } from "@/features/goals/actions/update-goal-action";
import { goalFormSchema, type GoalFormValues } from "@/features/goals/schemas/goal-schema";
import type { Goal } from "@/features/goals/types/goal";
import { cn } from "@/lib/utils";

type GoalFormProps = {
  goal?: Goal | null;
  returnHref: string;
};

function formatDateForInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getDefaultValues(goal?: Goal | null): GoalFormValues {
  return {
    name: goal?.name ?? "",
    targetAmount: goal ? goal.targetAmount / 100 : 0,
    currentAmount: goal ? goal.currentAmount / 100 : 0,
    targetDate: goal?.targetDate ? formatDateForInput(goal.targetDate) : ""
  };
}

function FieldErrorMessage({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-destructive">{message}</p>;
}

export function GoalForm({ goal, returnHref }: GoalFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  const defaultValues = useMemo(() => getDefaultValues(goal), [goal]);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const isEditing = Boolean(goal);

  const handleSubmit = form.handleSubmit((values) => {
    setFeedback(null);
    form.clearErrors();

    startTransition(async () => {
      const result =
        isEditing && goal
          ? await updateGoalAction({
              goalId: goal.id,
              values
            })
          : await createGoalAction(values);

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

            form.setError(fieldName as keyof GoalFormValues, {
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
        form.reset(getDefaultValues());
      }

      router.refresh();
    });
  });

  return (
    <Card className="border-primary/10 bg-card/95">
      <CardHeader className="space-y-3">
        <div className="space-y-1">
          <CardTitle className="text-xl">{isEditing ? "Editar meta" : "Nova meta"}</CardTitle>
          <CardDescription>Valor alvo, valor acumulado e prazo opcional.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              disabled={isPending}
              id="name"
              placeholder="Ex.: Reserva de emergência, Viagem, Entrada do imóvel"
              {...form.register("name")}
            />
            <FieldErrorMessage message={form.formState.errors.name?.message} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Valor alvo</Label>
              <Input
                disabled={isPending}
                id="targetAmount"
                inputMode="decimal"
                step="0.01"
                type="number"
                {...form.register("targetAmount", {
                  valueAsNumber: true
                })}
              />
              <FieldErrorMessage message={form.formState.errors.targetAmount?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentAmount">Valor acumulado</Label>
              <Input
                disabled={isPending}
                id="currentAmount"
                inputMode="decimal"
                step="0.01"
                type="number"
                {...form.register("currentAmount", {
                  valueAsNumber: true
                })}
              />
              <FieldErrorMessage message={form.formState.errors.currentAmount?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Data alvo</Label>
            <Input disabled={isPending} id="targetDate" type="date" {...form.register("targetDate")} />
            <FieldErrorMessage message={form.formState.errors.targetDate?.message} />
          </div>

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
            <Button disabled={isPending} type="submit">
              {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {isEditing ? "Salvar alterações" : "Criar meta"}
            </Button>
            {isEditing ? (
              <Button asChild type="button" variant="outline">
                <Link href={returnHref}>Cancelar edição</Link>
              </Button>
            ) : (
              <Button
                disabled={isPending}
                onClick={() => {
                  form.reset(getDefaultValues());
                  setFeedback(null);
                }}
                type="button"
                variant="outline"
              >
                Limpar formulário
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
