# UI Polish And Product Clarification Plan

## Why This Exists
The current app has the right foundations, but the experience still feels closer to an in-progress framework shell than a polished packing product.

The most visible problems today are:
- first-run screens talk too much about sessions, Supabase, and infrastructure
- the user is not guided clearly toward the main workflow
- template creation is presented too early even though a default template already exists in the product model
- mandatory quantity and unit fields make obvious items like passport feel unnatural
- the seeded data is too thin to make the starter template feel genuinely helpful

## Outcomes We Want
- A first-time user understands what the app does and what to click next within a few seconds.
- The default template feels like the normal starting point, not a fallback.
- Creating extra templates feels available but clearly advanced.
- Item entry supports both measured items and common-sense single items.
- Starter content feels useful enough that the app is believable on first load.

## Workstreams

### 1. First-Run UX And Visual Cleanup
Scope:
- landing page
- dashboard shell
- shared visual language
- empty states and helper copy

Changes:
- remove generic or infrastructure-first copy
- replace “session status” style panels with product guidance
- tighten typography, spacing, and hierarchy
- add a clear “start here” path tied to the default template and trip planning
- remove obvious leftover Next.js starter or generic shadcn-looking artifacts where they are still visible

Done when:
- the main job of the app is understandable at a glance
- the dashboard explains what to do next without teaching implementation details

### 2. Make The Default Template The Basic Mode
Scope:
- templates navigation
- templates overview and detail pages
- template editor copy and calls to action

Changes:
- treat the auto-created default template as the primary workspace
- route first-time users toward editing the default template instead of creating one
- push “create another template” behind an advanced affordance or secondary action
- make the default template feel special and trustworthy, not just one record in a list

Done when:
- a user can start customizing their packing list without creating anything first
- advanced template creation no longer competes with the main flow

### 3. Flexible Item Measurements
Scope:
- Supabase schema
- seed data
- types and validation
- template and trip item rendering

Changes:
- allow template items and trip items to omit both quantity and unit
- keep support for numeric quantity plus unit where it makes sense
- render items cleanly whether measurement exists or not
- update validation and actions so “Passport” is valid without forcing fake values

Done when:
- both `Passport` and `3 pairs socks` are first-class item formats
- there are no awkward empty labels or display regressions

### 4. Richer Starter Data
Scope:
- system catalog seed data
- starter template blueprint

Changes:
- add more realistic travel items across documents, tech, clothes, toiletries, health, and misc
- make the starter template broad enough to feel helpful immediately
- keep the default template editable rather than over-engineered

Done when:
- the seeded default template feels like a real starter packing list
- the suggestion list looks like product content rather than demo content

## Suggested Delivery Order
1. Update the data model and seeds for optional measurements.
2. Adjust template flows so default-template-first behavior matches the product direction.
3. Polish the landing page, dashboard, and explanatory copy.
4. Run an integration QA pass across templates, trips, and seeded first-run behavior.

## Risks To Watch
- Nullable quantity and unit values will ripple through actions, types, and checklist rendering.
- Moving “create template” into advanced mode may require copy, navigation, and empty-state changes in multiple places.
- A richer starter template should feel useful without becoming cluttered or too opinionated.
