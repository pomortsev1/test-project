import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  PACKING_APP_AUTH_NEXT_COOKIE,
  PACKING_APP_USER_ID_COOKIE,
} from "@/lib/domain/constants";
import {
  createSessionIdentityFromAuthUser,
  getAuthChoicePath,
  getSafeNextPath,
  isSessionUserId,
} from "@/lib/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getErrorRedirectUrl(request: NextRequest, nextPath: string, message: string) {
  const redirectUrl = new URL(getAuthChoicePath(nextPath), request.url);
  redirectUrl.searchParams.set("authError", encodeURIComponent(message));
  return redirectUrl;
}

export async function GET(request: NextRequest) {
  const nextCookieValue = request.cookies.get(PACKING_APP_AUTH_NEXT_COOKIE)?.value ?? null;
  const nextPath = getSafeNextPath(
    request.nextUrl.searchParams.get("next") ??
      (nextCookieValue ? decodeURIComponent(nextCookieValue) : null),
    "/dashboard"
  );
  const anonymousUserId = request.cookies.get(PACKING_APP_USER_ID_COOKIE)?.value ?? null;
  const cookieNames = request.cookies.getAll().map((cookie) => cookie.name);
  const response = NextResponse.redirect(new URL(nextPath, request.url));
  response.headers.set("Cache-Control", "private, no-store");
  response.cookies.delete(PACKING_APP_AUTH_NEXT_COOKIE);

  console.info("[google-auth] finalize request", {
    anonymousUserIdPresent: Boolean(anonymousUserId),
    cookieNames,
    nextPath,
    url: request.url,
  });

  const supabase = await createSupabaseServerClient();

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
    const identity = createSessionIdentityFromAuthUser(user);
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        display_name:
          identity.authMode === "google" ? identity.label.trim() || null : null,
        email:
          identity.authMode === "google" && identity.email
            ? identity.email.trim().toLowerCase()
            : null,
      },
      { onConflict: "id" }
    );

    if (profileError) {
      throw profileError;
    }

    console.info("[google-auth] profile upserted", {
      email: identity.email,
      userId: user.id,
    });

    if (isSessionUserId(anonymousUserId) && anonymousUserId !== user.id) {
      const mergeResult = await supabase.rpc("merge_packing_profiles", {
        p_source_profile_id: anonymousUserId,
        p_target_profile_id: user.id,
      });

      if (mergeResult.error) {
        throw mergeResult.error;
      }

      const merged =
        typeof mergeResult.data === "object" &&
        mergeResult.data !== null &&
        "merged" in mergeResult.data
          ? mergeResult.data.merged === true
          : false;

      console.info("[google-auth] merge result", {
        merged,
        result: mergeResult.data,
      });

      if (merged) {
        response.cookies.delete(PACKING_APP_USER_ID_COOKIE);
      }
    }
  } catch (error) {
    console.error("[google-auth] finalize failed", {
      message:
        error instanceof Error ? error.message : "Unable to finalize the Google session.",
    });
    return NextResponse.redirect(
      getErrorRedirectUrl(
        request,
        nextPath,
        error instanceof Error ? error.message : "Unable to finalize the Google session."
      )
    );
  }

  console.info("[google-auth] finalize response cookies", {
    cookieNames: response.cookies.getAll().map((cookie) => cookie.name),
  });

  return response;
}
