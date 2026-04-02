import type { ReactNode } from "react";

import { getTemplatesForCurrentUser } from "@/app/actions/templates";
import { TemplateSidebar } from "@/components/templates/template-sidebar";
import { requireCurrentUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function TemplatesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  await requireCurrentUserId("/templates");
  const templatesState = await getTemplatesForCurrentUser();
  const canMutate = templatesState.hasSession && templatesState.isConfigured;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,250,240,0.96),rgba(248,250,252,0.94),rgba(226,232,240,0.82))]">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Packing app
          </p>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Build reusable packing templates with catalog-backed item ideas.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              Keep a few sharp starting points ready for weekend trips, long
              flights, work travel, or anything else that repeats often.
            </p>
          </div>
        </section>

        {templatesState.issue ? (
          <div className="rounded-2xl border border-amber-300/60 bg-amber-50/85 px-4 py-3 text-sm leading-6 text-amber-950">
            {templatesState.issue}
          </div>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside>
            <TemplateSidebar
              templates={templatesState.templates}
              canMutate={canMutate}
            />
          </aside>
          <div>{children}</div>
        </section>
      </main>
    </div>
  );
}
