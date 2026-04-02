import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { PACKING_APP_USER_ID_COOKIE } from "@/lib/domain/constants";
import {
  createSessionIdentityFromAuthUser,
  ensureProfileForUserId,
  getAuthChoicePath,
  getSafeNextPath,
  isSessionUserId,
} from "@/lib/session";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/server";

function getErrorRedirectUrl(request: NextRequest, nextPath: string, message: string) {
  const redirectUrl = new URL(getAuthChoicePath(nextPath), request.url);
  redirectUrl.searchParams.set("authError", encodeURIComponent(message));
  return redirectUrl;
}

export async function GET(request: NextRequest) {
  const nextPath = getSafeNextPath(request.nextUrl.searchParams.get("next"), "/dashboard");
  const anonymousUserId = request.cookies.get(PACKING_APP_USER_ID_COOKIE)?.value ?? null;
  let mergedAnonymousProfile = false;
  const response = NextResponse.redirect(new URL(nextPath, request.url));
  response.headers.set("Cache-Control", "private, no-store");
  const supabase = createSupabaseRouteHandlerClient(request, response);

  if (!supabase) {
    return NextResponse.redirect(
      getErrorRedirectUrl(
        request,
        nextPath,
        "Supabase is not configured yet, so Google sign-in cannot complete."
      )
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(
      getErrorRedirectUrl(
        request,
        nextPath,
        userError?.message ?? "Google sign-in completed, but the user session could not be loaded."
      )
    );
  }

  try {
    await ensureProfileForUserId(user.id, createSessionIdentityFromAuthUser(user));

    if (isSessionUserId(anonymousUserId) && anonymousUserId !== user.id) {
      const mergeResult = await supabase.rpc("merge_packing_profiles", {
        p_source_profile_id: anonymousUserId,
        p_target_profile_id: user.id,
      });

      if (mergeResult.error) {
        throw mergeResult.error;
      }

      mergedAnonymousProfile = true;
    }
  } catch (error) {
    return NextResponse.redirect(
      getErrorRedirectUrl(
        request,
        nextPath,
        error instanceof Error ? error.message : "Unable to finalize the Google session."
      )
    );
  }

  if (mergedAnonymousProfile) {
    response.cookies.delete(PACKING_APP_USER_ID_COOKIE);
  }

  return response;
}
