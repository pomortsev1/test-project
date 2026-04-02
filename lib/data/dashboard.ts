import {
  getTripDetails,
  getTripsPageData,
} from "@/app/(app)/trips/_lib/trips-data";
import type {
  TripDetails,
  TripListItem,
  TripTemplateOption,
} from "@/components/trips/types";
import type {
  DashboardData,
  PackingItemSnapshot,
  QuantityValue,
  PackingTemplate,
  Trip,
  TripChecklistItem,
  TripLeg,
  TripStop,
} from "@/lib/domain/types";
import { ensureProfileForCurrentUser } from "@/lib/session";
import { getSupabaseEnv } from "@/lib/supabase/env";

type DashboardPackingItemSeed = {
  categoryName: string;
  itemName: string;
} & QuantityValue;

function createTemplateItems(
  prefix: string,
  items: DashboardPackingItemSeed[],
): PackingItemSnapshot[] {
  return items.map((item, index) => ({
    ...item,
    id: `${prefix}-item-${index + 1}`,
  }));
}

function createStops(prefix: string, names: string[]): TripStop[] {
  return names.map((name, index) => ({
    id: `${prefix}-stop-${index + 1}`,
    kind: index === 0 || index === names.length - 1 ? "home" : "stop",
    name,
    position: index,
  }));
}

function createChecklistItems(
  templateItems: PackingItemSnapshot[],
  prefix: string,
  packedNames: string[]
): TripChecklistItem[] {
  return templateItems.map((item, index) => ({
    ...item,
    id: `${prefix}-check-${index + 1}`,
    isPacked: packedNames.includes(item.itemName),
  }));
}

function createLeg(
  prefix: string,
  position: number,
  status: TripLeg["status"],
  fromStopName: string,
  toStopName: string,
  templateItems: PackingItemSnapshot[],
  packedNames: string[]
): TripLeg {
  return {
    id: `${prefix}-leg-${position + 1}`,
    position,
    status,
    fromStopName,
    toStopName,
    checklistItems: createChecklistItems(
      templateItems,
      `${prefix}-leg-${position + 1}`,
      packedNames
    ),
  };
}

function buildTemplates(): PackingTemplate[] {
  return [
    {
      id: "template-weekend-city-break",
      name: "Weekend city break",
      isDefault: true,
      itemCount: 6,
      items: createTemplateItems("template-weekend-city-break", [
        {
          itemName: "Passport",
          categoryName: "Documents",
          quantity: 1,
          unit: "document",
        },
        {
          itemName: "Phone charger",
          categoryName: "Tech",
          quantity: 1,
          unit: "charger",
        },
        {
          itemName: "T-shirts",
          categoryName: "Clothes",
          quantity: 3,
          unit: "shirts",
        },
        {
          itemName: "Socks",
          categoryName: "Clothes",
          quantity: 4,
          unit: "pairs",
        },
        {
          itemName: "Toothbrush",
          categoryName: "Toiletries",
          quantity: 1,
          unit: "brush",
        },
        {
          itemName: "Medication",
          categoryName: "Health",
          quantity: 1,
          unit: "kit",
        },
      ]),
    },
    {
      id: "template-remote-work-week",
      name: "Remote work week",
      isDefault: false,
      itemCount: 5,
      items: createTemplateItems("template-remote-work-week", [
        {
          itemName: "Laptop",
          categoryName: "Tech",
          quantity: 1,
          unit: "device",
        },
        {
          itemName: "USB-C charger",
          categoryName: "Tech",
          quantity: 1,
          unit: "charger",
        },
        {
          itemName: "Notebook",
          categoryName: "Misc",
          quantity: 1,
          unit: "notebook",
        },
        {
          itemName: "Trousers",
          categoryName: "Clothes",
          quantity: 2,
          unit: "pairs",
        },
        {
          itemName: "Headphones",
          categoryName: "Tech",
          quantity: 1,
          unit: "pair",
        },
      ]),
    },
    {
      id: "template-summer-escape",
      name: "Summer escape",
      isDefault: false,
      itemCount: 4,
      items: createTemplateItems("template-summer-escape", [
        {
          itemName: "Swimwear",
          categoryName: "Clothes",
          quantity: 2,
          unit: "sets",
        },
        {
          itemName: "Sunscreen",
          categoryName: "Health",
          quantity: 1,
          unit: "tube",
        },
        {
          itemName: "Water bottle",
          categoryName: "Misc",
          quantity: 1,
          unit: "bottle",
        },
        {
          itemName: "Sandals",
          categoryName: "Clothes",
          quantity: 1,
          unit: "pair",
        },
      ]),
    },
  ];
}

