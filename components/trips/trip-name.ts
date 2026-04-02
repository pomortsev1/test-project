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
    .join(" -> ");
}

export function resolveTripName(
  name: string | null | undefined,
  destinationNames: string[],
) {
  return cleanTripName(name) || buildTripNameFromDestinations(destinationNames);
}
