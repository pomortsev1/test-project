export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  return {
    url,
    publishableKey,
    isConfigured: Boolean(url && publishableKey),
  };
}

export function getSupabaseMissingEnvNames() {
  const { url, publishableKey } = getSupabaseEnv();
  const missingEnvNames: string[] = [];

  if (!url) {
    missingEnvNames.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!publishableKey) {
    missingEnvNames.push(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return missingEnvNames;
}
