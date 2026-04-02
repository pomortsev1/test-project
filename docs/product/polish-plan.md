# Recovery Plan

## Why This Exists
Recent changes created functional regressions and reinforced the wrong product shape.

Current failures:
- creating a new template does not reliably work
- editing existing templates does not reliably work
- the default template is not reliably viewable or editable
- creating a trip from templates does not reliably work
- the seeded system catalog is far too small for the intended product
- the UI still contains too many explanatory panels and too much text

## Recovery Outcomes
- The default template is always accessible and editable.
- Creating a new template works.
- Creating a trip from the default template or any other template works.
- Optional measurements work end to end for templates, trips, and checklist rendering.
- The seeded catalog reaches useful product scale instead of demo scale.
- Core screens become simple, fast to scan, and action-first.

## Workstreams

### 1. Template Recovery
Scope:
- template loaders
- template mutations
- default-template-first routing
- template editor and sidebar copy

Required fixes:
- align template action contracts with optional measurement support
- stop dropping seeded items that have `quantity = null` and `unit = null`
- make the default template the normal landing view for `/templates`
- keep extra template creation secondary

Done when:
- the default template opens
- existing templates can be edited
- new templates can be created

### 2. Trip Creation Recovery
Scope:
- trip planner
- trip creation mutation path
- trip checklist rendering

Required fixes:
- create trips from any accessible template
- snapshot template items without corrupting null measurement pairs
- keep route creation simple and reliable
- make default-template-first trip planning obvious

Done when:
- a trip can be created from the default template
- a trip can be created from a non-default template
- trips built from measurement-free items do not fail

### 3. Data Scale And Starter Quality
Scope:
- system categories
- system catalog items
- starter template blueprint
- data contracts and generated types

Required fixes:
- expand the seeded system catalog toward roughly `1000-2000` useful items
- keep the starter template curated rather than huge
- preserve optional-measurement support in the seed path

Done when:
- the database feels like a real suggestion engine instead of a demo
- the starter template feels useful without being bloated

### 4. UI Simplification
Scope:
- landing page
- dashboard
- template presentation
- trip presentation
- shared visual language

Required fixes:
- remove instructional clutter
- remove low-value summary panels and badge noise
- reduce copy length across the app
- make the main actions obvious on each screen

Done when:
- a user can understand the workflow in seconds
- the screens feel like a product, not a walkthrough

## Suggested Delivery Order
1. Data contracts and seed path
2. Template recovery
3. Trip creation recovery
4. UI simplification
5. Coordinator integration and QA

## Risks To Watch
- The schema already supports optional measurements, but template and trip code still contain required-measurement assumptions.
- Any trip creation logic that coerces null quantity values will break inserts against the newer database rules.
- Catalog expansion must improve usefulness without flooding the starter template.
- UI cleanup must remove clutter without hiding the core workflow.
