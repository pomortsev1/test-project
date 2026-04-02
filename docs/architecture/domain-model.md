# Domain Model

## Shared Enums
- `scope`: `system | user`
- `trip_mode`: `simple | multi_stop`
- `trip_status`: `draft | active | completed | archived`
- `stop_kind`: `home | stop`
- `leg_status`: `pending | active | completed | skipped`

These enum values are contract-level and should not be renamed by worker threads.

## Cookie Contract
- Cookie name: `packing_app_user_id`
- Value: UUID string
- Lifetime: persistent cookie, one year max age is acceptable
- Cookie should be set only in a Route Handler or Server Action

## Tables

### `profiles`
- `id uuid primary key`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Meaning:
- App owner keyed by cookie UUID

### `categories`
- `id uuid primary key`
- `scope text not null check in ('system','user')`
- `profile_id uuid null references profiles(id)`
- `name text not null`
- `slug text not null`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Rules:
- System rows have `profile_id is null`
- User rows have `profile_id not null`
- Unique name or slug within owner scope

### `catalog_items`
- `id uuid primary key`
- `scope text not null check in ('system','user')`
- `profile_id uuid null references profiles(id)`
- `category_id uuid not null references categories(id)`
- `name text not null`
- `normalized_name text not null`
- `default_unit text null`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Rules:
- Used for item suggestions
- Unique per owner/category/normalized name

### `packing_templates`
- `id uuid primary key`
- `profile_id uuid not null references profiles(id)`
- `name text not null`
- `is_default boolean not null default false`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Rules:
- Only one default template per profile

### `packing_template_items`
- `id uuid primary key`
- `template_id uuid not null references packing_templates(id) on delete cascade`
- `catalog_item_id uuid null references catalog_items(id)`
- `item_name text not null`
- `item_normalized_name text not null`
- `category_name text not null`
- `quantity numeric not null`
- `unit text not null`
- `sort_order integer not null default 0`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Rules:
- Snapshot the display names needed to render the item even if the catalog changes later

### `trips`
- `id uuid primary key`
- `profile_id uuid not null references profiles(id)`
- `template_id uuid null references packing_templates(id)`
- `name text not null`
- `mode text not null check in ('simple','multi_stop')`
- `status text not null check in ('draft','active','completed','archived')`
- `current_leg_index integer not null default 0`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Rules:
- Multiple trips may exist for a profile

### `trip_stops`
- `id uuid primary key`
- `trip_id uuid not null references trips(id) on delete cascade`
- `position integer not null`
- `name text not null`
- `kind text not null check in ('home','stop')`
- `created_at timestamptz default now()`

Rules:
- Position order defines route order
- First and last stop should be `home`

### `trip_items`
- `id uuid primary key`
- `trip_id uuid not null references trips(id) on delete cascade`
- `catalog_item_id uuid null references catalog_items(id)`
- `template_item_id uuid null references packing_template_items(id)`
- `item_name text not null`
- `item_normalized_name text not null`
- `category_name text not null`
- `quantity numeric not null`
- `unit text not null`
- `sort_order integer not null default 0`
- `created_at timestamptz default now()`

Rules:
- Trip snapshot of item list

### `trip_legs`
- `id uuid primary key`
- `trip_id uuid not null references trips(id) on delete cascade`
- `position integer not null`
- `from_stop_id uuid not null references trip_stops(id)`
- `to_stop_id uuid not null references trip_stops(id)`
- `status text not null check in ('pending','active','completed','skipped')`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Rules:
- Exactly one active leg for an active trip
- Leg position matches route order

### `trip_leg_item_checks`
- `id uuid primary key`
- `leg_id uuid not null references trip_legs(id) on delete cascade`
- `trip_item_id uuid not null references trip_items(id) on delete cascade`
- `is_packed boolean not null default false`
- `packed_at timestamptz null`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Rules:
- Unique per `(leg_id, trip_item_id)`
- New legs should start with all checks false

## Seed Data
- System categories:
  - Documents
  - Tech
  - Clothes
  - Toiletries
  - Health
  - Misc
- System starter catalog items:
  - Passport, Boarding pass, Wallet
  - Mobile phone, Phone charger, Power bank, Headphones
  - T-shirts, Socks, Underwear, Trousers
  - Toothbrush, Toothpaste, Deodorant
  - Medication
  - Keys, Water bottle
- System starter template:
  - grouped across the seeded categories
  - enough content to feel useful on first visit

## Invariants
- Profiles only see their own user-scoped records plus system-scoped records.
- A profile can have many templates and many trips.
- Template edits do not mutate existing trips.
- Leg completion advances the trip; packing state never bleeds into the next leg.
- `Go home now` should not destroy history of completed legs.
