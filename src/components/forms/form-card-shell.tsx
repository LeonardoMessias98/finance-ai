import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FormCardShellProps = {
  children: ReactNode;
  showCard?: boolean;
  title: string;
};

export function FormCardShell({ children, showCard = true, title }: FormCardShellProps) {
  if (!showCard) {
    return children;
  }

  return (
    <Card className="border-primary/10 bg-card/95">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
