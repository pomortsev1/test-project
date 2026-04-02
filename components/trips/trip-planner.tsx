"use client";

import { useDeferredValue, useState, useTransition } from "react";
import { MapPinned, Plus, Route, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { createTrip } from "@/app/actions/trips";
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
              Plan a trip
            </CardTitle>
            <CardDescription>
              Pick a template, add your stops, and we&apos;ll name the trip from the
              route if you leave it blank.
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1.5">
            <Route className="size-3.5" />
            Default template first
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium">Trip name (optional)</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={generatedName || "Spring city break"}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
            />
            <p className="text-xs text-muted-foreground">
              {generatedName
                ? `Leave blank to use: ${generatedName}`
                : "Leave blank to generate the trip name from your destinations."}
            </p>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">Template</span>
            <select
              value={templateId}
              onChange={(event) => setTemplateId(event.target.value)}
              disabled={templates.length === 0}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20 disabled:opacity-60"
            >
              {templates.length === 0 ? (
                <option value="">No templates available yet</option>
              ) : null}
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                  {template.isDefault ? " • default" : ""}
                  {` • ${template.itemCount} items`}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              {templates.some((template) => template.isDefault)
                ? "The default template is selected first."
                : "Choose any saved template for this trip."}
            </p>
          </label>
        </div>

        <div className="space-y-3">
          <span className="text-sm font-medium">Route mode</span>
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
                    <span className="font-medium">{formatTripMode(nextMode)}</span>
                    {isSelected ? <Badge>Selected</Badge> : null}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {nextMode === "simple"
                      ? "Home → Destination → Home"
                      : "Home → Stop 1 → Stop 2 → Home"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">
              {mode === "simple" ? "Destination" : "Stops"}
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
                Add stop
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
                  placeholder={mode === "simple" ? "Destination" : `Stop ${index + 1}`}
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
          <p className="text-sm font-medium">Route preview</p>
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
            Items are copied when you create the trip, so later template edits
            won&apos;t change this checklist.
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

                  router.push(`/trips/${result.tripId}`);
                  router.refresh();
                } catch (createError) {
                  setError(
                    createError instanceof Error
                      ? createError.message
                      : "Unable to create the trip right now.",
                  );
                }
              });
            }}
          >
            {isPending ? "Creating trip..." : "Create trip"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
