import type { Metadata } from "next";
import { Compass, Route } from "lucide-react";

import { getTripsPageData } from "./_lib/trips-data";
import { TripList } from "@/components/trips/trip-list";
import { TripPlanner } from "@/components/trips/trip-planner";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireCurrentUserId } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Trips",
};

export default async function TripsPage() {
  await requireCurrentUserId("/trips");
  const data = await getTripsPageData();

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
        <Card className="border border-border/70 bg-card/95 shadow-sm">
          <CardHeader className="gap-4">
            <Badge variant="outline" className="w-fit gap-1.5">
              <Compass className="size-3.5" />
              Trips
            </Badge>
            <div className="space-y-3">
              <CardTitle className="text-3xl font-semibold tracking-tight text-balance">
                Build the route, then pack one leg at a time.
              </CardTitle>
              <CardDescription className="max-w-3xl text-base leading-7">
                Start with the default template or pick another saved list.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="border border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="size-5" />
              Quick view
            </CardTitle>
            <CardDescription>
              Active trips stay on top, followed by drafts and finished routes.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Active trip
              </p>
              <p className="mt-2 font-medium">
                {data.activeTripId ? "Live in the list below" : "None yet"}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Templates available
              </p>
              <p className="mt-2 font-medium">{data.templates.length}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Saved trips
              </p>
              <p className="mt-2 font-medium">{data.trips.length}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {data.templates.length > 0 ? (
        <TripPlanner templates={data.templates} />
      ) : (
        <Card className="border border-dashed border-border/80 bg-card/90">
          <CardHeader>
            <CardTitle>No templates yet</CardTitle>
            <CardDescription>
              Create or recover a template before planning a trip.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Saved trips</h2>
          <p className="text-sm text-muted-foreground">
            Open any trip to start it or keep packing.
          </p>
        </div>

        <TripList trips={data.trips} activeTripId={data.activeTripId} />
      </section>
    </div>
  );
}
