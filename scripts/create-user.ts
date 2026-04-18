#!/usr/bin/env node

/**
 * Script para criar novo usuário
 *
 * Função:
 * - Criar um novo usuário na aplicação
 * - Usar dados de variáveis de ambiente
 *
 * Uso:
 *   npm run user:create
 *   NODE_ENV=staging npm run user:create
 *
 * Variáveis de ambiente necessárias:
 *   MONGODB_URI
 *   SEED_USER_FIRST_NAME
 *   SEED_USER_LAST_NAME
 *   SEED_USER_BIRTH_DATE (formato: YYYY-MM-DD)
 *   SEED_USER_EMAIL
 *   SEED_USER_PASSWORD_SHA256
 *
 * Para criar múltiplos usuários com prefixos diferentes:
 *   USER_PREFIX=ADMIN npm run user:create
 *   USER_PREFIX=BACKUP npm run user:create
 */

import mongoose from "mongoose";
import { loadEnvConfig } from "@next/env";
import { connectToDatabase } from "@/lib/db/connect";
import { createUser, readUserInputFromEnv } from "./lib/user-creation";

loadEnvConfig(process.cwd());

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const NODE_ENV = process.env.NODE_ENV || "development";
const USER_PREFIX = process.env.USER_PREFIX || "SEED_USER";

function printHelp() {
  console.log("Uso:");
  console.log("  npm run user:create");
  console.log("");
  console.log("Com prefixo de env var customizado:");
  console.log("  USER_PREFIX=ADMIN npm run user:create");
  console.log("");
  console.log("Variáveis de ambiente necessárias:");
  console.log("  MONGODB_URI");
  console.log("  ${USER_PREFIX}_FIRST_NAME");
  console.log("  ${USER_PREFIX}_LAST_NAME");
  console.log("  ${USER_PREFIX}_BIRTH_DATE (YYYY-MM-DD)");
  console.log("  ${USER_PREFIX}_EMAIL");
  console.log("  ${USER_PREFIX}_PASSWORD_SHA256");
}

// ============================================================================
// EXECUÇÃO PRINCIPAL
// ============================================================================

async function main() {
  console.clear();
  console.log("=".repeat(70));
  console.log("CRIAR NOVO USUÁRIO - Finance AI");
  console.log("=".repeat(70));
  console.log("");

  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    printHelp();
    process.exit(0);
  }

  try {
    console.log(`Ambiente: ${NODE_ENV}`);
    console.log(`Prefixo env vars: ${USER_PREFIX}`);
    console.log("");

    // Conectar ao banco
    console.log("📡 Conectando ao banco de dados...");
    await connectToDatabase();
    console.log("✓ Conectado com sucesso");
    console.log("");

    // Ler dados de env vars
    console.log(`📖 Lendo dados do usuário (${USER_PREFIX}_*)...`);
    const userInput = readUserInputFromEnv();
    console.log("✓ Dados validados");
    console.log("");

    // Criar usuário
    console.log("👤 Criando usuário...");
    const createdUser = await createUser(userInput, {
      skipEmailCheck: false
    });
    console.log("✓ Usuário criado com sucesso:");
    console.log(`   - Nome: ${createdUser.firstName} ${createdUser.lastName}`);
    console.log(`   - Email: ${createdUser.email}`);
    console.log(`   - ID: ${createdUser.id}`);
    console.log("");

    console.log("=".repeat(70));
    console.log("✅ Usuário criado com sucesso!");
    console.log("=".repeat(70));
    console.log("");

    // Desconectar
    await mongoose.disconnect();
  } catch (error) {
    console.error("");
    console.error("=".repeat(70));
    console.error("❌ ERRO AO CRIAR USUÁRIO");
    console.error("=".repeat(70));

    if (error instanceof Error) {
      console.error(`Mensagem: ${error.message}`);
    } else {
      console.error("Erro desconhecido:", error);
    }

    console.error("");
    console.error("Use 'npm run user:create -- --help' para mais informações");

    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
