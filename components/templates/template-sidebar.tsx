"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Star } from "lucide-react";

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
}: {
  template: TemplateSummary;
  isActive: boolean;
  label?: string;
}) {
  return (
    <Link
      href={`/templates/${template.id}`}
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
            This is the main list most trips should start from.
          </p>
        </CardHeader>
        <CardContent>
          {defaultTemplate ? (
            <TemplateLink
              template={defaultTemplate}
              isActive={pathname === `/templates/${defaultTemplate.id}`}
              label="Start here"
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/35 p-4 text-sm leading-6 text-muted-foreground">
              Your starter template should appear here automatically.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border border-border/70 bg-card/88 shadow-sm">
        <CardHeader className="gap-2">
          <CardTitle className="text-base">Other templates</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Keep extras only for clearly different trip styles.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {additionalTemplates.length > 0 ? (
            additionalTemplates.map((template) => (
              <TemplateLink
                key={template.id}
                template={template}
                isActive={pathname === `/templates/${template.id}`}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/35 p-4 text-sm leading-6 text-muted-foreground">
              No extra templates yet.
            </div>
          )}
        </CardContent>
      </Card>

      {defaultTemplate ? (
        <Card className="border border-border/70 bg-card/90 shadow-sm">
          <CardHeader className="gap-2">
            <CardTitle className="text-base">Create another template</CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              Use this for a real variation like winter gear or work travel.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {showCreateForm ? (
              <>
                <CreateTemplateForm
                  disabled={!canMutate}
                  fieldLabel="Extra template name"
                  onCreated={() => setShowCreateForm(false)}
                  placeholder="Winter carry-on"
                  submitLabel="Create extra template"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 w-full rounded-xl"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
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
                Create extra template
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border/70 bg-card/90 shadow-sm">
          <CardHeader className="gap-2">
            <CardTitle className="text-base">Create a template now</CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              If the starter template is delayed, create one here so you can keep
              going.
            </p>
          </CardHeader>
          <CardContent>
            <CreateTemplateForm
              disabled={!canMutate}
              fieldLabel="Template name"
              placeholder="Weekend carry-on"
              submitLabel="Create template"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
