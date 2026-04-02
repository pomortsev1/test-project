import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  LOCALE_COOKIE_NAME,
  getPathLocale,
  getPreferredLocale,
  localizePath,
} from "@/lib/i18n/config";

export async function proxy(request: NextRequest) {
  const pathLocale = getPathLocale(request.nextUrl.pathname);
  const preferredLocale =
    pathLocale ?? getPreferredLocale(request.headers.get("accept-language"));

  if (
    process.env.NODE_ENV !== "production" &&
    request.nextUrl.hostname === "127.0.0.1"
  ) {
    const redirectUrl = new URL(request.url);
    redirectUrl.hostname = "localhost";

    return NextResponse.redirect(redirectUrl);
  }

  if (
    process.env.NODE_ENV !== "production" &&
    ["/auth/finalize", "/dashboard", "/"].includes(request.nextUrl.pathname)
  ) {
    console.info("[google-auth] proxy request", {
      cookieNames: request.cookies.getAll().map((cookie) => cookie.name),
      pathname: request.nextUrl.pathname,
      url: request.url,
    });
  }

  const pathname = request.nextUrl.pathname;
  const isPublicAsset = /\.[a-zA-Z0-9]+$/.test(pathname);
  const isLocalized = Boolean(pathLocale);
  const shouldSkipLocaleRedirect =
    isLocalized ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    isPublicAsset;

  if (!shouldSkipLocaleRedirect) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = localizePath(preferredLocale, pathname);

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set(LOCALE_COOKIE_NAME, preferredLocale, {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  const response = NextResponse.next({
    request,
  });
  response.headers.set("Cache-Control", "private, no-store");
  response.cookies.set(LOCALE_COOKIE_NAME, preferredLocale, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
