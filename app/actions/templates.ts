"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { QuantityInputValue, QuantityValue } from "@/lib/domain/types";
import {
  ensureProfileForUserId,
  getCurrentUserId as getCurrentSessionUserId,
} from "@/lib/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const TEMPLATES_PATH = "/templates";
const SYSTEM_CATEGORY_ORDER = [
  "Documents",
  "Tech",
  "Clothes",
  "Toiletries",
  "Health",
  "Misc",
];

type JsonRecord = Record<string, unknown>;
type TemplateMeasurementValue = {
  quantity: QuantityValue["quantity"];
  unit: QuantityValue["unit"];
};
type TemplateMeasurementInput = {
  quantity?: QuantityInputValue["quantity"];
  unit?: QuantityInputValue["unit"];
};

export type Scope = "system" | "user";

export type LoaderState = {
  hasSession: boolean;
  isConfigured: boolean;
  issue?: string;
};

export type CategoryOption = {
  id: string;
  name: string;
  scope: Scope;
};

export type CatalogSuggestion = {
  id: string;
  name: string;
  normalizedName: string;
  defaultUnit: string;
  categoryId: string;
  categoryName: string;
  scope: Scope;
};

export type TemplateSummary = {
  id: string;
  name: string;
  isDefault: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
};

export type TemplateItem = {
  id: string;
  catalogItemId: string | null;
  itemName: string;
  itemNormalizedName: string;
  categoryName: string;
  sortOrder: number;
} & TemplateMeasurementValue;

export type TemplateDetails = {
  template: TemplateSummary;
  items: TemplateItem[];
};

export type TemplatesLoaderResult = LoaderState & {
  templates: TemplateSummary[];
};

export type TemplateDetailsLoaderResult = LoaderState & {
  detail: TemplateDetails | null;
};

export type CategoryOptionsLoaderResult = LoaderState & {
  categories: CategoryOption[];
};

export type CatalogContextLoaderResult = LoaderState & {
  categories: CategoryOption[];
  suggestions: CatalogSuggestion[];
};

export type TemplateEditorCapabilities = {
  supportsOptionalMeasurements: boolean;
};

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type CreateTemplateInput = {
  name: string;
};

export type RenameTemplateInput = {
  templateId: string;
  name: string;
};

export type DeleteTemplateInput = {
  templateId: string;
};

export type SetDefaultTemplateInput = {
  templateId: string;
};

export type AddTemplateItemInput = {
  templateId: string;
  itemName: string;
  catalogItemId?: string;
  categoryId?: string;
  categoryName?: string;
  saveToCatalog?: boolean;
} & TemplateMeasurementInput;

export type UpdateTemplateItemInput = {
  templateId: string;
  templateItemId: string;
  itemName: string;
  categoryName: string;
} & TemplateMeasurementInput;

export type RemoveTemplateItemInput = {
  templateId: string;
  templateItemId: string;
};

export type RemoveTemplateItemsInput = {
  templateId: string;
  templateItemIds: string[];
};

