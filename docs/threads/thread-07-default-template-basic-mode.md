# Thread 07: Default Template As Basic Mode

## Goal
Make the auto-created default template the normal starting point and move extra template creation into advanced mode.

## Write Scope
- `app/actions/templates.ts`
- `app/(app)/templates/**`
- `components/templates/**`

## Read-Only Context
- `docs/product/packing-app-spec.md`
- `docs/product/polish-plan.md`
- `docs/architecture/app-flows.md`
- `docs/contracts/actions-and-loaders.md`
- any schema/types updates from the measurements thread if they already exist

## Must Not Edit
- `supabase/**`
- trip files
- session internals

## Required Deliverables
- first-use template flow that starts from the existing default template
- template sidebar and editor copy that frame the default template as the main workspace
- “create another template” moved behind a secondary or advanced affordance
- less cluttered template overview and empty states
- compatibility with optional item measurements if the data thread has landed

## Fixed Decisions
- Every profile should start with a usable default template.
- The user should not need to create a template before they can use the app.
- Creating additional templates is advanced mode, not the main CTA.

## Suggested Implementation Notes
- Keep the default template easy to recognize.
- Reduce the amount of setup language on template screens.
- If older docs conflict, follow the product spec as the newest source of truth.

## Done When
- A user can open the templates area and immediately edit the default template.
- Advanced template creation no longer competes with the main path.
