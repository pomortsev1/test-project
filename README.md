This is a Next.js App Router starter prepared for Vercel deployment with TypeScript, Supabase, shadcn/ui, and Lucide.

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

The app is intentionally safe to run without Supabase variables.

When you are ready to connect Supabase, create a `.env.local` file in the project root and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

If you prefer the older Supabase key name, the starter also accepts `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

After adding or changing environment variables, restart the dev server:

```bash
npm run dev
```

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
