import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  message: ReactNode;
  className?: string;
};

export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-dashed border-border px-5 py-8 text-center text-sm text-muted-foreground",
        className
      )}
    >
      {message}
    </div>
  );
}
