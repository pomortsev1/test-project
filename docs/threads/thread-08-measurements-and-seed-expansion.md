# Thread 08: Flexible Measurements + Seed Expansion

## Goal
Update the data model and starter content so the app supports both measured items and obvious single items like passport.

## Write Scope
- `supabase/**`
- `lib/domain/**`
- `lib/data/**`
- `lib/supabase/database.types.ts`
- `docs/architecture/**`
- `docs/contracts/**`

## Read-Only Context
- `docs/product/packing-app-spec.md`
- `docs/product/polish-plan.md`
- template and trip action/UI files for compatibility checking only

## Must Not Edit
- landing page and dashboard presentation files
- template or trip UI implementation files unless coordinator expands the scope

## Required Deliverables
- schema changes so template and trip items can omit quantity and unit together
- validation rules that still support numeric quantity plus unit when provided
- richer system catalog seed data
- a more useful starter template blueprint
- updated domain and contract docs to reflect the new invariant

## Fixed Decisions
- Items like passport, wallet, and keys can exist without quantity or unit.
- If one measurement field is absent, the display should stay clean and natural.
- The seeded starter content should feel like a real travel checklist, not placeholder demo data.

## Suggested Implementation Notes
- Keep data compatibility in mind for existing rows that already have measurements.
- Update shared docs so later UI threads do not follow outdated assumptions.
- Prefer common-sense starter items over overly niche examples.

## Done When
- The database supports measured and unmeasured items safely.
- The seed catalog and starter template are materially richer than the current baseline.
