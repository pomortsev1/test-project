import { CheckCircle2, PlaneTakeoff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatTripItemMeasurement,
  formatTripMode,
} from "@/components/trips/format";
import type { TripDetails } from "@/components/trips/types";
import type { Trip as DashboardTrip } from "@/lib/domain/types";

export function ActiveTripPanel({
  trip,
}: {
  trip: TripDetails | DashboardTrip | null;
}) {
  if (!trip) {
    return (
      <Card className="border border-border/70 bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle>No active trip yet</CardTitle>
          <CardDescription>
            Draft trips are ready below when you want to start your next route.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!("activeLeg" in trip)) {
    const activeLegacyLeg = trip.legs.find((leg) => leg.status === "active") ?? null;

    if (!activeLegacyLeg) {
      return (
        <Card className="border border-border/70 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>No active trip yet</CardTitle>
            <CardDescription>
              Draft trips are ready below when you want to start your next route.
            </CardDescription>
          </CardHeader>
        </Card>
      );
    }

    return (
      <Card className="border border-border/70 bg-card/92 shadow-sm">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1.5">
              <PlaneTakeoff className="size-3.5" />
              Active trip
            </Badge>
            <Badge variant="secondary">{formatTripMode(trip.mode)}</Badge>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-xl sm:text-2xl">{trip.name}</CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6">
              Current leg: {activeLegacyLeg.fromStopName}
              {" -> "}
              {activeLegacyLeg.toStopName}.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
            <p className="text-sm text-muted-foreground">
              Template snapshot: {trip.templateName}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!trip.activeLeg) {
    return (
      <Card className="border border-border/70 bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle>No active trip yet</CardTitle>
          <CardDescription>
            Draft trips are ready below when you want to start your next route.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border border-border/70 bg-card/92 shadow-sm">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <PlaneTakeoff className="size-3.5" />
            Active trip
          </Badge>
          <Badge variant="secondary">{formatTripMode(trip.mode)}</Badge>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-xl sm:text-2xl">{trip.name}</CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-6">
            Current leg: {trip.activeLeg.fromStopName}
            {" -> "}
            {trip.activeLeg.toStopName}. {trip.checklistPackedCount} of{" "}
            {trip.checklistTotalCount} items packed for this move.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {trip.checklistGroups.map((group) => (
          <div
            key={group.categoryName}
            className="rounded-2xl border border-border/70 bg-background/80 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-medium">{group.categoryName}</h3>
              <Badge variant="outline">{group.items.length} items</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {group.items.map((item) => {
                const measurementLabel = formatTripItemMeasurement(item);

                return (
                  <div
                    key={item.tripItemId}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border/60 px-3 py-2"
                  >
                    <div>
                      <p className="font-medium">{item.itemName}</p>
                      {measurementLabel ? (
                        <p className="text-sm text-muted-foreground">
                          {measurementLabel}
                        </p>
                      ) : null}
                    </div>
                    <Badge variant={item.isPacked ? "secondary" : "outline"} className="gap-1.5">
                      {item.isPacked ? <CheckCircle2 className="size-3.5" /> : null}
                      {item.isPacked ? "Packed" : "To pack"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
