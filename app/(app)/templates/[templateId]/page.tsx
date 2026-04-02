import {
  getCategoryOptionsForCurrentUser,
  getTemplateDetails,
} from "@/app/actions/templates";
import { TemplateEditor } from "@/components/templates/template-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const [detailState, categoriesState] = await Promise.all([
    getTemplateDetails(templateId),
    getCategoryOptionsForCurrentUser(),
  ]);

  if (!detailState.detail) {
    return (
      <Card className="border border-dashed border-border/80 bg-card/80 shadow-sm">
        <CardHeader className="gap-3">
          <CardTitle className="text-2xl">Template not found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
          <p>
            This template may have been deleted, or the current Google or
            anonymous workspace does not own it.
          </p>
          <p>
            Choose another template from the list on the left or create a new
            one.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <TemplateEditor
      key={`${detailState.detail.template.id}:${detailState.detail.template.name}:${detailState.detail.template.itemCount}:${detailState.detail.template.isDefault}`}
      detail={detailState.detail}
      categories={categoriesState.categories}
      canMutate={detailState.hasSession && detailState.isConfigured}
      issue={detailState.issue ?? categoriesState.issue}
    />
  );
}
