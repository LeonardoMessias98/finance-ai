import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  header?: ReactNode;
};

export function AppShell({ children, header }: AppShellProps) {
  return (
    <div className="min-h-screen">
      {header}
      <main className="pb-12 pt-10 sm:pt-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">{children}</div>
      </main>
    </div>
  );
}
