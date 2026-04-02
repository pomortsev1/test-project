# Integration Checklist

## Merge Order
1. Thread 01: Data + domain
2. Thread 02: Session + shell
3. Thread 03: Templates + catalog
4. Thread 04: Trips + active journey
5. Coordinator integration pass

## Integration Checks
- Shared enum values are unchanged.
- Cookie name remains `packing_app_user_id`.
- No thread edited outside its scope without documenting why.
- Template and trip actions use the same shared types.
- Session bootstrap works before any personalized data loader runs.
- First-time profile bootstrap creates a default user template.
- Trip creation snapshots template items.
- Starting a trip activates one leg only.
- Advancing a leg resets checklist state because it uses per-leg checks.
- `Go home now` preserves past completed history and skips future planned legs.

## Final QA
- Run `npm run lint`
- Run `npm run typecheck`
- Apply database changes with `npx supabase db push`
- Verify first visit flow
- Verify template editing flow
- Verify custom catalog suggestion flow
- Verify simple trip flow
- Verify multi-stop flow
- Verify `Start trip`
- Verify `Arrived`
- Verify `Go home now`

## Manual Command Notes
- The app may require a server restart after new environment variables, generated types, or major route/layout changes.
- If migrations or seed files are added, apply them with `npx supabase db push`.
- If shared TS types are generated later, document the exact command in the implementation thread.
