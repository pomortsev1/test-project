# Prompt: Thread 03 Templates + Catalog

Use [`docs/threads/thread-03-templates-catalog.md`](/Users/ivan.pomortsev/Projects/test-project/docs/threads/thread-03-templates-catalog.md) as the task brief and follow the shared rules in [`docs/README.md`](/Users/ivan.pomortsev/Projects/test-project/docs/README.md).

You own only this write scope:
- `app/actions/templates.ts`
- `app/(app)/templates/**`
- `components/templates/**`

Before coding, read:
- [`docs/product/packing-app-spec.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/packing-app-spec.md)
- [`docs/architecture/domain-model.md`](/Users/ivan.pomortsev/Projects/test-project/docs/architecture/domain-model.md)
- [`docs/architecture/app-flows.md`](/Users/ivan.pomortsev/Projects/test-project/docs/architecture/app-flows.md)
- [`docs/contracts/actions-and-loaders.md`](/Users/ivan.pomortsev/Projects/test-project/docs/contracts/actions-and-loaders.md)

Assume session and data foundations exist. Implement:
- template list/detail/editor UI
- create, rename, delete, and set-default actions
- template item add/update/remove flows
- autocomplete from system and user catalog
- free-typed custom item flow with category selection
- optional save-to-user-catalog support

Guardrails:
- Do not edit `supabase/**`
- Do not edit trip files
- Reuse shared domain types and action contracts

When done, report:
- exact files changed
- checks run
- any UI or data seams the trip thread should know about
