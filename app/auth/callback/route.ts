import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSafeNextPath } from "@/lib/session";

export async function GET(request: NextRequest) {
  const nextPath = getSafeNextPath(request.nextUrl.searchParams.get("next"), "/dashboard");
  const authCode = request.nextUrl.searchParams.get("code");
  const providerError =
    request.nextUrl.searchParams.get("error_description") ??
    request.nextUrl.searchParams.get("error");
  const redirectUrl = new URL("/", request.url);
  redirectUrl.searchParams.set("next", nextPath);

  if (authCode) {
    redirectUrl.searchParams.set("code", authCode);
  }

  if (providerError) {
    redirectUrl.searchParams.set("error_description", providerError);
  }

  return NextResponse.redirect(redirectUrl);
}
