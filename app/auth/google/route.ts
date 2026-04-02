import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getAuthChoicePath, getSafeNextPath } from "@/lib/session";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/server";

function getErrorRedirectUrl(request: NextRequest, nextPath: string, message: string) {
  const redirectUrl = new URL(getAuthChoicePath(nextPath), request.url);
  redirectUrl.searchParams.set("authError", encodeURIComponent(message));
  return redirectUrl;
}

export async function GET(request: NextRequest) {
  const nextPath = getSafeNextPath(request.nextUrl.searchParams.get("next"), "/dashboard");
  const callbackUrl = new URL("/auth/callback", request.url);
  callbackUrl.searchParams.set("next", nextPath);

  const response = NextResponse.redirect(callbackUrl);
  response.headers.set("Cache-Control", "private, no-store");

  const supabase = await createSupabaseRouteHandlerClient(response);

  if (!supabase) {
    return NextResponse.redirect(
      getErrorRedirectUrl(
        request,
        nextPath,
        "Supabase is not configured yet, so Google sign-in is unavailable in this environment."
      )
    );
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString(),
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    return NextResponse.redirect(getErrorRedirectUrl(request, nextPath, error.message));
  }

  if (!data.url) {
    return NextResponse.redirect(
      getErrorRedirectUrl(
        request,
        nextPath,
        "Google sign-in could not start because no redirect URL was returned."
      )
    );
  }

  response.headers.set("Location", data.url);
  return response;
}
