import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  if (
    process.env.NODE_ENV !== "production" &&
    request.nextUrl.hostname === "127.0.0.1"
  ) {
    const redirectUrl = new URL(request.url);
    redirectUrl.hostname = "localhost";

    return NextResponse.redirect(redirectUrl);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
