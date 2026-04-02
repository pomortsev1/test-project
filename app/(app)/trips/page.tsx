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
              Trips + active journey
            </Badge>
            <div className="space-y-3">
              <CardTitle className="text-3xl font-semibold tracking-tight text-balance">
                Plan the route, start the move, and repack every leg with a fresh checklist.
              </CardTitle>
              <CardDescription className="max-w-3xl text-base leading-7">
                Trips snapshot template items when they are created, keep packing
                progress isolated to each leg, and make the next route obvious
                when you arrive or cut the plan short to head home.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="border border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="size-5" />
              Dashboard pulse
            </CardTitle>
            <CardDescription>
              Active trips stay on top, draft journeys wait underneath, and
              finished routes stay readable.
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
            <CardTitle>No templates to snapshot yet</CardTitle>
            <CardDescription>
              The planner is ready, but it needs template data before a trip can
              be created.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Saved trips</h2>
          <p className="text-sm text-muted-foreground">
            The current route, status, and next action stay visible at a glance.
          </p>
        </div>

        <TripList trips={data.trips} activeTripId={data.activeTripId} />
      </section>
    </div>
  );
}