type TemplateRecord = {
  id: string;
  name: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

type TemplateItemRecord = {
  id: string;
  templateId: string;
  catalogItemId: string | null;
  itemName: string;
  itemNormalizedName: string;
  categoryName: string;
  sortOrder: number;
} & TemplateMeasurementValue;

type CatalogItemRecord = {
  id: string;
  categoryId: string;
  name: string;
  normalizedName: string;
  defaultUnit: string;
  scope: Scope;
};

type MutationContext = {
  supabase: SupabaseClient;
  userId: string;
};

type CategoryResolution = {
  id: string | null;
  name: string;
};

const OPTIONAL_TEMPLATE_MEASUREMENTS_ENABLED = true;

function asRecord(value: unknown): JsonRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as JsonRecord;
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function isScope(value: unknown): value is Scope {
  return value === "system" || value === "user";
}

function cleanText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function cleanNullableText(value: string | null | undefined) {
  const cleaned = cleanText(value ?? "");
  return cleaned.length > 0 ? cleaned : null;
}

function normalizeName(value: string) {
  return cleanText(value).toLocaleLowerCase();
}

function slugify(value: string) {
  return normalizeName(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sortCategories(categories: CategoryOption[]) {
  return [...categories].sort((left, right) => {
    const leftSystemIndex = SYSTEM_CATEGORY_ORDER.indexOf(left.name);
    const rightSystemIndex = SYSTEM_CATEGORY_ORDER.indexOf(right.name);

    if (leftSystemIndex !== -1 || rightSystemIndex !== -1) {
      if (leftSystemIndex === -1) {
        return 1;
      }

      if (rightSystemIndex === -1) {
        return -1;
      }

      return leftSystemIndex - rightSystemIndex;
    }

    if (left.scope !== right.scope) {
      return left.scope === "system" ? -1 : 1;
    }

    return left.name.localeCompare(right.name);
  });
}

function mapTemplateRecord(value: unknown): TemplateRecord | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const id = asString(record.id);
  const name = asString(record.name);
  const isDefault = asBoolean(record.is_default);
  const createdAt = asString(record.created_at);
  const updatedAt = asString(record.updated_at);

  if (!id || !name || isDefault === null || !createdAt || !updatedAt) {
    return null;
  }

  return {
    id,
    name,
    isDefault,
    createdAt,
    updatedAt,
  };
}

function mapTemplateItemRecord(value: unknown): TemplateItemRecord | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const id = asString(record.id);
  const templateId = asString(record.template_id);
  const itemName = asString(record.item_name);
  const itemNormalizedName = asString(record.item_normalized_name);
  const categoryName = asString(record.category_name);
  const quantity = record.quantity === null ? null : asNumber(record.quantity);
  const unit =
    record.unit === null ? null : cleanNullableText(asString(record.unit));
  const sortOrder = asNumber(record.sort_order);
  const catalogItemId =
    record.catalog_item_id === null ? null : asString(record.catalog_item_id);

  if (
    !id ||
    !templateId ||
    !itemName ||
    !itemNormalizedName ||
    !categoryName ||
    sortOrder === null
  ) {
    return null;
  }

  if (quantity === null && unit === null) {
    return {
      id,
      templateId,
      catalogItemId,
      itemName,
      itemNormalizedName,
      categoryName,
      quantity: null,
      unit: null,
      sortOrder,
    };
  }

  if (quantity === null || unit === null || quantity <= 0) {
    return null;
  }

  return {
    id,
    templateId,
    catalogItemId,
    itemName,
    itemNormalizedName,
    categoryName,
    quantity,
    unit,
    sortOrder,
  };
}

function mapCategoryOption(value: unknown): CategoryOption | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const id = asString(record.id);
  const name = asString(record.name);
  const scope = record.scope;

  if (!id || !name || !isScope(scope)) {
    return null;
  }

  return { id, name, scope };
}

function mapCatalogItemRecord(value: unknown): CatalogItemRecord | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const id = asString(record.id);
  const categoryId = asString(record.category_id);
  const name = asString(record.name);
  const normalizedName = asString(record.normalized_name);
  const defaultUnit = asString(record.default_unit) ?? "";
  const scope = record.scope;

  if (!id || !categoryId || !name || !normalizedName || !isScope(scope)) {
    return null;
  }

  return {
    id,
    categoryId,
    name,
    normalizedName,
    defaultUnit,
    scope,
  };
}

function toTemplateSummary(
  template: TemplateRecord,
  itemCounts: Map<string, number>,
  effectiveDefaultTemplateId: string | null = null,
): TemplateSummary {
  return {
    id: template.id,
    name: template.name,
    isDefault:
      effectiveDefaultTemplateId !== null
        ? template.id === effectiveDefaultTemplateId
        : template.isDefault,
    itemCount: itemCounts.get(template.id) ?? 0,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
  };
}

function toTemplateItem(record: TemplateItemRecord): TemplateItem {
  return {
    id: record.id,
    catalogItemId: record.catalogItemId,
    itemName: record.itemName,
    itemNormalizedName: record.itemNormalizedName,
    categoryName: record.categoryName,
    quantity: record.quantity,
    unit: record.unit,
    sortOrder: record.sortOrder,
  };
}

function buildLoaderState(
  hasSession: boolean,
  isConfigured: boolean,
  issue?: string,
): LoaderState {
  return {
    hasSession,
    isConfigured,
    issue,
  };
}

async function getCurrentUserId() {
  return cleanText((await getCurrentSessionUserId()) ?? "");
}

async function getLoaderContext() {
  const [userId, supabase] = await Promise.all([
    getCurrentUserId(),
    createSupabaseServerClient(),
  ]);

  if (userId.length > 0) {
    await ensureProfileForUserId(userId);
  }

  return {
    userId,
    supabase,
    hasSession: userId.length > 0,
    isConfigured: supabase !== null,
  };
}

async function requireMutationContext(): Promise<ActionResult<MutationContext>> {
  const { userId, supabase, hasSession, isConfigured } = await getLoaderContext();

  if (!isConfigured || !supabase) {
    return {
      ok: false,
      error:
        "Supabase is not configured yet, so templates cannot be saved in this environment.",
    };
  }

  if (!hasSession || userId.length === 0) {
    return {
      ok: false,
      error:
        "No Google or anonymous session is available yet. Start an anonymous workspace or sign in with Google before saving templates.",
    };
  }

  return {
    ok: true,
    data: {
      supabase,
      userId,
    },
  };
}

