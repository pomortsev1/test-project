# Packing Checklist Travel App Spec

## Product Goal
Build a Supabase-backed web app for planning packing checklists for travel with two entry modes:
- Google sign-in through Supabase Auth
- anonymous browser-based access backed by a persistent UUID cookie

Both modes should let the user manage templates, item suggestions, and trips.

The first-use experience should feel immediately useful:
- the app should open into a clear, guided packing workflow
- the user should start with a meaningful default template already created
- the interface should explain the next best action without exposing implementation details or framework leftovers

## Core User Model
- The entry UI should offer both `Continue with Google` and `Continue anonymously`.
- Anonymous mode creates one persistent UUID cookie per browser.
- Google mode uses the authenticated Supabase user ID as the active profile owner key.
- The current workspace follows the active session identity:
  - anonymous cookie UUID for guests
  - authenticated Supabase user UUID for Google users
- If a user starts anonymously and then signs in with Google, the anonymous workspace should be merged into the Google-authenticated profile.
- If the anonymous cookie is cleared, that anonymous workspace is not recoverable in v1.

## Core Entities
- Profile: app owner keyed by the current session UUID.
- Category: system or user-defined item grouping.
- Catalog item: reusable item suggestion, system or user-defined.
- Packing template: reusable list of items.
- Template item: item row inside a template with optional quantity and unit.
- Trip: a travel plan created from a template.
- Trip stop: ordered destinations including home at start and end.
- Trip leg: one movement from one stop to the next.
- Trip item: snapshot copy of a template item stored on the trip.
- Trip leg item check: packed state of a given trip item for a given leg.

## Required Behaviors

### Session Modes
- On first anonymous entry, create a UUID cookie and corresponding profile.
- The anonymous cookie should persist across browser restarts.
- Google sign-in should complete through a Supabase OAuth callback route and persist a Supabase auth session.
- If a valid anonymous profile exists before Google sign-in, merge its templates, trips, categories, and catalog data into the authenticated profile.
- App personalization should follow the active session identity.
- Signing out of Google should still leave anonymous mode available.

### Templates
- Each new profile gets a copied default template based on a system starter template.
- The default template is the primary basic-mode workflow and should be ready to use without manual setup.
- Users can edit the default template immediately instead of being forced to create one first.
- Users can create multiple templates, but that is an advanced workflow rather than the main call to action.
- One template is marked as the default.
- New trips use the selected template or the default template.
- Users can edit template items:
  - name
  - category
  - quantity when needed
  - unit when needed

### Categories And Suggestions
- The app ships with system categories such as:
  - Documents
  - Tech
  - Clothes
  - Toiletries
  - Health
  - Misc
- The app ships with a practical starter catalog that is noticeably richer than a minimal demo dataset.
- The app ships with system catalog items such as:
  - passport
  - id card
  - mobile phone
  - charger
  - laptop
  - laptop charger
  - socks
  - underwear
  - t-shirts
  - hoodie
  - toothbrush
  - toothpaste
  - deodorant
  - sunscreen
  - medicine
  - painkillers
  - keys
  - water bottle
- Add-item UI should:
  - suggest existing items from system catalog and user catalog
  - let the user type a new item
  - let the user choose or create a category
  - optionally save the new item into the user's catalog for future suggestions

### Measurements
- Many items use a numeric value plus short unit text.
- Examples:
  - `Passport`
  - `Wallet`
  - `1 charger`
  - `3 pairs`
  - `2 t-shirts`
- Quantity and unit should both be optional for self-explanatory single-instance items.
- If quantity and unit are omitted, the item should display as plain text without awkward placeholders.
- The app should follow common sense defaults instead of forcing every item into the same measurement format.

### Basic And Advanced Modes
- Basic mode should focus on:
  - understanding the app quickly
  - reviewing the already-created default template
  - editing that template
  - creating a trip from it
- Advanced mode can include:
  - creating additional templates
  - building specialized packing setups
  - expanding the personal catalog over time
- Basic mode should remain the default presentation in copy, layout, and calls to action.

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
- Email/password auth, signup, password reset
- Cross-device recovery for anonymous workspaces beyond cookie persistence
- Weather suggestions
- Collaboration or sharing
- Per-stop custom packing subsets
- Notes

## UX Direction
- Replace the starter page with a product-specific dashboard-style app shell.
- Remove leftover Next.js starter artifacts, generic admin framing, and infrastructure-heavy copy from the visible UI.
- Keep the app intentional and practical rather than generic admin UI.
- Make it obvious how to use the product within a few seconds of landing on the app.
- Favor one strong primary action per screen.
- Prefer editing the default template over asking the user to create a template from scratch on first use.
- Prioritize:
  - first-run clarity
  - understandable hierarchy and navigation
  - clear trip status
  - fast template editing
  - low-friction item entry
  - obvious current-leg actions
