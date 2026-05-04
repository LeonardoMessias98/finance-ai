import "server-only";

import { findAccountByIdForUser } from "@/features/accounts/repositories/account-repository";
import { isCreditAccount } from "@/features/accounts/utils/account-type-compatibility";
import { findCategoryByIdForUser } from "@/features/categories/repositories/category-repository";
import { getCategoryTypeLabel } from "@/features/categories/utils/category-formatters";
import { createTransactionFieldError } from "@/features/transactions/services/transaction-errors";
import type { UpdateTransactionInput } from "@/features/transactions/types/transaction";

type TransactionRelationInput = Pick<
  UpdateTransactionInput,
  "type" | "accountId" | "categoryId" | "installment" | "paymentForCreditAccountId"
>;
const creditAccountIncomeMessage =
  "Contas de crédito não aceitam receitas. Use uma conta de débito para registrar entradas.";
const creditInstallmentMessage = "Parcelamento está disponível apenas para despesas em contas de crédito.";
const creditPaymentSourceMessage = "Pagamento de cartão deve sair de uma conta de débito.";
const creditPaymentTargetMessage = "Associe o pagamento a uma conta de crédito.";

export async function assertTransactionRelations(input: TransactionRelationInput, userId: string): Promise<void> {
  const [sourceAccount, paymentCreditAccount, category] = await Promise.all([
    findAccountByIdForUser(input.accountId, userId),
    input.paymentForCreditAccountId
      ? findAccountByIdForUser(input.paymentForCreditAccountId, userId)
      : Promise.resolve(null),
    input.categoryId ? findCategoryByIdForUser(input.categoryId, userId) : Promise.resolve(null)
  ]);

  if (!sourceAccount) {
    throw createTransactionFieldError("accountId", "A conta de origem selecionada não foi encontrada.");
  }

  if (input.type === "income" && isCreditAccount(sourceAccount.type)) {
    throw createTransactionFieldError("accountId", creditAccountIncomeMessage);
  }

  if (input.installment && input.installment.total > 1 && !isCreditAccount(sourceAccount.type)) {
    throw createTransactionFieldError("accountId", creditInstallmentMessage);
  }

  if (input.paymentForCreditAccountId) {
    if (input.type !== "expense") {
      throw createTransactionFieldError("paymentForCreditAccountId", "Pagamento de cartão deve ser uma despesa.");
    }

    if (isCreditAccount(sourceAccount.type)) {
      throw createTransactionFieldError("accountId", creditPaymentSourceMessage);
    }

    if (!paymentCreditAccount) {
      throw createTransactionFieldError("paymentForCreditAccountId", "A conta de crédito selecionada não foi encontrada.");
    }

    if (!isCreditAccount(paymentCreditAccount.type)) {
      throw createTransactionFieldError("paymentForCreditAccountId", creditPaymentTargetMessage);
    }
  }

  if (!input.categoryId) {
    throw createTransactionFieldError("categoryId", "Selecione uma categoria.");
  }

  if (!category) {
    throw createTransactionFieldError("categoryId", "A categoria selecionada não foi encontrada.");
  }

  if (category.type !== input.type) {
    throw createTransactionFieldError(
      "categoryId",
      `A categoria selecionada precisa ser do tipo ${getCategoryTypeLabel(input.type).toLowerCase()}.`
    );
  }
}
