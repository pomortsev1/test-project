# Thread 11: Starter Data Scale And Curation

## Goal
Replace the demo-sized starter data with a product-sized system catalog while keeping the default template curated, practical, and aligned with optional-measurement support.

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
- template and trip UI files for compatibility awareness only

## Must Not Edit
- landing and dashboard presentation files
- template or trip UI implementation files unless coordinator expands the scope

## Known Failure Seams To Address
- The current seeded system catalog is only `34` items, which is far below the intended product scale.
- The starter template blueprint is only `25` items, which is serviceable for a demo but not for a believable first-run product.
- Shared docs and generated types must stay aligned with the optional-measurement rules already introduced in the schema.

## Required Deliverables
- a substantially expanded seeded system catalog targeting roughly `1000-2000` useful rows
- a curated starter template blueprint that stays compact enough to edit comfortably
- data and contract docs that clearly describe the new scale and measurement behavior
- any required generated type updates

## Fixed Decisions
- Catalog size should feel like a real suggestion engine, not a demo.
- The starter template should remain curated, not gigantic.
- Quantity and unit must continue to behave as an all-or-nothing pair.

## Done When
- seeded data clearly exceeds the current demo scale
- the default template feels useful on first visit
- shared docs and types match the actual database contract
