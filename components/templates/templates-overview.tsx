import { Layers3, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PackingTemplate } from "@/lib/domain/types";

function getCategorySummary(template: PackingTemplate) {
  return [...new Set(template.items.map((item) => item.categoryName))];
}

export function TemplatesOverview({
  templates,
}: {
  templates: PackingTemplate[];
}) {
  if (templates.length === 0) {
    return (
      <Card className="border border-dashed border-border/80 bg-card/90">
        <CardHeader>
          <CardTitle>No templates yet</CardTitle>
          <CardDescription>
            Templates will appear here once the starter copy or custom template flow runs.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {templates.map((template) => {
        const categories = getCategorySummary(template);

        return (
          <Card
            key={template.id}
            className="border border-border/70 bg-card/88 shadow-sm"
          >
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {template.isDefault ? (
                  <Badge variant="secondary" className="gap-1.5">
                    <Star className="size-3.5" />
                    Default
                  </Badge>
                ) : (
                  <Badge variant="outline">Template</Badge>
                )}
              </div>
              <div className="space-y-1">
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>
                  {template.itemCount} reusable items
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
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-border/70 bg-background/80 p-4 text-sm text-muted-foreground">
                  Template details are available in the templates workspace.
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
