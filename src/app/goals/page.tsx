import { redirect } from "next/navigation";

import { GoalsPage } from "@/features/goals/components/goals-page";
import { getOptionalAuthenticatedAppUser } from "@/lib/auth/session";

type GoalsRoutePageProps = {
  searchParams?: Promise<{
    goalId?: string | string[];
  }>;
};

export default async function GoalsRoutePage({ searchParams }: GoalsRoutePageProps) {
  const user = await getOptionalAuthenticatedAppUser();

  if (!user) {
    redirect("/login?next=/goals");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const editingGoalId = typeof resolvedSearchParams.goalId === "string" ? resolvedSearchParams.goalId : undefined;

  return <GoalsPage editingGoalId={editingGoalId} />;
}
