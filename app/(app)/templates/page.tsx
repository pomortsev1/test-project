import { redirect } from "next/navigation";

import {
  getDefaultTemplateForCurrentUser,
  getTemplatesForCurrentUser,
} from "@/app/actions/templates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function TemplatesIndexPage() {
  const [defaultTemplate, templatesState] = await Promise.all([
    getDefaultTemplateForCurrentUser(),
    getTemplatesForCurrentUser(),
  ]);

  if (defaultTemplate) {
    redirect(`/templates/${defaultTemplate.id}`);
  }

  return (
    <Card className="border border-dashed border-border/80 bg-card/80 shadow-sm">
      <CardHeader className="gap-3">
        <CardTitle className="text-2xl">Starter template not ready yet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
        <p>
          New workspaces should open straight into the default packing list, so
          you should not need to create a template before you can start.
        </p>
        {templatesState.issue ? <p>{templatesState.issue}</p> : null}
      </CardContent>
    </Card>
  );
}
