"use client";

import { useDeferredValue, useState, useTransition } from "react";
import { MapPinned, Plus, Route, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { createTrip } from "@/app/actions/trips";
import { useOptionalI18n } from "@/components/i18n/i18n-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatTripMode } from "@/components/trips/format";
import {
  buildTripNameFromDestinations,
  formatTripRoute,
} from "@/components/trips/trip-name";
import type { TripMode, TripTemplateOption } from "@/components/trips/types";

type TripPlannerProps = {
  templates: TripTemplateOption[];
};

function buildVisibleStops(mode: TripMode, stops: string[]) {
  if (mode === "simple") {
    return [stops[0] ?? ""];
  }

  return stops;
}

export function TripPlanner({ templates }: TripPlannerProps) {
  const router = useRouter();
  const i18n = useOptionalI18n();
  const t = (value: string) => i18n?.t(value) ?? value;
  const defaultTemplate =
    templates.find((template) => template.isDefault)?.id ?? templates[0]?.id ?? "";
  const [name, setName] = useState("");
  const [mode, setMode] = useState<TripMode>("simple");
  const [templateId, setTemplateId] = useState(defaultTemplate);
  const [stops, setStops] = useState([""]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const deferredStops = useDeferredValue(stops);
  const visibleStops = buildVisibleStops(mode, deferredStops);
  const generatedName = buildTripNameFromDestinations(visibleStops);

  const canCreate = templates.length > 0 && templateId.length > 0;

  return (
    <Card className="border border-border/70 bg-card/95 shadow-sm">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <MapPinned className="size-5" />
              {t("Start your trip")}
            </CardTitle>
            <CardDescription>
              {t(
                "Add your stops and we'll bring in your usual packing list automatically. If you have extra saved lists, you can switch them here.",
              )}
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1.5">
            <Route className="size-3.5" />
            {t("Main list selected first")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium">{t("Trip name (optional)")}</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={generatedName || t("Spring city break")}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
            />
            <p className="text-xs text-muted-foreground">
              {generatedName
                ? `${t("Leave blank to use:")} ${generatedName}`
                : t("Leave blank to generate the trip name from your destinations.")}
            </p>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">{t("Packing list")}</span>
            <select
              value={templateId}
              onChange={(event) => setTemplateId(event.target.value)}
              disabled={templates.length === 0}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20 disabled:opacity-60"
            >
              {templates.length === 0 ? (
                <option value="">{t("No templates available yet")}</option>
              ) : null}
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                  {template.isDefault ? ` • ${t("default")}` : ""}
                  {` • ${template.itemCount} ${t("items")}`}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              {templates.some((template) => template.isDefault)
                ? t("Your main saved list is selected first.")
                : t("Choose any saved list for this trip.")}
            </p>
          </label>
        </div>

        <div className="space-y-3">
          <span className="text-sm font-medium">{t("Route mode")}</span>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["simple", "multi_stop"] as const).map((nextMode) => {
              const isSelected = mode === nextMode;

              return (
                <button
                  key={nextMode}
                  type="button"
                  onClick={() => {
                    setMode(nextMode);
                    setError(null);
                    setStops((currentStops) => {
                      if (nextMode === "simple") {
                        return [currentStops[0] ?? ""];
                      }

                      return currentStops.length > 1
                        ? currentStops
                        : [currentStops[0] ?? "", ""];
                    });
                  }}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-background hover:bg-muted/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{t(formatTripMode(nextMode))}</span>
                    {isSelected ? <Badge>{t("Selected")}</Badge> : null}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {nextMode === "simple"
                      ? t("Home → Destination → Home")
                      : t("Home → Stop 1 → Stop 2 → Home")}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">
              {mode === "simple" ? t("Destination") : t("Stops")}
            </span>
            {mode === "multi_stop" ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setStops((currentStops) => [...currentStops, ""]);
                  setError(null);
                }}
              >
                <Plus className="size-4" />
                {t("Add stop")}
              </Button>
            ) : null}
          </div>

          <div className="space-y-3">
            {buildVisibleStops(mode, stops).map((stop, index) => (
              <div key={`${mode}-${index}`} className="flex gap-3">
                <input
                  value={stop}
                  onChange={(event) => {
                    const nextStops = [...stops];
                    nextStops[index] = event.target.value;
                    setStops(nextStops);
                    setError(null);
                  }}
                  placeholder={
                    mode === "simple" ? t("Destination") : `${t("Stop")} ${index + 1}`
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
                />
                {mode === "multi_stop" && stops.length > 1 ? (
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => {
                      setStops((currentStops) =>
                        currentStops.filter((_, currentIndex) => currentIndex !== index),
                      );
                      setError(null);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
          <p className="text-sm font-medium">{t("Route preview")}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatTripRoute(["Home", ...visibleStops.filter(Boolean), "Home"])}
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {t(
              "Items are copied when you create the trip, and the first checklist leg starts right away, so later template edits won't change this checklist.",
            )}
          </p>
          <Button
            type="button"
            disabled={!canCreate || isPending}
            onClick={() => {
              setError(null);

              startTransition(async () => {
                try {
                  const result = await createTrip({
                    templateId,
                    name,
                    mode,
                    stops: buildVisibleStops(mode, stops).map((stopName) => ({
                      name: stopName,
                    })),
                  });

                  router.push(i18n?.localizePath(`/trips/${result.tripId}`) ?? `/trips/${result.tripId}`);
                  router.refresh();
                } catch (createError) {
                  setError(
                    createError instanceof Error
                      ? createError.message
                      : t("Unable to create the trip right now."),
                  );
                }
              });
            }}
          >
            {isPending ? t("Creating and starting trip...") : t("Create and start trip")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
