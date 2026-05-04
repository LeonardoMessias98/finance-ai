import { redirect } from "next/navigation";

import { FamilyPage } from "@/features/families/components/family-page";
import { getCurrentCompetencyMonth, isCompetencyMonth } from "@/lib/dates/competency-month";
import { getOptionalAuthenticatedAppUser } from "@/lib/auth/session";

type FamilyRoutePageProps = {
  searchParams?: Promise<{
    competencyMonth?: string | string[];
  }>;
};

export default async function FamilyRoutePage({ searchParams }: FamilyRoutePageProps) {
  const user = await getOptionalAuthenticatedAppUser();

  if (!user) {
    redirect("/login?next=/family");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const competencyMonth =
    typeof resolvedSearchParams.competencyMonth === "string" &&
    isCompetencyMonth(resolvedSearchParams.competencyMonth)
      ? resolvedSearchParams.competencyMonth
      : getCurrentCompetencyMonth();

  return <FamilyPage competencyMonth={competencyMonth} />;
}
