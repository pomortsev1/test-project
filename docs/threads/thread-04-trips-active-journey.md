# Thread 04: Trips + Active Journey

## Goal
Build trip planning, leg progression, and active packing checklist behavior on top of templates and session bootstrap.

## Write Scope
- `app/actions/trips.ts`
- `app/(app)/trips/**`
- `components/trips/**`

## Read-Only Context
- `docs/product/packing-app-spec.md`
- `docs/architecture/domain-model.md`
- `docs/architecture/app-flows.md`
- `docs/contracts/actions-and-loaders.md`
- data/session/template outputs from earlier threads

## Must Not Edit
- `supabase/**`
- template UI and actions
- cookie bootstrap code

## Required Deliverables
- trip list and trip detail screens
- simple trip planner: `Home -> Destination -> Home`
- multi-stop planner: `Home -> Stop 1 -> Stop 2 -> ... -> Home`
- create trip action that snapshots template items
- start trip action
- active leg checklist UI
- toggle packed state action
- arrive action to advance to next leg
- go-home-now action that skips future planned stops and activates direct return

## Fixed Decisions
- trips use statuses `draft | active | completed | archived`
- same full item list appears for every leg
- packing state is per leg
- multiple trips may exist for a profile

## Suggested Implementation Notes
- Make current route and next action obvious
- Keep leg status transitions explicit and easy to reason about
- Do not leak checklist completion from one leg to another

## Done When
- User can create simple and multi-stop trips
- Starting a trip activates the first leg
- Arriving advances correctly
- Go-home-now works without corrupting completed history
- Completed trips remain readable
