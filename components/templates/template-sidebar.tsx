"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, LayoutTemplate, Sparkles } from "lucide-react";

import type { TemplateSummary } from "@/app/actions/templates";
import { CreateTemplateForm } from "@/components/templates/create-template-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TemplateSidebarProps = {
  templates: TemplateSummary[];
  canMutate: boolean;
};

export function TemplateSidebar({
  templates,
  canMutate,
}: TemplateSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-5">
      <Card className="border border-border/70 bg-card/92 shadow-sm">
        <CardHeader className="gap-3">
          <Badge variant="outline" className="w-fit gap-1.5">
            <Sparkles className="size-3.5" />
            Templates
          </Badge>
          <div className="space-y-2">
            <CardTitle className="text-xl">Reusable packing setups</CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              Create focused lists for different travel rhythms, then refine the
              items inside each template.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <CreateTemplateForm disabled={!canMutate} />
        </CardContent>
      </Card>

      <Card className="border border-border/70 bg-card/88 shadow-sm">
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Compass className="size-4" />
              Your templates
            </CardTitle>
            <Badge variant="secondary">{templates.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {templates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/35 p-4 text-sm leading-6 text-muted-foreground">
              No templates yet. Start with a name above, then add reusable
              items, categories, and quantities.
            </div>
          ) : (
            templates.map((template) => {
              const href = `/templates/${template.id}`;
              const isActive = pathname === href;

              return (
                <Link
                  key={template.id}
                  href={href}
                  className={cn(
                    "block rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm transition hover:border-foreground/20 hover:bg-background",
                    isActive &&
                      "border-foreground/25 bg-foreground/[0.03] ring-1 ring-foreground/10",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {template.itemCount}{" "}
                        {template.itemCount === 1 ? "item" : "items"}
                      </p>
                    </div>
                    {template.isDefault ? (
                      <Badge variant="secondary">Default</Badge>
                    ) : null}
                  </div>
                </Link>
              );
            })
          )}

          {templates.length > 0 ? (
            <div className="rounded-2xl border border-border/70 bg-muted/35 p-4 text-sm leading-6 text-muted-foreground">
              <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                <LayoutTemplate className="size-4" />
                Catalog-aware editing
              </div>
              Suggestions combine starter items with anything you save into your
              own catalog, so later templates get faster to build.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
