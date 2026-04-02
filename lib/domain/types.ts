import type { Enums, Tables } from "@/lib/supabase/types";

export type Scope = Enums<"scope">;
export type TripMode = Enums<"trip_mode">;
export type TripStatus = Enums<"trip_status">;
export type StopKind = Enums<"stop_kind">;
export type LegStatus = Enums<"leg_status">;

export type ProfileRecord = Tables<"profiles">;
export type CategoryRecord = Tables<"categories">;
export type CatalogItemRecord = Tables<"catalog_items">;
export type PackingTemplateRecord = Tables<"packing_templates">;
export type PackingTemplateItemRecord = Tables<"packing_template_items">;
export type TripRecord = Tables<"trips">;
export type TripStopRecord = Tables<"trip_stops">;
export type TripItemRecord = Tables<"trip_items">;
export type TripLegRecord = Tables<"trip_legs">;
export type TripLegItemCheckRecord = Tables<"trip_leg_item_checks">;

export type Profile = ProfileRecord;
export type Category = CategoryRecord;
export type CatalogItem = CatalogItemRecord;

export type QuantityValue =
  | {
      quantity: number;
      unit: string;
    }
  | {
      quantity: null;
      unit: null;
    };

export type QuantityInputValue =
  | {
      quantity: number;
      unit: string;
    }
  | {
      quantity?: null;
      unit?: null;
    };

export type PackingItemSnapshot = QuantityValue & {
  categoryName: string;
  id: string;
  itemName: string;
};

export interface PackingTemplate {
  id: string;
  isDefault: boolean;
  itemCount: number;
  items: PackingItemSnapshot[];
  name: string;
}

export type TripChecklistItem = PackingItemSnapshot & {
  isPacked: boolean;
};

export interface TripStop {
  id: string;
  kind: StopKind;
  name: string;
  position: number;
}

export interface TripLeg {
  checklistItems: TripChecklistItem[];
  fromStopName: string;
  id: string;
  position: number;
  status: LegStatus;
  toStopName: string;
}

export interface Trip {
  currentLegIndex: number;
  id: string;
  legs: TripLeg[];
  mode: TripMode;
  name: string;
  status: TripStatus;
  stops: TripStop[];
  templateName: string;
}

export interface DashboardProfile {
  authMode: "anonymous" | "google";
  displayName: string;
  email: string | null;
  id: string;
  notes: string[];
  source: "supabase" | "degraded";
}

export interface DashboardData {
  activeTrip: Trip | null;
  isSupabaseConfigured: boolean;
  profile: DashboardProfile;
  templates: PackingTemplate[];
  trips: Trip[];
}

export interface CatalogSuggestion {
  category: Category;
  item: CatalogItem;
}

export interface PackingTemplateRecordDetails {
  items: PackingTemplateItemRecord[];
  template: PackingTemplateRecord;
}

export interface TripRecordDetails {
  checks: TripLegItemCheckRecord[];
  items: TripItemRecord[];
  legs: TripLegRecord[];
  stops: TripStopRecord[];
  trip: TripRecord;
}

interface TemplateItemInputBase {
  catalogItemId?: string | null;
  categoryId?: string;
  categoryName?: string;
  name: string;
  saveToCatalog?: boolean;
  sortOrder?: number;
}

export type TemplateItemInput = TemplateItemInputBase & QuantityInputValue;

export interface TripStopInput {
  name: string;
}

export interface CreateTripInput {
  mode: TripMode;
  name: string;
  stops: TripStopInput[];
  templateId: string;
}

export type TripCreateInput = CreateTripInput;

export interface StartTripInput {
  tripId: string;
}

export interface ToggleTripLegItemCheckInput {
  isPacked: boolean;
  legId: string;
  tripId: string;
  tripItemId: string;
}

export interface ArriveAtCurrentStopInput {
  tripId: string;
}

export interface GoHomeNowInput {
  tripId: string;
}

export interface ArchiveTripInput {
  tripId: string;
}

export interface TripTemplateOption {
  id: string;
  isDefault: boolean;
  itemCount: number;
  name: string;
}
