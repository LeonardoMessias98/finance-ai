"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ModalShellProps = {
  title: string;
  children: ReactNode;
  closeHref?: string;
  description?: string;
  mobileFullscreen?: boolean;
  className?: string;
  contentClassName?: string;
  onClose?: () => void;
};

export function ModalShell({
  title,
  children,
  closeHref,
  description,
  mobileFullscreen = false,
  className,
  contentClassName,
  onClose
}: ModalShellProps) {
  const router = useRouter();
  const titleId = useId();
  const descriptionId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const focusFrame = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();

      if (onClose) {
        onClose();
        return;
      }

      if (closeHref) {
        router.replace(closeHref);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(focusFrame);
    };
  }, [closeHref, onClose, router]);

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    if (closeHref) {
      router.replace(closeHref);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/82 backdrop-blur-sm" onClick={handleClose}>
      <div
        className={cn(
          "fixed inset-0 overflow-y-auto p-0 sm:p-6",
          mobileFullscreen ? "" : "px-4 py-6 sm:px-6 sm:py-8"
        )}
      >
        <div className="flex min-h-full items-start justify-center sm:items-center">
          <div
            aria-describedby={description ? descriptionId : undefined}
            aria-labelledby={titleId}
            aria-modal="true"
            className={cn(
              "w-full border border-border bg-card text-card-foreground shadow-panel",
              mobileFullscreen
                ? "min-h-[100dvh] rounded-none border-x-0 border-y-0 sm:min-h-0 sm:max-w-2xl sm:rounded-[1.75rem] sm:border"
                : "max-w-2xl rounded-[1.75rem]",
              className
            )}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border/80 px-5 pb-4 pt-6 sm:px-6 sm:pb-5 sm:pt-6">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-foreground" id={titleId}>
                  {title}
                </h2>
                {description ? (
                  <p className="text-sm text-muted-foreground" id={descriptionId}>
                    {description}
                  </p>
                ) : null}
              </div>

              <Button
                aria-label="Fechar"
                className="shrink-0"
                onClick={handleClose}
                ref={closeButtonRef}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className={cn("px-5 pb-6 pt-6 sm:px-6 sm:pb-6 sm:pt-6", contentClassName)}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