async function getCategoryOptionsFromDb(
  supabase: SupabaseClient,
  userId: string,
): Promise<CategoryOption[]> {
  const [systemResult, userResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, scope")
      .eq("scope", "system")
      .order("name"),
    supabase
      .from("categories")
      .select("id, name, scope")
      .eq("scope", "user")
      .eq("profile_id", userId)
      .order("name"),
  ]);

  if (systemResult.error) {
    throw new Error(systemResult.error.message);
  }

  if (userResult.error) {
    throw new Error(userResult.error.message);
  }

  return sortCategories(
    [...(systemResult.data ?? []), ...(userResult.data ?? [])]
      .map(mapCategoryOption)
      .filter((value): value is CategoryOption => value !== null),
  );
}

async function getCatalogContextFromDb(
  supabase: SupabaseClient,
  userId: string,
): Promise<{
  categories: CategoryOption[];
  suggestions: CatalogSuggestion[];
}> {
  const [categories, systemItemsResult, userItemsResult] = await Promise.all([
    getCategoryOptionsFromDb(supabase, userId),
    supabase
      .from("catalog_items")
      .select("id, category_id, name, normalized_name, default_unit, scope")
      .eq("scope", "system")
      .order("name"),
    supabase
      .from("catalog_items")
      .select("id, category_id, name, normalized_name, default_unit, scope")
      .eq("scope", "user")
      .eq("profile_id", userId)
      .order("name"),
  ]);

  if (systemItemsResult.error) {
    throw new Error(systemItemsResult.error.message);
  }

  if (userItemsResult.error) {
    throw new Error(userItemsResult.error.message);
  }

  const categoryMap = new Map(categories.map((category) => [category.id, category]));
  const suggestions = [...(systemItemsResult.data ?? []), ...(userItemsResult.data ?? [])]
    .map(mapCatalogItemRecord)
    .filter((value): value is CatalogItemRecord => value !== null)
    .flatMap((record) => {
      const category = categoryMap.get(record.categoryId);
      if (!category) {
        return [];
      }

      return [
        {
          id: record.id,
          name: record.name,
          normalizedName: record.normalizedName,
          defaultUnit: record.defaultUnit,
          categoryId: record.categoryId,
          categoryName: category.name,
          scope: record.scope,
        } satisfies CatalogSuggestion,
      ];
    })
    .sort((left, right) => {
      if (left.scope !== right.scope) {
        return left.scope === "user" ? -1 : 1;
      }

      return left.name.localeCompare(right.name);
    });

  return {
    categories,
    suggestions,
  };
}

async function loadOwnedTemplate(
  supabase: SupabaseClient,
  userId: string,
  templateId: string,
) {
  const result = await supabase
    .from("packing_templates")
    .select("id, name, is_default, created_at, updated_at")
    .eq("id", templateId)
    .eq("profile_id", userId)
    .maybeSingle();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return mapTemplateRecord(result.data);
}

async function loadTemplatesForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<TemplateRecord[]> {
  const templatesResult = await supabase
    .from("packing_templates")
    .select("id, name, is_default, created_at, updated_at")
    .eq("profile_id", userId)
    .order("is_default", { ascending: false })
    .order("updated_at", { ascending: false });

  if (templatesResult.error) {
    throw new Error(templatesResult.error.message);
  }

  return (templatesResult.data ?? [])
    .map(mapTemplateRecord)
    .filter((value): value is TemplateRecord => value !== null);
}

async function loadAccessibleCategoryById(
  supabase: SupabaseClient,
  userId: string,
  categoryId: string,
) {
  const result = await supabase
    .from("categories")
    .select("id, name, scope")
    .eq("id", categoryId)
    .maybeSingle();

  if (result.error) {
    throw new Error(result.error.message);
  }

  const category = mapCategoryOption(result.data);
  if (!category) {
    return null;
  }

  if (category.scope === "system") {
    return category;
  }

  const ownershipResult = await supabase
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .eq("profile_id", userId)
    .maybeSingle();

  if (ownershipResult.error) {
    throw new Error(ownershipResult.error.message);
  }

  return ownershipResult.data ? category : null;
}

