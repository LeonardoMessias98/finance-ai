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
import { createCategoryAction } from "@/features/categories/actions/create-category-action";
import { getCategoryFormDefaultValues } from "@/features/categories/components/category-form.helpers";
import { updateCategoryAction } from "@/features/categories/actions/update-category-action";
import { categoryFormSchema, type CategoryFormValues } from "@/features/categories/schemas/category-schema";
import { categoryTypeValues, type Category } from "@/features/categories/types/category";
import { buildCategoriesHref } from "@/features/categories/utils/build-categories-href";
import { getCategoryTypeLabel } from "@/features/categories/utils/category-formatters";
import { applyFormActionFieldErrors, type FormActionFeedback } from "@/lib/forms/form-action-feedback";

type CategoryFormProps = {
  category?: Category | null;
  defaultType?: string;
  closeOnSuccess?: boolean;
  returnHref?: string;
  showCard?: boolean;
};

export function CategoryForm({
  category,
  defaultType,
  closeOnSuccess = false,
  returnHref = buildCategoriesHref(),
  showCard = true
}: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<FormActionFeedback | null>(null);

  const defaultValues = useMemo(() => getCategoryFormDefaultValues(category, defaultType), [category, defaultType]);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const isEditing = Boolean(category);

  const handleSubmit = form.handleSubmit((values) => {
    setFeedback(null);
    form.clearErrors();

    startTransition(async () => {
      const result =
        isEditing && category
          ? await updateCategoryAction({
              categoryId: category.id,
              values
            })
          : await createCategoryAction(values);

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
        form.reset(getCategoryFormDefaultValues(undefined, defaultType));
      }

      router.refresh();
    });
  });

  const formContent = (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          disabled={isPending}
          placeholder="Ex.: Salário, Moradia, Mercado"
          {...form.register("name")}
        />
        <FieldErrorMessage message={form.formState.errors.name?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo</Label>
        <Select id="type" disabled={isPending} {...form.register("type")}>
          {categoryTypeValues.map((categoryType) => (
            <option key={categoryType} value={categoryType}>
              {getCategoryTypeLabel(categoryType)}
            </option>
          ))}
        </Select>
        <FieldErrorMessage message={form.formState.errors.type?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="color">Cor</Label>
          <Input id="color" disabled={isPending} placeholder="#0f766e" {...form.register("color")} />
          <FieldErrorMessage message={form.formState.errors.color?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon">Ícone</Label>
          <Input id="icon" disabled={isPending} placeholder="tag" {...form.register("icon")} />
          <FieldErrorMessage message={form.formState.errors.icon?.message} />
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-[1.25rem] border border-border bg-background/70 px-4 py-3 text-sm text-foreground">
        <input className="h-4 w-4 rounded border-input text-primary" disabled={isPending} type="checkbox" {...form.register("isActive")} />
        Ativa
      </label>

      <FormFeedbackMessage message={feedback?.message} status={feedback?.status} className="rounded-2xl" />

      <div className="flex flex-wrap gap-3">
        <Button disabled={isPending} type="submit">
          {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {isEditing ? "Salvar" : "Criar categoria"}
        </Button>
        {isEditing ? (
          <Button asChild type="button" variant="outline">
            <Link href={returnHref}>Cancelar</Link>
          </Button>
        ) : (
          <Button
            disabled={isPending}
            onClick={() => {
              form.reset(getCategoryFormDefaultValues(undefined, defaultType));
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
    <FormCardShell showCard={showCard} title={isEditing ? "Editar categoria" : "Nova categoria"}>
      {formContent}
    </FormCardShell>
  );
}
