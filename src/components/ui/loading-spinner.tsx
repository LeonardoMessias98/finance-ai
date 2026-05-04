import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  label?: string;
  className?: string;
};

export function LoadingSpinner({ label, className }: LoadingSpinnerProps) {
  return (
    <div
      aria-label={label}
      aria-live="polite"
      className={cn("inline-flex items-center gap-2 text-sm text-muted-foreground", className)}
      role="status"
    >
      <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin text-primary" />
      {label ? <span>{label}</span> : <span className="sr-only">Carregando</span>}
    </div>
  );
}
