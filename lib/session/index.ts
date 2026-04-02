import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { PACKING_APP_USER_ID_COOKIE } from "@/lib/domain/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type SessionProfile = {
  authMode: "anonymous" | "google";
  email: string | null;
  id: string;
  displayName: string;
  source: "supabase" | "degraded";
  notes: string[];
};

export type SessionIdentity = {
  authMode: "anonymous" | "google";
  email: string | null;
  label: string;
  userId: string;
};

export type SessionTripSummary = {
  id: string;
  name: string;
  mode: "simple" | "multi_stop";
  status: "draft" | "active" | "completed" | "archived";
  currentLegIndex: number;
  updatedAt: string | null;
};

export type SessionTemplateSummary = {
  id: string;
  name: string;
  isDefault: boolean;
  updatedAt: string | null;
};

export type AppShellData = {
  profile: SessionProfile;
  activeTrip: SessionTripSummary | null;
  draftTrips: SessionTripSummary[];
  templates: SessionTemplateSummary[];
  isSupabaseConfigured: boolean;
  notes: string[];
};

type ProfileRow = {
  display_name: string | null;
  email: string | null;
  id: string;
};

type TripRow = {
  id: string;
  name: string;
  mode: SessionTripSummary["mode"];
  status: SessionTripSummary["status"];
  current_leg_index: number;
  updated_at: string | null;
};

type TemplateRow = {
  id: string;
  name: string;
  is_default: boolean;
  updated_at: string | null;
};

export function isSessionUserId(value: string | null | undefined): value is string {
  return Boolean(value && UUID_PATTERN.test(value));
}

function getAnonymousProfileLabel(userId: string) {
  return `Traveler ${userId.slice(0, 8)}`;
}

function getAuthenticatedProfileLabel(user: User) {
  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : null;
  const givenName =
    typeof user.user_metadata?.given_name === "string"
      ? user.user_metadata.given_name.trim()
      : null;
  const email = typeof user.email === "string" ? user.email.trim() : null;

  return fullName || givenName || email || `Traveler ${user.id.slice(0, 8)}`;
}

function getIdentityProfileFields(identity: SessionIdentity) {
  return {
    displayName:
      identity.authMode === "google" ? identity.label.trim() || null : null,
    email:
      identity.authMode === "google" && identity.email
        ? identity.email.trim().toLowerCase()
        : null,
  };
}

function dedupeNotes(notes: string[]) {
  return Array.from(new Set(notes));
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;

    if (typeof message === "string") {
      return message;
    }
  }

  return "Unknown error";
}

function mapTrip(row: TripRow): SessionTripSummary {
  return {
    id: row.id,
    name: row.name,
    mode: row.mode,
    status: row.status,
    currentLegIndex: row.current_leg_index,
    updatedAt: row.updated_at,
  };
}

function mapTemplate(row: TemplateRow): SessionTemplateSummary {
  return {
    id: row.id,
    name: row.name,
    isDefault: row.is_default,
    updatedAt: row.updated_at,
  };
}

export function getBootstrapPath(nextPath = "/dashboard") {
  const safeNextPath = getSafeNextPath(nextPath, "/dashboard");

  return `/api/bootstrap?next=${encodeURIComponent(safeNextPath)}`;
}

export function getAuthChoicePath(nextPath = "/dashboard") {
  const safeNextPath = getSafeNextPath(nextPath, "/dashboard");

  return `/?next=${encodeURIComponent(safeNextPath)}`;
}

export function getSafeNextPath(nextPath: string | null | undefined, fallback = "/dashboard") {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return fallback;
  }

  if (nextPath.startsWith("/api/bootstrap")) {
    return fallback;
  }

  if (nextPath.startsWith("/auth/callback")) {
    return fallback;
  }

  return nextPath;
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

async function getCurrentAnonymousUserId() {
  const cookieStore = await cookies();
  const value = cookieStore.get(PACKING_APP_USER_ID_COOKIE)?.value;

  return isSessionUserId(value) ? value : null;
}

function createAnonymousSessionIdentity(userId: string): SessionIdentity {
  return {
    authMode: "anonymous",
    email: null,
    label: getAnonymousProfileLabel(userId),
    userId,
  };
}

export function createSessionIdentityFromAuthUser(user: User): SessionIdentity {
  return {
    authMode: "google",
    email: user.email ?? null,
    label: getAuthenticatedProfileLabel(user),
    userId: user.id,
  };
}

async function getAuthenticatedSessionIdentity() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return createSessionIdentityFromAuthUser(user);
}

export async function getCurrentSessionIdentity() {
  const authenticatedIdentity = await getAuthenticatedSessionIdentity();

  if (authenticatedIdentity) {
    return authenticatedIdentity;
  }

  const anonymousUserId = await getCurrentAnonymousUserId();

  return anonymousUserId ? createAnonymousSessionIdentity(anonymousUserId) : null;
}

export async function getCurrentUserId() {
  const identity = await getCurrentSessionIdentity();

  return identity?.userId ?? null;
}

export async function getOrThrowCurrentUserId(nextPath = "/dashboard") {
  const identity = await getCurrentSessionIdentity();

  if (!identity) {
    redirect(getAuthChoicePath(nextPath));
  }

  return identity.userId;
}

export async function requireCurrentUserId(nextPath: string) {
  const identity = await getCurrentSessionIdentity();

  if (!identity) {
    redirect(getAuthChoicePath(nextPath));
  }

  return identity.userId;
}

