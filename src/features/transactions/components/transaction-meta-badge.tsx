import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TransactionMetaBadgeProps = {
  children: ReactNode;
  tone?: "account" | "category";
};

export function TransactionMetaBadge({ children, tone = "account" }: TransactionMetaBadgeProps) {
  return (
    <Badge
      className={cn(
        "border px-2.5 py-1 text-[11px] font-medium",
        tone === "category"
          ? "border-accent/25 bg-accent/10 text-foreground"
          : "border-border bg-background/70 text-foreground"
      )}
      variant="outline"
    >
      {children}
    </Badge>
  );
}
