# Thread 01: Data + Domain

## Goal
Create the database schema, seed data, shared domain types, and data-access helpers that the rest of the app can build on.

## Write Scope
- `supabase/**`
- `lib/domain/**`
- `lib/data/**`
- `lib/supabase/**` when needed for typed access

## Read-Only Context
- `docs/product/packing-app-spec.md`
- `docs/architecture/domain-model.md`
- `docs/contracts/actions-and-loaders.md`

## Must Not Edit
- `app/**`
- `components/**`
- root UI styling files

## Required Deliverables
- Supabase migration(s) for all tables and constraints in the spec
- seed data for system categories, catalog items, and starter template
- shared TS domain types for templates, trips, legs, and catalog items
- data helpers for loading profile-owned and system-owned data safely

## Fixed Decisions
- No Supabase Auth for v1
- anonymous identity comes from cookie UUID
- quantity is number + unit
- templates and trips use snapshot item records
- multiple trips may exist

## Suggested Implementation Notes
- Favor normalized names/slugs for uniqueness and search
- Add helper utilities for:
  - profile-scoped reads
  - system + user catalog queries
  - copying starter template into a new profile
- Keep RLS decisions minimal for now if the app uses server-side access only

## Done When
- Schema can be applied with `npx supabase db push`
- Seed data produces a usable starter dataset
- Shared types are ready for template and trip threads
- No app UI was changed
