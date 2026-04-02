# Packing App Agent Kit

This folder is the execution kit for building the packing checklist travel app with multiple agent threads.

## Recommended Run Order
1. Read `docs/product/packing-app-spec.md`.
2. Read `docs/architecture/domain-model.md`.
3. Run Thread 01 with `docs/prompts/01-data-domain.md`.
4. Run Thread 02 with `docs/prompts/02-session-shell.md`.
5. Run Thread 03 with `docs/prompts/03-templates-catalog.md`.
6. Run Thread 04 with `docs/prompts/04-trips-active-journey.md`.
7. Run the integration pass with `docs/prompts/05-coordinator-integration.md`.

## Polish Follow-Up Run Order
When continuing from the current foundation and implementing the new product-direction changes, use:
1. `docs/prompts/08-measurements-and-seed-expansion.md`
2. `docs/prompts/07-default-template-basic-mode.md`
3. `docs/prompts/06-ui-polish-first-run.md`
4. A final integration/QA pass using the existing coordinator prompt plus the new product spec

## Recovery Run Order
When fixing the current regressions and resetting the product back to the intended workflow, use:
1. `docs/prompts/11-starter-data-scale-and-curation.md`
2. `docs/prompts/09-template-recovery.md`
3. `docs/prompts/10-trip-creation-recovery.md`
4. `docs/prompts/12-ui-simplification.md`
5. `docs/prompts/13-recovery-coordinator-qa.md`

This order works both sequentially and in parallel. If you run in parallel, freeze the shared contracts first and do not let worker threads edit outside their write scopes.

## Shared Rules For Every Thread
- Read the product and architecture docs before changing code.
- Do not change another thread's write scope.
- Do not rename shared enums, table names, or action names without coordinator approval.
- Do not revert unrelated local changes in the repo.
- Prefer adding new files over editing shared files that another thread owns.
- Return a short summary with:
  - files changed
  - tests/checks run
  - open risks or assumptions

## Shared Source Of Truth
- Product behavior: `docs/product/packing-app-spec.md`
- Data model and invariants: `docs/architecture/domain-model.md`
- User journeys: `docs/architecture/app-flows.md`
- Server action and loader contracts: `docs/contracts/actions-and-loaders.md`
- Final acceptance and merge checklist: `docs/integration/checklist.md`

## Suggested Branch / Thread Naming
- `codex/packing-data-domain`
- `codex/packing-session-shell`
- `codex/packing-templates-catalog`
- `codex/packing-trips-journey`
- `codex/packing-integration`
- `codex/packing-measurements-seeds`
- `codex/packing-default-template-basic-mode`
- `codex/packing-ui-polish`
- `codex/packing-template-recovery`
- `codex/packing-trip-recovery`
- `codex/packing-data-scale`
- `codex/packing-ui-simplification`
- `codex/packing-recovery-qa`

## Suggested Merge Order
1. Data + domain
2. Session + shell
3. Templates + catalog
4. Trips + active journey
5. Coordinator integration and QA

## Recovery Merge Order
1. Starter data scale and curation
2. Template recovery
3. Trip creation recovery
4. UI simplification
5. Recovery coordinator and QA
