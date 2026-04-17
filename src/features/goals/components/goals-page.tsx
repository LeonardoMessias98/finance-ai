import { AppShell } from "@/components/layout/app-shell";
import { GoalForm } from "@/features/goals/components/goal-form";
import { GoalsList } from "@/features/goals/components/goals-list";
import { getGoalForEditing } from "@/features/goals/services/get-goal-for-editing-service";
import { listGoalsForManagement } from "@/features/goals/services/list-goals-for-management-service";
import { buildGoalsHref } from "@/features/goals/utils/build-goals-href";

type GoalsPageProps = {
  editingGoalId?: string;
};

export async function GoalsPage({ editingGoalId }: GoalsPageProps) {
  const [goals, editingGoal] = await Promise.all([
    listGoalsForManagement(),
    editingGoalId ? getGoalForEditing(editingGoalId) : Promise.resolve(null)
  ]);

  const hasEditingError = Boolean(editingGoalId) && !editingGoal;
  const returnHref = buildGoalsHref();

  return (
    <AppShell>
      <section className="space-y-6 pt-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Metas</h1>
          <p className="text-sm text-muted-foreground">{goals.length} metas cadastradas</p>
        </div>

        {hasEditingError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            A meta selecionada para edição não foi encontrada. A página voltou ao modo de criação.
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <GoalsList editingGoalId={editingGoal?.id} goals={goals} />
          <GoalForm goal={editingGoal} returnHref={returnHref} />
        </div>
      </section>
    </AppShell>
  );
}
