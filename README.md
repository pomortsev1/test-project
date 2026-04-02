This is Packmap, a Next.js App Router packing app with Supabase-backed data, Google authentication, and browser-based anonymous mode.

## Stack

- Next.js
- TypeScript
- Supabase
- shadcn/ui
- Lucide React
- Tailwind CSS

## Local Development

1. Install dependencies if they are not already present:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## Supabase Environment Variables

Anonymous mode is intentionally safe to run without Supabase variables. Google sign-in requires Supabase to be configured.

When you are ready to connect Supabase, create a `.env.local` file in the project root and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

If you prefer the older Supabase key name, the starter also accepts `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Google Auth Setup

1. Make sure `supabase/config.toml` allows the callback URLs you use locally:

   - `http://localhost:3000/auth/callback`
   - `http://127.0.0.1:3000/auth/callback`

2. In Google Cloud Console, add the same callback URLs to your OAuth client.

3. If you use the local Supabase stack, export the Google client secret in the same shell before starting or restarting Supabase:

   ```bash
   export SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET=your-google-client-secret
   npx supabase start
   ```

After adding or changing environment variables, restart the dev server:

```bash
npm run dev
```

If you change `supabase/config.toml` while the local Supabase stack is running, restart that stack too:

```bash
npx supabase stop
npx supabase start
```

## Authentication Modes

- Anonymous mode uses the `packmap_user_id` cookie and stays available.
- Google mode uses the Supabase auth user ID for the active workspace.
- If someone starts anonymously and then signs in with Google, the anonymous profile is merged into the Google-backed profile during the auth callback.
- After that upgrade, signing out starts a fresh anonymous workspace instead of keeping a stale pre-merge cookie identity.

## Helpful Commands

```bash
npm run lint
npm run typecheck
npm run build
```

## Deploy on Vercel

Deploy with Vercel when you are ready:

- [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying)
- [Create a new Vercel project](https://vercel.com/new)
