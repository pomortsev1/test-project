import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";

import { PACKING_APP_USER_ID_COOKIE } from "@/lib/domain/constants";
import {
  getCurrentSessionIdentity,
  getCurrentUserId as getCurrentSessionUserId,
  getSessionCookieOptions,
} from "@/lib/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ArchiveTripInput,
  ArriveAtCurrentStopInput,
  CreateTripInput,
  GoHomeNowInput,
  LegStatus,
  StartTripInput,
  ToggleTripLegItemCheckInput,
  TripChecklistGroup,
  TripDetails,
  TripLeg,
  TripListItem,
  TripMode,
  TripPageData,
  TripStatus,
  TripStop,
  TripTemplateOption,
} from "@/components/trips/types";

const HOME_STOP_NAME = "Home";
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type AppSupabaseClient = NonNullable<
  Awaited<ReturnType<typeof createSupabaseServerClient>>
>;

type TripRow = {
  id: string;
  template_id: string | null;
  name: string;
  mode: TripMode;
  status: TripStatus;
  current_leg_index: number;
  created_at: string;
  updated_at: string;
};

type StopRow = {
  id: string;
  trip_id: string;
  position: number;
  name: string;
  kind: "home" | "stop";
};

type LegRow = {
  id: string;
  trip_id: string;
  position: number;
  from_stop_id: string;
  to_stop_id: string;
  status: LegStatus;
};

type TemplateRow = {
  id: string;
  name: string;
  is_default: boolean;
};

type TemplateItemRow = {
  id: string;
  catalog_item_id: string | null;
  item_name: string;
  item_normalized_name: string;
  category_name: string;
  quantity: number | string;
  unit: string;
  sort_order: number;
};

type TripItemRow = {
  id: string;
  item_name: string;
  category_name: string;
  quantity: number | string;
  unit: string;
  sort_order: number;
};

type CheckRow = {
  id: string;
  leg_id: string;
  trip_item_id: string;
  is_packed: boolean;
};

type ChecklistSelection = {
  legId: string | null;
  status: LegStatus | null;
  routeLabel: string | null;
  packedCount: number;
  totalCount: number;
  groups: TripChecklistGroup[];
};

const tripStatusRank: Record<TripStatus, number> = {
  active: 0,
  draft: 1,
  completed: 2,
  archived: 3,
};

function isUuid(value: string | null | undefined): value is string {
  return Boolean(value && UUID_PATTERN.test(value));
}

function cleanText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function cleanStopName(value: string) {
  return cleanText(value);
}

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return 0;
}

function requireRow<T>(value: T | null, context: string): T {
  if (!value) {
    throw new Error(`${context}: missing result.`);
  }

  return value;
}

async function getCurrentUserIdFromCookie() {
  return await getCurrentSessionUserId();
}

async function ensureCurrentUserId() {
  const existingIdentity = await getCurrentSessionIdentity();

  if (existingIdentity) {
    return existingIdentity.userId;
  }

  const cookieStore = await cookies();
  const existingValue = cookieStore
    .get(PACKING_APP_USER_ID_COOKIE)
    ?.value?.trim();

  if (isUuid(existingValue)) {
    return existingValue;
  }

  const userId = randomUUID();
  cookieStore.set(
    PACKING_APP_USER_ID_COOKIE,
    userId,
    getSessionCookieOptions()
  );

  return userId;
}

async function getSupabaseClient() {
  return createSupabaseServerClient();
}

async function requireSupabaseClient() {
  const client = await getSupabaseClient();

  if (!client) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to use trips."
    );
  }

  return client;
}

async function ensureProfileForUser(client: AppSupabaseClient, userId: string) {
  const { data: existingProfile, error: profileLookupError } = await client
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (profileLookupError) {
    throw profileLookupError;
  }

  if (existingProfile) {
    return existingProfile;
  }

  const { data: insertedProfile, error: insertProfileError } = await client
    .from("profiles")
    .insert({ id: userId })
    .select("id")
    .single();

  if (insertProfileError) {
    throw insertProfileError;
  }

  return insertedProfile;
}

