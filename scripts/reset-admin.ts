#!/usr/bin/env node

/**
 * Script administrativo de reset inicial do ambiente
 *
 * Função:
 * - Limpar todos os dados do banco
 * - Criar usuário inicial seguro com dados de env vars
 * - Deixar o ambiente pronto para uso
 *
 * ⚠️ CUIDADO: Este script deleta TODOS os dados!
 * Segurança: Rejeita execução em produção por padrão
 *
 * Uso:
 *   npm run reset:admin
 *   FORCE_RESET_PRODUCTION=true npm run reset:admin  # apenas em emergência
 *
 * Variáveis de ambiente necessárias:
 *   MONGODB_URI
 *   SEED_USER_FIRST_NAME
 *   SEED_USER_LAST_NAME
 *   SEED_USER_BIRTH_DATE (formato: YYYY-MM-DD)
 *   SEED_USER_EMAIL
 *   SEED_USER_PASSWORD_SHA256
 */

import mongoose from "mongoose";
import { loadEnvConfig } from "@next/env";
import { connectToDatabase } from "@/lib/db/connect";
import { AccountModel } from "@/lib/db/models/account-model";
import { BudgetModel } from "@/lib/db/models/budget-model";
import { CategoryModel } from "@/lib/db/models/category-model";
import { GoalModel } from "@/lib/db/models/goal-model";
import { TransactionModel } from "@/lib/db/models/transaction-model";
import { UserModel } from "@/lib/db/models/user-model";
import { RefreshTokenModel } from "@/lib/db/models/refresh-token-model";
import { createUser, readUserInputFromEnv } from "./lib/user-creation";

loadEnvConfig(process.cwd());

// ============================================================================
// CONFIGURAÇÃO DE SEGURANÇA
// ============================================================================

const NODE_ENV = process.env.NODE_ENV || "development";
const FORCE_RESET_PRODUCTION = process.env.FORCE_RESET_PRODUCTION === "true";
const IS_PRODUCTION = NODE_ENV === "production";

function checkProductionSafety() {
  if (IS_PRODUCTION && !FORCE_RESET_PRODUCTION) {
    console.error("❌ ERRO: Não é permitido executar reset em produção!");
    console.error("");
    console.error("Se você realmente precisa fazer isso, use:");
    console.error("  FORCE_RESET_PRODUCTION=true npm run reset:admin");
    console.error("");
    console.error("Considere fazer um backup antes!");
    process.exit(1);
  }

  if (IS_PRODUCTION && FORCE_RESET_PRODUCTION) {
    console.warn("⚠️  AVISO: Você está executando RESET EM PRODUÇÃO!");
    console.warn("");
  }
}

function validateEnvironmentVariables() {
  const required = ["MONGODB_URI"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("❌ ERRO: Variáveis de ambiente ausentes:");
    missing.forEach((key) => console.error(`   - ${key}`));
    process.exit(1);
  }

  // User variables will be validated when reading from env
}

// ============================================================================
// RESET DE DADOS
// ============================================================================

interface ResetSummary {
  users: number;
  refreshTokens: number;
  accounts: number;
  categories: number;
  transactions: number;
  budgets: number;
  goals: number;
}

async function clearAllCollections(): Promise<ResetSummary> {
  console.log("🗑️  Limpando coleções do banco...");

  const results: ResetSummary = {
    users: 0,
    refreshTokens: 0,
    accounts: 0,
    categories: 0,
    transactions: 0,
    budgets: 0,
    goals: 0
  };

  try {
    const userResult = await UserModel.deleteMany({});
    results.users = userResult.deletedCount || 0;

    const refreshTokenResult = await RefreshTokenModel.deleteMany({});
    results.refreshTokens = refreshTokenResult.deletedCount || 0;

    const accountResult = await AccountModel.deleteMany({});
    results.accounts = accountResult.deletedCount || 0;

    const categoryResult = await CategoryModel.deleteMany({});
    results.categories = categoryResult.deletedCount || 0;

    const transactionResult = await TransactionModel.deleteMany({});
    results.transactions = transactionResult.deletedCount || 0;

    const budgetResult = await BudgetModel.deleteMany({});
    results.budgets = budgetResult.deletedCount || 0;

    const goalResult = await GoalModel.deleteMany({});
    results.goals = goalResult.deletedCount || 0;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Erro ao limpar coleções: ${error.message}`);
    }
    throw error;
  }

  return results;
}

// ============================================================================
// CRIAÇÃO DE USUÁRIO INICIAL
// ============================================================================

interface InitialUserCreationResult {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// ============================================================================
// CONFIRMAÇÃO INTERATIVA
// ============================================================================

function promptConfirmation(): boolean {
  console.log("");
  console.warn("⚠️  AVISO: Esta ação vai DELETAR TODOS os dados do banco!");
  console.warn("");
  console.log("Dados que serão removidos:");
  console.log("  • Usuários (exceto o novo)");
  console.log("  • Contas");
  console.log("  • Categorias");
  console.log("  • Transações");
  console.log("  • Orçamentos");
  console.log("  • Metas");
  console.log("  • Refresh tokens");
  console.log("");

  // Em CI/CD ou quando não há terminal interativo, assumir "sim"
  if (!process.stdin.isTTY) {
    return true;
  }

  // Prompt não é possível em Node.js puro sem dependências
  // Usar abordagem com flag segura
  if (!process.argv.includes("--confirm")) {
    console.log("Para confirmar, use:");
    console.log("  npm run reset:admin -- --confirm");
    process.exit(0);
  }

  return true;
}

// ============================================================================
// EXECUÇÃO PRINCIPAL
// ============================================================================

async function main() {
  console.clear();
  console.log("=".repeat(70));
  console.log("RESET ADMINISTRATIVO - Finance AI");
  console.log("=".repeat(70));
  console.log("");

  try {
    // 1. Validações de segurança
    checkProductionSafety();
    validateEnvironmentVariables();

    // 2. Confirmação
    promptConfirmation();

    // 3. Conectar ao banco
    console.log("📡 Conectando ao banco de dados...");
    await connectToDatabase();
    console.log("✓ Conectado com sucesso");
    console.log("");

    // 4. Limpar coleções
    const resetSummary = await clearAllCollections();
    console.log("✓ Coleções limpas:");
    console.log(`   - Usuários: ${resetSummary.users} deletados`);
    console.log(`   - Contas: ${resetSummary.accounts} deletadas`);
    console.log(`   - Categorias: ${resetSummary.categories} deletadas`);
    console.log(`   - Transações: ${resetSummary.transactions} deletadas`);
    console.log(`   - Orçamentos: ${resetSummary.budgets} deletados`);
    console.log(`   - Metas: ${resetSummary.goals} deletadas`);
    console.log(`   - Refresh tokens: ${resetSummary.refreshTokens} deletados`);
    console.log("");

    // Desconectar
    await mongoose.disconnect();
  } catch (error) {
    console.error("");
    console.error("=".repeat(70));
    console.error("❌ ERRO DURANTE RESET");
    console.error("=".repeat(70));

    if (error instanceof Error) {
      console.error(`Mensagem: ${error.message}`);
      if (error.stack) {
        console.error("Stack:", error.stack);
      }
    } else {
      console.error("Erro desconhecido:", error);
    }

    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
