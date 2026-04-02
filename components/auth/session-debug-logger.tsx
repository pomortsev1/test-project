"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function getCookieNames() {
  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter(Boolean);
}

export function SessionDebugLogger() {
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    console.info("[google-auth] browser debug mount", {
      cookieNames: getCookieNames(),
      pathname,
    });

    if (!supabase) {
      console.info("[google-auth] browser debug: no supabase client");
      return;
    }

    void supabase.auth.getSession().then(({ data, error }) => {
      console.info("[google-auth] browser debug session", {
        error: error?.message ?? null,
        hasSession: Boolean(data.session),
        pathname,
        userEmail: data.session?.user.email ?? null,
        userId: data.session?.user.id ?? null,
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.info("[google-auth] browser debug auth state", {
        cookieNames: getCookieNames(),
        event,
        hasSession: Boolean(session),
        pathname,
        userEmail: session?.user.email ?? null,
        userId: session?.user.id ?? null,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname]);

  return null;
}
