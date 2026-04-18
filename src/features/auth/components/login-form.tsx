"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/features/auth/actions/login-action";
import {
  clearTextPasswordSchema,
  passwordPolicyDescription
} from "@/features/auth/schemas/password-policy";
import { cn } from "@/lib/utils";

const loginFormSchema = z.object({
  email: z.string().trim().email("Informe um email válido."),
  password: clearTextPasswordSchema
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

async function createSha256Hash(value: string): Promise<string> {
  const encodedValue = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest("SHA-256", encodedValue);

  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function LoginForm({ nextPathname }: { nextPathname?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleSubmit = form.handleSubmit((values) => {
    setFeedback(null);
    form.clearErrors();

    startTransition(async () => {
      const passwordHash = await createSha256Hash(values.password);
      console.log({passwordHash})
      const result = await loginAction({
        email: values.email,
        passwordHash,
        nextPathname
      });

      if (result.status === "error") {
        setFeedback(result.message);

        if (result.fieldErrors?.email?.[0]) {
          form.setError("email", {
            type: "server",
            message: result.fieldErrors.email[0]
          });
        }

        if (result.fieldErrors?.passwordHash?.[0]) {
          form.setError("password", {
            type: "server",
            message: result.fieldErrors.passwordHash[0]
          });
        }

        return;
      }

      router.replace(result.redirectTo);
      router.refresh();
    });
  });

  return (
    <Card className="w-full border-border/80 bg-card/95 shadow-none">
      <CardHeader className="space-y-2 border-b border-border/70 pb-5">
        <CardTitle className="text-2xl">Entrar</CardTitle>
        <CardDescription>Use seu email e sua senha para continuar.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form aria-busy={isPending} className="space-y-5" noValidate onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              aria-describedby={form.formState.errors.email?.message ? "login-email-error" : undefined}
              aria-invalid={form.formState.errors.email ? "true" : "false"}
              autoComplete="email"
              autoFocus
              autoCapitalize="none"
              disabled={isPending}
              id="email"
              inputMode="email"
              placeholder="voce@email.com"
              spellCheck={false}
              type="email"
              className={cn(form.formState.errors.email ? "border-destructive/60 focus-visible:ring-destructive/60" : undefined)}
              {...form.register("email")}
            />
            {form.formState.errors.email?.message ? (
              <p className="text-sm text-destructive" id="login-email-error">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              aria-describedby={
                form.formState.errors.password?.message ? "login-password-error" : "login-password-hint"
              }
              aria-invalid={form.formState.errors.password ? "true" : "false"}
              autoComplete="current-password"
              disabled={isPending}
              id="password"
              minLength={6}
              placeholder="Sua senha"
              type="password"
              className={cn(
                form.formState.errors.password ? "border-destructive/60 focus-visible:ring-destructive/60" : undefined
              )}
              {...form.register("password")}
            />
            {!form.formState.errors.password?.message ? (
              <p className="text-xs text-muted-foreground" id="login-password-hint">
                {passwordPolicyDescription}
              </p>
            ) : null}
            {form.formState.errors.password?.message ? (
              <p className="text-sm text-destructive" id="login-password-error">
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          {feedback ? (
            <p
              className={cn("rounded-xl px-4 py-3 text-sm", "bg-destructive/10 text-destructive")}
              role="alert"
            >
              {feedback}
            </p>
          ) : null}

          <Button className="w-full" disabled={isPending} size="lg" type="submit">
            {isPending ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
