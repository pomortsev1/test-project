# Prompt: Thread 06 UI Polish + First-Run Clarity

Use [`docs/threads/thread-06-ui-polish-first-run.md`](/Users/ivan.pomortsev/Projects/test-project/docs/threads/thread-06-ui-polish-first-run.md) as the task brief and follow the shared rules in [`docs/README.md`](/Users/ivan.pomortsev/Projects/test-project/docs/README.md).

You own only this write scope:
- `app/page.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `components/app-shell/**`
- shared UI files only if truly needed

Before coding, read:
- [`docs/product/packing-app-spec.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/packing-app-spec.md)
- [`docs/product/polish-plan.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/polish-plan.md)
- [`docs/architecture/app-flows.md`](/Users/ivan.pomortsev/Projects/test-project/docs/architecture/app-flows.md)

Assume data and template foundations exist. Implement:
- a more intentional visual direction for first-run and dashboard screens
- clearer hierarchy and “what do I do next?” guidance
- copy that focuses on the product instead of infrastructure
- empty states that point toward the default-template-first flow

Guardrails:
- Do not edit `supabase/**`
- Do not edit template or trip mutation logic
- Do not introduce a generic SaaS/admin visual language

When done, report:
- exact files changed
- checks run
- any remaining UX seams that should be handled by template or integration threads
