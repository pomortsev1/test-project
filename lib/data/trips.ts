import type {
  TripItemRecord,
  TripLegItemCheckRecord,
  TripLegRecord,
  TripRecord,
  TripRecordDetails,
  TripStopRecord,
} from "@/lib/domain/types";
import type { TypedSupabaseClient } from "@/lib/supabase/types";

import { throwIfSupabaseError } from "@/lib/data/shared";

export async function getTripsForProfile(
  client: TypedSupabaseClient,
  profileId: string,
): Promise<TripRecord[]> {
  const { data, error } = await client
    .from("trips")
    .select("*")
    .eq("profile_id", profileId)
    .order("updated_at", { ascending: false });

  throwIfSupabaseError(error, "Failed to load trips");

  return data ?? [];
}

export async function getTripByIdForProfile(
  client: TypedSupabaseClient,
  profileId: string,
  tripId: string,
): Promise<TripRecord | null> {
  const { data, error } = await client
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .eq("profile_id", profileId)
    .maybeSingle();

  throwIfSupabaseError(error, "Failed to load trip");

  return data;
}

export async function getActiveTripForProfile(
  client: TypedSupabaseClient,
  profileId: string,
): Promise<TripRecord | null> {
  const trips = await getTripsForProfile(client, profileId);

  return trips.find((trip) => trip.status === "active") ?? null;
}

export async function getTripStops(
  client: TypedSupabaseClient,
  tripId: string,
): Promise<TripStopRecord[]> {
  const { data, error } = await client
    .from("trip_stops")
    .select("*")
    .eq("trip_id", tripId)
    .order("position");

  throwIfSupabaseError(error, "Failed to load trip stops");

  return data ?? [];
}

export async function getTripItems(
  client: TypedSupabaseClient,
  tripId: string,
): Promise<TripItemRecord[]> {
  const { data, error } = await client
    .from("trip_items")
    .select("*")
    .eq("trip_id", tripId)
    .order("sort_order")
    .order("created_at");

  throwIfSupabaseError(error, "Failed to load trip items");

  return data ?? [];
}

export async function getTripLegs(
  client: TypedSupabaseClient,
  tripId: string,
): Promise<TripLegRecord[]> {
  const { data, error } = await client
    .from("trip_legs")
    .select("*")
    .eq("trip_id", tripId)
    .order("position");

  throwIfSupabaseError(error, "Failed to load trip legs");

  return data ?? [];
}

export async function getTripLegItemChecks(
  client: TypedSupabaseClient,
  legIds: string[],
): Promise<TripLegItemCheckRecord[]> {
  if (!legIds.length) {
    return [];
  }

  const { data, error } = await client
    .from("trip_leg_item_checks")
    .select("*")
    .in("leg_id", legIds)
    .order("created_at");

  throwIfSupabaseError(error, "Failed to load trip leg item checks");

  return data ?? [];
}

export async function getTripDetailsForProfile(
  client: TypedSupabaseClient,
  profileId: string,
  tripId: string,
): Promise<TripRecordDetails | null> {
  const trip = await getTripByIdForProfile(client, profileId, tripId);

  if (!trip) {
    return null;
  }

  const [stops, items, legs] = await Promise.all([
    getTripStops(client, trip.id),
    getTripItems(client, trip.id),
    getTripLegs(client, trip.id),
  ]);

  const checks = await getTripLegItemChecks(
    client,
    legs.map((leg) => leg.id),
  );

  return {
    checks,
    items,
    legs,
    stops,
    trip,
  };
}
