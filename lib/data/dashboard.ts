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
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";
import {
  localizeMeasurementUnit,
  localizeStarterItemName,
  localizeStarterTemplateName,
  localizeSystemCategoryName,
} from "@/lib/i18n/starter-template-localization";
import { ensureProfileForCurrentUser } from "@/lib/session";
import { getSupabaseEnv } from "@/lib/supabase/env";

type DashboardPackingItemSeed = {
  categoryName: string;
  itemName: string;
} & QuantityValue;

async function getDashboardLocale() {
  try {
    return await getRequestLocale();
  } catch {
    return DEFAULT_LOCALE;
  }
}

function localizePackingItem(item: PackingItemSnapshot, locale: Locale): PackingItemSnapshot {
  if (item.quantity === null || item.unit === null) {
    return {
      ...item,
      itemName: localizeStarterItemName(item.itemName, locale),
      categoryName: localizeSystemCategoryName(item.categoryName, locale),
      quantity: null,
      unit: null,
    };
  }

  return {
    ...item,
    itemName: localizeStarterItemName(item.itemName, locale),
    categoryName: localizeSystemCategoryName(item.categoryName, locale),
    quantity: item.quantity,
    unit: localizeMeasurementUnit(item.unit, locale),
  };
}

function localizeTemplate(template: PackingTemplate, locale: Locale): PackingTemplate {
  return {
    ...template,
    name: localizeStarterTemplateName(template.name, locale),
    items: template.items.map((item) => localizePackingItem(item, locale)),
  };
}

