# Prompt: Thread 05 Coordinator Integration

Use [`docs/threads/thread-05-coordinator-integration.md`](/Users/ivan.pomortsev/Projects/test-project/docs/threads/thread-05-coordinator-integration.md) as the task brief and follow the shared rules in [`docs/README.md`](/Users/ivan.pomortsev/Projects/test-project/docs/README.md).

Before coding, read:
- [`docs/product/packing-app-spec.md`](/Users/ivan.pomortsev/Projects/test-project/docs/product/packing-app-spec.md)
- [`docs/architecture/domain-model.md`](/Users/ivan.pomortsev/Projects/test-project/docs/architecture/domain-model.md)
- [`docs/architecture/app-flows.md`](/Users/ivan.pomortsev/Projects/test-project/docs/architecture/app-flows.md)
- [`docs/contracts/actions-and-loaders.md`](/Users/ivan.pomortsev/Projects/test-project/docs/contracts/actions-and-loaders.md)
- [`docs/integration/checklist.md`](/Users/ivan.pomortsev/Projects/test-project/docs/integration/checklist.md)

Integrate the thread outputs into a coherent app:
- resolve action/type mismatches
- connect dashboard shell, templates, and trips cleanly
- remove placeholders that are no longer needed
- run lint and typecheck
- document required manual commands, migration steps, and whether the app server must restart

Guardrails:
- prefer minimal edits
- do not rewrite working subsystems without cause
- preserve thread ownership unless integration requires a small fix

When done, report:
- exact files changed
- checks run
- remaining risks
- exact follow-up commands for the user
