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
  formatTripMode,
  formatTripStatus,
  getLegStatusBadgeVariant,
  getTripStatusBadgeVariant,
} from "@/components/trips/format";
import { formatTripRoute } from "@/components/trips/trip-name";
import type { TripListItem } from "@/components/trips/types";

type LegacyTrip = {
  id: string;
  name: string;
  mode: "simple" | "multi_stop";
  status: "draft" | "active" | "completed" | "archived";
  templateName: string;
  currentLegIndex: number;
  stops: Array<{ id: string; name: string }>;
  legs: Array<{
    id: string;
    status: "pending" | "active" | "completed" | "skipped";
    fromStopName: string;
    toStopName: string;
  }>;
};

export function TripsOverview({ trips }: { trips: Array<TripListItem | LegacyTrip> }) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {trips.map((trip) => {
        const currentLeg =
          "activeLeg" in trip
            ? trip.activeLeg ?? trip.legs[trip.legs.length - 1] ?? null
            : trip.legs.find((leg) => leg.status === "active") ??
              trip.legs[Math.min(trip.currentLegIndex, trip.legs.length - 1)] ??
              null;
        const routeLabel =
          "routeLabel" in trip
            ? trip.routeLabel
            : formatTripRoute(trip.stops.map((stop) => stop.name));
        const templateName =
          "templateName" in trip && trip.templateName ? trip.templateName : "Snapshot only";

        return (
          <Card
            key={trip.id}
            className="border border-border/70 bg-card/88 shadow-sm"
          >
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={getTripStatusBadgeVariant(trip.status)}>
                  {formatTripStatus(trip.status)}
                </Badge>
                <Badge variant="secondary">{formatTripMode(trip.mode)}</Badge>
              </div>
              <div className="space-y-1">
                <CardTitle>{trip.name}</CardTitle>
                <CardDescription>{routeLabel}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Template
                </p>
                <p className="mt-2 font-medium">{templateName}</p>
              </div>
              {currentLeg ? (
                <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                    Current leg
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-sm font-medium">
                    <span>{currentLeg.fromStopName}</span>
                    <ArrowRight className="size-4 text-muted-foreground" />
                    <span>{currentLeg.toStopName}</span>
                  </div>
                  <div className="mt-2">
                    <Badge variant={getLegStatusBadgeVariant(currentLeg.status)}>
                      {currentLeg.status}
                    </Badge>
                  </div>
                </div>
              ) : null}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Route className="size-4" />
                <span>
                  {trip.stops.length} stops, {trip.legs.length} planned legs
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
