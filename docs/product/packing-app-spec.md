# Packing Checklist Travel App Spec

## Product Goal
Build a Supabase-backed web app for planning packing checklists for travel without login. Each visitor gets an anonymous persistent UUID in a cookie and uses that identity to manage templates, item suggestions, and trips.

## Core User Model
- No login UI.
- Each browser gets one persistent UUID cookie.
- The UUID maps to a profile row in Supabase.
- If the cookie is cleared, the user's data is not recoverable in v1.

## Core Entities
- Profile: anonymous app owner keyed by UUID.
- Category: system or user-defined item grouping.
- Catalog item: reusable item suggestion, system or user-defined.
- Packing template: reusable list of items.
- Template item: item row inside a template with quantity and unit.
- Trip: a travel plan created from a template.
- Trip stop: ordered destinations including home at start and end.
- Trip leg: one movement from one stop to the next.
- Trip item: snapshot copy of a template item stored on the trip.
- Trip leg item check: packed state of a given trip item for a given leg.

## Required Behaviors

### Anonymous Session
- On first visit, create a UUID cookie and corresponding profile.
- The cookie should persist across browser restarts.
- The app should be personalized by cookie identity only.

### Templates
- Each new profile gets a copied default template based on a system starter template.
- Users can create multiple templates.
- One template is marked as the default.
- New trips use the selected template or the default template.
- Users can edit template items:
  - name
  - category
  - quantity
  - unit

### Categories And Suggestions
- The app ships with system categories such as:
  - Documents
  - Tech
  - Clothes
  - Toiletries
  - Health
  - Misc
- The app ships with system catalog items such as:
  - passport
  - mobile phone
  - charger
  - socks
  - underwear
  - toothbrush
  - medicine
- Add-item UI should:
  - suggest existing items from system catalog and user catalog
  - let the user type a new item
  - let the user choose or create a category
  - optionally save the new item into the user's catalog for future suggestions

### Quantities
- Quantities use a numeric value plus short unit text.
- Examples:
  - `1 document`
  - `3 pairs`
  - `2 chargers`

### Trip Planning
- The user can create a trip in one of two modes:
  - `simple`: `Home -> Destination -> Home`
  - `multi_stop`: `Home -> Stop 1 -> Stop 2 ... -> Home`
- Creating a trip copies template items into trip items so later template edits do not affect existing trips.
- Trips support statuses:
  - `draft`
  - `active`
  - `completed`
  - `archived`
- Multiple trips may exist at once.

### Active Trip Flow
- `Start trip` activates the first leg.
- The active leg screen shows the full grouped checklist for that leg.
- Packing state is tracked per leg, not globally for the whole trip.
- `Arrived` completes the current leg and activates the next leg.
- `Go home now` skips remaining intermediate planned legs and creates or activates a direct leg from the current stop back home.
- Each newly active leg starts unchecked so the user can repack for the next move.

## Out Of Scope For V1
- Login, signup, password reset
- Cross-device recovery beyond cookie persistence
- Weather suggestions
- Collaboration or sharing
- Per-stop custom packing subsets
- Notes

## UX Direction
- Replace the starter page with a dashboard-style app shell.
- Keep the app intentional and practical rather than generic admin UI.
- Prioritize:
  - clear trip status
  - fast template editing
  - low-friction item entry
  - obvious current-leg actions
