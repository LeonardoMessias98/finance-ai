"use client";

import type { ComponentProps } from "react";

import { useIsMobile } from "@/hooks/use-is-mobile";
import { ModalShell } from "@/components/ui/modal-shell";

type MobileOnlyModalShellProps = ComponentProps<typeof ModalShell>;

export function MobileOnlyModalShell(props: MobileOnlyModalShellProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return <ModalShell {...props} />;
}
