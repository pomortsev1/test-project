import type { Metadata } from "next";
import { Compass, Route } from "lucide-react";
import { redirect } from "next/navigation";

import { getTripsPageData } from "@/app/(app)/trips/_lib/trips-data";
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
import { getServerI18n } from "@/lib/i18n/server";
import { normalizeLocale } from "@/lib/i18n/config";
import { getLocalizedPathname, requireCurrentUserId } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Trips",
};

export default async function LocalizedTripsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);

  if (!locale) {
    redirect("/");
  }

  const { t } = await getServerI18n(locale);
  await requireCurrentUserId(getLocalizedPathname("/trips", locale));
  const data = await getTripsPageData();

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
        <Card className="border border-border/70 bg-card/95 shadow-sm">
          <CardHeader className="gap-4">
            <Badge variant="outline" className="w-fit gap-1.5">
              <Compass className="size-3.5" />
              {t("Trips")}
            </Badge>
            <div className="space-y-3">
              <CardTitle className="text-3xl font-semibold tracking-tight text-balance">
                {t("Plan the route and start packing from leg one.")}
              </CardTitle>
              <CardDescription className="max-w-3xl text-base leading-7">
                {t(
                  "Add where you are going and your checklist becomes live as soon as the trip is created.",
                )}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="border border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="size-5" />
              {t("Quick view")}
            </CardTitle>
            <CardDescription>
              {t("Active trips stay on top, and new ones start immediately.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {t("Active trip")}
              </p>
              <p className="mt-2 font-medium">
                {data.activeTripId ? t("Live in the list below") : t("None yet")}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {t("Templates available")}
              </p>
              <p className="mt-2 font-medium">{data.templates.length}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {t("Saved trips")}
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
            <CardTitle>{t("No templates yet")}</CardTitle>
            <CardDescription>
              {t("Create or recover a template before planning a trip.")}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">{t("Saved trips")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("Open any trip to keep packing or review the route.")}
          </p>
        </div>

        <TripList trips={data.trips} activeTripId={data.activeTripId} />
      </section>
    </div>
  );
}
