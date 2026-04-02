# Thread 03: Templates + Catalog

## Goal
Build reusable packing template management and the item/category suggestion flow.

## Write Scope
- `app/actions/templates.ts`
- `app/(app)/templates/**`
- `components/templates/**`
- template-related shared UI modules if needed

## Read-Only Context
- `docs/product/packing-app-spec.md`
- `docs/architecture/domain-model.md`
- `docs/architecture/app-flows.md`
- `docs/contracts/actions-and-loaders.md`
- session and data helpers from earlier threads

## Must Not Edit
- `supabase/**`
- `app/actions/trips.ts`
- trip UI files
- cookie/session internals

## Required Deliverables
- template list and template detail/editor UI
- create, rename, delete template actions
- set-default-template action
- add/update/remove template item actions
- add-item autocomplete from system + user catalog
- free-typed item flow with category selection
- optional save-to-catalog behavior for new custom items

## Fixed Decisions
- one profile can have multiple templates
- exactly one template is default
- suggestions come from system catalog plus user catalog
- quantity is number + unit

## Suggested Implementation Notes
- Group items visually by category
- Keep add-item interactions fast and tolerant of partial typing
- Reuse shared type contracts rather than inventing local shapes

## Done When
- User can manage multiple templates
- User can set one default template
- User can add suggested or new custom items
- New custom items can appear again in suggestions
