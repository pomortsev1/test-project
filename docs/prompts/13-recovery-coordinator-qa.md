# Prompt: Thread 13 Recovery Coordinator And QA

Use [`docs/threads/thread-13-recovery-coordinator-qa.md`](/Users/ivan.pomortsev/Projects/test-project/docs/threads/thread-13-recovery-coordinator-qa.md) as the task brief and follow the shared rules in [`docs/README.md`](/Users/ivan.pomortsev/Projects/test-project/docs/README.md).

You are the integration owner after threads 09 through 12 land.

Before coding, read:
- [`docs/product/packing-app-spec.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/packing-app-spec.md)
- [`docs/product/polish-plan.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/polish-plan.md)
- [`docs/architecture/app-flows.md`](/Users/ivan.pomortsev/Projects/test-project/docs/architecture/app-flows.md)
- [`docs/contracts/actions-and-loaders.md`](/Users/ivan.pomortsev/Projects/test-project/docs/contracts/actions-and-loaders.md)
- outputs from threads 09 through 12

Own:
- cross-thread seam fixes only
- final QA and acceptance validation
- doc touch-ups required by the merged result

Explicitly verify:
- default template can be opened and edited
- new templates can be created
- trips can be created from any template
- nullable measurement pairs survive template load, trip snapshot, and checklist render
- seeded counts are no longer demo-sized
- landing and dashboard no longer bury the workflow under long reads

Guardrails:
- Do not reopen already-correct areas just for stylistic churn
- Prefer the smallest integration fix that restores product consistency

When done, report:
- exact files changed
- checks run
- any manual QA that still must be performed in the browser
