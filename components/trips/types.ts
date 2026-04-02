import type {
  LegStatus,
  StopKind,
  TripCreateInput,
  TripMode,
  TripStatus,
} from "@/lib/domain/types";

export type { LegStatus, StopKind, TripMode, TripStatus };

export type TripStop = {
  id: string;
  position: number;
  name: string;
  kind: StopKind;
};

export type TripTemplateOption = {
  id: string;
  name: string;
  isDefault: boolean;
  itemCount: number;
};

export type CreateTripInput = TripCreateInput;

export type StartTripInput = {
  tripId: string;
};

export type ToggleTripLegItemCheckInput = {
  tripId: string;
  legId: string;
  tripItemId: string;
  isPacked?: boolean;
};

export type ArriveAtCurrentStopInput = {
  tripId: string;
};

export type GoHomeNowInput = {
  tripId: string;
};

export type ArchiveTripInput = {
  tripId: string;
};

export type TripLeg = {
  id: string;
  position: number;
  fromStopId: string;
  toStopId: string;
  fromStopName: string;
  toStopName: string;
  status: LegStatus;
  packedCount: number;
  totalCount: number;
};

export type TripChecklistItem = {
  tripItemId: string;
  itemName: string;
  quantity: number | null;
  unit: string | null;
  categoryName: string;
  isPacked: boolean;
};

export type TripChecklistGroup = {
  categoryName: string;
  items: TripChecklistItem[];
};

export type TripListItem = {
  id: string;
  name: string;
  mode: TripMode;
  status: TripStatus;
  templateId: string | null;
  templateName: string | null;
  createdAt: string;
  updatedAt: string;
  stops: TripStop[];
  legs: TripLeg[];
  routeLabel: string;
  activeLeg: TripLeg | null;
  completedLegs: number;
  totalLegs: number;
};

export type TripDetails = {
  id: string;
  name: string;
  mode: TripMode;
  status: TripStatus;
  templateId: string | null;
  templateName: string | null;
  createdAt: string;
  updatedAt: string;
  currentLegIndex: number;
  stops: TripStop[];
  legs: TripLeg[];
  checklistLegId: string | null;
  checklistLegStatus: LegStatus | null;
  checklistRouteLabel: string | null;
  checklistPackedCount: number;
  checklistTotalCount: number;
  checklistGroups: TripChecklistGroup[];
  activeLeg: TripLeg | null;
  canStart: boolean;
  canArrive: boolean;
  canGoHomeNow: boolean;
};

export type TripPageData = {
  userId: string | null;
  isSupabaseConfigured: boolean;
  templates: TripTemplateOption[];
  trips: TripListItem[];
  activeTripId: string | null;
};
