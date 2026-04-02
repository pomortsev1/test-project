# Prompt: Thread 09 Template Recovery

Use [`docs/threads/thread-09-template-recovery.md`](/Users/ivan.pomortsev/Projects/test-project/docs/threads/thread-09-template-recovery.md) as the task brief and follow the shared rules in [`docs/README.md`](/Users/ivan.pomortsev/Projects/test-project/docs/README.md).

You own only this write scope:
- `app/actions/templates.ts`
- `app/(app)/templates/**`
- `components/templates/**`

Before coding, read:
- [`docs/product/packing-app-spec.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/packing-app-spec.md)
- [`docs/product/polish-plan.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/polish-plan.md)
- [`docs/architecture/app-flows.md`](/Users/ivan.pomortsev/Projects/test-project/docs/architecture/app-flows.md)
- [`docs/contracts/actions-and-loaders.md`](/Users/ivan.pomortsev/Projects/test-project/docs/contracts/actions-and-loaders.md)
- [`lib/domain/measurements.ts`](/Users/ivan.pomortsev/Projects/test-project/lib/domain/measurements.ts)

Implement:
- template loader and mutation recovery for optional measurement pairs
- reliable default-template-first behavior
- working template CRUD
- simpler template copy and layout that stop burying the main action

Explicitly verify and fix these seams:
- `OPTIONAL_TEMPLATE_MEASUREMENTS_ENABLED` is stale
- nullable template item measurements are currently rejected by the mapper and types
- add/update item validation still assumes quantity and unit are mandatory
- default template access must not fail after the seed changes landed

Guardrails:
- Do not edit `supabase/**`
- Do not edit trip files
- Reuse the shared quantity-pair contract from the docs instead of inventing a new one

When done, report:
- exact files changed
- checks run
- any trip-thread follow-up required because template output contracts changed