async function ensureCategoryForCatalogSave(
  supabase: SupabaseClient,
  userId: string,
  categoryId: string | undefined,
  categoryName: string | undefined,
) {
  if (categoryId) {
    const existing = await loadAccessibleCategoryById(supabase, userId, categoryId);
    if (!existing) {
      throw new Error("The selected category could not be found.");
    }

    return existing;
  }

  const cleanedName = cleanText(categoryName ?? "");
  if (!cleanedName) {
    throw new Error("Choose a category before saving this item to your catalog.");
  }

  const availableCategories = await getCategoryOptionsFromDb(supabase, userId);
  const normalized = normalizeName(cleanedName);
  const existing =
    availableCategories.find(
      (category) => normalizeName(category.name) === normalized,
    ) ?? null;

  if (existing) {
    return existing;
  }

  const insertResult = await supabase
    .from("categories")
    .insert({
      scope: "user",
      profile_id: userId,
      name: cleanedName,
      slug: slugify(cleanedName),
    })
    .select("id, name, scope")
    .single();

  if (insertResult.error) {
    throw new Error(insertResult.error.message);
  }

  const category = mapCategoryOption(insertResult.data);
  if (!category) {
    throw new Error("The new category could not be created.");
  }

  return category;
}

async function resolveCategoryForTemplateItem(
  supabase: SupabaseClient,
  userId: string,
  categoryId: string | undefined,
  categoryName: string | undefined,
  fallbackCategoryName: string | null = null,
): Promise<CategoryResolution> {
  if (categoryId) {
    const existing = await loadAccessibleCategoryById(supabase, userId, categoryId);
    if (!existing) {
      throw new Error("The selected category could not be found.");
    }

    return { id: existing.id, name: existing.name };
  }

  const cleanedName = cleanText(categoryName ?? "");
  if (cleanedName) {
    return {
      id: null,
      name: cleanedName,
    };
  }

  if (fallbackCategoryName) {
    return {
      id: null,
      name: fallbackCategoryName,
    };
  }

  throw new Error("Choose a category before adding this item.");
}

