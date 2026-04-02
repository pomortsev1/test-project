import { describe, expect, it } from "vitest";

import {
  buildTripNameFromDestinations,
  cleanTripName,
  resolveTripName,
} from "@/components/trips/trip-name";

describe("trip name helpers", () => {
  it("builds a generated name from non-empty destinations", () => {
    expect(
      buildTripNameFromDestinations(["  Madrid  ", "", "Barcelona", " Valencia  "]),
    ).toBe("Madrid -> Barcelona -> Valencia");
  });

  it("prefers the explicit name when provided", () => {
    expect(resolveTripName("  Spring city break  ", ["Madrid", "Barcelona"])).toBe(
      "Spring city break",
    );
  });

  it("falls back to destinations when the explicit name is blank", () => {
    expect(resolveTripName("   ", ["Madrid", "Barcelona"])).toBe(
      "Madrid -> Barcelona",
    );
  });

  it("normalizes a custom trip name", () => {
    expect(cleanTripName("  Spring   city  break ")).toBe("Spring city break");
  });
});
