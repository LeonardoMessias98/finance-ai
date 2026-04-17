import { DashboardPage } from "@/features/dashboard/components/dashboard-page";
import { transactionTypeValues, type TransactionType } from "@/features/transactions/types/transaction";
import { getCurrentCompetencyMonth, isCompetencyMonth } from "@/lib/dates/competency-month";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams?: Promise<{
    competencyMonth?: string | string[];
    type?: string | string[];
  }>;
};

function isTransactionType(value: string): value is TransactionType {
  return transactionTypeValues.includes(value as TransactionType);
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const competencyMonth =
    typeof resolvedSearchParams.competencyMonth === "string" && isCompetencyMonth(resolvedSearchParams.competencyMonth)
      ? resolvedSearchParams.competencyMonth
      : getCurrentCompetencyMonth();
  const selectedType =
    typeof resolvedSearchParams.type === "string" && isTransactionType(resolvedSearchParams.type)
      ? resolvedSearchParams.type
      : undefined;

  return <DashboardPage competencyMonth={competencyMonth} selectedType={selectedType} />;
}
