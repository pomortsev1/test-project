# Thread 02: Anonymous Session + App Shell

## Goal
Add anonymous UUID bootstrap, profile initialization, and the top-level dashboard shell that later threads can plug into.

## Write Scope
- `app/layout.tsx`
- `app/page.tsx`
- `app/(app)/**`
- `app/api/**`
- `components/app-shell/**`
- `lib/session/**`

## Read-Only Context
- `docs/product/packing-app-spec.md`
- `docs/architecture/domain-model.md`
- `docs/architecture/app-flows.md`
- `docs/contracts/actions-and-loaders.md`
- shared data/domain helpers created by Thread 01

## Must Not Edit
- `supabase/**`
- `components/templates/**`
- `components/trips/**`
- template and trip action modules unless coordinator approves

## Required Deliverables
- bootstrap flow that ensures `packing_app_user_id` exists
- profile bootstrap on first visit
- initial dashboard shell with sections/placeholders for:
  - active trip
  - trips
  - templates
- metadata/title update for the packing app

## Fixed Decisions
- Cookie is persistent and UUID-based
- cookie mutations happen only in Route Handlers or Server Actions
- routes depending on the cookie are dynamic

## Suggested Implementation Notes
- Prefer a clean shell and composition points over deep feature logic
- Leave obvious mounting points or components for template and trip threads
- Keep the shell mobile-friendly

## Done When
- First visit creates cookie and profile safely
- App no longer shows the starter landing page
- Dashboard shell renders personalized data frame or empty states
- Template and trip threads can build inside the shell without reworking session logic
