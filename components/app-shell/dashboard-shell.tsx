import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  Luggage,
  MapPinned,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatTripStatus, getTripStatusBadgeVariant } from "@/components/trips/format";
import { formatTripLeg, formatTripRoute } from "@/components/trips/trip-name";
import type { DashboardData, PackingTemplate, Trip } from "@/lib/domain/types";

function getFirstName(displayName: string) {
  const normalized = displayName.trim();

  if (!normalized) {
    return "Traveler";
  }

  return normalized.split(/\s+/)[0] ?? normalized;
}

function getActiveLeg(trip: Trip | null) {
  return trip?.legs.find((leg) => leg.status === "active") ?? null;
}

function getChecklistProgress(trip: Trip | null) {
  const activeLeg = getActiveLeg(trip);
  const totalCount = activeLeg?.checklistItems.length ?? 0;
  const packedCount =
    activeLeg?.checklistItems.filter((item) => item.isPacked).length ?? 0;

  return {
    packedCount,
    totalCount,
    percent:
      totalCount > 0 ? Math.max(8, Math.round((packedCount / totalCount) * 100)) : 0,
  };
}

function buildHeroContent(data: DashboardData, defaultTemplate: PackingTemplate | null) {
  const activeTrip = data.activeTrip;
  const activeLeg = getActiveLeg(activeTrip);
  const draftTripsCount = data.trips.filter((trip) => trip.status === "draft").length;
  const { packedCount, totalCount } = getChecklistProgress(activeTrip);

  if (activeTrip && activeLeg) {
    return {
      title: `Keep packing for ${activeTrip.name}.`,
      description: `${formatTripLeg(
        activeLeg.fromStopName,
        activeLeg.toStopName,
      )}. ${packedCount} of ${totalCount} items are packed for this move.`,
      primaryHref: `/trips/${activeTrip.id}`,
      primaryLabel: "Open live checklist",
      secondaryHref: "/trips",
      secondaryLabel: draftTripsCount > 0 ? "See all trips" : "Plan another trip",
    };
  }

  if (defaultTemplate) {
    return {
      title: "Start your next trip without the setup mess.",
      description: `${defaultTemplate.name} is ready with ${defaultTemplate.itemCount} ${
        defaultTemplate.itemCount === 1 ? "item" : "items"
      }. Add your route and the first checklist leg goes live immediately.`,
      primaryHref: "/trips",
      primaryLabel: "Plan a trip",
      secondaryHref: `/templates/${defaultTemplate.id}`,
      secondaryLabel: "Open main packing list",
    };
  }

  return {
    title: "Set up one trusted packing list first.",
    description:
      "Once your main list exists, every new trip can start from something real instead of an empty screen.",
    primaryHref: "/templates",
    primaryLabel: "Create packing list",
    secondaryHref: "/trips",
    secondaryLabel: "Open trips",
  };
}

function buildAtAGlanceStats(data: DashboardData, defaultTemplate: PackingTemplate | null) {
  const activeTrip = data.activeTrip;
  const recentTripsCount = data.trips.filter((trip) => trip.id !== activeTrip?.id).length;
  const draftTripsCount = data.trips.filter((trip) => trip.status === "draft").length;

  return [
    {
      label: "Live trip",
      value: activeTrip ? activeTrip.name : "None right now",
      helper: activeTrip ? "Pick up where you left off" : "Start one from Trips",
    },
    {
      label: "Main list",
      value: defaultTemplate
        ? `${defaultTemplate.itemCount} ${defaultTemplate.itemCount === 1 ? "item" : "items"}`
        : "Not ready yet",
      helper: defaultTemplate ? defaultTemplate.name : "Create your first list",
    },
    {
      label: "Queued next",
      value: draftTripsCount > 0 ? `${draftTripsCount} draft ${draftTripsCount === 1 ? "trip" : "trips"}` : "Nothing waiting",
      helper:
        recentTripsCount > 0
          ? `${recentTripsCount} more saved ${recentTripsCount === 1 ? "route" : "routes"}`
          : "Everything is tidy",
    },
  ];
}

