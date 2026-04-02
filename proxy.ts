import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
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

  const response = NextResponse.next({
    request,
  });
  response.headers.set("Cache-Control", "private, no-store");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
