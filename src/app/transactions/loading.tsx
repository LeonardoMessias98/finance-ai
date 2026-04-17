import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TransactionsLoading() {
  return (
    <AppShell>
      <section className="space-y-6">
        <Card className="border-primary/10 bg-card/85">
          <CardHeader>
            <CardTitle className="font-display text-3xl">Carregando transações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-36 animate-pulse rounded-[1.5rem] bg-secondary/60" />
            <div className="grid gap-4 md:grid-cols-4">
              <div className="h-28 animate-pulse rounded-[1.5rem] bg-secondary/60" />
              <div className="h-28 animate-pulse rounded-[1.5rem] bg-secondary/60" />
              <div className="h-28 animate-pulse rounded-[1.5rem] bg-secondary/60" />
              <div className="h-28 animate-pulse rounded-[1.5rem] bg-secondary/60" />
            </div>
            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="h-[28rem] animate-pulse rounded-[1.5rem] bg-secondary/60" />
              <div className="h-[28rem] animate-pulse rounded-[1.5rem] bg-secondary/60" />
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
