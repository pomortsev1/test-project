# Thread 12: UI Simplification

## Goal
Strip the product back to a simple, readable workflow with far less copy, fewer decorative panels, and clearer primary actions.

## Write Scope
- `app/page.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `components/app-shell/**`

## Read-Only Context
- `docs/product/packing-app-spec.md`
- `docs/product/polish-plan.md`
- `docs/architecture/app-flows.md`
- the current template and trip screens for visual consistency only

## Must Not Edit
- `supabase/**`
- template mutation logic
- trip mutation logic

## Known Failure Seams To Address
- Landing and dashboard still contain too many text blocks and helper panels.
- The current UI still reads like a walkthrough instead of a simple product.
- Visual hierarchy is diluted by too many badges, summaries, and explanation cards.

## Required Deliverables
- a simpler landing page
- a simpler dashboard shell
- shorter instructions and fewer helper blocks
- stronger emphasis on the main next action

## Fixed Decisions
- Keep the copy short.
- Keep the workflow obvious.
- Prefer fewer UI blocks with more signal.

## Done When
- the product can be understood in seconds
- the dashboard feels direct rather than instructional
- the global visual language supports the simple workflow instead of fighting it
