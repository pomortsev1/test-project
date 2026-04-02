# Packmap Product Spec

## Product Goal
Build Packmap, a Supabase-backed travel packing app that feels simple on the first visit and stays useful as the data grows.

The product has two entry modes:
- Google sign-in through Supabase Auth
- anonymous browser-based access backed by a persistent UUID cookie

Both modes should let the user manage templates, item suggestions, and trips.

The intended product is not a generic dashboard. It is a focused packing workflow:
1. open the default template
2. add or adjust items
3. create a trip from that template, or create a trip and add items directly
4. start the trip
5. tick checkboxes while packing

The first-use experience should feel immediately useful:
- the app should open into a clear default-template-first workflow
- the user should not need to create a template before they can use the app
- the default template must be viewable and editable immediately
- the interface should explain the next best action without exposing implementation details
- copy must be short and clear, not a wall of instructional text

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
- Users must be able to view the default template at all times unless it was truly deleted.
- Users must be able to create a new template and edit any existing template.
- Users can create multiple templates, but that is an advanced workflow rather than the main call to action.
- One template is marked as the default.
- New trips use the selected template or the default template.
- The UI should support the quick path:
  - add item to the current template
  - optionally save the item to the personal catalog
  - optionally save the current list as another template
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
- The seeded system catalog should be materially larger than a demo list:
  - target roughly `1000-2000` practical catalog items in the database
  - cover common travel, climate, work, family, health, and activity scenarios
  - avoid junk filler, lorem-ipsum-style rows, and near-duplicate noise
- The default starter template should stay curated and manageable:
  - enough items to be genuinely useful on first visit
  - not anywhere near the full catalog size
  - heavily biased toward universal travel essentials

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
  - adding a missing item directly in context without detouring into setup
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
- Trip creation must work with:
  - the default template
  - any user-created template
  - template items that omit both quantity and unit
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
- Replace the starter page with a product-specific app shell.
- Remove leftover Next.js starter artifacts, generic admin framing, and infrastructure-heavy copy from the visible UI.
- Keep the app intentional and practical rather than generic admin UI.
- Make it obvious how to use the product within a few seconds of landing on the app.
- Favor one strong primary action per screen.
- Prefer editing the default template over asking the user to create a template from scratch on first use.
- Keep instructions short.
- Avoid stacking multiple explanation panels, helper cards, and status blocks on the same screen.
- Reduce badge noise and decorative UI that competes with the main action.
- Prioritize:
  - first-run clarity
  - understandable hierarchy and navigation
  - clear trip status
  - fast template editing
  - low-friction item entry
  - obvious current-leg actions

## Screen-Level Expectations

### Landing
- One short headline that explains the product.
- One short supporting sentence.
- Two entry actions:
  - continue anonymously
  - continue with Google
- A very short note that the default template is already included.

### Dashboard
- Show the most important next action immediately:
  - open active trip
  - or open default template
- Do not render a tutorial wall.
- Keep summary blocks minimal and directly useful.

### Templates
- Opening `/templates` should lead straight to the default template when one exists.
- The default template should be visibly marked but not surrounded by excessive copy.
- Adding, editing, and removing items should feel inline and fast.
- Creating another template should be present but clearly secondary.

### Trips
- The trip planner should be simple enough to scan in seconds.
- Template choice should be visible and usable.
- Creating a trip should not fail just because template items have no measurement pair.
- After trip creation, the user should be able to start the trip and use the checklist without extra explanation.
