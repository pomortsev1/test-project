# Prompt: Thread 10 Trip Creation Recovery

Use [`docs/threads/thread-10-trip-creation-recovery.md`](/Users/ivan.pomortsev/Projects/test-project/docs/threads/thread-10-trip-creation-recovery.md) as the task brief and follow the shared rules in [`docs/README.md`](/Users/ivan.pomortsev/Projects/test-project/docs/README.md).

You own only this write scope:
- `app/actions/trips.ts`
- `app/(app)/trips/**`
- `components/trips/**`

Before coding, read:
- [`docs/product/packing-app-spec.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/packing-app-spec.md)
- [`docs/product/polish-plan.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/polish-plan.md)
- [`docs/architecture/app-flows.md`](/Users/ivan.pomortsev/Projects/test-project/docs/architecture/app-flows.md)
- [`docs/contracts/actions-and-loaders.md`](/Users/ivan.pomortsev/Projects/test-project/docs/contracts/actions-and-loaders.md)
- template loader/action outputs as implemented by the template recovery thread

Implement:
- trip creation recovery
- safe snapshotting of template items with nullable measurements
- checklist rendering that follows the shared quantity-pair rules
- streamlined trip planner and trip screen copy

Explicitly verify and fix these seams:
- `components/trips/trips-data.ts` currently coerces nullable quantities with `toNumber(item.quantity)` during trip-item insert
- trip checklist UIs must suppress measurement text when both fields are null
- creating a trip from any available template must succeed

Guardrails:
- Do not edit `supabase/**`
- Do not edit template files
- Keep leg-scoped checklist behavior intact

When done, report:
- exact files changed
- checks run
- any coordinator follow-up required for integration or shared display helpers
