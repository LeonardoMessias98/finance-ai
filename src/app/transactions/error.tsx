"use client";

import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type TransactionsErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function TransactionsErrorPage({ error, reset }: TransactionsErrorPageProps) {
  return (
    <AppShell>
      <section className="space-y-6 pt-1">
        <Card className="border-destructive/20 bg-card/85">
          <CardHeader className="space-y-2">
            <CardTitle className="font-display text-3xl">Não foi possível carregar as transações</CardTitle>
            <CardDescription>
              Revise a configuração do banco e tente novamente. Se o problema persistir, verifique os logs do servidor.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="rounded-[1.25rem] bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error.message || "Erro inesperado ao carregar a feature Transactions."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={reset} type="button">
                Tentar novamente
              </Button>
              <Button asChild type="button" variant="outline">
                <Link href="/">Voltar ao início</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