async function getNextTemplateItemSortOrder(
  supabase: SupabaseClient,
  templateId: string,
) {
  const result = await supabase
    .from("packing_template_items")
    .select("sort_order")
    .eq("template_id", templateId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (result.error) {
    throw new Error(result.error.message);
  }

  const lastSortOrder = asNumber(asRecord(result.data)?.sort_order);
  return (lastSortOrder ?? -1) + 1;
}

function validateTemplateName(name: string) {
  const cleaned = cleanText(name);
  if (!cleaned) {
    throw new Error("Template name cannot be empty.");
  }

  return cleaned;
}

function validateItemPayload(input: {
  itemName: string;
} & TemplateMeasurementInput): { itemName: string } & TemplateMeasurementValue {
  const itemName = cleanText(input.itemName);
  const unit = cleanNullableText(input.unit);
  const hasQuantity = input.quantity !== undefined && input.quantity !== null;
  const hasUnit = unit !== null;

  if (!itemName) {
    throw new Error("Item name cannot be empty.");
  }

  if (!hasQuantity && !hasUnit) {
    return {
      itemName,
      quantity: null,
      unit: null,
    } satisfies { itemName: string } & QuantityValue;
  }

  if (!hasQuantity || !hasUnit) {
    throw new Error(
      "Leave both quantity and unit blank for single items, or fill in both.",
    );
  }

  const quantity = input.quantity;

  if (typeof quantity !== "number" || !Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("Quantity must be greater than 0.");
  }

  return {
    itemName,
    quantity,
    unit,
  };
}

function getEffectiveDefaultTemplateId(templates: TemplateRecord[]) {
  return templates.find((template) => template.isDefault)?.id ?? templates[0]?.id ?? null;
}

async function setDefaultTemplateForUser(
  supabase: SupabaseClient,
  userId: string,
  templateId: string,
) {
  const result = await supabase.rpc("set_default_packing_template", {
    p_profile_id: userId,
    p_template_id: templateId,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  const resolvedTemplateId = asString(result.data);
  if (!resolvedTemplateId) {
    throw new Error("The default template update did not return a template id.");
  }

  return resolvedTemplateId;
}

function exactCatalogMatch(
  suggestions: CatalogSuggestion[],
  normalizedName: string,
  categoryId: string | undefined,
  categoryName: string | undefined,
) {
  const normalizedCategory = normalizeName(categoryName ?? "");

  return (
    suggestions.find((suggestion) => {
      if (suggestion.normalizedName !== normalizedName) {
        return false;
      }

      if (categoryId) {
        return suggestion.categoryId === categoryId;
      }

      if (normalizedCategory) {
        return normalizeName(suggestion.categoryName) === normalizedCategory;
      }

      return true;
    }) ?? null
  );
}

async function ensureOwnedTemplateOrThrow(
  supabase: SupabaseClient,
  userId: string,
  templateId: string,
) {
  const template = await loadOwnedTemplate(supabase, userId, templateId);
  if (!template) {
    throw new Error("That template could not be found.");
  }

  return template;
}

async function revalidateTemplatePaths(templateId?: string) {
  revalidatePath(TEMPLATES_PATH);

  if (templateId) {
    revalidatePath(`${TEMPLATES_PATH}/${templateId}`);
  }
}

export async function getTemplatesForCurrentUser(): Promise<TemplatesLoaderResult> {
  const { userId, supabase, hasSession, isConfigured } = await getLoaderContext();

  if (!isConfigured || !supabase) {
    return {
      templates: [],
      ...buildLoaderState(
        hasSession,
        false,
        "Supabase is not configured yet, so template data cannot load.",
      ),
    };
  }

  if (!hasSession || userId.length === 0) {
    return {
      templates: [],
      ...buildLoaderState(
        false,
        true,
        "No Google or anonymous session is available yet. Template data appears once you continue anonymously or sign in with Google.",
      ),
    };
  }

  try {
    const templateRecords = await loadTemplatesForUser(supabase, userId);

    if (templateRecords.length === 0) {
      return {
        templates: [],
        ...buildLoaderState(true, true),
      };
    }

    const itemCountsResult = await supabase
      .from("packing_template_items")
      .select("template_id")
      .in(
        "template_id",
        templateRecords.map((template) => template.id),
      );

    if (itemCountsResult.error) {
      throw new Error(itemCountsResult.error.message);
    }

    const itemCounts = new Map<string, number>();
    const effectiveDefaultTemplateId = getEffectiveDefaultTemplateId(templateRecords);

    for (const row of itemCountsResult.data ?? []) {
      const record = asRecord(row);
      const templateId = asString(record?.template_id);

      if (!templateId) {
        continue;
      }

      itemCounts.set(templateId, (itemCounts.get(templateId) ?? 0) + 1);
    }

    return {
      templates: templateRecords.map((template) =>
        toTemplateSummary(template, itemCounts, effectiveDefaultTemplateId),
      ),
      ...buildLoaderState(true, true),
    };
  } catch (error) {
    return {
      templates: [],
      ...buildLoaderState(
        true,
        true,
        error instanceof Error ? error.message : "Unable to load templates.",
      ),
    };
  }
}

export async function getDefaultTemplateForCurrentUser() {
  const result = await getTemplatesForCurrentUser();
  return result.templates.find((template) => template.isDefault) ?? null;
}

export async function getTemplateEditorCapabilities(): Promise<TemplateEditorCapabilities> {
  return {
    supportsOptionalMeasurements: OPTIONAL_TEMPLATE_MEASUREMENTS_ENABLED,
  };
}

export async function getTemplateDetails(
  templateId: string,
): Promise<TemplateDetailsLoaderResult> {
  const { userId, supabase, hasSession, isConfigured } = await getLoaderContext();

  if (!isConfigured || !supabase) {
    return {
      detail: null,
      ...buildLoaderState(
        hasSession,
        false,
        "Supabase is not configured yet, so template details cannot load.",
      ),
    };
  }

  if (!hasSession || userId.length === 0) {
    return {
      detail: null,
      ...buildLoaderState(
        false,
        true,
        "No Google or anonymous session is available yet. Template details appear once you continue anonymously or sign in with Google.",
      ),
    };
  }

  try {
    const templates = await loadTemplatesForUser(supabase, userId);
    const effectiveDefaultTemplateId = getEffectiveDefaultTemplateId(templates);
    const template =
      templates.find((candidate) => candidate.id === templateId) ?? null;

    if (!template) {
      return {
        detail: null,
        ...buildLoaderState(true, true),
      };
    }

    const itemsResult = await supabase
      .from("packing_template_items")
      .select(
        "id, template_id, catalog_item_id, item_name, item_normalized_name, category_name, quantity, unit, sort_order",
      )
      .eq("template_id", templateId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (itemsResult.error) {
      throw new Error(itemsResult.error.message);
    }

    const items = (itemsResult.data ?? [])
      .map(mapTemplateItemRecord)
      .filter((value): value is TemplateItemRecord => value !== null)
      .map(toTemplateItem);

    return {
      detail: {
        template: toTemplateSummary(
          template,
          new Map([[template.id, items.length]]),
          effectiveDefaultTemplateId,
        ),
        items,
      },
      ...buildLoaderState(true, true),
    };
  } catch (error) {
    return {
      detail: null,
      ...buildLoaderState(
        true,
        true,
        error instanceof Error
          ? error.message
          : "Unable to load the selected template.",
      ),
    };
  }
}

export async function getCategoryOptionsForCurrentUser(): Promise<CategoryOptionsLoaderResult> {
  const { userId, supabase, hasSession, isConfigured } = await getLoaderContext();

  if (!isConfigured || !supabase) {
    return {
      categories: [],
      ...buildLoaderState(
        hasSession,
        false,
        "Supabase is not configured yet, so categories cannot load.",
      ),
    };
  }

  if (!hasSession || userId.length === 0) {
    return {
      categories: [],
      ...buildLoaderState(
        false,
        true,
        "No Google or anonymous session is available yet. Categories appear once you continue anonymously or sign in with Google.",
      ),
    };
  }

  try {
    return {
      categories: await getCategoryOptionsFromDb(supabase, userId),
      ...buildLoaderState(true, true),
    };
  } catch (error) {
    return {
      categories: [],
      ...buildLoaderState(
        true,
        true,
        error instanceof Error ? error.message : "Unable to load categories.",
      ),
    };
  }
}

export async function getCatalogContextForCurrentUser(): Promise<CatalogContextLoaderResult> {
  const { userId, supabase, hasSession, isConfigured } = await getLoaderContext();

  if (!isConfigured || !supabase) {
    return {
      categories: [],
      suggestions: [],
      ...buildLoaderState(
        hasSession,
        false,
        "Supabase is not configured yet, so catalog items cannot load.",
      ),
    };
  }

  if (!hasSession || userId.length === 0) {
    return {
      categories: [],
      suggestions: [],
      ...buildLoaderState(
        false,
        true,
        "No Google or anonymous session is available yet. Catalog items appear once you continue anonymously or sign in with Google.",
      ),
    };
  }

  try {
    const { categories, suggestions } = await getCatalogContextFromDb(
      supabase,
      userId,
    );

    return {
      categories,
      suggestions,
      ...buildLoaderState(true, true),
    };
  } catch (error) {
    return {
      categories: [],
      suggestions: [],
      ...buildLoaderState(
        true,
        true,
        error instanceof Error
          ? error.message
          : "Unable to load catalog items.",
      ),
    };
  }
}

export async function getCatalogSuggestions(query: string) {
  const { userId, supabase, hasSession, isConfigured } = await getLoaderContext();

  if (!isConfigured || !supabase || !hasSession || userId.length === 0) {
    return [] satisfies CatalogSuggestion[];
  }

  try {
    const { suggestions } = await getCatalogContextFromDb(supabase, userId);
    const normalizedQuery = normalizeName(query);

    return suggestions
      .filter((suggestion) => {
        if (!normalizedQuery) {
          return true;
        }

        return (
          suggestion.normalizedName.includes(normalizedQuery) ||
          normalizeName(suggestion.categoryName).includes(normalizedQuery)
        );
      })
      .slice(0, 8);
  } catch {
    return [] satisfies CatalogSuggestion[];
  }
}

export async function createTemplate(
  input: CreateTemplateInput,
): Promise<ActionResult<{ templateId: string }>> {
  const context = await requireMutationContext();
  if (!context.ok) {
    return context;
  }

  try {
    const name = validateTemplateName(input.name);
    const { supabase, userId } = context.data;
    const existingTemplates = await loadTemplatesForUser(supabase, userId);
    const insertResult = await supabase
      .from("packing_templates")
      .insert({
        profile_id: userId,
        name,
        is_default: existingTemplates.length === 0,
      })
      .select("id")
      .single();

    if (insertResult.error) {
      throw new Error(insertResult.error.message);
    }

    const templateId = asString(asRecord(insertResult.data)?.id);
    if (!templateId) {
      throw new Error("The new template did not return an id.");
    }

    await revalidateTemplatePaths(templateId);

    return {
      ok: true,
      data: { templateId },
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Unable to create the template.",
    };
  }
}

export async function renameTemplate(
  input: RenameTemplateInput,
): Promise<ActionResult<{ templateId: string; name: string }>> {
  const context = await requireMutationContext();
  if (!context.ok) {
    return context;
  }

  try {
    const { supabase, userId } = context.data;
    const name = validateTemplateName(input.name);

    await ensureOwnedTemplateOrThrow(supabase, userId, input.templateId);

    const result = await supabase
      .from("packing_templates")
      .update({ name })
      .eq("id", input.templateId)
      .eq("profile_id", userId);

    if (result.error) {
      throw new Error(result.error.message);
    }

    await revalidateTemplatePaths(input.templateId);

    return {
      ok: true,
      data: {
        templateId: input.templateId,
        name,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Unable to rename the template.",
    };
  }
}

export async function deleteTemplate(
  input: DeleteTemplateInput,
): Promise<ActionResult<{ nextTemplateId: string | null }>> {
  const context = await requireMutationContext();
  if (!context.ok) {
    return context;
  }

  try {
    const { supabase, userId } = context.data;

    await ensureOwnedTemplateOrThrow(supabase, userId, input.templateId);
    const templates = await loadTemplatesForUser(supabase, userId);
    const deletedTemplate =
      templates.find((template) => template.id === input.templateId) ?? null;

    const remainingTemplates = templates.filter(
      (template) => template.id !== input.templateId,
    );
    const nextDefaultTemplateId = getEffectiveDefaultTemplateId(remainingTemplates);

    const deleteResult = await supabase
      .from("packing_templates")
      .delete()
      .eq("id", input.templateId)
      .eq("profile_id", userId);

    if (deleteResult.error) {
      throw new Error(deleteResult.error.message);
    }

    if (
      nextDefaultTemplateId &&
      (deletedTemplate?.isDefault || !remainingTemplates.some((template) => template.isDefault))
    ) {
      await setDefaultTemplateForUser(supabase, userId, nextDefaultTemplateId);
    }

    await revalidateTemplatePaths(input.templateId);

    return {
      ok: true,
      data: {
        nextTemplateId: nextDefaultTemplateId,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Unable to delete the template.",
    };
  }
}

export async function setDefaultTemplate(
  input: SetDefaultTemplateInput,
): Promise<ActionResult<{ templateId: string }>> {
  const context = await requireMutationContext();
  if (!context.ok) {
    return context;
  }

  try {
    const { supabase, userId } = context.data;

    await ensureOwnedTemplateOrThrow(supabase, userId, input.templateId);
    await setDefaultTemplateForUser(supabase, userId, input.templateId);

    await revalidateTemplatePaths(input.templateId);

    return {
      ok: true,
      data: { templateId: input.templateId },
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to set the default template.",
    };
  }
}

export async function addTemplateItem(
  input: AddTemplateItemInput,
): Promise<ActionResult<{ templateItemId: string }>> {
  const context = await requireMutationContext();
  if (!context.ok) {
    return context;
  }

  try {
    const { supabase, userId } = context.data;
    await ensureOwnedTemplateOrThrow(supabase, userId, input.templateId);

    const validated = validateItemPayload(input);
    const { suggestions } = await getCatalogContextFromDb(supabase, userId);

    const selectedSuggestion =
      input.catalogItemId?.trim().length
        ? suggestions.find((suggestion) => suggestion.id === input.catalogItemId) ??
          null
        : exactCatalogMatch(
            suggestions,
            normalizeName(validated.itemName),
            input.categoryId,
            input.categoryName,
          );

    const category = await resolveCategoryForTemplateItem(
      supabase,
      userId,
      input.categoryId,
      input.categoryName,
      selectedSuggestion?.categoryName ?? null,
    );

    let catalogItemId = selectedSuggestion?.id ?? null;
    let itemName = selectedSuggestion?.name ?? validated.itemName;
    let itemNormalizedName =
      selectedSuggestion?.normalizedName ?? normalizeName(validated.itemName);

    if (input.saveToCatalog && !selectedSuggestion) {
      const categoryForCatalog = await ensureCategoryForCatalogSave(
        supabase,
        userId,
        input.categoryId,
        input.categoryName,
      );
      const normalizedName = normalizeName(validated.itemName);
      const existingCatalogResult = await supabase
        .from("catalog_items")
        .select("id, category_id, name, normalized_name, default_unit, scope")
        .eq("scope", "user")
        .eq("profile_id", userId)
        .eq("category_id", categoryForCatalog.id)
        .eq("normalized_name", normalizedName)
        .maybeSingle();

      if (existingCatalogResult.error) {
        throw new Error(existingCatalogResult.error.message);
      }

      const existingCatalogItem = mapCatalogItemRecord(existingCatalogResult.data);

      if (existingCatalogItem) {
        catalogItemId = existingCatalogItem.id;
        itemName = existingCatalogItem.name;
        itemNormalizedName = existingCatalogItem.normalizedName;
      } else {
        const insertCatalogResult = await supabase
          .from("catalog_items")
          .insert({
            scope: "user",
            profile_id: userId,
            category_id: categoryForCatalog.id,
            name: validated.itemName,
            normalized_name: normalizedName,
            default_unit: validated.unit,
          })
          .select("id, category_id, name, normalized_name, default_unit, scope")
          .single();

        if (insertCatalogResult.error) {
          throw new Error(insertCatalogResult.error.message);
        }

        const insertedCatalogItem = mapCatalogItemRecord(insertCatalogResult.data);
        if (!insertedCatalogItem) {
          throw new Error("The new catalog item could not be created.");
        }

        catalogItemId = insertedCatalogItem.id;
        itemName = insertedCatalogItem.name;
        itemNormalizedName = insertedCatalogItem.normalizedName;
      }
    }

    const sortOrder = await getNextTemplateItemSortOrder(supabase, input.templateId);
    const insertResult = await supabase
      .from("packing_template_items")
      .insert({
        template_id: input.templateId,
        catalog_item_id: catalogItemId,
        item_name: itemName,
        item_normalized_name: itemNormalizedName,
        category_name: category.name,
        quantity: validated.quantity,
        unit: validated.unit,
        sort_order: sortOrder,
      })
      .select("id")
      .single();

    if (insertResult.error) {
      throw new Error(insertResult.error.message);
    }

    const templateItemId = asString(asRecord(insertResult.data)?.id);
    if (!templateItemId) {
      throw new Error("The new template item did not return an id.");
    }

    await revalidateTemplatePaths(input.templateId);

    return {
      ok: true,
      data: { templateItemId },
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Unable to add the template item.",
    };
  }
}

export async function updateTemplateItem(
  input: UpdateTemplateItemInput,
): Promise<ActionResult<{ templateItemId: string }>> {
  const context = await requireMutationContext();
  if (!context.ok) {
    return context;
  }

  try {
    const { supabase, userId } = context.data;
    await ensureOwnedTemplateOrThrow(supabase, userId, input.templateId);

    const existingItemResult = await supabase
      .from("packing_template_items")
      .select("id")
      .eq("id", input.templateItemId)
      .eq("template_id", input.templateId)
      .maybeSingle();

    if (existingItemResult.error) {
      throw new Error(existingItemResult.error.message);
    }

    if (!existingItemResult.data) {
      throw new Error("That template item could not be found.");
    }

    const validated = validateItemPayload(input);
    const categoryName = cleanText(input.categoryName);

    if (!categoryName) {
      throw new Error("Category cannot be empty.");
    }

    const { suggestions } = await getCatalogContextFromDb(supabase, userId);
    const matchingSuggestion =
      exactCatalogMatch(
        suggestions,
        normalizeName(validated.itemName),
        undefined,
        categoryName,
      ) ?? null;

    const updateResult = await supabase
      .from("packing_template_items")
      .update({
        catalog_item_id: matchingSuggestion?.id ?? null,
        item_name: validated.itemName,
        item_normalized_name: normalizeName(validated.itemName),
        category_name: categoryName,
        quantity: validated.quantity,
        unit: validated.unit,
      })
      .eq("id", input.templateItemId)
      .eq("template_id", input.templateId);

    if (updateResult.error) {
      throw new Error(updateResult.error.message);
    }

    await revalidateTemplatePaths(input.templateId);

    return {
      ok: true,
      data: { templateItemId: input.templateItemId },
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to update the template item.",
    };
  }
}

export async function removeTemplateItem(
  input: RemoveTemplateItemInput,
): Promise<ActionResult<{ templateItemId: string }>> {
  const context = await requireMutationContext();
  if (!context.ok) {
    return context;
  }

  try {
    const { supabase, userId } = context.data;
    await ensureOwnedTemplateOrThrow(supabase, userId, input.templateId);

    const deleteResult = await supabase
      .from("packing_template_items")
      .delete()
      .eq("id", input.templateItemId)
      .eq("template_id", input.templateId);

    if (deleteResult.error) {
      throw new Error(deleteResult.error.message);
    }

    await revalidateTemplatePaths(input.templateId);

    return {
      ok: true,
      data: { templateItemId: input.templateItemId },
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to remove the template item.",
    };
  }
}

export async function removeTemplateItems(
  input: RemoveTemplateItemsInput,
): Promise<ActionResult<{ templateItemIds: string[] }>> {
  const context = await requireMutationContext();
  if (!context.ok) {
    return context;
  }

  try {
    const { supabase, userId } = context.data;
    await ensureOwnedTemplateOrThrow(supabase, userId, input.templateId);

    const templateItemIds = [...new Set(input.templateItemIds.map(cleanText).filter(Boolean))];

    if (templateItemIds.length === 0) {
      throw new Error("Choose at least one item to remove.");
    }

    const existingItemsResult = await supabase
      .from("packing_template_items")
      .select("id")
      .eq("template_id", input.templateId)
      .in("id", templateItemIds);

    if (existingItemsResult.error) {
      throw new Error(existingItemsResult.error.message);
    }

    const existingItemIds = new Set(
      (existingItemsResult.data ?? [])
        .map((row) => asString(asRecord(row)?.id))
        .filter((value): value is string => value !== null),
    );

    if (existingItemIds.size !== templateItemIds.length) {
      throw new Error("One or more selected items could not be found.");
    }

    const deleteResult = await supabase
      .from("packing_template_items")
      .delete()
      .eq("template_id", input.templateId)
      .in("id", templateItemIds);

    if (deleteResult.error) {
      throw new Error(deleteResult.error.message);
    }

    await revalidateTemplatePaths(input.templateId);

    return {
      ok: true,
      data: { templateItemIds },
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to remove the selected template items.",
    };
  }
}
