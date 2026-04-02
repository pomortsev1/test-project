import type {
  PackingTemplateItemRecord,
  PackingTemplateRecord,
  PackingTemplateRecordDetails,
} from "@/lib/domain/types";
import { STARTER_TEMPLATE_NAME } from "@/lib/domain/constants";
import type { TypedSupabaseClient } from "@/lib/supabase/types";

import { requireValue, throwIfSupabaseError } from "@/lib/data/shared";

export async function getTemplatesForProfile(
  client: TypedSupabaseClient,
  profileId: string,
): Promise<PackingTemplateRecord[]> {
  const { data, error } = await client
    .from("packing_templates")
    .select("*")
    .eq("profile_id", profileId)
    .order("is_default", { ascending: false })
    .order("created_at");

  throwIfSupabaseError(error, "Failed to load templates");

  return data ?? [];
}

export async function getDefaultTemplateForProfile(
  client: TypedSupabaseClient,
  profileId: string,
): Promise<PackingTemplateRecord | null> {
  const { data, error } = await client
    .from("packing_templates")
    .select("*")
    .eq("profile_id", profileId)
    .eq("is_default", true)
    .maybeSingle();

  throwIfSupabaseError(error, "Failed to load default template");

  return data;
}

export async function getTemplateByIdForProfile(
  client: TypedSupabaseClient,
  profileId: string,
  templateId: string,
): Promise<PackingTemplateRecord | null> {
  const { data, error } = await client
    .from("packing_templates")
    .select("*")
    .eq("id", templateId)
    .eq("profile_id", profileId)
    .maybeSingle();

  throwIfSupabaseError(error, "Failed to load template");

  return data;
}

export async function getTemplateItems(
  client: TypedSupabaseClient,
  templateId: string,
): Promise<PackingTemplateItemRecord[]> {
  const { data, error } = await client
    .from("packing_template_items")
    .select("*")
    .eq("template_id", templateId)
    .order("sort_order")
    .order("created_at");

  throwIfSupabaseError(error, "Failed to load template items");

  return data ?? [];
}

export async function getTemplateDetailsForProfile(
  client: TypedSupabaseClient,
  profileId: string,
  templateId: string,
): Promise<PackingTemplateRecordDetails | null> {
  const template = await getTemplateByIdForProfile(client, profileId, templateId);

  if (!template) {
    return null;
  }

  const items = await getTemplateItems(client, template.id);

  return {
    items,
    template,
  };
}

export async function copyStarterTemplateToProfile(
  client: TypedSupabaseClient,
  profileId: string,
  templateName = STARTER_TEMPLATE_NAME,
): Promise<string> {
  const { data, error } = await client.rpc("copy_starter_template_for_profile", {
    p_profile_id: profileId,
    p_template_name: templateName,
  });

  throwIfSupabaseError(error, "Failed to copy starter template");

  return requireValue(data, "Starter template copy RPC returned no template id");
}

export async function ensureStarterTemplateForProfile(
  client: TypedSupabaseClient,
  profileId: string,
  templateName = STARTER_TEMPLATE_NAME,
): Promise<string> {
  const { data, error } = await client.rpc("ensure_profile_starter_template", {
    p_profile_id: profileId,
    p_template_name: templateName,
  });

  throwIfSupabaseError(error, "Failed to ensure default template");

  return requireValue(data, "Starter template ensure RPC returned no template id");
}

export async function setDefaultTemplateForProfile(
  client: TypedSupabaseClient,
  profileId: string,
  templateId: string,
): Promise<string> {
  const { data, error } = await client.rpc("set_default_packing_template", {
    p_profile_id: profileId,
    p_template_id: templateId,
  });

  throwIfSupabaseError(error, "Failed to set default template");

  return requireValue(data, "Set default template RPC returned no template id");
}
