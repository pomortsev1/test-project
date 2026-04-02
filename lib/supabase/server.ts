import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseEnv } from "@/lib/supabase/env";

export async function createSupabaseServerClient(): Promise<SupabaseClient<Database> | null> {
  const { url, publishableKey, isConfigured } = getSupabaseEnv();

  if (!isConfigured || !url || !publishableKey) {
    return null;
  }

  const cookieStore = await cookies();
  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach((cookie) => {
          cookieStore.set(cookie.name, cookie.value, cookie.options);
        });
      } catch {
        // Server Components may not be able to write cookies during render.
      }
    },
  };

  return createServerClient(url, publishableKey, {
    cookies: cookieMethods,
  });
}

export function createSupabaseRouteHandlerClient(
  request: NextRequest,
  response: NextResponse
): SupabaseClient<Database> | null {
  const { url, publishableKey, isConfigured } = getSupabaseEnv();

  if (!isConfigured || !url || !publishableKey) {
    return null;
  }

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}
