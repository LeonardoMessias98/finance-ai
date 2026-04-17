import Link from "next/link";
import { CheckCircle2, CircleDashed, PencilLine, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { GoalListItem } from "@/features/goals/types/goal";
import { buildGoalsHref } from "@/features/goals/utils/build-goals-href";
import { formatGoalAmountFromCents, formatGoalDate, getGoalStatusLabel } from "@/features/goals/utils/goal-formatters";
import { cn } from "@/lib/utils";

type GoalsListProps = {
  goals: GoalListItem[];
  editingGoalId?: string;
};

function getStatusBadgeClassName(isCompleted: boolean): string {
  return isCompleted ? "bg-primary/10 text-primary" : "bg-background/70 text-foreground border border-border";
}

function getProgressBarClassName(isCompleted: boolean): string {
  return isCompleted ? "bg-primary" : "bg-accent";
}

export function GoalsList({ goals, editingGoalId }: GoalsListProps) {
  return (
    <Card className="border-primary/10 bg-card/85">
      <CardHeader className="space-y-1">
        <CardTitle className="font-display text-3xl">Metas financeiras</CardTitle>
        <CardDescription>
          O status é atualizado automaticamente quando o valor acumulado alcança ou supera o valor alvo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-border bg-background/60 px-5 py-8 text-center text-sm text-muted-foreground">
            Nenhuma meta cadastrada ainda. Use o formulário ao lado para criar a primeira meta financeira.
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => (
              <div
                className={cn(
                  "space-y-4 rounded-[1.5rem] border border-border/80 bg-background/70 p-4",
                  editingGoalId === goal.id ? "border-primary/40 bg-primary/5" : ""
                )}
                key={goal.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-foreground">{goal.name}</p>
                      <Badge className={getStatusBadgeClassName(goal.isCompleted)}>
                        {getGoalStatusLabel(goal.isCompleted)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>Acumulado {formatGoalAmountFromCents(goal.currentAmount)}</span>
                      <span>Alvo {formatGoalAmountFromCents(goal.targetAmount)}</span>
                      <span>Faltam {formatGoalAmountFromCents(goal.remainingAmount)}</span>
                      {goal.targetDate ? <span>Prazo {formatGoalDate(goal.targetDate)}</span> : <span>Sem prazo definido</span>}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-start gap-3">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">{goal.progressPercentage.toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">de progresso</p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link
                        href={buildGoalsHref({
                          goalId: goal.id
                        })}
                      >
                        <PencilLine className="h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-3 overflow-hidden rounded-full bg-secondary/80">
                    <div
                      className={cn("h-full rounded-full transition-[width]", getProgressBarClassName(goal.isCompleted))}
                      style={{
                        width: `${goal.cappedProgressPercentage}%`
                      }}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      {goal.isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <CircleDashed className="h-4 w-4" />}
                      {goal.isCompleted ? "Meta concluída automaticamente." : "Meta em construção."}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      {goal.isCompleted
                        ? "Objetivo financeiro alcançado."
                        : `Falta ${formatGoalAmountFromCents(goal.remainingAmount)} para concluir.`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
