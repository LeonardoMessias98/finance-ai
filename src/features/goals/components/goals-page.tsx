import { AuthenticatedAppShell } from "@/components/layout/authenticated-app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { MobileOnlyModalShell } from "@/components/ui/mobile-only-modal-shell";
import { Button } from "@/components/ui/button";
import { StatusBanner } from "@/components/ui/status-banner";
import { GoalForm } from "@/features/goals/components/goal-form";
import { GoalsList } from "@/features/goals/components/goals-list";
import { getGoalForEditing } from "@/features/goals/services/get-goal-for-editing-service";
import { listGoalsForManagement } from "@/features/goals/services/list-goals-for-management-service";
import { buildGoalsHref } from "@/features/goals/utils/build-goals-href";
import Link from "next/link";

type GoalsPageProps = {
  editingGoalId?: string;
  isCreateModalOpen?: boolean;
};

export async function GoalsPage({ editingGoalId, isCreateModalOpen = false }: GoalsPageProps) {
  const [goals, editingGoal] = await Promise.all([
    listGoalsForManagement(),
    editingGoalId ? getGoalForEditing(editingGoalId) : Promise.resolve(null)
  ]);

  const hasEditingError = Boolean(editingGoalId) && !editingGoal;
  const returnHref = buildGoalsHref();
  const createHref = buildGoalsHref({
    create: true
  });
  const isMobileModalOpen = isCreateModalOpen || Boolean(editingGoal);

  return (
    <AuthenticatedAppShell>
      <PageSection>
        <PageHeader
          actions={
            <Button asChild className="lg:hidden" type="button">
              <Link href={createHref}>Nova meta</Link>
            </Button>
          }
          description={`${goals.length} metas cadastradas`}
          title="Metas"
        />

        {hasEditingError ? (
          <StatusBanner
            message="A meta selecionada para edição não foi encontrada. A página voltou ao modo de criação."
            variant="error"
          />
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <GoalsList editingGoalId={editingGoal?.id} goals={goals} />
          <div className="hidden lg:block">
            <GoalForm goal={editingGoal} returnHref={returnHref} />
          </div>
        </div>

        {isMobileModalOpen ? (
          <MobileOnlyModalShell closeHref={returnHref} mobileFullscreen title={editingGoal ? "Editar meta" : "Nova meta"}>
            <GoalForm closeOnSuccess goal={editingGoal} returnHref={returnHref} showCard={false} />
          </MobileOnlyModalShell>
        ) : null}
      </PageSection>
    </AuthenticatedAppShell>
  );
}
