import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  LEGACY_PACKING_APP_USER_ID_COOKIE,
  PACKMAP_USER_ID_COOKIE,
  SESSION_USER_ID_COOKIE_NAMES,
} from "@/lib/domain/constants";
import {
  ensureProfileForUserId,
  getSafeNextPath,
  getSessionCookieOptions,
} from "@/lib/session";

function getRequestNextPath(request: NextRequest) {
  return getSafeNextPath(request.nextUrl.searchParams.get("next"), "/dashboard");
}

function isSessionUserId(value: string | null | undefined): value is string {
  return Boolean(
    value &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value
      )
  );
}

function getAnonymousUserIdFromRequest(request: NextRequest) {
  for (const cookieName of SESSION_USER_ID_COOKIE_NAMES) {
    const value = request.cookies.get(cookieName)?.value;

    if (isSessionUserId(value)) {
      return value;
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  const nextPath = getRequestNextPath(request);
  const existingUserId = getAnonymousUserIdFromRequest(request);
  const userId = existingUserId ?? crypto.randomUUID();
  const response = NextResponse.redirect(new URL(nextPath, request.url));

  if (request.cookies.get(PACKMAP_USER_ID_COOKIE)?.value !== userId) {
    response.cookies.set(
      PACKMAP_USER_ID_COOKIE,
      userId,
      getSessionCookieOptions()
    );
  }

  if (request.cookies.get(LEGACY_PACKING_APP_USER_ID_COOKIE)?.value) {
    response.cookies.delete(LEGACY_PACKING_APP_USER_ID_COOKIE);
  }

  response.headers.set("Cache-Control", "no-store");

  try {
    await ensureProfileForUserId(userId);
  } catch {
    // The app shell renders bootstrap notes when the database is not ready yet.
  }

  return response;
}
