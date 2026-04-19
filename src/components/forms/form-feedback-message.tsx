import { cn } from "@/lib/utils";

type FormFeedbackMessageProps = {
  message?: string | null;
  status?: "success" | "error";
  className?: string;
};

export function FormFeedbackMessage({ message, status = "error", className }: FormFeedbackMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      aria-live="polite"
      className={cn(
        "rounded-xl px-4 py-3 text-sm",
        status === "success" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive",
        className
      )}
      role={status === "error" ? "alert" : "status"}
    >
      {message}
    </p>
  );
}
