import { DashboardPage } from "@/features/dashboard/components/dashboard-page";
import { getCurrentCompetencyMonth, isCompetencyMonth } from "@/lib/dates/competency-month";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams?: Promise<{
    competencyMonth?: string | string[];
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const competencyMonth =
    typeof resolvedSearchParams.competencyMonth === "string" && isCompetencyMonth(resolvedSearchParams.competencyMonth)
      ? resolvedSearchParams.competencyMonth
      : getCurrentCompetencyMonth();

  return <DashboardPage competencyMonth={competencyMonth} />;
}
