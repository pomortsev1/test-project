import { redirect } from "next/navigation";

import {
  getDefaultTemplateForCurrentUser,
  getTemplatesForCurrentUser,
} from "@/app/actions/templates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeLocale } from "@/lib/i18n/config";
import { getServerI18n } from "@/lib/i18n/server";
import { getLocalizedPathname } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function LocalizedTemplatesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);

  if (!locale) {
    redirect("/");
  }

  const { t } = await getServerI18n(locale);
  const [defaultTemplate, templatesState] = await Promise.all([
    getDefaultTemplateForCurrentUser(),
    getTemplatesForCurrentUser(),
  ]);

  if (defaultTemplate) {
    redirect(getLocalizedPathname(`/templates/${defaultTemplate.id}`, locale));
  }

  return (
    <Card className="border border-dashed border-border/80 bg-card/80 shadow-sm">
      <CardHeader className="gap-3">
        <CardTitle className="text-2xl">{t("Starter template not ready yet")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
        <p>
          {t(
            "New workspaces should open straight into the default packing list, so you should not need to create a template before you can start.",
          )}
        </p>
        {templatesState.issue ? <p>{templatesState.issue}</p> : null}
      </CardContent>
    </Card>
  );
}
