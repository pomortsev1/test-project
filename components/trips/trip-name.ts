export const TRIP_ROUTE_SEPARATOR = " → ";

function normalizeTripText(value: string | null | undefined) {
  return (value ?? "").trim().replace(/\s+/g, " ");
}

export function cleanTripName(value: string | null | undefined) {
  return normalizeTripText(value);
}

export function normalizeTripDestinationName(value: string | null | undefined) {
  return normalizeTripText(value);
}

export function buildTripNameFromDestinations(destinationNames: string[]) {
  return destinationNames
    .map((destinationName) => normalizeTripDestinationName(destinationName))
    .filter((destinationName) => destinationName.length > 0)
    .join(TRIP_ROUTE_SEPARATOR);
}

export function formatTripRoute(stopNames: string[]) {
  return stopNames.join(TRIP_ROUTE_SEPARATOR);
}

export function formatTripLeg(fromStopName: string, toStopName: string) {
  return `${fromStopName}${TRIP_ROUTE_SEPARATOR}${toStopName}`;
}

export function resolveTripName(
  name: string | null | undefined,
  destinationNames: string[],
) {
  return cleanTripName(name) || buildTripNameFromDestinations(destinationNames);
}
