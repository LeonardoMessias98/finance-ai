import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatusBannerProps = {
  message: ReactNode;
  variant?: "error" | "info";
  className?: string;
};

const statusBannerClassNames = {
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  info: "border-border bg-card text-muted-foreground"
} satisfies Record<NonNullable<StatusBannerProps["variant"]>, string>;

export function StatusBanner({ message, variant = "info", className }: StatusBannerProps) {
  return (
    <p
      className={cn("rounded-xl border px-4 py-3 text-sm", statusBannerClassNames[variant], className)}
      role={variant === "error" ? "alert" : "status"}
    >
      {message}
    </p>
  );
}
