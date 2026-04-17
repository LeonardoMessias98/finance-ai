import mongoose from "mongoose";
import { loadEnvConfig } from "@next/env";

import { seedInitialDatabase } from "@/lib/db/seeds/seed-initial-database";

loadEnvConfig(process.cwd());

type SeedScriptOptions = {
  includeSampleData: boolean;
  showHelp: boolean;
};

function parseSeedScriptOptions(argv: string[]): SeedScriptOptions {
  return {
    includeSampleData: argv.includes("--with-sample-data"),
    showHelp: argv.includes("--help") || argv.includes("-h")
  };
}

function printHelp() {
  console.log("Uso:");
  console.log("  npm run seed");
  console.log("  npm run seed -- --with-sample-data");
}

function printSeedSummary(result: Awaited<ReturnType<typeof seedInitialDatabase>>) {
  console.log("Seed inicial concluido.");
  console.log(`Competencia base: ${result.competencyMonth}`);
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
    includeSampleData: options.includeSampleData
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
