"use client";

import { useContext } from "react";

import { GlobalTransactionModalContext } from "@/features/transactions/context/global-transaction-modal-context";

export function useOptionalGlobalTransactionModal() {
  return useContext(GlobalTransactionModalContext);
}

export function useGlobalTransactionModal() {
  const context = useOptionalGlobalTransactionModal();

  if (!context) {
    throw new Error("useGlobalTransactionModal must be used within GlobalTransactionModalProvider.");
  }

  return context;
}
