# Prompt: Thread 12 UI Simplification

Use [`docs/threads/thread-12-ui-simplification.md`](/Users/ivan.pomortsev/Projects/test-project/docs/threads/thread-12-ui-simplification.md) as the task brief and follow the shared rules in [`docs/README.md`](/Users/ivan.pomortsev/Projects/test-project/docs/README.md).

You own only this write scope:
- `app/page.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `components/app-shell/**`

Before coding, read:
- [`docs/product/packing-app-spec.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/packing-app-spec.md)
- [`docs/product/polish-plan.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/polish-plan.md)
- [`docs/architecture/app-flows.md`](/Users/ivan.pomortsev/Projects/test-project/docs/architecture/app-flows.md)

Implement:
- landing and dashboard simplification
- shorter copy
- fewer low-value panels and badges
- stronger visual emphasis on the next action

Explicitly verify and fix these seams:
- the landing page currently stacks multiple explanatory blocks about entry choices and what happens next
- the dashboard currently over-explains the workflow with extra steps, helper panels, and summaries
- the result should feel like a focused packing tool, not a guided tour

Guardrails:
- Do not edit `supabase/**`
- Do not edit template or trip business logic
- Do not reintroduce generic admin/SaaS styling

When done, report:
- exact files changed
- checks run
- any remaining copy/layout seams that template or trip threads should handle inside their own scopes
