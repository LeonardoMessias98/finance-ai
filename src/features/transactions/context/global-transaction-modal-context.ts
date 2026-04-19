"use client";

import { createContext } from "react";

import type { OpenGlobalTransactionModalOptions } from "@/features/transactions/types/global-transaction-modal";

export type GlobalTransactionModalContextValue = {
  close: () => void;
  open: (options?: OpenGlobalTransactionModalOptions) => void;
};

export const GlobalTransactionModalContext = createContext<GlobalTransactionModalContextValue | null>(null);
