import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FilterPanelProps = {
  children: ReactNode;
  title?: string;
  className?: string;
  contentClassName?: string;
};

export function FilterPanel({ children, title, className, contentClassName }: FilterPanelProps) {
  return (
    <Card className={cn("border-primary/10 bg-card/85", className)}>
      {title ? (
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className={cn(title ? "space-y-5 pt-5" : "pt-6", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
