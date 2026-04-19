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
import { createGoalAction } from "@/features/goals/actions/create-goal-action";
import { getGoalFormDefaultValues } from "@/features/goals/components/goal-form.helpers";
import { updateGoalAction } from "@/features/goals/actions/update-goal-action";
import { goalFormSchema, type GoalFormValues } from "@/features/goals/schemas/goal-schema";
import type { Goal } from "@/features/goals/types/goal";
import { applyFormActionFieldErrors, type FormActionFeedback } from "@/lib/forms/form-action-feedback";

type GoalFormProps = {
  goal?: Goal | null;
  closeOnSuccess?: boolean;
  returnHref: string;
  showCard?: boolean;
};

export function GoalForm({
  goal,
  closeOnSuccess = false,
  returnHref,
  showCard = true
}: GoalFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<FormActionFeedback | null>(null);

  const defaultValues = useMemo(() => getGoalFormDefaultValues(goal), [goal]);

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
        form.reset(getGoalFormDefaultValues());
      }

      router.refresh();
    });
  });

  const formContent = (
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
        <Label htmlFor="targetDate">Prazo</Label>
        <Input disabled={isPending} id="targetDate" type="date" {...form.register("targetDate")} />
        <FieldErrorMessage message={form.formState.errors.targetDate?.message} />
      </div>

      <FormFeedbackMessage message={feedback?.message} status={feedback?.status} className="rounded-2xl" />

      <div className="flex flex-wrap gap-3">
        <Button disabled={isPending} type="submit">
          {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {isEditing ? "Salvar" : "Criar meta"}
        </Button>
        {isEditing ? (
          <Button asChild type="button" variant="outline">
            <Link href={returnHref}>Cancelar</Link>
          </Button>
        ) : (
          <Button
            disabled={isPending}
            onClick={() => {
              form.reset(getGoalFormDefaultValues());
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
    <FormCardShell showCard={showCard} title={isEditing ? "Editar meta" : "Nova meta"}>
      {formContent}
    </FormCardShell>
  );
}
