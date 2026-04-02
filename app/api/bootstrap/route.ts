import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { PACKING_APP_USER_ID_COOKIE } from "@/lib/domain/constants";
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

export async function GET(request: NextRequest) {
  const nextPath = getRequestNextPath(request);
  const existingUserId = request.cookies.get(PACKING_APP_USER_ID_COOKIE)?.value;
  const userId: string = isSessionUserId(existingUserId)
    ? existingUserId
    : crypto.randomUUID();
  const response = NextResponse.redirect(new URL(nextPath, request.url));

  if (!isSessionUserId(existingUserId)) {
    response.cookies.set(
      PACKING_APP_USER_ID_COOKIE,
      userId,
      getSessionCookieOptions()
    );
  }

  response.headers.set("Cache-Control", "no-store");

  try {
    await ensureProfileForUserId(userId);
  } catch {
    // The app shell renders bootstrap notes when the database is not ready yet.
  }

  return response;
}
