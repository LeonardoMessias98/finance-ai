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
import { createAccountAction } from "@/features/accounts/actions/create-account-action";
import { updateAccountAction } from "@/features/accounts/actions/update-account-action";
import { accountFormSchema, type AccountFormValues } from "@/features/accounts/schemas/account-schema";
import { accountTypeValues, type Account } from "@/features/accounts/types/account";
import { getAccountTypeLabel } from "@/features/accounts/utils/account-formatters";
import { cn } from "@/lib/utils";

type AccountFormProps = {
  account?: Account | null;
};

function getDefaultValues(account?: Account | null): AccountFormValues {
  return {
    name: account?.name ?? "",
    type: account?.type ?? "checking",
    initialBalance: account ? account.initialBalance / 100 : 0,
    isActive: account?.isActive ?? true,
    color: account?.color ?? "",
    icon: account?.icon ?? ""
  };
}

function FieldErrorMessage({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-destructive">{message}</p>;
}

export function AccountForm({ account }: AccountFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  const defaultValues = useMemo(() => getDefaultValues(account), [account]);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const isEditing = Boolean(account);

  const handleSubmit = form.handleSubmit((values) => {
    setFeedback(null);
    form.clearErrors();

    startTransition(async () => {
      const result =
        isEditing && account
          ? await updateAccountAction({
              accountId: account.id,
              values
            })
          : await createAccountAction(values);

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

            form.setError(fieldName as keyof AccountFormValues, {
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
        router.push("/accounts");
      } else {
        form.reset(getDefaultValues());
      }

      router.refresh();
    });
  });

  return (
    <Card className="border-primary/10 bg-card/95">
      <CardHeader>
        <CardTitle className="text-xl">{isEditing ? "Editar conta" : "Nova conta"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              disabled={isPending}
              placeholder="Ex.: Nubank, Carteira, XP"
              {...form.register("name")}
            />
            <FieldErrorMessage message={form.formState.errors.name?.message} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select id="type" disabled={isPending} {...form.register("type")}>
                {accountTypeValues.map((accountType) => (
                  <option key={accountType} value={accountType}>
                    {getAccountTypeLabel(accountType)}
                  </option>
                ))}
              </Select>
              <FieldErrorMessage message={form.formState.errors.type?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initialBalance">Saldo inicial</Label>
              <Input
                id="initialBalance"
                disabled={isPending}
                inputMode="decimal"
                step="0.01"
                type="number"
                {...form.register("initialBalance", {
                  valueAsNumber: true
                })}
              />
              <FieldErrorMessage message={form.formState.errors.initialBalance?.message} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <Input id="color" disabled={isPending} placeholder="#0f766e" {...form.register("color")} />
              <FieldErrorMessage message={form.formState.errors.color?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Ícone</Label>
              <Input id="icon" disabled={isPending} placeholder="wallet" {...form.register("icon")} />
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
              {isEditing ? "Salvar" : "Criar conta"}
            </Button>
            {isEditing ? (
              <Button asChild type="button" variant="outline">
                <Link href="/accounts">Cancelar</Link>
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
                Limpar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