async function ensureWritableContext() {
  const client = await requireSupabaseClient();
  const userId = await ensureCurrentUserId();
  await ensureProfileForUser(client, userId);

  return { client, userId };
}

async function requireOwnedTrip(
  client: AppSupabaseClient,
  userId: string,
  tripId: string
) {
  const { data: trip, error } = await client
    .from("trips")
    .select(
      "id, template_id, name, mode, status, current_leg_index, created_at, updated_at"
    )
    .eq("id", tripId)
    .eq("profile_id", userId)
    .single<TripRow>();

  if (error) {
    throw error;
  }

  return trip;
}

async function loadTemplatesForUser(client: AppSupabaseClient, userId: string) {
  const { data: templateRows, error: templateError } = await client
    .from("packing_templates")
    .select("id, name, is_default")
    .eq("profile_id", userId)
    .order("is_default", { ascending: false })
    .order("updated_at", { ascending: false })
    .returns<TemplateRow[]>();

  if (templateError) {
    throw templateError;
  }

  const templateIds = (templateRows ?? []).map((template) => template.id);

  if (templateIds.length === 0) {
    return [] satisfies TripTemplateOption[];
  }

  const { data: templateItemRows, error: templateItemsError } = await client
    .from("packing_template_items")
    .select("template_id")
    .in("template_id", templateIds)
    .returns<Array<{ template_id: string }>>();

  if (templateItemsError) {
    throw templateItemsError;
  }

  const itemCounts = new Map<string, number>();

  for (const row of templateItemRows ?? []) {
    itemCounts.set(row.template_id, (itemCounts.get(row.template_id) ?? 0) + 1);
  }

  return (templateRows ?? []).map((template) => ({
    id: template.id,
    name: template.name,
    isDefault: template.is_default,
    itemCount: itemCounts.get(template.id) ?? 0,
  }));
}

