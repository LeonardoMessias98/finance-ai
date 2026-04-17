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
import { createCategoryAction } from "@/features/categories/actions/create-category-action";
import { updateCategoryAction } from "@/features/categories/actions/update-category-action";
import { categoryFormSchema, type CategoryFormValues } from "@/features/categories/schemas/category-schema";
import { categoryTypeValues, type Category } from "@/features/categories/types/category";
import { getCategoryTypeLabel } from "@/features/categories/utils/category-formatters";
import { cn } from "@/lib/utils";

type CategoryFormProps = {
  category?: Category | null;
  defaultType?: string;
};

function getDefaultValues(category?: Category | null, defaultType?: string): CategoryFormValues {
  return {
    name: category?.name ?? "",
    type:
      category?.type ??
      (defaultType === "income" || defaultType === "expense" || defaultType === "transfer" ? defaultType : "expense"),
    isActive: category?.isActive ?? true,
    color: category?.color ?? "",
    icon: category?.icon ?? ""
  };
}

function FieldErrorMessage({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-destructive">{message}</p>;
}

export function CategoryForm({ category, defaultType }: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  const defaultValues = useMemo(() => getDefaultValues(category, defaultType), [category, defaultType]);

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

        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([fieldName, messages]) => {
            if (!messages || messages.length === 0) {
              return;
            }

            form.setError(fieldName as keyof CategoryFormValues, {
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
        router.push("/categories");
      } else {
        form.reset(getDefaultValues(undefined, defaultType));
      }

      router.refresh();
    });
  });

  return (
    <Card className="border-primary/10 bg-card/95">
      <CardHeader>
        <CardTitle className="text-xl">{isEditing ? "Editar categoria" : "Nova categoria"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              disabled={isPending}
              placeholder="Ex.: Salário, Moradia, Transferência interna"
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
              {isEditing ? "Salvar" : "Criar categoria"}
            </Button>
            {isEditing ? (
              <Button asChild type="button" variant="outline">
                <Link href="/categories">Cancelar</Link>
              </Button>
            ) : (
              <Button
                disabled={isPending}
                onClick={() => {
                  form.reset(getDefaultValues(undefined, defaultType));
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
