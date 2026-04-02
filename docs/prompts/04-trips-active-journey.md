# Prompt: Thread 04 Trips + Active Journey

Use [`docs/threads/thread-04-trips-active-journey.md`](/Users/ivan.pomortsev/Projects/test-project/docs/threads/thread-04-trips-active-journey.md) as the task brief and follow the shared rules in [`docs/README.md`](/Users/ivan.pomortsev/Projects/test-project/docs/README.md).

You own only this write scope:
- `app/actions/trips.ts`
- `app/(app)/trips/**`
- `components/trips/**`

Before coding, read:
- [`docs/product/packing-app-spec.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/packing-app-spec.md)
- [`docs/architecture/domain-model.md`](/Users/ivan.pomortsev/Projects/test-project/docs/architecture/domain-model.md)
- [`docs/architecture/app-flows.md`](/Users/ivan.pomortsev/Projects/test-project/docs/architecture/app-flows.md)
- [`docs/contracts/actions-and-loaders.md`](/Users/ivan.pomortsev/Projects/test-project/docs/contracts/actions-and-loaders.md)

Assume data, session, and template foundations exist. Implement:
- trip planner for simple and multi-stop modes
- create trip by snapshotting template items
- trip list/detail UI
- start trip
- per-leg checklist toggle flow
- arrive flow
- go-home-now flow

Guardrails:
- Do not edit `supabase/**`
- Do not edit template files
- Keep checklist state scoped to legs

When done, report:
- exact files changed
- checks run
- any integration seams the coordinator should verify