function buildTrips(templates: PackingTemplate[]): Trip[] {
  const defaultTemplate = templates[0];
  const workTemplate = templates[1];

  const activeStops = createStops("trip-andalusia", [
    "Home",
    "Seville",
    "Granada",
    "Home",
  ]);
  const activeTrip: Trip = {
    id: "trip-andalusia",
    name: "Andalusia spring route",
    mode: "multi_stop",
    status: "active",
    templateName: defaultTemplate.name,
    currentLegIndex: 1,
    stops: activeStops,
    legs: [
      createLeg(
        "trip-andalusia",
        0,
        "completed",
        activeStops[0].name,
        activeStops[1].name,
        defaultTemplate.items,
        ["Passport", "Phone charger", "T-shirts", "Socks"]
      ),
      createLeg(
        "trip-andalusia",
        1,
        "active",
        activeStops[1].name,
        activeStops[2].name,
        defaultTemplate.items,
        ["Passport", "Phone charger", "Medication"]
      ),
      createLeg(
        "trip-andalusia",
        2,
        "pending",
        activeStops[2].name,
        activeStops[3].name,
        defaultTemplate.items,
        []
      ),
    ],
  };

  const draftStops = createStops("trip-porto", ["Home", "Porto", "Home"]);
  const draftTrip: Trip = {
    id: "trip-porto",
    name: "Porto long weekend",
    mode: "simple",
    status: "draft",
    templateName: workTemplate.name,
    currentLegIndex: 0,
    stops: draftStops,
    legs: [
      createLeg(
        "trip-porto",
        0,
        "pending",
        draftStops[0].name,
        draftStops[1].name,
        workTemplate.items,
        []
      ),
      createLeg(
        "trip-porto",
        1,
        "pending",
        draftStops[1].name,
        draftStops[2].name,
        workTemplate.items,
        []
      ),
    ],
  };

  const completedStops = createStops("trip-berlin", ["Home", "Berlin", "Home"]);
  const completedTrip: Trip = {
    id: "trip-berlin",
    name: "Berlin design fair",
    mode: "simple",
    status: "completed",
    templateName: defaultTemplate.name,
    currentLegIndex: 1,
    stops: completedStops,
    legs: [
      createLeg(
        "trip-berlin",
        0,
        "completed",
        completedStops[0].name,
        completedStops[1].name,
        defaultTemplate.items,
        ["Passport", "Phone charger", "T-shirts", "Socks", "Toothbrush"]
      ),
      createLeg(
        "trip-berlin",
        1,
        "completed",
        completedStops[1].name,
        completedStops[2].name,
        defaultTemplate.items,
        ["Passport", "Phone charger", "T-shirts", "Socks", "Toothbrush"]
      ),
    ],
  };

  return [activeTrip, draftTrip, completedTrip];
}

function mapTemplateOptions(templates: TripTemplateOption[]): PackingTemplate[] {
  return templates.map((template) => ({
    id: template.id,
    name: template.name,
    isDefault: template.isDefault,
    itemCount: template.itemCount,
    items: [],
  }));
}

function mapTripListItem(trip: TripListItem): Trip {
  return {
    id: trip.id,
    name: trip.name,
    mode: trip.mode,
    status: trip.status,
    templateName: trip.templateName ?? "No template selected",
    currentLegIndex: trip.activeLeg?.position ?? trip.completedLegs,
    stops: trip.stops,
    legs: trip.legs.map((leg) => ({
      id: leg.id,
      position: leg.position,
      status: leg.status,
      fromStopName: leg.fromStopName,
      toStopName: leg.toStopName,
      checklistItems: [],
    })),
  };
}

function mapTripDetails(details: TripDetails): Trip {
  const checklistItems = details.checklistGroups.flatMap((group) =>
    group.items.map((item) =>
      item.quantity !== null && item.unit !== null
        ? {
            id: item.tripItemId,
            itemName: item.itemName,
            categoryName: item.categoryName,
            quantity: item.quantity,
            unit: item.unit,
            isPacked: item.isPacked,
          }
        : {
            id: item.tripItemId,
            itemName: item.itemName,
            categoryName: item.categoryName,
            quantity: null,
            unit: null,
            isPacked: item.isPacked,
          },
    )
  );

  return {
    id: details.id,
    name: details.name,
    mode: details.mode,
    status: details.status,
    templateName: details.templateName ?? "No template selected",
    currentLegIndex: details.currentLegIndex,
    stops: details.stops,
    legs: details.legs.map((leg) => ({
      id: leg.id,
      position: leg.position,
      status: leg.status,
      fromStopName: leg.fromStopName,
      toStopName: leg.toStopName,
      checklistItems: details.checklistLegId === leg.id ? checklistItems : [],
    })),
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const profile = await ensureProfileForCurrentUser();

  try {
    const tripsPageData = await getTripsPageData();

    if (tripsPageData.isSupabaseConfigured) {
      const templates = mapTemplateOptions(tripsPageData.templates);
      const trips = tripsPageData.trips.map(mapTripListItem);
      const activeTripDetails = tripsPageData.activeTripId
        ? await getTripDetails(tripsPageData.activeTripId)
        : null;

      return {
        profile,
        templates,
        trips,
        activeTrip: activeTripDetails ? mapTripDetails(activeTripDetails) : null,
        isSupabaseConfigured: true,
      };
    }
  } catch {
    // Fall back to the integrated demo data if database tables are not ready yet.
  }

  const templates = buildTemplates();
  const trips = buildTrips(templates);

  return {
    profile,
    templates,
    trips,
    activeTrip: trips.find((trip) => trip.status === "active") ?? null,
    isSupabaseConfigured: getSupabaseEnv().isConfigured,
  };
}