function localizeTrip(trip: Trip, locale: Locale): Trip {
  return {
    ...trip,
    templateName: localizeStarterTemplateName(trip.templateName, locale),
    legs: trip.legs.map((leg) => ({
      ...leg,
      checklistItems: leg.checklistItems.map((item) => ({
        ...localizePackingItem(item, locale),
        isPacked: item.isPacked,
      })),
    })),
  };
}

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
      id: "template-two-hour-trip",
      name: "2-hour trip",
      isDefault: false,
      itemCount: 4,
      items: createTemplateItems("template-two-hour-trip", [
        {
          itemName: "Keys",
          categoryName: "Misc",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Wallet",
          categoryName: "Documents",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Mobile phone",
          categoryName: "Tech",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Water bottle",
          categoryName: "Misc",
          quantity: null,
          unit: null,
        },
      ]),
    },
    {
      id: "template-one-day-trip",
      name: "1-day trip essentials",
      isDefault: true,
      itemCount: 8,
      items: createTemplateItems("template-one-day-trip", [
        {
          itemName: "Wallet",
          categoryName: "Documents",
          quantity: null,
          unit: null,
        },
        {
          itemName: "ID card",
          categoryName: "Documents",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Mobile phone",
          categoryName: "Tech",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Phone charger",
          categoryName: "Tech",
          quantity: 1,
          unit: "charger",
        },
        {
          itemName: "Keys",
          categoryName: "Misc",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Water bottle",
          categoryName: "Misc",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Medication",
          categoryName: "Health",
          quantity: 1,
          unit: "pack",
        },
        {
          itemName: "Sunglasses",
          categoryName: "Misc",
          quantity: null,
          unit: null,
        },
      ]),
    },
    {
      id: "template-one-night-trip",
      name: "1-night light pack",
      isDefault: false,
      itemCount: 12,
      items: createTemplateItems("template-one-night-trip", [
        {
          itemName: "Wallet",
          categoryName: "Documents",
          quantity: null,
          unit: null,
        },
        {
          itemName: "ID card",
          categoryName: "Documents",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Mobile phone",
          categoryName: "Tech",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Phone charger",
          categoryName: "Tech",
          quantity: 1,
          unit: "charger",
        },
        {
          itemName: "Keys",
          categoryName: "Misc",
          quantity: null,
          unit: null,
        },
        {
          itemName: "T-shirts",
          categoryName: "Clothes",
          quantity: 1,
          unit: "t-shirt",
        },
        {
          itemName: "Socks",
          categoryName: "Clothes",
          quantity: 1,
          unit: "pair",
        },
        {
          itemName: "Underwear",
          categoryName: "Clothes",
          quantity: 1,
          unit: "pair",
        },
        {
          itemName: "Toothbrush",
          categoryName: "Toiletries",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Toothpaste",
          categoryName: "Toiletries",
          quantity: 1,
          unit: "tube",
        },
        {
          itemName: "Deodorant",
          categoryName: "Toiletries",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Pajamas",
          categoryName: "Clothes",
          quantity: 1,
          unit: "set",
        },
      ]),
    },
    {
      id: "template-one-week-carry-on",
      name: "1-week carry-on",
      isDefault: false,
      itemCount: 18,
      items: createTemplateItems("template-one-week-carry-on", [
        {
          itemName: "Passport",
          categoryName: "Documents",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Wallet",
          categoryName: "Documents",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Mobile phone",
          categoryName: "Tech",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Phone charger",
          categoryName: "Tech",
          quantity: 1,
          unit: "charger",
        },
        {
          itemName: "Power bank",
          categoryName: "Tech",
          quantity: null,
          unit: null,
        },
        {
          itemName: "T-shirts",
          categoryName: "Clothes",
          quantity: 5,
          unit: "t-shirts",
        },
        {
          itemName: "Underwear",
          categoryName: "Clothes",
          quantity: 7,
          unit: "pairs",
        },
        {
          itemName: "Socks",
          categoryName: "Clothes",
          quantity: 7,
          unit: "pairs",
        },
        {
          itemName: "Trousers",
          categoryName: "Clothes",
          quantity: 2,
          unit: "pairs",
        },
        {
          itemName: "Shorts",
          categoryName: "Clothes",
          quantity: 2,
          unit: "pairs",
        },
        {
          itemName: "Hoodie",
          categoryName: "Clothes",
          quantity: 1,
          unit: "hoodie",
        },
        {
          itemName: "Lightweight jacket",
          categoryName: "Clothes",
          quantity: 1,
          unit: "jacket",
        },
        {
          itemName: "Toothbrush",
          categoryName: "Toiletries",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Toothpaste",
          categoryName: "Toiletries",
          quantity: 1,
          unit: "tube",
        },
        {
          itemName: "Deodorant",
          categoryName: "Toiletries",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Travel-size Shampoo",
          categoryName: "Toiletries",
          quantity: 1,
          unit: "bottle",
        },
        {
          itemName: "Medication",
          categoryName: "Health",
          quantity: 1,
          unit: "pack",
        },
        {
          itemName: "Laundry bag",
          categoryName: "Misc",
          quantity: null,
          unit: null,
        },
      ]),
    },
    {
      id: "template-extended-trip-with-baggage",
      name: "1+ week with baggage",
      isDefault: false,
      itemCount: 25,
      items: createTemplateItems("template-extended-trip-with-baggage", [
        {
          itemName: "Passport",
          categoryName: "Documents",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Boarding pass",
          categoryName: "Documents",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Wallet",
          categoryName: "Documents",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Mobile phone",
          categoryName: "Tech",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Phone charger",
          categoryName: "Tech",
          quantity: 1,
          unit: "charger",
        },
        {
          itemName: "Power bank",
          categoryName: "Tech",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Laptop",
          categoryName: "Tech",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Laptop charger",
          categoryName: "Tech",
          quantity: 1,
          unit: "charger",
        },
        {
          itemName: "Travel adapter",
          categoryName: "Tech",
          quantity: 1,
          unit: "adapter",
        },
        {
          itemName: "T-shirts",
          categoryName: "Clothes",
          quantity: 7,
          unit: "t-shirts",
        },
        {
          itemName: "Underwear",
          categoryName: "Clothes",
          quantity: 10,
          unit: "pairs",
        },
        {
          itemName: "Socks",
          categoryName: "Clothes",
          quantity: 10,
          unit: "pairs",
        },
        {
          itemName: "Trousers",
          categoryName: "Clothes",
          quantity: 3,
          unit: "pairs",
        },
        {
          itemName: "Shorts",
          categoryName: "Clothes",
          quantity: 3,
          unit: "pairs",
        },
        {
          itemName: "Hoodie",
          categoryName: "Clothes",
          quantity: 1,
          unit: "hoodie",
        },
        {
          itemName: "Lightweight jacket",
          categoryName: "Clothes",
          quantity: 1,
          unit: "jacket",
        },
        {
          itemName: "Pajamas",
          categoryName: "Clothes",
          quantity: 1,
          unit: "set",
        },
        {
          itemName: "Walking shoes",
          categoryName: "Clothes",
          quantity: 1,
          unit: "pair",
        },
        {
          itemName: "Sandals",
          categoryName: "Clothes",
          quantity: 1,
          unit: "pair",
        },
        {
          itemName: "Toothbrush",
          categoryName: "Toiletries",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Toothpaste",
          categoryName: "Toiletries",
          quantity: 1,
          unit: "tube",
        },
        {
          itemName: "Deodorant",
          categoryName: "Toiletries",
          quantity: null,
          unit: null,
        },
        {
          itemName: "Sunscreen",
          categoryName: "Toiletries",
          quantity: 1,
          unit: "bottle",
        },
        {
          itemName: "Travel-size Body wash",
          categoryName: "Toiletries",
          quantity: 1,
          unit: "bottle",
        },
        {
          itemName: "Medication",
          categoryName: "Health",
          quantity: 1,
          unit: "pack",
        },
      ]),
    },
  ];
}

