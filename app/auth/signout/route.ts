import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { PACKING_APP_USER_ID_COOKIE } from "@/lib/domain/constants";
import {
  getAuthChoicePath,
  getBootstrapPath,
  getSafeNextPath,
} from "@/lib/session";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function hasAnonymousCookie(request: NextRequest) {
  const value = request.cookies.get(PACKING_APP_USER_ID_COOKIE)?.value;
  return Boolean(value && UUID_PATTERN.test(value));
}

export async function GET(request: NextRequest) {
  const nextPath = getSafeNextPath(request.nextUrl.searchParams.get("next"), "/dashboard");
  const mode = request.nextUrl.searchParams.get("mode");
  const destination =
    mode === "anonymous"
      ? hasAnonymousCookie(request)
        ? nextPath
        : getBootstrapPath(nextPath)
      : getAuthChoicePath(nextPath);
  const response = NextResponse.redirect(new URL(destination, request.url));
  response.headers.set("Cache-Control", "private, no-store");
  const supabase = createSupabaseRouteHandlerClient(request, response);

  if (supabase) {
    await supabase.auth.signOut({ scope: "local" });
  }

  return response;
}
