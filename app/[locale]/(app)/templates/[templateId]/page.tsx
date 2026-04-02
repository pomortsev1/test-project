import { redirect } from "next/navigation";

import {
  getCatalogContextForCurrentUser,
  getTemplateEditorCapabilities,
  getTemplateDetails,
} from "@/app/actions/templates";
import { TemplateEditor } from "@/components/templates/template-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeLocale } from "@/lib/i18n/config";
import { getServerI18n } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function LocalizedTemplateDetailPage({
  params,
}: {
  params: Promise<{ locale: string; templateId: string }>;
}) {
  const { locale: localeParam, templateId } = await params;
  const locale = normalizeLocale(localeParam);

  if (!locale) {
    redirect("/");
  }

  const { t } = await getServerI18n(locale);
  const [detailState, catalogState, capabilities] = await Promise.all([
    getTemplateDetails(templateId),
    getCatalogContextForCurrentUser(),
    getTemplateEditorCapabilities(),
  ]);

  if (!detailState.detail) {
    return (
      <Card className="border border-dashed border-border/80 bg-card/80 shadow-sm">
        <CardHeader className="gap-3">
          <CardTitle className="text-2xl">{t("Template not found")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
          <p>
            {t("This template may have been deleted, or this workspace does not own it.")}
          </p>
          <p>{t("Pick the default template on the left to keep going.")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <TemplateEditor
      key={`${detailState.detail.template.id}:${detailState.detail.template.name}:${detailState.detail.template.itemCount}:${detailState.detail.template.isDefault}`}
      detail={detailState.detail}
      categories={catalogState.categories}
      catalogSuggestions={catalogState.suggestions}
      canMutate={detailState.hasSession && detailState.isConfigured}
      issue={detailState.issue ?? catalogState.issue}
      supportsOptionalMeasurements={capabilities.supportsOptionalMeasurements}
    />
  );
}
