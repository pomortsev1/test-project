# Thread 13: Recovery Coordinator And QA

## Goal
Merge the recovery work into a coherent product, fix cross-thread seams, and verify that the app now matches the intended default-template-first workflow.

## Write Scope
- coordinator-owned follow-up edits across the repo only as needed for integration
- `docs/**`

## Read-Only Context
- `docs/product/packing-app-spec.md`
- `docs/product/polish-plan.md`
- `docs/architecture/**`
- `docs/contracts/**`
- outputs from threads 09 through 12

## Must Not Edit
- large feature redesigns that belong in worker threads
- unrelated local changes

## Required Deliverables
- integration fixes for cross-thread seams
- final product-direction consistency pass
- updated QA notes if any acceptance criteria changed while fixing regressions

## Mandatory QA
- verify default template accessibility
- verify template CRUD
- verify trip creation from default template
- verify trip creation from non-default template
- verify optional-measurement items through template, trip, and checklist flows
- verify the catalog and starter template feel materially richer
- verify landing and dashboard simplicity

## Done When
- the reported regressions are fixed
- the core workflow is simple and coherent
- there are no remaining contract mismatches between data, templates, trips, and UI
