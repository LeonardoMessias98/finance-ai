import { redirect } from "next/navigation";

import { GoalsPage } from "@/features/goals/components/goals-page";
import { getOptionalAuthenticatedAppUser } from "@/lib/auth/session";
import { isTruthySearchParam } from "@/lib/search-params";

type GoalsRoutePageProps = {
  searchParams?: Promise<{
    goalId?: string | string[];
    create?: string | string[];
  }>;
};

export default async function GoalsRoutePage({ searchParams }: GoalsRoutePageProps) {
  const user = await getOptionalAuthenticatedAppUser();

  if (!user) {
    redirect("/login?next=/goals");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const editingGoalId = typeof resolvedSearchParams.goalId === "string" ? resolvedSearchParams.goalId : undefined;
  const isCreateModalOpen = isTruthySearchParam(resolvedSearchParams.create);

  return <GoalsPage editingGoalId={editingGoalId} isCreateModalOpen={isCreateModalOpen} />;
}
