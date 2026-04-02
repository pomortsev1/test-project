"use server";

import { revalidatePath } from "next/cache";

import {
  archiveTripData,
  arriveAtCurrentStopData,
  createTripData,
  goHomeNowData,
  initializeTripsWorkspaceData,
  startTripData,
  toggleTripLegItemCheckData,
} from "../(app)/trips/_lib/trips-data";
import type {
  ArchiveTripInput,
  ArriveAtCurrentStopInput,
  CreateTripInput,
  GoHomeNowInput,
  StartTripInput,
  ToggleTripLegItemCheckInput,
} from "@/components/trips/types";

function revalidateTripPaths(tripId?: string) {
  revalidatePath("/trips");

  if (tripId) {
    revalidatePath(`/trips/${tripId}`);
  }
}

export async function initializeTripsWorkspace() {
  const result = await initializeTripsWorkspaceData();
  revalidateTripPaths();
  return result;
}

export async function createTrip(input: CreateTripInput) {
  const result = await createTripData(input);
  revalidateTripPaths(result.tripId);
  return result;
}

export async function startTrip(input: StartTripInput) {
  const result = await startTripData(input);
  revalidateTripPaths(result.tripId);
  return result;
}

export async function toggleTripLegItemCheck(
  input: ToggleTripLegItemCheckInput,
) {
  const result = await toggleTripLegItemCheckData(input);
  revalidateTripPaths(result.tripId);
  return result;
}

export async function arriveAtCurrentStop(input: ArriveAtCurrentStopInput) {
  const result = await arriveAtCurrentStopData(input);
  revalidateTripPaths(result.tripId);
  return result;
}

export async function goHomeNow(input: GoHomeNowInput) {
  const result = await goHomeNowData(input);
  revalidateTripPaths(result.tripId);
  return result;
}

export async function archiveTrip(input: ArchiveTripInput) {
  const result = await archiveTripData(input);
  revalidateTripPaths(result.tripId);
  return result;
}
