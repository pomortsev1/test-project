import { redirect } from "next/navigation";

import { getTemplatesForCurrentUser } from "@/app/actions/templates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function TemplatesIndexPage() {
  const templatesState = await getTemplatesForCurrentUser();
  const defaultTemplate =
    templatesState.templates.find((template) => template.isDefault) ??
    templatesState.templates[0];

  if (defaultTemplate) {
    redirect(`/templates/${defaultTemplate.id}`);
  }

  return (
    <Card className="border border-dashed border-border/80 bg-card/80 shadow-sm">
      <CardHeader className="gap-3">
        <CardTitle className="text-2xl">Start your first template</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
        <p>
          Give the template a clear purpose on the left, then fill it with
          saved suggestions or custom items grouped by category.
        </p>
        <p>
          The editor supports quantities, units, default-template switching, and
          optional save-to-catalog for brand-new ideas.
        </p>
      </CardContent>
    </Card>
  );
}
