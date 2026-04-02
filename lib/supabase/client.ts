"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseEnv } from "@/lib/supabase/env";

let browserClient: SupabaseClient<Database> | null = null;

export function createSupabaseBrowserClient() {
  const { url, publishableKey, isConfigured } = getSupabaseEnv();

  if (!isConfigured || !url || !publishableKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createBrowserClient(url, publishableKey, {
      auth: {
        detectSessionInUrl: false,
      },
    });
  }

  return browserClient;
}
