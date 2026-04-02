import {
  getCategoryOptionsForCurrentUser,
  getTemplateEditorCapabilities,
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
  const [detailState, categoriesState, capabilities] = await Promise.all([
    getTemplateDetails(templateId),
    getCategoryOptionsForCurrentUser(),
    getTemplateEditorCapabilities(),
  ]);

  if (!detailState.detail) {
    return (
      <Card className="border border-dashed border-border/80 bg-card/80 shadow-sm">
        <CardHeader className="gap-3">
          <CardTitle className="text-2xl">Template not found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
          <p>
            This template may have been deleted, or this workspace does not own
            it.
          </p>
          <p>Pick the default template on the left to keep going.</p>
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
      supportsOptionalMeasurements={capabilities.supportsOptionalMeasurements}
    />
  );
}
