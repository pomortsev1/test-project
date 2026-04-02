import type { QuantityValue } from "@/lib/domain/types";

export function hasMeasurement(
  value: QuantityValue,
): value is Extract<QuantityValue, { quantity: number; unit: string }> {
  return value.quantity !== null && value.unit !== null;
}

export function formatMeasurementLabel(value: QuantityValue) {
  return hasMeasurement(value) ? `${value.quantity} ${value.unit}` : null;
}
