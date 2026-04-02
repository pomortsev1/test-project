# Prompt: Thread 11 Starter Data Scale And Curation

Use [`docs/threads/thread-11-starter-data-scale-and-curation.md`](/Users/ivan.pomortsev/Projects/test-project/docs/threads/thread-11-starter-data-scale-and-curation.md) as the task brief and follow the shared rules in [`docs/README.md`](/Users/ivan.pomortsev/Projects/test-project/docs/README.md).

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
- template and trip UI/action files for compatibility checking only

Implement:
- system catalog expansion toward roughly `1000-2000` practical items
- starter template blueprint curation
- shared data-contract and generated-type updates required by the final seed shape

Explicitly verify and fix these seams:
- current seed volume is only `34` system catalog items
- current starter template blueprint is only `25` items
- optional-measurement rules must remain valid in seeds, types, and docs

Guardrails:
- Do not edit landing, dashboard, or template/trip presentation files
- Keep the migration and seed path compatible with `npx supabase`
- Prefer explicit, maintainable seed structure over huge opaque SQL blobs

When done, report:
- exact files changed
- checks run
- exact new seeded counts
- any template/trip follow-up required because of contract or content changes
