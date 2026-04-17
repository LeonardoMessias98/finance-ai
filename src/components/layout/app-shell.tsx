import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="pb-12 pt-10 sm:pt-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">{children}</div>
      </main>
    </div>
  );
}
