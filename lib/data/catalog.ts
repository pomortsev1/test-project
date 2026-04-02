import type { Category, CatalogItem, CatalogSuggestion } from "@/lib/domain/types";
import type { TablesInsert, TypedSupabaseClient } from "@/lib/supabase/types";

import { normalizeName, slugify } from "@/lib/data/normalization";
import {
  buildSystemOrProfileFilter,
  isUniqueViolation,
  throwIfSupabaseError,
} from "@/lib/data/shared";

export interface CatalogSuggestionQuery {
  limit?: number;
  profileId: string;
  query?: string;
}

export interface CreateUserCatalogItemInput {
  categoryId: string;
  defaultUnit?: string | null;
  name: string;
  profileId: string;
}

export async function getCategoriesForProfile(
  client: TypedSupabaseClient,
  profileId: string,
): Promise<Category[]> {
  const { data, error } = await client
    .from("categories")
    .select("*")
    .or(buildSystemOrProfileFilter(profileId))
    .order("name");

  throwIfSupabaseError(error, "Failed to load categories");

  return data ?? [];
}

export async function getCategoryByIdForProfile(
  client: TypedSupabaseClient,
  profileId: string,
  categoryId: string,
): Promise<Category | null> {
  const { data, error } = await client
    .from("categories")
    .select("*")
    .eq("id", categoryId)
    .or(buildSystemOrProfileFilter(profileId))
    .maybeSingle();

  throwIfSupabaseError(error, "Failed to load category");

  return data;
}

export async function findUserCategoryByName(
  client: TypedSupabaseClient,
  profileId: string,
  name: string,
): Promise<Category | null> {
  const { data, error } = await client
    .from("categories")
    .select("*")
    .eq("scope", "user")
    .eq("profile_id", profileId)
    .eq("slug", slugify(name))
    .maybeSingle();

  throwIfSupabaseError(error, "Failed to find user category");

  return data;
}

export async function findOrCreateUserCategory(
  client: TypedSupabaseClient,
  profileId: string,
  name: string,
): Promise<Category> {
  const existing = await findUserCategoryByName(client, profileId, name);

  if (existing) {
    return existing;
  }

  const payload: TablesInsert<"categories"> = {
    name,
    profile_id: profileId,
    scope: "user",
    slug: slugify(name),
  };

  const { data, error } = await client
    .from("categories")
    .insert(payload)
    .select("*")
    .single();

  if (isUniqueViolation(error)) {
    const duplicate = await findUserCategoryByName(client, profileId, name);

    if (duplicate) {
      return duplicate;
    }
  }

  throwIfSupabaseError(error, "Failed to create user category");

  if (!data) {
    throw new Error("Failed to create user category: insert returned no category.");
  }

  return data;
}

export async function getCatalogItemByIdForProfile(
  client: TypedSupabaseClient,
  profileId: string,
  catalogItemId: string,
): Promise<CatalogItem | null> {
  const { data, error } = await client
    .from("catalog_items")
    .select("*")
    .eq("id", catalogItemId)
    .or(buildSystemOrProfileFilter(profileId))
    .maybeSingle();

  throwIfSupabaseError(error, "Failed to load catalog item");

  return data;
}

export async function findUserCatalogItemByName(
  client: TypedSupabaseClient,
  profileId: string,
  categoryId: string,
  name: string,
): Promise<CatalogItem | null> {
  const { data, error } = await client
    .from("catalog_items")
    .select("*")
    .eq("scope", "user")
    .eq("profile_id", profileId)
    .eq("category_id", categoryId)
    .eq("normalized_name", normalizeName(name))
    .maybeSingle();

  throwIfSupabaseError(error, "Failed to find user catalog item");

  return data;
}

export async function createUserCatalogItem(
  client: TypedSupabaseClient,
  input: CreateUserCatalogItemInput,
): Promise<CatalogItem> {
  const existing = await findUserCatalogItemByName(
    client,
    input.profileId,
    input.categoryId,
    input.name,
  );

  if (existing) {
    return existing;
  }

  const payload: TablesInsert<"catalog_items"> = {
    category_id: input.categoryId,
    default_unit: input.defaultUnit ?? null,
    name: input.name,
    normalized_name: normalizeName(input.name),
    profile_id: input.profileId,
    scope: "user",
  };

  const { data, error } = await client
    .from("catalog_items")
    .insert(payload)
    .select("*")
    .single();

  if (isUniqueViolation(error)) {
    const duplicate = await findUserCatalogItemByName(
      client,
      input.profileId,
      input.categoryId,
      input.name,
    );

    if (duplicate) {
      return duplicate;
    }
  }

  throwIfSupabaseError(error, "Failed to create user catalog item");

  if (!data) {
    throw new Error("Failed to create user catalog item: insert returned no item.");
  }

  return data;
}

export async function getCatalogSuggestions(
  client: TypedSupabaseClient,
  input: CatalogSuggestionQuery,
): Promise<CatalogSuggestion[]> {
  const limit = input.limit ?? 20;
  const normalizedQuery = input.query ? normalizeName(input.query) : "";

  let request = client
    .from("catalog_items")
    .select("*")
    .or(buildSystemOrProfileFilter(input.profileId))
    .order("name")
    .limit(limit);

  if (normalizedQuery) {
    request = request.ilike("normalized_name", `%${normalizedQuery}%`);
  }

  const { data: items, error } = await request;

  throwIfSupabaseError(error, "Failed to load catalog suggestions");

  if (!items?.length) {
    return [];
  }

  const categoryIds = Array.from(new Set(items.map((item) => item.category_id)));
  const { data: categories, error: categoryError } = await client
    .from("categories")
    .select("*")
    .in("id", categoryIds);

  throwIfSupabaseError(categoryError, "Failed to load catalog suggestion categories");

  const categoriesById = new Map((categories ?? []).map((category) => [category.id, category]));

  return items.flatMap((item) => {
    const category = categoriesById.get(item.category_id);

    if (!category) {
      return [];
    }

    return [{ category, item }];
  });
}
