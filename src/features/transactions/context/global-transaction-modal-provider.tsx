"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { ModalShell } from "@/components/ui/modal-shell";
import type { Account } from "@/features/accounts/types/account";
import type { Category } from "@/features/categories/types/category";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import {
  GlobalTransactionModalContext,
  type GlobalTransactionModalContextValue
} from "@/features/transactions/context/global-transaction-modal-context";
import type { OpenGlobalTransactionModalOptions } from "@/features/transactions/types/global-transaction-modal";

type GlobalTransactionModalProviderProps = {
  accounts: Account[];
  categories: Category[];
  children: ReactNode;
};

export function GlobalTransactionModalProvider({
  accounts,
  categories,
  children
}: GlobalTransactionModalProviderProps) {
  const [modalOptions, setModalOptions] = useState<OpenGlobalTransactionModalOptions | null>(null);

  const close = () => {
    setModalOptions(null);
  };

  const open = (options: OpenGlobalTransactionModalOptions = {}) => {
    setModalOptions(options);
  };

  const contextValue = useMemo<GlobalTransactionModalContextValue>(
    () => ({
      close,
      open
    }),
    []
  );

  return (
    <GlobalTransactionModalContext.Provider value={contextValue}>
      {children}
      {modalOptions ? (
        <ModalShell mobileFullscreen onClose={close} title="Nova transação">
          <TransactionForm
            accounts={accounts}
            categories={categories}
            closeOnSuccess
            defaultCompetencyMonth={modalOptions.defaultCompetencyMonth}
            defaultType={modalOptions.defaultType}
            onCancel={close}
            onSuccess={close}
            showCard={false}
          />
        </ModalShell>
      ) : null}
    </GlobalTransactionModalContext.Provider>
  );
}
