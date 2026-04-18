import { redirect } from "next/navigation";

import { LoginForm } from "@/features/auth/components/login-form";
import { getOptionalAuthenticatedAppUser } from "@/lib/auth/session";

type LoginPageProps = {
  searchParams?: Promise<{
    next?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getOptionalAuthenticatedAppUser();

  if (user) {
    redirect("/");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const nextPathname = typeof resolvedSearchParams.next === "string" ? resolvedSearchParams.next : undefined;

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#151A21_0%,#0B0D10_48%,#0B0D10_100%)] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col justify-center gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:gap-16">
        <section className="max-w-md space-y-5">
          <p className="inline-flex rounded-full border border-border bg-secondary/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Acesso privado
          </p>
          <div className="space-y-3">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Entre e continue de onde parou.
            </h1>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground sm:text-base">
              Saldo, histórico e lançamentos do mês em um fluxo simples e direto.
            </p>
          </div>

          <div className="grid max-w-sm gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-card/40 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground/80">Foco</p>
              <p className="mt-2 text-foreground">Ver saldo e registrar movimentações sem atrito.</p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card/40 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground/80">Sessão</p>
              <p className="mt-2 text-foreground">Seu acesso fica protegido e restrito ao seu espaço.</p>
            </div>
          </div>
        </section>

        <section className="relative">
          <div className="absolute inset-x-6 top-6 -z-10 h-40 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
          <div className="absolute right-0 top-1/2 -z-10 hidden h-48 w-48 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl lg:block" aria-hidden="true" />
          <div className="rounded-[28px] border border-border/70 bg-card/55 p-2 backdrop-blur-sm">
            <LoginForm nextPathname={nextPathname} />
          </div>
        </section>
      </div>
    </main>
  );
}
