# App Flows

## Entry Choice
1. User opens the app.
2. If a Google auth session already exists, render the authenticated workspace.
3. Otherwise, if `packing_app_user_id` already exists, render the anonymous workspace.
4. Otherwise, show an entry choice with:
   - `Continue with Google`
   - `Continue anonymously`

## First Anonymous Visit
1. User chooses anonymous mode.
2. Server checks for `packing_app_user_id`.
3. If missing, bootstrap endpoint or action creates a UUID cookie.
4. Profile bootstrap ensures a `profiles` row exists.
5. If the profile has no templates yet, create a user-owned default template copied from the system starter template.
6. Render dashboard with templates and trips.

## Google Sign-In
1. User chooses Google sign-in.
2. Browser starts Supabase OAuth with a callback route.
3. Callback exchanges the authorization code for a Supabase auth session.
4. If a valid anonymous cookie profile exists, merge that profile into the authenticated profile.
5. Profile bootstrap ensures a `profiles` row exists for the authenticated user ID.
6. Clear the anonymous cookie identity after a successful merge so future anonymous sessions start cleanly.
7. Render dashboard with templates and trips for that authenticated profile.

## Template Creation
1. User opens templates area.
2. User creates a template with a name.
3. Template starts empty or can be copied from default later if the implementation chooses.
4. User adds items through autocomplete or free typing.
5. Each item stores category, sort order, and an optional measurement pair.
6. Single-instance items can omit both quantity and unit.
7. User can mark the template as default.

## Add Item Flow
1. User opens add-item UI.
2. User types item text.
3. UI suggests matching system catalog items and user catalog items.
4. User can choose:
   - existing suggestion
   - new item with selected category
5. If it is a new item, UI offers to save it to the user catalog.
6. Selected or created item is inserted into the template with either:
   - `quantity + unit`
   - no measurement for obvious single items

## Create Trip
1. User starts from template selection.
2. User enters trip name.
3. User chooses mode:
   - `simple`
   - `multi_stop`
4. UI gathers stops:
   - simple: one destination
   - multi-stop: ordered list of stops
5. System auto-wraps route with `Home` at the beginning and end.
6. On save:
   - create trip
   - create stops
   - create legs from consecutive stops
   - copy template items into trip items
   - create unchecked leg-item records for each leg and trip item

## Start Trip
1. User opens a draft trip.
2. User presses `Start trip`.
3. Trip status becomes `active`.
4. First leg becomes `active`.
5. All other legs remain `pending`.

## Active Leg Checklist
1. User sees current route, for example `Home -> Barcelona`.
2. User sees grouped checklist items with measurement only when present.
3. User toggles packed state per item.
4. Progress feedback should make it obvious how many items remain.

## Arrive At Next Stop
1. User presses `Arrived`.
2. Current active leg becomes `completed`.
3. If a next leg exists:
   - next leg becomes `active`
   - checklist loads from that leg's unchecked records
4. If no next leg exists:
   - trip becomes `completed`

## Go Home Now
1. User presses `Go home now` while away from final stop.
2. Current active leg is completed or replaced according to implementation details.
3. Remaining non-home future legs become `skipped`.
4. System ensures there is one active direct leg from current stop to final home stop.
5. That leg shows a fresh unchecked checklist.

## Dashboard Priorities
- Show the active trip first.
- Show draft trips next.
- Keep template management available without leaving the app entirely.
