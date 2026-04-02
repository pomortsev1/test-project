# Prompt: Thread 02 Anonymous Session + App Shell

Use [`docs/threads/thread-02-session-shell.md`](/Users/ivan.pomortsev/Projects/test-project/docs/threads/thread-02-session-shell.md) as the task brief and follow the shared rules in [`docs/README.md`](/Users/ivan.pomortsev/Projects/test-project/docs/README.md).

You own only this write scope:
- `app/layout.tsx`
- `app/page.tsx`
- `app/(app)/**`
- `app/api/**`
- `components/app-shell/**`
- `lib/session/**`

Before coding, read:
- [`docs/product/packing-app-spec.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/packing-app-spec.md)
- [`docs/architecture/domain-model.md`](/Users/ivan.pomortsev/Projects/test-project/docs/architecture/domain-model.md)
- [`docs/architecture/app-flows.md`](/Users/ivan.pomortsev/Projects/test-project/docs/architecture/app-flows.md)
- [`docs/contracts/actions-and-loaders.md`](/Users/ivan.pomortsev/Projects/test-project/docs/contracts/actions-and-loaders.md)

Assume Thread 01 either already landed or is available in your branch. Implement:
- UUID cookie bootstrap using `packmap_user_id`
- profile bootstrap for first visit
- dashboard shell replacing the starter landing page
- metadata/title update
- composition points for templates and trips

Guardrails:
- Do not edit `supabase/**`
- Do not implement template/trip business logic beyond placeholders or shell wiring
- Keep cookie writes in Route Handlers or Server Actions only

When done, report:
- exact files changed
- checks run
- whether the app server likely needs restart after your changes
