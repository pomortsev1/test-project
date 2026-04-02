"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Star } from "lucide-react";

import { useOptionalI18n } from "@/components/i18n/i18n-provider";
import type { TemplateSummary } from "@/app/actions/templates";
import { CreateTemplateForm } from "@/components/templates/create-template-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TemplateSidebarProps = {
  templates: TemplateSummary[];
  canMutate: boolean;
};

function TemplateLink({
  template,
  isActive,
  label,
  href,
}: {
  template: TemplateSummary;
  isActive: boolean;
  label?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-2xl border border-border/70 bg-background/85 p-4 shadow-sm transition hover:border-foreground/20 hover:bg-background",
        isActive &&
          "border-foreground/25 bg-foreground/[0.03] ring-1 ring-foreground/10",
      )}
    >
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {label ? <Badge variant="secondary">{label}</Badge> : null}
          {template.isDefault ? (
            <Badge variant="outline" className="gap-1.5">
              <Star className="size-3.5" />
              Default
            </Badge>
          ) : null}
        </div>
        <div>
          <p className="font-medium">{template.name}</p>
          <p className="text-sm text-muted-foreground">
            {template.itemCount} {template.itemCount === 1 ? "item" : "items"}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function TemplateSidebar({
  templates,
  canMutate,
}: TemplateSidebarProps) {
  const pathname = usePathname();
  const i18n = useOptionalI18n();
  const localizeHref = (value: string) => i18n?.localizePath(value) ?? value;
  const t = (value: string) => i18n?.t(value) ?? value;
  const [showCreateForm, setShowCreateForm] = useState(false);
  const defaultTemplate =
    templates.find((template) => template.isDefault) ?? templates[0] ?? null;
  const additionalTemplates = templates.filter(
    (template) => template.id !== defaultTemplate?.id,
  );

  return (
    <div className="space-y-4">
      <Card className="border border-border/70 bg-card/92 shadow-sm">
        <CardHeader className="gap-2">
          <CardTitle className="text-base">Default template</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            {t("This is the main list most trips should start from.")}
          </p>
        </CardHeader>
        <CardContent>
          {defaultTemplate ? (
            <TemplateLink
              template={defaultTemplate}
              href={localizeHref(`/templates/${defaultTemplate.id}`)}
              isActive={pathname === localizeHref(`/templates/${defaultTemplate.id}`)}
              label={t("Start here")}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/35 p-4 text-sm leading-6 text-muted-foreground">
              {t("Your starter template should appear here automatically.")}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border border-border/70 bg-card/88 shadow-sm">
        <CardHeader className="gap-2">
          <CardTitle className="text-base">{t("Other templates")}</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            {t("Keep extras only for clearly different trip styles.")}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {additionalTemplates.length > 0 ? (
            additionalTemplates.map((template) => (
              <TemplateLink
                key={template.id}
                template={template}
                href={localizeHref(`/templates/${template.id}`)}
                isActive={pathname === localizeHref(`/templates/${template.id}`)}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/35 p-4 text-sm leading-6 text-muted-foreground">
              {t("No extra templates yet.")}
            </div>
          )}
        </CardContent>
      </Card>

      {defaultTemplate ? (
        <Card className="border border-border/70 bg-card/90 shadow-sm">
          <CardHeader className="gap-2">
            <CardTitle className="text-base">{t("Create another template")}</CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              {t("Use this for a real variation like winter gear or work travel.")}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {showCreateForm ? (
              <>
                <CreateTemplateForm
                  disabled={!canMutate}
                  fieldLabel={t("Extra template name")}
                  onCreated={() => setShowCreateForm(false)}
                  placeholder={t("Winter carry-on")}
                  submitLabel={t("Create extra template")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 w-full rounded-xl"
                  onClick={() => setShowCreateForm(false)}
                >
                  {t("Cancel")}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                disabled={!canMutate}
                className="h-11 w-full rounded-xl"
                onClick={() => setShowCreateForm(true)}
              >
                {t("Create extra template")}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border/70 bg-card/90 shadow-sm">
          <CardHeader className="gap-2">
            <CardTitle className="text-base">{t("Create a template now")}</CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              {t("If the starter template is delayed, create one here so you can keep going.")}
            </p>
          </CardHeader>
          <CardContent>
            <CreateTemplateForm
              disabled={!canMutate}
              fieldLabel={t("Template name")}
              placeholder={t("Weekend carry-on")}
              submitLabel={t("Create template")}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
