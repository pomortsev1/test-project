<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Completion Rules

When finishing implementation work in this repository:

- Tell the user whether they need to restart the app server.
- Tell the user whether they need to push database updates, run migrations, seed data, regenerate types, reinstall dependencies, or execute any other manual commands.
- If any follow-up action is required, provide the exact command to run.
- If no follow-up action is required, say that explicitly.
