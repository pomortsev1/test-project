# Prompt: Thread 08 Flexible Measurements + Seed Expansion

Use [`docs/threads/thread-08-measurements-and-seed-expansion.md`](/Users/ivan.pomortsev/Projects/test-project/docs/threads/thread-08-measurements-and-seed-expansion.md) as the task brief and follow the shared rules in [`docs/README.md`](/Users/ivan.pomortsev/Projects/test-project/docs/README.md).

You own only this write scope:
- `supabase/**`
- `lib/domain/**`
- `lib/data/**`
- `lib/supabase/database.types.ts`
- `docs/architecture/**`
- `docs/contracts/**`

Before coding, read:
- [`docs/product/packing-app-spec.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/packing-app-spec.md)
- [`docs/product/polish-plan.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/polish-plan.md)
- template and trip actions/components for compatibility awareness only

Implement:
- data-model support for optional quantity and unit on snapshot items
- richer system seed catalog data
- a more useful starter template blueprint
- shared type and doc updates so downstream UI threads can consume the new contract safely

Guardrails:
- Do not edit landing, dashboard, or template/trip presentation files
- Keep the migration and seed path compatible with `npx supabase`
- Prefer additive, explicit schema changes over hidden behavior

When done, report:
- exact files changed
- checks run
- any contract changes the template or trip threads must adopt
