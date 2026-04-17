import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { GoalForm } from "@/features/goals/components/goal-form";
import { GoalsList } from "@/features/goals/components/goals-list";
import { getGoalForEditing } from "@/features/goals/services/get-goal-for-editing-service";
import { listGoalsForManagement } from "@/features/goals/services/list-goals-for-management-service";
import { buildGoalsHref } from "@/features/goals/utils/build-goals-href";
import { formatGoalAmountFromCents } from "@/features/goals/utils/goal-formatters";

type GoalsPageProps = {
  editingGoalId?: string;
};

export async function GoalsPage({ editingGoalId }: GoalsPageProps) {
  const [goals, editingGoal] = await Promise.all([
    listGoalsForManagement(),
    editingGoalId ? getGoalForEditing(editingGoalId) : Promise.resolve(null)
  ]);

  const completedGoals = goals.filter((goal) => goal.isCompleted);
  const activeGoals = goals.filter((goal) => !goal.isCompleted);
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const hasEditingError = Boolean(editingGoalId) && !editingGoal;
  const returnHref = buildGoalsHref();

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Metas</h1>
          <p className="text-sm text-muted-foreground">{goals.length} metas cadastradas</p>
        </div>

        {hasEditingError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            A meta selecionada para edição não foi encontrada. A página voltou ao modo de criação.
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-3">
          <Card>
            <CardContent className="space-y-2 pt-5">
              <p className="text-sm text-muted-foreground">Valor acumulado</p>
              <p className="text-2xl font-semibold text-foreground">{formatGoalAmountFromCents(totalCurrentAmount)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 pt-5">
              <p className="text-sm text-muted-foreground">Em andamento</p>
              <p className="text-2xl font-semibold text-foreground">{activeGoals.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 pt-5">
              <p className="text-sm text-muted-foreground">Valor alvo</p>
              <p className="text-2xl font-semibold text-foreground">{formatGoalAmountFromCents(totalTargetAmount)}</p>
              <p className="text-xs text-muted-foreground">{completedGoals.length} concluídas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <GoalsList editingGoalId={editingGoal?.id} goals={goals} />
          <GoalForm goal={editingGoal} returnHref={returnHref} />
        </div>
      </section>
    </AppShell>
  );
}
