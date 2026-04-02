import type { LegStatus, TripMode, TripStatus } from "@/components/trips/types";
import { formatMeasurementLabel } from "@/lib/domain/measurements";

export function formatTripDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function formatTripMode(mode: TripMode) {
  return mode === "multi_stop" ? "Multi-stop" : "Simple";
}

export function formatTripStatus(status: TripStatus) {
  switch (status) {
    case "active":
      return "Active";
    case "draft":
      return "Draft";
    case "completed":
      return "Completed";
    case "archived":
      return "Archived";
    default:
      return status;
  }
}

export function formatLegStatus(status: LegStatus) {
  switch (status) {
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    case "pending":
      return "Pending";
    case "skipped":
      return "Skipped";
    default:
      return status;
  }
}

export function getTripStatusBadgeVariant(status: TripStatus) {
  switch (status) {
    case "active":
      return "default" as const;
    case "draft":
      return "secondary" as const;
    case "completed":
      return "outline" as const;
    case "archived":
      return "ghost" as const;
    default:
      return "outline" as const;
  }
}

export function getLegStatusBadgeVariant(status: LegStatus) {
  switch (status) {
    case "active":
      return "default" as const;
    case "completed":
      return "outline" as const;
    case "pending":
      return "secondary" as const;
    case "skipped":
      return "ghost" as const;
    default:
      return "outline" as const;
  }
}

export function formatChecklistProgress(packedCount: number, totalCount: number) {
  if (totalCount === 0) {
    return "No items in this checklist";
  }

  return `${packedCount} of ${totalCount} packed`;
}

export function formatTripItemMeasurement(value: {
  quantity: number | null;
  unit: string | null;
}) {
  return value.quantity !== null && value.unit !== null
    ? formatMeasurementLabel({
        quantity: value.quantity,
        unit: value.unit,
      })
    : null;
}
