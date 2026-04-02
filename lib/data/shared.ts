import type { PostgrestError } from "@supabase/supabase-js";

export function buildSystemOrProfileFilter(profileId: string) {
  return `profile_id.is.null,profile_id.eq.${profileId}`;
}

export function requireValue<T>(value: T | null | undefined, context: string): T {
  if (value == null) {
    throw new Error(`${context}: missing result.`);
  }

  return value;
}

export function throwIfSupabaseError(error: PostgrestError | null, context: string) {
  if (!error) {
    return;
  }

  throw new Error(`${context}: ${error.message}`);
}

export function isUniqueViolation(error: PostgrestError | null) {
  return error?.code === "23505";
}
