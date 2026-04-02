# Prompt: Thread 07 Default Template As Basic Mode

Use [`docs/threads/thread-07-default-template-basic-mode.md`](/Users/ivan.pomortsev/Projects/test-project/docs/threads/thread-07-default-template-basic-mode.md) as the task brief and follow the shared rules in [`docs/README.md`](/Users/ivan.pomortsev/Projects/test-project/docs/README.md).

You own only this write scope:
- `app/actions/templates.ts`
- `app/(app)/templates/**`
- `components/templates/**`

Before coding, read:
- [`docs/product/packing-app-spec.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/packing-app-spec.md)
- [`docs/product/polish-plan.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/polish-plan.md)
- [`docs/architecture/app-flows.md`](/Users/ivan.pomortsev/Projects/test-project/docs/architecture/app-flows.md)
- [`docs/contracts/actions-and-loaders.md`](/Users/ivan.pomortsev/Projects/test-project/docs/contracts/actions-and-loaders.md)

Assume session and data foundations exist. Implement:
- a default-template-first templates experience
- copy and layout changes that make the existing template the basic path
- advanced placement for “create another template”
- optional-measurement support in template forms if the data contracts already allow it

Guardrails:
- Do not edit `supabase/**`
- Do not edit trip files
- Reuse action contracts and shared types where possible

When done, report:
- exact files changed
- checks run
- any follow-up required from the measurements or UI polish threads
