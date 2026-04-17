import { GoalsPage } from "@/features/goals/components/goals-page";

type GoalsRoutePageProps = {
  searchParams?: Promise<{
    goalId?: string | string[];
  }>;
};

export default async function GoalsRoutePage({ searchParams }: GoalsRoutePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const editingGoalId = typeof resolvedSearchParams.goalId === "string" ? resolvedSearchParams.goalId : undefined;

  return <GoalsPage editingGoalId={editingGoalId} />;
}
