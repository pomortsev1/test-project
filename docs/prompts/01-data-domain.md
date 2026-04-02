# Prompt: Thread 01 Data + Domain

Use [`docs/threads/thread-01-data-domain.md`](/Users/ivan.pomortsev/Projects/test-project/docs/threads/thread-01-data-domain.md) as the task brief and follow the shared rules in [`docs/README.md`](/Users/ivan.pomortsev/Projects/test-project/docs/README.md).

You own only this write scope:
- `supabase/**`
- `lib/domain/**`
- `lib/data/**`
- `lib/supabase/**` when required for typed access

Before coding, read:
- [`docs/product/packing-app-spec.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/packing-app-spec.md)
- [`docs/architecture/domain-model.md`](/Users/ivan.pomortsev/Projects/test-project/docs/architecture/domain-model.md)
- [`docs/contracts/actions-and-loaders.md`](/Users/ivan.pomortsev/Projects/test-project/docs/contracts/actions-and-loaders.md)

Implement the full data/domain foundation for the packing checklist app:
- Supabase migrations for the tables, enums/checks, constraints, and seed strategy in the docs
- seed data for system categories, starter catalog items, and starter template
- shared TypeScript domain types and low-level data helpers used by later threads

Guardrails:
- Do not edit `app/**` or `components/**`
- Do not invent different enum names or cookie names
- Optimize for later threads to consume stable types and helper functions

When done, report:
- exact files changed
- whether `npx supabase db push`, `npm run lint`, and `npm run typecheck` were run
- any assumptions or edge cases left for integration
