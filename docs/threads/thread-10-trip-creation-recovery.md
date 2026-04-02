# Thread 10: Trip Creation Recovery

## Goal
Restore trip creation and template-to-trip snapshotting so trips can be created from the default template or any other template without breaking on optional measurements.

## Write Scope
- `app/actions/trips.ts`
- `app/(app)/trips/**`
- `components/trips/**`

## Read-Only Context
- `docs/product/packing-app-spec.md`
- `docs/product/polish-plan.md`
- `docs/architecture/app-flows.md`
- `docs/contracts/actions-and-loaders.md`
- template outputs from the template recovery thread

## Must Not Edit
- `supabase/**`
- template files
- session internals

## Known Failure Seams To Address
- Trip creation still snapshots template items with `toNumber(item.quantity)`, which corrupts null measurement pairs.
- Trip checklist rendering still assumes every item has a numeric quantity and a unit string.
- The trip planner and trip page still contain too much explanatory copy for a simple workflow.

## Required Deliverables
- trip creation that works with default and non-default templates
- snapshot logic that preserves nullable measurement pairs
- checklist rendering that hides measurement text when both values are null
- a simpler trip planner and trip page presentation with short, direct copy

## Fixed Decisions
- The planner should default to the default template when available.
- Template edits must not mutate existing trips.
- Simple trips remain `Home -> Destination -> Home`.

## Done When
- a trip can be created from the default template
- a trip can be created from another saved template
- a trip using unmeasured items no longer fails during snapshotting
- trip pages are simpler and more action-focused than the current version