async function loadStopsForTrips(client: AppSupabaseClient, tripIds: string[]) {
  if (tripIds.length === 0) {
    return [] as StopRow[];
  }

  const { data, error } = await client
    .from("trip_stops")
    .select("id, trip_id, position, name, kind")
    .in("trip_id", tripIds)
    .order("position", { ascending: true })
    .returns<StopRow[]>();

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function loadLegsForTrips(client: AppSupabaseClient, tripIds: string[]) {
  if (tripIds.length === 0) {
    return [] as LegRow[];
  }

  const { data, error } = await client
    .from("trip_legs")
    .select("id, trip_id, position, from_stop_id, to_stop_id, status")
    .in("trip_id", tripIds)
    .order("position", { ascending: true })
    .returns<LegRow[]>();

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function loadChecksForLegs(client: AppSupabaseClient, legIds: string[]) {
  if (legIds.length === 0) {
    return [] as CheckRow[];
  }

  const { data, error } = await client
    .from("trip_leg_item_checks")
    .select("id, leg_id, trip_item_id, is_packed")
    .in("leg_id", legIds)
    .returns<CheckRow[]>();

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function loadTripItems(client: AppSupabaseClient, tripId: string) {
  const { data, error } = await client
    .from("trip_items")
    .select("id, item_name, category_name, quantity, unit, sort_order")
    .eq("trip_id", tripId)
    .order("category_name", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("item_name", { ascending: true })
    .returns<TripItemRow[]>();

  if (error) {
    throw error;
  }

  return data ?? [];
}

function groupByTripId<T extends { trip_id: string }>(rows: T[]) {
  const grouped = new Map<string, T[]>();

  for (const row of rows) {
    const tripRows = grouped.get(row.trip_id) ?? [];
    tripRows.push(row);
    grouped.set(row.trip_id, tripRows);
  }

  return grouped;
}

function buildStopMap(stopRows: StopRow[]) {
  const stopMap = new Map<string, TripStop>();

  for (const stop of stopRows) {
    stopMap.set(stop.id, {
      id: stop.id,
      position: stop.position,
      name: stop.name,
      kind: stop.kind,
    });
  }

  return stopMap;
}

function buildLegCountMap(checkRows: CheckRow[]) {
  const counts = new Map<string, { packed: number; total: number }>();

  for (const check of checkRows) {
    const legCounts = counts.get(check.leg_id) ?? { packed: 0, total: 0 };
    legCounts.total += 1;

    if (check.is_packed) {
      legCounts.packed += 1;
    }

    counts.set(check.leg_id, legCounts);
  }

  return counts;
}

function buildTripLegs(
  legRows: LegRow[],
  stopMap: Map<string, TripStop>,
  legCounts: Map<string, { packed: number; total: number }>
) {
  return legRows
    .map((leg): TripLeg | null => {
      const fromStop = stopMap.get(leg.from_stop_id);
      const toStop = stopMap.get(leg.to_stop_id);

      if (!fromStop || !toStop) {
        return null;
      }

      const counts = legCounts.get(leg.id) ?? { packed: 0, total: 0 };

      return {
        id: leg.id,
        position: leg.position,
        fromStopId: fromStop.id,
        toStopId: toStop.id,
        fromStopName: fromStop.name,
        toStopName: toStop.name,
        status: leg.status,
        packedCount: counts.packed,
        totalCount: counts.total,
      };
    })
    .filter((leg): leg is TripLeg => leg !== null)
    .sort((left, right) => left.position - right.position);
}

function buildChecklistSelection(
  legs: TripLeg[],
  tripItems: TripItemRow[],
  allChecks: CheckRow[]
) {
  const activeLeg = legs.find((leg) => leg.status === "active") ?? null;

  const fallbackLeg =
    activeLeg ??
    legs.find((leg) => leg.position === 0) ??
    [...legs].reverse().find((leg) => leg.status === "completed") ??
    legs.at(-1) ??
    null;

  if (!fallbackLeg) {
    return {
      legId: null,
      status: null,
      routeLabel: null,
      packedCount: 0,
      totalCount: tripItems.length,
      groups: [],
    } satisfies ChecklistSelection;
  }

  const checkByTripItemId = new Map<string, CheckRow>();
  const selectedChecks = allChecks.filter((check) => check.leg_id === fallbackLeg.id);

  for (const check of selectedChecks) {
    checkByTripItemId.set(check.trip_item_id, check);
  }

  const groups = new Map<string, TripChecklistGroup>();

  for (const item of tripItems) {
    const itemGroup =
      groups.get(item.category_name) ??
      {
        categoryName: item.category_name,
        items: [],
      };

    itemGroup.items.push({
      tripItemId: item.id,
      itemName: item.item_name,
      quantity: toNumber(item.quantity),
      unit: item.unit,
      categoryName: item.category_name,
      isPacked: checkByTripItemId.get(item.id)?.is_packed ?? false,
    });

    groups.set(item.category_name, itemGroup);
  }

  const packedCount = selectedChecks.filter((check) => check.is_packed).length;

  return {
    legId: fallbackLeg.id,
    status: fallbackLeg.status,
    routeLabel: `${fallbackLeg.fromStopName} -> ${fallbackLeg.toStopName}`,
    packedCount,
    totalCount: selectedChecks.length || tripItems.length,
    groups: [...groups.values()],
  } satisfies ChecklistSelection;
}

function buildTripListItems(
  tripRows: TripRow[],
  stopRows: StopRow[],
  legRows: LegRow[],
  checkRows: CheckRow[],
  templateMap: Map<string, TripTemplateOption>
) {
  const stopsByTrip = groupByTripId(stopRows);
  const legsByTrip = groupByTripId(legRows);
  const stopMap = buildStopMap(stopRows);
  const legCountMap = buildLegCountMap(checkRows);

  return tripRows
    .map((trip): TripListItem => {
      const tripStops = (stopsByTrip.get(trip.id) ?? [])
        .map((stop) => ({
          id: stop.id,
          position: stop.position,
          name: stop.name,
          kind: stop.kind,
        }))
        .sort((left, right) => left.position - right.position);

      const tripLegs = buildTripLegs(
        legsByTrip.get(trip.id) ?? [],
        stopMap,
        legCountMap
      );
      const activeLeg = tripLegs.find((leg) => leg.status === "active") ?? null;
      const template = trip.template_id ? templateMap.get(trip.template_id) : null;

      return {
        id: trip.id,
        name: trip.name,
        mode: trip.mode,
        status: trip.status,
        templateId: trip.template_id,
        templateName: template?.name ?? null,
        createdAt: trip.created_at,
        updatedAt: trip.updated_at,
        stops: tripStops,
        legs: tripLegs,
        routeLabel: tripStops.map((stop) => stop.name).join(" -> "),
        activeLeg,
        completedLegs: tripLegs.filter((leg) => leg.status === "completed").length,
        totalLegs: tripLegs.length,
      };
    })
    .sort((left, right) => {
      const statusDifference = tripStatusRank[left.status] - tripStatusRank[right.status];

      if (statusDifference !== 0) {
        return statusDifference;
      }

      return right.updatedAt.localeCompare(left.updatedAt);
    });
}

function buildStopsFromInput(input: CreateTripInput) {
  const plannedStops = input.stops
    .map((stop) => cleanStopName(stop.name))
    .filter((stopName) => stopName.length > 0)
    .filter((stopName) => stopName.toLowerCase() !== HOME_STOP_NAME.toLowerCase());

  if (input.mode === "simple" && plannedStops.length !== 1) {
    throw new Error("Simple trips need exactly one destination.");
  }

  if (plannedStops.length === 0) {
    throw new Error("Add at least one stop before creating a trip.");
  }

  return [
    { name: HOME_STOP_NAME, kind: "home" as const },
    ...plannedStops.map((name) => ({ name, kind: "stop" as const })),
    { name: HOME_STOP_NAME, kind: "home" as const },
  ];
}

async function loadTripRowsForUser(client: AppSupabaseClient, userId: string) {
  const { data, error } = await client
    .from("trips")
    .select(
      "id, template_id, name, mode, status, current_leg_index, created_at, updated_at"
    )
    .eq("profile_id", userId)
    .returns<TripRow[]>();

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function loadStopsForTrip(client: AppSupabaseClient, tripId: string) {
  const rows = await loadStopsForTrips(client, [tripId]);
  return rows.sort((left, right) => left.position - right.position);
}

async function loadLegsForTrip(client: AppSupabaseClient, tripId: string) {
  const rows = await loadLegsForTrips(client, [tripId]);
  return rows.sort((left, right) => left.position - right.position);
}

function assertTripName(name: string) {
  if (cleanText(name).length === 0) {
    throw new Error("Trip name cannot be empty.");
  }
}

export async function initializeTripsWorkspaceData() {
  const { client, userId } = await ensureWritableContext();
  await ensureProfileForUser(client, userId);

  return { userId };
}

export async function getTripsPageData(): Promise<TripPageData> {
  const client = await getSupabaseClient();
  const userId = await getCurrentUserIdFromCookie();

  if (!client) {
    return {
      userId,
      isSupabaseConfigured: false,
      templates: [],
      trips: [],
      activeTripId: null,
    };
  }

  if (!userId) {
    return {
      userId: null,
      isSupabaseConfigured: true,
      templates: [],
      trips: [],
      activeTripId: null,
    };
  }

  await ensureProfileForUser(client, userId);

  const [templates, tripRows] = await Promise.all([
    loadTemplatesForUser(client, userId),
    loadTripRowsForUser(client, userId),
  ]);

  const tripIds = tripRows.map((trip) => trip.id);
  const [stopRows, legRows] = await Promise.all([
    loadStopsForTrips(client, tripIds),
    loadLegsForTrips(client, tripIds),
  ]);
  const checkRows = await loadChecksForLegs(
    client,
    legRows.map((leg) => leg.id)
  );

  const templateMap = new Map(templates.map((template) => [template.id, template]));
  const trips = buildTripListItems(
    tripRows,
    stopRows,
    legRows,
    checkRows,
    templateMap
  );

  return {
    userId,
    isSupabaseConfigured: true,
    templates,
    trips,
    activeTripId: trips.find((trip) => trip.status === "active")?.id ?? null,
  };
}

export async function getTripsForCurrentUser() {
  const pageData = await getTripsPageData();
  return pageData.trips;
}

export async function getActiveTripForCurrentUser() {
  const trips = await getTripsForCurrentUser();
  return trips.find((trip) => trip.status === "active") ?? null;
}

export async function getTripDetails(tripId: string): Promise<TripDetails | null> {
  const client = await getSupabaseClient();
  const userId = await getCurrentUserIdFromCookie();

  if (!client || !userId) {
    return null;
  }

  await ensureProfileForUser(client, userId);

  const { data: tripRow, error: tripError } = await client
    .from("trips")
    .select(
      "id, template_id, name, mode, status, current_leg_index, created_at, updated_at"
    )
    .eq("id", tripId)
    .eq("profile_id", userId)
    .maybeSingle<TripRow>();

  if (tripError) {
    throw tripError;
  }

  if (!tripRow) {
    return null;
  }

  const [stops, legs, tripItems, templateRow] = await Promise.all([
    loadStopsForTrip(client, tripId),
    loadLegsForTrip(client, tripId),
    loadTripItems(client, tripId),
    tripRow.template_id
      ? client
          .from("packing_templates")
          .select("id, name, is_default")
          .eq("id", tripRow.template_id)
          .maybeSingle<TemplateRow>()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (templateRow.error) {
    throw templateRow.error;
  }

  const allChecks = await loadChecksForLegs(
    client,
    legs.map((leg) => leg.id)
  );
  const stopMap = buildStopMap(stops);
  const legCountMap = buildLegCountMap(allChecks);
  const tripLegs = buildTripLegs(legs, stopMap, legCountMap);
  const activeLeg = tripLegs.find((leg) => leg.status === "active") ?? null;
  const finalHomeStop = [...stops]
    .sort((left, right) => left.position - right.position)
    .reverse()
    .find((stop) => stop.kind === "home");
  const checklistSelection = buildChecklistSelection(
    tripLegs,
    tripItems,
    allChecks
  );

  return {
    id: tripRow.id,
    name: tripRow.name,
    mode: tripRow.mode,
    status: tripRow.status,
    templateId: tripRow.template_id,
    templateName: templateRow.data?.name ?? null,
    createdAt: tripRow.created_at,
    updatedAt: tripRow.updated_at,
    currentLegIndex: tripRow.current_leg_index,
    stops: [...stops]
      .map((stop) => ({
        id: stop.id,
        position: stop.position,
        name: stop.name,
        kind: stop.kind,
      }))
      .sort((left, right) => left.position - right.position),
    legs: tripLegs,
    checklistLegId: checklistSelection.legId,
    checklistLegStatus: checklistSelection.status,
    checklistRouteLabel: checklistSelection.routeLabel,
    checklistPackedCount: checklistSelection.packedCount,
    checklistTotalCount: checklistSelection.totalCount,
    checklistGroups: checklistSelection.groups,
    activeLeg,
    canStart: tripRow.status === "draft" && tripLegs.length > 0,
    canArrive: tripRow.status === "active" && activeLeg !== null,
    canGoHomeNow:
      tripRow.status === "active" &&
      activeLeg !== null &&
      finalHomeStop !== undefined &&
      activeLeg.toStopId !== finalHomeStop.id,
  };
}

export async function createTripData(input: CreateTripInput) {
  const { client, userId } = await ensureWritableContext();
  const tripName = cleanText(input.name);
  assertTripName(tripName);

  const { data: template, error: templateError } = await client
    .from("packing_templates")
    .select("id, name, is_default")
    .eq("id", input.templateId)
    .eq("profile_id", userId)
    .single<TemplateRow>();

  if (templateError) {
    throw templateError;
  }
  const templateRow = requireRow(template, "Failed to load trip template");

  const { data: templateItems, error: templateItemsError } = await client
    .from("packing_template_items")
    .select(
      "id, catalog_item_id, item_name, item_normalized_name, category_name, quantity, unit, sort_order"
    )
    .eq("template_id", templateRow.id)
    .order("sort_order", { ascending: true })
    .returns<TemplateItemRow[]>();

  if (templateItemsError) {
    throw templateItemsError;
  }

  const routeStops = buildStopsFromInput(input);

  let tripId: string | null = null;

  try {
    const { data: insertedTrip, error: tripInsertError } = await client
      .from("trips")
      .insert({
        profile_id: userId,
        template_id: templateRow.id,
        name: tripName,
        mode: input.mode,
        status: "draft",
        current_leg_index: 0,
      })
      .select("id")
      .single<{ id: string }>();

    if (tripInsertError) {
      throw tripInsertError;
    }
    const tripRow = requireRow(insertedTrip, "Failed to create trip");
    const createdTripId = tripRow.id as string;

    tripId = createdTripId;

    const { data: insertedStops, error: stopInsertError } = await client
      .from("trip_stops")
      .insert(
        routeStops.map((stop, index) => ({
          trip_id: createdTripId,
          position: index,
          name: stop.name,
          kind: stop.kind,
        }))
      )
      .select("id, trip_id, position, name, kind")
      .returns<StopRow[]>();

    if (stopInsertError) {
      throw stopInsertError;
    }

    const orderedStops = (insertedStops ?? []).sort(
      (left, right) => left.position - right.position
    );

    const { data: insertedTripItems, error: tripItemsError } = await client
      .from("trip_items")
      .insert(
        (templateItems ?? []).map((item) => ({
          trip_id: createdTripId,
          catalog_item_id: item.catalog_item_id,
          template_item_id: item.id,
          item_name: item.item_name,
          item_normalized_name: item.item_normalized_name,
          category_name: item.category_name,
          quantity: toNumber(item.quantity),
          unit: item.unit,
          sort_order: item.sort_order,
        }))
      )
      .select("id")
      .returns<Array<{ id: string }>>();

    if (tripItemsError) {
      throw tripItemsError;
    }

    const legPayload = orderedStops.slice(0, -1).map((stop, index) => ({
      trip_id: createdTripId,
      position: index,
      from_stop_id: stop.id,
      to_stop_id: orderedStops[index + 1]!.id,
      status: "pending" as const,
    }));

    const { data: insertedLegs, error: legsInsertError } = await client
      .from("trip_legs")
      .insert(legPayload)
      .select("id, trip_id, position, from_stop_id, to_stop_id, status")
      .returns<LegRow[]>();

    if (legsInsertError) {
      throw legsInsertError;
    }

    const checkPayload = (insertedLegs ?? []).flatMap((leg) =>
      (insertedTripItems ?? []).map((tripItem) => ({
        leg_id: leg.id,
        trip_item_id: tripItem.id,
        is_packed: false,
      }))
    );

    if (checkPayload.length > 0) {
      const { error: checkInsertError } = await client
        .from("trip_leg_item_checks")
        .insert(checkPayload);

      if (checkInsertError) {
        throw checkInsertError;
      }
    }
  } catch (error) {
    if (tripId) {
      await client.from("trips").delete().eq("id", tripId).eq("profile_id", userId);
    }

    throw error;
  }

  return { tripId };
}

export async function startTripData(input: StartTripInput) {
  const { client, userId } = await ensureWritableContext();
  const trip = requireRow(
    await requireOwnedTrip(client, userId, input.tripId),
    "Failed to load trip",
  );

  if (trip.status !== "draft") {
    throw new Error("Only draft trips can be started.");
  }

  const legs = await loadLegsForTrip(client, trip.id);
  const firstLeg = legs[0];

  if (!firstLeg) {
    throw new Error("Trip needs at least one leg before it can start.");
  }

  await client.from("trip_legs").update({ status: "pending" }).eq("trip_id", trip.id);

  const { error: activateLegError } = await client
    .from("trip_legs")
    .update({ status: "active" })
    .eq("id", firstLeg.id)
    .eq("trip_id", trip.id);

  if (activateLegError) {
    throw activateLegError;
  }

  const { error: resetChecksError } = await client
    .from("trip_leg_item_checks")
    .update({ is_packed: false, packed_at: null })
    .eq("leg_id", firstLeg.id);

  if (resetChecksError) {
    throw resetChecksError;
  }

  const { error: tripUpdateError } = await client
    .from("trips")
    .update({
      status: "active",
      current_leg_index: firstLeg.position,
    })
    .eq("id", trip.id)
    .eq("profile_id", userId);

  if (tripUpdateError) {
    throw tripUpdateError;
  }

  return { tripId: trip.id };
}

export async function toggleTripLegItemCheckData(
  input: ToggleTripLegItemCheckInput
) {
  const { client, userId } = await ensureWritableContext();
  const trip = requireRow(
    await requireOwnedTrip(client, userId, input.tripId),
    "Failed to load trip",
  );

  if (trip.status !== "active") {
    throw new Error("Only active trips can update checklist items.");
  }

  const { data: leg, error: legError } = await client
    .from("trip_legs")
    .select("id, trip_id, status")
    .eq("id", input.legId)
    .eq("trip_id", trip.id)
    .single<{ id: string; trip_id: string; status: LegStatus }>();

  if (legError) {
    throw legError;
  }

  if (leg.status !== "active") {
    throw new Error("Only the active leg checklist can be changed.");
  }

  const { data: checkRow, error: checkLookupError } = await client
    .from("trip_leg_item_checks")
    .select("id, leg_id, trip_item_id, is_packed")
    .eq("leg_id", input.legId)
    .eq("trip_item_id", input.tripItemId)
    .single<CheckRow>();

  if (checkLookupError) {
    throw checkLookupError;
  }

  const nextPackedState =
    typeof input.isPacked === "boolean" ? input.isPacked : !checkRow.is_packed;

  const { error: checkUpdateError } = await client
    .from("trip_leg_item_checks")
    .update({
      is_packed: nextPackedState,
      packed_at: nextPackedState ? new Date().toISOString() : null,
    })
    .eq("id", checkRow.id)
    .eq("leg_id", input.legId);

  if (checkUpdateError) {
    throw checkUpdateError;
  }

  return {
    tripId: trip.id,
    legId: input.legId,
    tripItemId: input.tripItemId,
    isPacked: nextPackedState,
  };
}

export async function arriveAtCurrentStopData(input: ArriveAtCurrentStopInput) {
  const { client, userId } = await ensureWritableContext();
  const trip = requireRow(
    await requireOwnedTrip(client, userId, input.tripId),
    "Failed to load trip",
  );

  if (trip.status !== "active") {
    throw new Error("Only active trips can arrive at the next stop.");
  }

  const legs = await loadLegsForTrip(client, trip.id);
  const activeLeg = legs.find((leg) => leg.status === "active");

  if (!activeLeg) {
    throw new Error("Trip has no active leg to complete.");
  }

  const { error: completeLegError } = await client
    .from("trip_legs")
    .update({ status: "completed" })
    .eq("id", activeLeg.id)
    .eq("trip_id", trip.id);

  if (completeLegError) {
    throw completeLegError;
  }

  const nextLeg = legs.find(
    (leg) => leg.position > activeLeg.position && leg.status === "pending"
  );

  if (!nextLeg) {
    const { error: completeTripError } = await client
      .from("trips")
      .update({
        status: "completed",
        current_leg_index: activeLeg.position,
      })
      .eq("id", trip.id)
      .eq("profile_id", userId);

    if (completeTripError) {
      throw completeTripError;
    }

    return {
      tripId: trip.id,
      status: "completed" as const,
    };
  }

  const { error: activateLegError } = await client
    .from("trip_legs")
    .update({ status: "active" })
    .eq("id", nextLeg.id)
    .eq("trip_id", trip.id);

  if (activateLegError) {
    throw activateLegError;
  }

  const { error: tripUpdateError } = await client
    .from("trips")
    .update({
      status: "active",
      current_leg_index: nextLeg.position,
    })
    .eq("id", trip.id)
    .eq("profile_id", userId);

  if (tripUpdateError) {
    throw tripUpdateError;
  }

  return {
    tripId: trip.id,
    status: "active" as const,
  };
}

export async function goHomeNowData(input: GoHomeNowInput) {
  const { client, userId } = await ensureWritableContext();
  const trip = requireRow(
    await requireOwnedTrip(client, userId, input.tripId),
    "Failed to load trip",
  );

  if (trip.status !== "active") {
    throw new Error("Only active trips can reroute home.");
  }

  const [stops, legs] = await Promise.all([
    loadStopsForTrip(client, trip.id),
    loadLegsForTrip(client, trip.id),
  ]);
  const activeLeg = legs.find((leg) => leg.status === "active");
  const finalHomeStop = [...stops]
    .sort((left, right) => left.position - right.position)
    .reverse()
    .find((stop) => stop.kind === "home");

  if (!activeLeg || !finalHomeStop) {
    throw new Error("Trip route is incomplete.");
  }

  if (activeLeg.to_stop_id === finalHomeStop.id) {
    throw new Error("This leg already heads home.");
  }

  const futureLegIds = legs
    .filter(
      (leg) =>
        leg.position > activeLeg.position &&
        (leg.status === "pending" || leg.status === "active")
    )
    .map((leg) => leg.id);

  if (futureLegIds.length > 0) {
    const { error: skipLegsError } = await client
      .from("trip_legs")
      .update({ status: "skipped" })
      .in("id", futureLegIds)
      .eq("trip_id", trip.id);

    if (skipLegsError) {
      throw skipLegsError;
    }
  }

  const { error: rerouteLegError } = await client
    .from("trip_legs")
    .update({
      to_stop_id: finalHomeStop.id,
      status: "active",
    })
    .eq("id", activeLeg.id)
    .eq("trip_id", trip.id);

  if (rerouteLegError) {
    throw rerouteLegError;
  }

  const { error: resetChecksError } = await client
    .from("trip_leg_item_checks")
    .update({ is_packed: false, packed_at: null })
    .eq("leg_id", activeLeg.id);

  if (resetChecksError) {
    throw resetChecksError;
  }

  const { error: tripUpdateError } = await client
    .from("trips")
    .update({
      status: "active",
      current_leg_index: activeLeg.position,
    })
    .eq("id", trip.id)
    .eq("profile_id", userId);

  if (tripUpdateError) {
    throw tripUpdateError;
  }

  return { tripId: trip.id };
}

export async function archiveTripData(input: ArchiveTripInput) {
  const { client, userId } = await ensureWritableContext();
  const trip = requireRow(
    await requireOwnedTrip(client, userId, input.tripId),
    "Failed to load trip",
  );

  if (trip.status === "active") {
    throw new Error("Finish or reroute the active trip before archiving it.");
  }

  const { error } = await client
    .from("trips")
    .update({ status: "archived" })
    .eq("id", trip.id)
    .eq("profile_id", userId);

  if (error) {
    throw error;
  }

  return { tripId: trip.id };
}