function buildTrips(templates: PackingTemplate[]): Trip[] {
  const defaultTemplate = templates.find((template) => template.isDefault) ?? templates[0];
  const workTemplate =
    templates.find((template) => template.id === "template-one-week-carry-on") ??
    templates.find((template) => !template.isDefault) ??
    templates[0];

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
        ["Wallet", "Mobile phone", "Phone charger", "Keys"]
      ),
      createLeg(
        "trip-andalusia",
        1,
        "active",
        activeStops[1].name,
        activeStops[2].name,
        defaultTemplate.items,
        ["Wallet", "Phone charger", "Medication"]
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
    name: "Porto work week",
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
        ["Wallet", "ID card", "Mobile phone", "Phone charger", "Medication"]
      ),
      createLeg(
        "trip-berlin",
        1,
        "completed",
        completedStops[1].name,
        completedStops[2].name,
        defaultTemplate.items,
        ["Wallet", "ID card", "Mobile phone", "Phone charger", "Medication"]
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
  const locale = await getDashboardLocale();
  const profile = await ensureProfileForCurrentUser();

  try {
    const tripsPageData = await getTripsPageData();

    if (tripsPageData.isSupabaseConfigured) {
      const templates = mapTemplateOptions(tripsPageData.templates);
      const trips = tripsPageData.trips.map(mapTripListItem);
      const localizedTemplates = templates.map((template) =>
        localizeTemplate(template, locale),
      );
      const localizedTrips = trips.map((trip) => localizeTrip(trip, locale));
      const activeTripDetails = tripsPageData.activeTripId
        ? await getTripDetails(tripsPageData.activeTripId)
        : null;

      return {
        profile,
        templates: localizedTemplates,
        trips: localizedTrips,
        activeTrip: activeTripDetails ? localizeTrip(mapTripDetails(activeTripDetails), locale) : null,
        isSupabaseConfigured: true,
      };
    }
  } catch {
    // Fall back to the integrated demo data if database tables are not ready yet.
  }

  const templates = buildTemplates();
  const trips = buildTrips(templates);
  const localizedTemplates = templates.map((template) =>
    localizeTemplate(template, locale),
  );
  const localizedTrips = trips.map((trip) => localizeTrip(trip, locale));

  return {
    profile,
    templates: localizedTemplates,
    trips: localizedTrips,
    activeTrip: localizedTrips.find((trip) => trip.status === "active") ?? null,
    isSupabaseConfigured: getSupabaseEnv().isConfigured,
  };
}
