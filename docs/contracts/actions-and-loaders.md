# Actions And Loaders Contract

These contracts are stable enough for worker threads to build against. Keep naming consistent unless the coordinator explicitly changes it.

## Dynamic Rendering Rule
- Any route depending on `packing_app_user_id` should be treated as dynamic.
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

### Actions
- `createTemplate(input)`
- `renameTemplate(input)`
- `deleteTemplate(input)`
- `setDefaultTemplate(input)`
- `addTemplateItem(input)`
- `updateTemplateItem(input)`
- `removeTemplateItem(input)`

### Input shape conventions
- `quantity: number`
- `unit: string`
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
- Quantity must be positive.
- Unit must be non-empty short text.
- Template name and trip name must be non-empty.
- Stop list must always resolve to at least `Home -> Destination -> Home`.
- Users must only mutate rows owned by their profile or system-cloned descendants.

## Revalidation Guidance
- Mutations should revalidate the smallest affected route/path.
- Favor predictable route refresh over broad invalidation.
