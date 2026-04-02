# Thread 06: UI Polish + First-Run Clarity

## Goal
Make the app feel like a polished packing product instead of a framework shell, and make the first-use path obvious.

## Write Scope
- `app/page.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `components/app-shell/**`
- shared UI files only if needed for this thread

## Read-Only Context
- `docs/product/packing-app-spec.md`
- `docs/product/polish-plan.md`
- `docs/architecture/app-flows.md`
- dashboard and template flows from earlier threads

## Must Not Edit
- `supabase/**`
- template or trip server actions
- template editor business logic
- trip mutation logic

## Required Deliverables
- clearer first-run hero and dashboard messaging
- stronger product-specific visual direction
- removal of visible Next.js starter or infrastructure-heavy artifacts
- obvious “start here” guidance that points to the default template and trip flow
- better empty states and explanatory copy

## Fixed Decisions
- The UI should explain itself quickly.
- Basic mode centers on using the existing default template.
- Infrastructure details should not dominate visible copy.

## Suggested Implementation Notes
- Prefer one strong primary action per screen.
- Reduce badges and panels that describe implementation details instead of user value.
- Keep the tone practical and travel-oriented.

## Done When
- A first-time user can tell what this app is for within a few seconds.
- The dashboard points toward the next action without needing a walkthrough.
