import { AppShell } from "@/components/layout/app-shell";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function TransactionsLoading() {
  return (
    <AppShell>
      <section className="pt-1">
        <div className="rounded-xl border border-border bg-card/70 px-4 py-3">
          <LoadingSpinner label="Carregando transações..." />
        </div>
      </section>
    </AppShell>
  );
}
