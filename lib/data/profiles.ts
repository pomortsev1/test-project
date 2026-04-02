import type { Profile } from "@/lib/domain/types";
import { STARTER_TEMPLATE_NAME } from "@/lib/domain/constants";
import type { TypedSupabaseClient } from "@/lib/supabase/types";

import { requireValue, throwIfSupabaseError } from "@/lib/data/shared";

export interface ProfileBootstrapResult {
  defaultTemplateId: string;
  profile: Profile;
}

export async function getProfileById(
  client: TypedSupabaseClient,
  profileId: string,
): Promise<Profile | null> {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .maybeSingle();

  throwIfSupabaseError(error, "Failed to load profile");

  return data;
}

export async function ensureProfile(
  client: TypedSupabaseClient,
  profileId: string,
): Promise<Profile> {
  const { data, error } = await client
    .from("profiles")
    .upsert({ id: profileId }, { onConflict: "id" })
    .select("*")
    .single();

  throwIfSupabaseError(error, "Failed to ensure profile");

  return requireValue(data, "Profile upsert returned no profile");
}

export async function ensureProfileStarterTemplate(
  client: TypedSupabaseClient,
  profileId: string,
  templateName = STARTER_TEMPLATE_NAME,
): Promise<string> {
  const { data, error } = await client.rpc("ensure_profile_starter_template", {
    p_profile_id: profileId,
    p_template_name: templateName,
  });

  throwIfSupabaseError(error, "Failed to ensure starter template");

  return requireValue(data, "Starter template RPC returned no template id");
}

export async function bootstrapProfile(
  client: TypedSupabaseClient,
  profileId: string,
  templateName = STARTER_TEMPLATE_NAME,
): Promise<ProfileBootstrapResult> {
  const profile = await ensureProfile(client, profileId);
  const defaultTemplateId = await ensureProfileStarterTemplate(
    client,
    profileId,
    templateName,
  );

  return {
    defaultTemplateId,
    profile,
  };
}
