# Thread 09: Template Recovery

## Goal
Restore template management so the default template is always usable, template CRUD works again, and optional measurements no longer break the template flow.

## Write Scope
- `app/actions/templates.ts`
- `app/(app)/templates/**`
- `components/templates/**`

## Read-Only Context
- `docs/product/packing-app-spec.md`
- `docs/product/polish-plan.md`
- `docs/architecture/app-flows.md`
- `docs/contracts/actions-and-loaders.md`
- `lib/domain/measurements.ts`

## Must Not Edit
- `supabase/**`
- trip files
- session internals

## Known Failure Seams To Address
- The schema now allows `quantity` and `unit` to both be `null`, but template actions still treat them as required.
- `app/actions/templates.ts` still has `OPTIONAL_TEMPLATE_MEASUREMENTS_ENABLED = false`.
- `mapTemplateItemRecord` rejects rows with nullable measurements instead of loading them.
- `validateItemPayload` still rejects single-instance items such as passport.
- The template UI still contains too much explanatory chrome for the simple default-template-first workflow.

## Required Deliverables
- template loaders that can read measured and unmeasured items safely
- create, rename, delete, and set-default flows that work
- item add, update, and remove flows that work with optional measurements
- a reliable `/templates` entry that lands on the default template when it exists
- a simpler template sidebar and editor presentation with short, practical copy

## Fixed Decisions
- The default template is the main workspace.
- Creating another template is advanced mode.
- Single-instance items may omit both quantity and unit.

## Done When
- the default template opens and is editable
- existing templates can be edited without measurement regressions
- a new template can be created successfully
- template copy is shorter and more action-focused than the current version
