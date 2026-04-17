import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type HiddenField = {
  name: string;
  value: string;
};

type CompetencyMonthSwitcherProps = {
  competencyMonth: string;
  currentHref: string;
  formAction: string;
  hiddenFields?: HiddenField[];
  inputLabel?: string;
  nextHref: string;
  previousHref: string;
  submitLabel?: string;
};

export function CompetencyMonthSwitcher({
  competencyMonth,
  currentHref,
  formAction,
  hiddenFields = [],
  inputLabel = "Competência",
  nextHref,
  previousHref,
  submitLabel = "Aplicar mês"
}: CompetencyMonthSwitcherProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Button asChild type="button" variant="outline">
          <Link href={previousHref}>Mês anterior</Link>
        </Button>
        <Button asChild type="button" variant="outline">
          <Link href={currentHref}>Mês atual</Link>
        </Button>
        <Button asChild type="button" variant="outline">
          <Link href={nextHref}>Próximo mês</Link>
        </Button>
      </div>

      <form action={formAction} className="flex flex-wrap items-end gap-3" method="get">
        {hiddenFields.map((field) => (
          <input key={`${field.name}:${field.value}`} name={field.name} type="hidden" value={field.value} />
        ))}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="competencyMonth">
            {inputLabel}
          </label>
          <Input defaultValue={competencyMonth} id="competencyMonth" name="competencyMonth" type="month" />
        </div>

        <Button type="submit">{submitLabel}</Button>
      </form>
    </div>
  );
}
