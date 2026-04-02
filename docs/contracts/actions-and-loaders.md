# Actions And Loaders Contract

These contracts are stable enough for worker threads to build against. Keep naming consistent unless the coordinator explicitly changes it.

## Dynamic Rendering Rule
- Any route depending on `packmap_user_id` should be treated as dynamic.
- Do not add cache behavior to personalized loaders.

## Suggested Shared Modules
- `lib/domain/types.ts`
- `lib/domain/constants.ts`
- `lib/data/*.ts`
- `lib/session/*.ts`
- `app/actions/*.ts`

## Session Contract

### Loader helpers
- `getOrThrowCurrentUserId(): Promise<string>`
- `getCurrentUserId(): Promise<string | null>`
- `ensureProfileForCurrentUser(): Promise<Profile>`

### Cookie bootstrap
- Route Handler or Server Action ensures:
  - UUID exists
  - cookie is set if missing

## Template Contracts

### Loaders
- `getTemplatesForCurrentUser()`
- `getDefaultTemplateForCurrentUser()`
- `getTemplateDetails(templateId)`
- `getCatalogSuggestions(query)`

### Seeded starter-data contract
- `getCatalogSuggestions(query)` should expect a product-sized system catalog, currently roughly `1200+` seeded system items before any user-created rows.
- The default starter template is curated, not exhaustive, and currently seeds roughly `60` rows.
- Starter-template rows deliberately include both:
  - plain essentials with `quantity: null` and `unit: null`
  - measured rows with a positive `quantity` and non-empty `unit`

### Actions
- `createTemplate(input)`
- `renameTemplate(input)`
- `deleteTemplate(input)`
- `setDefaultTemplate(input)`
- `addTemplateItem(input)`
- `updateTemplateItem(input)`
- `removeTemplateItem(input)`

### Input shape conventions
- `quantity?: number | null`
- `unit?: string | null`
- Quantity and unit are a pair:
  - send both fields with values for measured rows
  - send both as `null` or omit both for single-instance rows
- `categoryId?: string`
- `categoryName?: string`
- `saveToCatalog?: boolean`

## Trip Contracts

### Loaders
- `getTripsForCurrentUser()`
- `getTripDetails(tripId)`
- `getActiveTripForCurrentUser()`

### Actions
- `createTrip(input)`
- `startTrip(input)`
- `toggleTripLegItemCheck(input)`
- `arriveAtCurrentStop(input)`
- `goHomeNow(input)`
- `archiveTrip(input)`

### Trip create input conventions
- `templateId: string`
- `name: string`
- `mode: 'simple' | 'multi_stop'`
- `stops: Array<{ name: string }>`

## UI Boundaries
- Server Components:
  - initial dashboard fetch
  - initial template/trip lists
  - metadata
- Client Components:
  - add-item autocomplete
  - multi-stop planner editor
  - checkbox toggles
  - optimistic or transitional interactions

## Validation Rules
- If present, quantity must be positive.
- If present, unit must be non-empty short text.
- Quantity and unit must be omitted together for single-instance items.
- Template name must be non-empty.
- Trip name may be omitted and should then be generated from the ordered destination stops.
- Stop list must always resolve to at least `Home -> Destination -> Home`.
- Users must only mutate rows owned by their profile or system-cloned descendants.

## Snapshot Output Rules
- Template-item and trip-item loaders may now return `quantity: null` and `unit: null`.
- Renderers must suppress measurement text completely when both values are null.
- Starter-template copies must preserve null/null rows instead of coercing them into fake `1 item` style measurements.
- Downstream UI threads should use [`lib/domain/measurements.ts`](/Users/ivan.pomortsev/Projects/test-project/lib/domain/measurements.ts) or equivalent pair-aware checks instead of string concatenation.

## Revalidation Guidance
- Mutations should revalidate the smallest affected route/path.
- Favor predictable route refresh over broad invalidation.
