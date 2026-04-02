import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { ActiveTripPanel } from "@/components/trips/active-trip-panel";
import { formatTripLeg } from "@/components/trips/trip-name";
import { TripsOverview } from "@/components/trips/trips-overview";
import { TemplatesOverview } from "@/components/templates/templates-overview";
import type { DashboardData } from "@/lib/domain/types";

export function DashboardShell({ data }: { data: DashboardData }) {
  const defaultTemplate =
    data.templates.find((template) => template.isDefault) ?? data.templates[0] ?? null;
  const activeLeg = data.activeTrip?.legs.find((leg) => leg.status === "active") ?? null;
  const packedCount =
    activeLeg?.checklistItems.filter((item) => item.isPacked).length ?? 0;
  const totalCount = activeLeg?.checklistItems.length ?? 0;
  const draftTripsCount = data.trips.filter((trip) => trip.status === "draft").length;
  const primaryHref = data.activeTrip
    ? `/trips/${data.activeTrip.id}`
    : defaultTemplate
      ? `/templates/${defaultTemplate.id}`
      : "/templates";
  const primaryLabel = data.activeTrip ? "Open active trip" : "Open default template";
  const secondaryHref =
    data.activeTrip && defaultTemplate ? `/templates/${defaultTemplate.id}` : "/trips";
  const secondaryLabel =
    data.activeTrip && defaultTemplate ? "Open default template" : "Open trips";
  const heroTitle = data.activeTrip
    ? "Pack this leg."
    : defaultTemplate
      ? "Open your default template."
      : "Create your first packing list.";
  const heroDescription = data.activeTrip
    ? `${data.activeTrip.name}: ${formatTripLeg(
        activeLeg?.fromStopName ?? "Current stop",
        activeLeg?.toStopName ?? "next stop",
      )}. ${packedCount} of ${totalCount} items packed for this move.`
    : defaultTemplate
      ? `${defaultTemplate.name} already has ${defaultTemplate.itemCount} items ready to tune before you plan the trip.`
      : "Create one template so every trip starts from a real packing list.";
  const hasTrips = data.trips.length > 0;

  return (
    <div className="space-y-6">
      <Card className="packing-panel-strong border-0">
        <CardHeader className="gap-5">
          <div className="flex flex-wrap items-center gap-2 text-slate-50">
            <LayoutDashboard className="size-4" />
            <span className="text-sm font-medium">Next action</span>
          </div>

          <div className="space-y-3">
            <h1 className="max-w-3xl font-heading text-5xl leading-none text-balance sm:text-6xl">
              {heroTitle}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              {heroDescription}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-3">
            <Button
              nativeButton={false}
              className="h-11 rounded-2xl bg-white text-slate-950 shadow-sm hover:bg-slate-100"
              render={<Link href={primaryHref} />}
            >
              {primaryLabel}
              <ArrowRight className="size-4" />
            </Button>

            <Button
              nativeButton={false}
              variant="outline"
              className="h-11 rounded-2xl border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              render={<Link href={secondaryHref} />}
            >
              {secondaryLabel}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            {data.activeTrip ? (
              <div className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-slate-100">
                {formatTripLeg(
                  activeLeg?.fromStopName ?? "Current stop",
                  activeLeg?.toStopName ?? "next stop",
                )}
              </div>
            ) : null}
            {defaultTemplate ? (
              <div className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-slate-100">
                {defaultTemplate.name}
              </div>
            ) : null}
            {defaultTemplate ? (
              <div className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-slate-100">
                {defaultTemplate.itemCount}{" "}
                {defaultTemplate.itemCount === 1 ? "item" : "items"}
              </div>
            ) : null}
            <div className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-slate-100">
              {draftTripsCount} draft {draftTripsCount === 1 ? "trip" : "trips"}
            </div>
          </div>
        </CardContent>
      </Card>

      {data.activeTrip ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">Active trip</h2>
            <p className="text-sm text-muted-foreground">
              Pack the live checklist first. The rest of the route can wait.
            </p>
          </div>
          <ActiveTripPanel trip={data.activeTrip} />
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Templates</h2>
            <p className="text-sm text-muted-foreground">
              Keep the default list close. Extra templates stay secondary.
            </p>
          </div>
          <TemplatesOverview templates={data.templates} />
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Trips</h2>
            <p className="text-sm text-muted-foreground">
              {hasTrips
                ? "Draft, active, and finished routes stay in one place."
                : "Create a trip when the list is ready."}
            </p>
          </div>
          <TripsOverview trips={data.trips} />
        </div>
      </section>

      {!data.isSupabaseConfigured ? (
        <Card className="packing-panel border-0">
          <CardContent className="px-4 py-4 text-sm leading-6 text-slate-600">
            Google sign-in is not configured here yet. The guest workspace still
            supports the full packing flow.
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