function renderFocusCard(
  data: DashboardData,
  defaultTemplate: PackingTemplate | null,
  localizePath: (pathname: string) => string,
) {
  const activeTrip = data.activeTrip;
  const activeLeg = getActiveLeg(activeTrip);
  const { packedCount, totalCount, percent } = getChecklistProgress(activeTrip);

  if (activeTrip && activeLeg) {
    const nextItems = activeLeg.checklistItems.slice(0, 5);

    return (
      <Card className="border border-border/70 bg-card/95 shadow-sm">
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1.5">
              <Luggage className="size-3.5" />
              Today&apos;s focus
            </Badge>
            <Badge variant="outline">{activeTrip.name}</Badge>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Pack this leg first</CardTitle>
            <CardDescription className="text-base leading-7">
              {formatTripLeg(activeLeg.fromStopName, activeLeg.toStopName)} is live now.
              Everything else can wait.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Checklist progress</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {packedCount} of {totalCount} packed
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-700">{percent}%</p>
            </div>
            <div className="mt-4 h-2.5 rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-slate-950 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Next items
              </h3>
              <Link
                href={localizePath(`/trips/${activeTrip.id}`)}
                className="text-sm font-medium text-foreground transition hover:text-foreground/80"
              >
                Open full checklist
              </Link>
            </div>

            {nextItems.length > 0 ? (
              <div className="space-y-2">
                {nextItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/80 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{item.itemName}</p>
                      <p className="text-sm text-muted-foreground">{item.categoryName}</p>
                    </div>
                    <Badge variant={item.isPacked ? "secondary" : "outline"} className="gap-1.5">
                      {item.isPacked ? <CheckCircle2 className="size-3.5" /> : null}
                      {item.isPacked ? "Packed" : "To pack"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border/70 bg-background/80 p-4 text-sm text-muted-foreground">
                This leg does not have checklist items yet, but the route is already live.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (defaultTemplate) {
    const previewItems = defaultTemplate.items.slice(0, 4);

    return (
      <Card className="border border-border/70 bg-card/95 shadow-sm">
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1.5">
              <MapPinned className="size-3.5" />
              Best next step
            </Badge>
            <Badge variant="outline">No live trip</Badge>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Turn your packing list into a trip</CardTitle>
            <CardDescription className="text-base leading-7">
              Add the route first. The checklist becomes live as soon as the trip is
              created, so you can start packing immediately.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Main packing list
            </p>
            <p className="mt-2 text-lg font-semibold">{defaultTemplate.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {defaultTemplate.itemCount} {defaultTemplate.itemCount === 1 ? "item" : "items"} ready
            </p>
          </div>

          {previewItems.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {previewItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3"
                >
                  <p className="font-medium">{item.itemName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.categoryName}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border/70 bg-background/80 p-4 text-sm text-muted-foreground">
              Open the list if you want to tune it first, or go straight to Trips and plan
              the route.
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              nativeButton={false}
              className="h-11 rounded-2xl"
              render={<Link href={localizePath("/trips")} />}
            >
              Plan a trip
              <ArrowRight className="size-4" />
            </Button>
            <Button
              nativeButton={false}
              variant="outline"
              className="h-11 rounded-2xl"
              render={<Link href={localizePath(`/templates/${defaultTemplate.id}`)} />}
            >
              Open packing list
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/70 bg-card/95 shadow-sm">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1.5">
            <Star className="size-3.5" />
            First setup
          </Badge>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl">Create one trusted packing list</CardTitle>
          <CardDescription className="text-base leading-7">
            After that, each trip starts from something familiar instead of from scratch.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-border/70 bg-background/80 p-4 text-sm text-muted-foreground">
          Start with the essentials you almost always carry, then plan the route when you
          are ready.
        </div>
        <Button
          nativeButton={false}
          className="h-11 rounded-2xl"
          render={<Link href={localizePath("/templates")} />}
        >
          Create packing list
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function renderRecentTripsCard(
  data: DashboardData,
  localizePath: (pathname: string) => string,
) {
  const recentTrips = data.trips.filter((trip) => trip.id !== data.activeTrip?.id).slice(0, 4);

  return (
    <Card className="border border-border/70 bg-card/95 shadow-sm">
      <CardHeader className="gap-2">
        <CardTitle className="text-xl">Trips</CardTitle>
        <CardDescription>
          Keep recent routes visible without turning the dashboard into the full trips page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentTrips.length > 0 ? (
          recentTrips.map((trip) => (
            <Link
              key={trip.id}
              href={localizePath(`/trips/${trip.id}`)}
              className="block rounded-2xl border border-border/70 bg-background/80 px-4 py-3 transition hover:border-slate-300 hover:bg-background"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{trip.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatTripRoute(trip.stops.map((stop) => stop.name))}
                  </p>
                </div>
                <Badge variant={getTripStatusBadgeVariant(trip.status)}>
                  {formatTripStatus(trip.status)}
                </Badge>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border/80 bg-background/70 p-4 text-sm text-muted-foreground">
            No saved trips yet. When you create one, it will show up here for quick return.
          </div>
        )}

        <Link
          href={localizePath("/trips")}
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:text-foreground/80"
        >
          Open all trips
          <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

function renderPackingListsCard(
  data: DashboardData,
  defaultTemplate: PackingTemplate | null,
  localizePath: (pathname: string) => string,
) {
  const extraCount = Math.max(data.templates.length - (defaultTemplate ? 1 : 0), 0);

  return (
    <Card className="border border-border/70 bg-card/95 shadow-sm">
      <CardHeader className="gap-2">
        <CardTitle className="text-xl">Packing lists</CardTitle>
        <CardDescription>
          Keep the main list close here. The rest can stay tucked away on the Templates page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {defaultTemplate ? (
          <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1.5">
                <Star className="size-3.5" />
                Main list
              </Badge>
              <Badge variant="outline">
                {defaultTemplate.itemCount} {defaultTemplate.itemCount === 1 ? "item" : "items"}
              </Badge>
            </div>
            <p className="mt-3 font-medium">{defaultTemplate.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {extraCount > 0
                ? `${extraCount} more ${extraCount === 1 ? "saved list" : "saved lists"} stay in Templates.`
                : "This is the only saved list right now."}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/80 bg-background/70 p-4 text-sm text-muted-foreground">
            No packing lists yet. Create one once, then reuse it for future trips.
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button
            nativeButton={false}
            variant="outline"
            className="h-11 rounded-2xl"
            render={<Link href={localizePath("/templates")} />}
          >
            Open Templates
          </Button>
          {defaultTemplate ? (
            <Button
              nativeButton={false}
              className="h-11 rounded-2xl"
              render={<Link href={localizePath(`/templates/${defaultTemplate.id}`)} />}
            >
              Open main list
              <ArrowRight className="size-4" />
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardShell({
  data,
  localizePath = (pathname: string) => pathname,
  translate = (value: string) => value,
}: {
  data: DashboardData;
  localizePath?: (pathname: string) => string;
  translate?: (value: string) => string;
}) {
  const t = translate;
  const travelerName = getFirstName(data.profile.displayName);
  const defaultTemplate =
    data.templates.find((template) => template.isDefault) ?? data.templates[0] ?? null;
  const hero = buildHeroContent(data, defaultTemplate);
  const atAGlanceStats = buildAtAGlanceStats(data, defaultTemplate);

  return (
    <div className="space-y-6">
      <Card className="packing-panel-strong border-0">
        <CardHeader className="gap-6">
          <div className="flex flex-wrap items-center gap-2 text-slate-50">
            <LayoutDashboard className="size-4" />
            <span className="text-sm font-medium">{t("Dashboard")}</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-200">{travelerName}, here&apos;s the clearest next step.</p>
                <h1 className="max-w-3xl font-heading text-5xl leading-none text-balance sm:text-6xl">
                  {hero.title}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                  {hero.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  nativeButton={false}
                  className="h-11 rounded-2xl bg-white text-slate-950 shadow-sm hover:bg-slate-100"
                  render={<Link href={localizePath(hero.primaryHref)} />}
                >
                  {t(hero.primaryLabel)}
                  <ArrowRight className="size-4" />
                </Button>

                <Button
                  nativeButton={false}
                  variant="outline"
                  className="h-11 rounded-2xl border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  render={<Link href={localizePath(hero.secondaryHref)} />}
                >
                  {t(hero.secondaryLabel)}
                </Button>
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-white/14 bg-white/10 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                {t("At a glance")}
              </p>
              <div className="mt-4 space-y-3">
                {atAGlanceStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                      {t(stat.label)}
                    </p>
                    <p className="mt-2 font-medium text-slate-50">{stat.value}</p>
                    <p className="mt-1 text-sm text-slate-300">{t(stat.helper)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_360px]">
        <div>{renderFocusCard(data, defaultTemplate, localizePath)}</div>

        <div className="space-y-6">
          {renderRecentTripsCard(data, localizePath)}
          {renderPackingListsCard(data, defaultTemplate, localizePath)}
        </div>
      </section>

      {!data.isSupabaseConfigured ? (
        <Card className="packing-panel border-0">
          <CardContent className="px-4 py-4 text-sm leading-6 text-slate-600">
            {t(
              "Google sign-in is not configured here yet. Guest mode still supports the full packing flow.",
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
