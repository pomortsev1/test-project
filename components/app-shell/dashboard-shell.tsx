import { Database, KeyRound, LayoutDashboard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActiveTripPanel } from "@/components/trips/active-trip-panel";
import { TripsOverview } from "@/components/trips/trips-overview";
import { TemplatesOverview } from "@/components/templates/templates-overview";
import type { DashboardData } from "@/lib/domain/types";

export function DashboardShell({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_340px]">
        <Card className="border border-border/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92),rgba(120,53,15,0.88))] text-slate-50 shadow-[0_24px_70px_rgba(15,23,42,0.28)]">
          <CardHeader className="gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="gap-1.5 border-white/20 bg-white/10 text-slate-50"
              >
                <LayoutDashboard className="size-3.5" />
                Packing dashboard
              </Badge>
              <Badge variant="secondary" className="bg-white/15 text-slate-50">
                {data.profile.authMode === "google"
                  ? "Google workspace"
                  : "Anonymous workspace"}
              </Badge>
            </div>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Plan templates, track live trip legs, and keep the whole route readable at a glance.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                {data.profile.displayName} is ready with reusable packing templates,
                a live trip checklist, and trip summaries shaped around the shared packing contracts.
              </p>
            </div>
          </CardHeader>
        </Card>

        <Card className="border border-border/70 bg-card/92 shadow-sm">
          <CardHeader>
            <CardTitle>Session status</CardTitle>
            <CardDescription>
              {data.profile.authMode === "google"
                ? "Google-authenticated access is active, and anonymous mode stays available when you switch back."
                : "Anonymous cookie bootstrap is active, and Google sign-in remains available as an upgrade path."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
              <div className="flex items-center gap-3">
                <KeyRound className="size-5 text-amber-700" />
                <div>
                  <p className="font-medium">Profile</p>
                  {data.profile.authMode === "google" ? (
                    <div className="space-y-0.5 text-sm text-muted-foreground">
                      <p>{data.profile.displayName}</p>
                      <p>{data.profile.email ?? data.profile.id}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{data.profile.id}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
              <div className="flex items-center gap-3">
                <Database className="size-5 text-sky-700" />
                <div>
                  <p className="font-medium">Supabase</p>
                  <p className="text-sm text-muted-foreground">
                    {data.isSupabaseConfigured
                      ? "Environment variables detected."
                      : "Running safely without database environment variables."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Active leg</h2>
          <p className="text-sm text-muted-foreground">
            The current packing view is scoped to the active leg so checklist state does not bleed into the next move.
          </p>
        </div>
        <ActiveTripPanel trip={data.activeTrip} />
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Trips</h2>
          <p className="text-sm text-muted-foreground">
            Active, draft, and completed trips now share the same route and status language.
          </p>
        </div>
        <TripsOverview trips={data.trips} />
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Templates</h2>
          <p className="text-sm text-muted-foreground">
            Templates stay visible on the dashboard so the packing source of truth sits next to trip planning.
          </p>
        </div>
        <TemplatesOverview templates={data.templates} />
      </section>
    </div>
  );
}
