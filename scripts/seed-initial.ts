import mongoose from "mongoose";
import { loadEnvConfig } from "@next/env";

import { seedInitialDatabase } from "@/lib/db/seeds/seed-initial-database";

loadEnvConfig(process.cwd());

type SeedScriptOptions = {
  includeSampleData: boolean;
  resetDatabase: boolean;
  showHelp: boolean;
};

function parseSeedScriptOptions(argv: string[]): SeedScriptOptions {
  return {
    includeSampleData: argv.includes("--with-sample-data"),
    resetDatabase: argv.includes("--reset"),
    showHelp: argv.includes("--help") || argv.includes("-h")
  };
}

function printHelp() {
  console.log("Uso:");
  console.log("  npm run seed");
  console.log("  npm run seed -- --with-sample-data");
  console.log("  npm run seed -- --reset");
  console.log("  npm run seed -- --reset --with-sample-data");
}

function printSeedSummary(result: Awaited<ReturnType<typeof seedInitialDatabase>>) {
  console.log("Seed inicial concluido.");
  console.log(`Competencia base: ${result.competencyMonth}`);

  if (result.resetApplied && result.resetSummary) {
    console.log("Reset aplicado antes do seed:");
    console.log(`- Usuarios removidos: ${result.resetSummary.users}`);
    console.log(`- Refresh tokens removidos: ${result.resetSummary.refreshTokens}`);
    console.log(`- Contas removidas: ${result.resetSummary.accounts}`);
    console.log(`- Categorias removidas: ${result.resetSummary.categories}`);
    console.log(`- Transacoes removidas: ${result.resetSummary.transactions}`);
    console.log(`- Orcamentos removidos: ${result.resetSummary.budgets}`);
    console.log(`- Metas removidas: ${result.resetSummary.goals}`);
  }

  console.log(`Contas: ${result.accounts.created} criadas, ${result.accounts.existing} existentes.`);
  console.log(`Categorias: ${result.categories.created} criadas, ${result.categories.existing} existentes.`);
  console.log(`Transacoes de exemplo: ${result.transactions.created} criadas, ${result.transactions.existing} existentes.`);
  console.log(`Orcamentos de exemplo: ${result.budgets.created} criados, ${result.budgets.existing} existentes.`);
  console.log(`Metas de exemplo: ${result.goals.created} criadas, ${result.goals.existing} existentes.`);

  if (!result.includedSampleData) {
    console.log("Use --with-sample-data para incluir transacoes, orcamento e meta de exemplo.");
  }
}

async function main() {
  const options = parseSeedScriptOptions(process.argv.slice(2));

  if (options.showHelp) {
    printHelp();
    return;
  }

  const result = await seedInitialDatabase({
    includeSampleData: options.includeSampleData,
    resetDatabase: options.resetDatabase
  });

  printSeedSummary(result);
}

main()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Falha desconhecida ao executar o seed inicial.";

    console.error("Falha ao executar o seed inicial.");
    console.error(message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
