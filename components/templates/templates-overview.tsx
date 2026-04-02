import Link from "next/link";
import { ArrowRight, Layers3, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PackingTemplate } from "@/lib/domain/types";
import { formatMeasurementLabel } from "@/lib/domain/measurements";
import { getServerI18n } from "@/lib/i18n/server";

function getCategorySummary(template: PackingTemplate) {
  return [...new Set(template.items.map((item) => item.categoryName))];
}

export async function TemplatesOverview({
  templates,
}: {
  templates: PackingTemplate[];
}) {
  const { localizePath } = await getServerI18n();
  const defaultTemplate =
    templates.find((template) => template.isDefault) ?? templates[0] ?? null;
  const additionalTemplates = templates.filter(
    (template) => template.id !== defaultTemplate?.id,
  );

  if (templates.length === 0) {
    return (
      <Card className="border border-dashed border-border/80 bg-card/90">
        <CardHeader>
          <CardTitle>Your starter template is on the way</CardTitle>
          <CardDescription>
            New workspaces should receive a default packing list automatically.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {defaultTemplate ? (
        <Card className="border border-border/70 bg-card/92 shadow-sm">
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1.5">
                <Star className="size-3.5" />
                Default template
              </Badge>
              <Badge variant="outline">Start here</Badge>
            </div>
            <div className="space-y-1">
              <CardTitle>{defaultTemplate.name}</CardTitle>
              <CardDescription>
                This is the main list most trips should start from.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {defaultTemplate.itemCount}{" "}
                {defaultTemplate.itemCount === 1 ? "item" : "items"}
              </Badge>
              {getCategorySummary(defaultTemplate).map((category) => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>

            {defaultTemplate.items.length > 0 ? (
              <div className="grid gap-2 md:grid-cols-2">
                {defaultTemplate.items.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-3 py-2"
                  >
                    <div>
                      <p className="font-medium">{item.itemName}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.categoryName}
                      </p>
                    </div>
                    {formatMeasurementLabel(item) ? (
                      <p className="text-sm text-muted-foreground">
                        {formatMeasurementLabel(item)}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border/70 bg-background/80 p-4 text-sm text-muted-foreground">
                Add the essentials you never want to forget.
              </div>
            )}

            <Link
              href={localizePath(`/templates/${defaultTemplate.id}`)}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:text-foreground/80"
            >
              Open the default template
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
      ) : null}

      {additionalTemplates.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {additionalTemplates.map((template) => {
            const categories = getCategorySummary(template);

            return (
              <Card
                key={template.id}
                className="border border-border/70 bg-card/88 shadow-sm"
              >
                <CardHeader className="gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">Extra template</Badge>
                  </div>
                  <div className="space-y-1">
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>
                      {template.itemCount} items
                      {categories.length > 0
                        ? ` across ${categories.length} categories`
                        : ""}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categories.length > 0 ? (
                    <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Layers3 className="size-4" />
                        <span>Category spread</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <Badge key={category} variant="outline">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {template.items.length > 0 ? (
                    <div className="space-y-2">
                      {template.items.slice(0, 4).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-3 py-2"
                        >
                          <div>
                            <p className="font-medium">{item.itemName}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.categoryName}
                            </p>
                          </div>
                          {formatMeasurementLabel(item) ? (
                            <p className="text-sm text-muted-foreground">
                              {formatMeasurementLabel(item)}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-border/70 bg-background/80 p-4 text-sm text-muted-foreground">
                      Open this template when you need a more specialized setup.
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border border-border/70 bg-card/88 shadow-sm">
        <CardHeader>
          <CardTitle>Extra templates stay optional</CardTitle>
          <CardDescription>
            If the default list covers most trips, keeping one trusted template
            is the simplest path.
          </CardDescription>
        </CardHeader>
        </Card>
      )}
    </div>
  );
}
