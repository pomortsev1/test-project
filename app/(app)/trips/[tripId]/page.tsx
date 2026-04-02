import Link from "next/link";

import { getTripDetails } from "@/app/(app)/trips/_lib/trips-data";
import { TripDetail } from "@/components/trips/trip-detail";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TripDetailPageProps = {
  params: Promise<{ tripId: string }>;
};

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { tripId } = await params;
  const trip = await getTripDetails(tripId);

  if (!trip) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(241,245,249,0.92),rgba(226,232,240,0.76))]">
        <main className="mx-auto flex w-full max-w-4xl px-6 py-10 sm:px-10">
          <Card className="w-full border border-border/70 bg-card/95 shadow-sm">
            <CardHeader>
              <CardTitle>Trip not found</CardTitle>
              <CardDescription>
                This trip either doesn&apos;t exist for the current browser
                profile or the session hasn&apos;t been initialized yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button nativeButton={false} render={<Link href="/trips" />}>
                Back to trips
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return <TripDetail trip={trip} />;
}