export async function ensureProfileForUserId(
  userId: string,
  identity?: SessionIdentity
): Promise<SessionProfile> {
  const currentIdentity = identity ? null : await getCurrentSessionIdentity();
  const resolvedIdentity =
    identity ??
    (currentIdentity?.userId === userId ? currentIdentity : null) ??
    createAnonymousSessionIdentity(userId);
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      authMode: resolvedIdentity.authMode,
      email: resolvedIdentity.email,
      id: userId,
      displayName: resolvedIdentity.label,
      source: "degraded",
      notes: [
        "Supabase is not configured yet, so the current profile cannot be persisted in the database.",
      ],
    };
  }

  const identityProfileFields = getIdentityProfileFields(resolvedIdentity);
  const existingProfileResult = await supabase
    .from("profiles")
    .select("id, display_name, email")
    .eq("id", userId)
    .maybeSingle();
  const existingProfile = existingProfileResult.data as ProfileRow | null;
  const existingProfileError = existingProfileResult.error;

  if (existingProfileError) {
    return {
      authMode: resolvedIdentity.authMode,
      email: resolvedIdentity.email,
      id: userId,
      displayName: resolvedIdentity.label,
      source: "degraded",
      notes: [
        `We could not look up the current profile row yet: ${getErrorMessage(
          existingProfileError
        )}`,
      ],
    };
  }

  if (!existingProfile) {
    const { error: insertProfileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        display_name: identityProfileFields.displayName,
        email: identityProfileFields.email,
      });

    if (insertProfileError) {
      return {
        authMode: resolvedIdentity.authMode,
        email: resolvedIdentity.email,
        id: userId,
        displayName: resolvedIdentity.label,
        source: "degraded",
        notes: [
          `We generated the session, but profile bootstrap is still pending: ${getErrorMessage(
            insertProfileError
          )}`,
        ],
      };
    }
  } else if (
    resolvedIdentity.authMode === "google" &&
    (existingProfile.display_name !== identityProfileFields.displayName ||
      existingProfile.email !== identityProfileFields.email)
  ) {
    const { error: updateProfileError } = await supabase
      .from("profiles")
      .update({
        display_name: identityProfileFields.displayName,
        email: identityProfileFields.email,
      })
      .eq("id", userId);

    if (updateProfileError) {
      return {
        authMode: resolvedIdentity.authMode,
        email: resolvedIdentity.email,
        id: userId,
        displayName: resolvedIdentity.label,
        source: "degraded",
        notes: [
          `We found the current profile, but could not refresh the saved account details: ${getErrorMessage(
            updateProfileError
          )}`,
        ],
      };
    }
  }

  const resolvedDisplayName =
    resolvedIdentity.authMode === "google"
      ? identityProfileFields.displayName ??
        existingProfile?.display_name ??
        resolvedIdentity.label
      : existingProfile?.display_name ?? resolvedIdentity.label;
  const resolvedEmail =
    resolvedIdentity.authMode === "google"
      ? identityProfileFields.email ?? existingProfile?.email ?? resolvedIdentity.email
      : existingProfile?.email ?? resolvedIdentity.email;

  return {
    authMode: resolvedIdentity.authMode,
    email: resolvedEmail,
    id: userId,
    displayName: resolvedDisplayName,
    source: "supabase",
    notes: [],
  };
}

export async function ensureProfileForCurrentUser(): Promise<SessionProfile> {
  const identity = await getCurrentSessionIdentity();

  if (!identity) {
    redirect(getAuthChoicePath("/dashboard"));
  }

  return ensureProfileForUserId(identity.userId, identity);
}

export async function getAppShellDataForUser(userId: string): Promise<AppShellData> {
  const profile = await ensureProfileForUserId(userId);
  const notes = [...profile.notes];
  const supabase = await createSupabaseServerClient();
  const isSupabaseConfigured = Boolean(supabase);

  if (!supabase) {
    return {
      profile,
      activeTrip: null,
      draftTrips: [],
      templates: [],
      isSupabaseConfigured,
      notes: dedupeNotes(notes),
    };
  }

  const [activeTripResult, draftTripsResult, templatesResult] = await Promise.all([
    supabase
      .from("trips")
      .select("id, name, mode, status, current_leg_index, updated_at")
      .eq("profile_id", userId)
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("trips")
      .select("id, name, mode, status, current_leg_index, updated_at")
      .eq("profile_id", userId)
      .eq("status", "draft")
      .order("updated_at", { ascending: false })
      .limit(4),
    supabase
      .from("packing_templates")
      .select("id, name, is_default, updated_at")
      .eq("profile_id", userId)
      .order("is_default", { ascending: false })
      .order("updated_at", { ascending: false })
      .limit(4),
  ]);

  if (activeTripResult.error) {
    notes.push(
      `Active trip data is not available yet: ${getErrorMessage(activeTripResult.error)}`
    );
  }

  if (draftTripsResult.error) {
    notes.push(`Trip list is still booting: ${getErrorMessage(draftTripsResult.error)}`);
  }

  if (templatesResult.error) {
    notes.push(
      `Template list is still booting: ${getErrorMessage(templatesResult.error)}`
    );
  }

  return {
    profile,
    activeTrip: activeTripResult.data
      ? mapTrip(activeTripResult.data as TripRow)
      : null,
    draftTrips: ((draftTripsResult.data ?? []) as TripRow[]).map(mapTrip),
    templates: ((templatesResult.data ?? []) as TemplateRow[]).map(mapTemplate),
    isSupabaseConfigured,
    notes: dedupeNotes(notes),
  };
}
