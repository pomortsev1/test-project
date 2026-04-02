export const PACKMAP_USER_ID_COOKIE = "packmap_user_id";
export const LEGACY_PACKING_APP_USER_ID_COOKIE = "packing_app_user_id";
export const SESSION_USER_ID_COOKIE_NAMES = [
  PACKMAP_USER_ID_COOKIE,
  LEGACY_PACKING_APP_USER_ID_COOKIE,
] as const;

export const PACKMAP_AUTH_NEXT_COOKIE = "packmap_auth_next";
export const LEGACY_PACKING_APP_AUTH_NEXT_COOKIE = "packing_app_auth_next";
export const AUTH_NEXT_COOKIE_NAMES = [
  PACKMAP_AUTH_NEXT_COOKIE,
  LEGACY_PACKING_APP_AUTH_NEXT_COOKIE,
] as const;
export const STARTER_TEMPLATE_NAME = "Starter Template";
export const HOME_STOP_NAME = "Home";

export const SCOPES = ["system", "user"] as const;
export const TRIP_MODES = ["simple", "multi_stop"] as const;
export const TRIP_STATUSES = ["draft", "active", "completed", "archived"] as const;
export const STOP_KINDS = ["home", "stop"] as const;
export const LEG_STATUSES = ["pending", "active", "completed", "skipped"] as const;

export const SYSTEM_CATEGORY_NAMES = [
  "Documents",
  "Tech",
  "Clothes",
  "Toiletries",
  "Health",
  "Misc",
] as const;
