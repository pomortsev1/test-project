import Link from "next/link";
import { ArrowRight, Route } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatChecklistProgress,
  formatLegStatus,
  formatTripDate,
  formatTripMode,
  formatTripStatus,
  getLegStatusBadgeVariant,
  getTripStatusBadgeVariant,
} from "@/components/trips/format";
import { formatTripLeg } from "@/components/trips/trip-name";
import type { TripListItem } from "@/components/trips/types";
import { getServerI18n } from "@/lib/i18n/server";

type TripListProps = {
  trips: TripListItem[];
  activeTripId: string | null;
};

export async function TripList({ trips, activeTripId }: TripListProps) {
  const { t, localizePath } = await getServerI18n();

  if (trips.length === 0) {
    return (
      <Card className="border border-dashed border-border/80 bg-card/90">
        <CardHeader>
          <CardTitle>{t("No trips yet")}</CardTitle>
          <CardDescription>
            {t("Your saved trips will appear here once you create the first route.")}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {trips.map((trip) => {
        const currentLeg = trip.activeLeg ?? trip.legs.at(-1) ?? null;

        return (
          <Card
            key={trip.id}
            className="border border-border/70 bg-card/95 shadow-sm transition hover:shadow-md"
          >
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-xl">{trip.name}</CardTitle>
                    {trip.id === activeTripId ? (
                      <Badge className="gap-1.5">
                        <Route className="size-3.5" />
                        {t("Active now")}
                      </Badge>
                    ) : null}
                  </div>
                  <CardDescription>{trip.routeLabel}</CardDescription>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant={getTripStatusBadgeVariant(trip.status)}>
                    {t(formatTripStatus(trip.status))}
                  </Badge>
                  <Badge variant="outline">{t(formatTripMode(trip.mode))}</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.9fr)]">
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-border/70 bg-background/80 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {t("Template")}
                    </p>
                    <p className="mt-2 font-medium">
                      {trip.templateName ?? t("Snapshot only")}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background/80 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {t("Journey")}
                    </p>
                    <p className="mt-2 font-medium">
                      {trip.completedLegs}/{trip.totalLegs} {t("legs done")}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background/80 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {t("Created")}
                    </p>
                    <p className="mt-2 font-medium">{formatTripDate(trip.createdAt)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {trip.legs.map((leg) => (
                    <Badge
                      key={leg.id}
                      variant={getLegStatusBadgeVariant(leg.status)}
                      className="gap-1.5"
                    >
                      {formatTripLeg(leg.fromStopName, leg.toStopName)}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {t("Current route")}
                    </p>
                    <p className="mt-1 font-medium">
                      {currentLeg
                        ? formatTripLeg(currentLeg.fromStopName, currentLeg.toStopName)
                        : t("Route pending")}
                    </p>
                  </div>
                  {currentLeg ? (
                    <Badge variant={getLegStatusBadgeVariant(currentLeg.status)}>
                      {t(formatLegStatus(currentLeg.status))}
                    </Badge>
                  ) : null}
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  {currentLeg
                    ? formatChecklistProgress(
                        currentLeg.packedCount,
                        currentLeg.totalCount,
                      )
                    : t("Checklist becomes active once the trip starts.")}
                </p>

                <Link
                  href={localizePath(`/trips/${trip.id}`)}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:opacity-80"
                >
                  {t("Open trip")}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
