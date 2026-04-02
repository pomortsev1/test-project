import Link from "next/link";
import {
  ArrowRight,
  CircleCheck,
  CloudCheck,
  Database,
  LayoutTemplate,
  Palette,
  TriangleAlert,
  WandSparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSupabaseEnv, getSupabaseMissingEnvNames } from "@/lib/supabase/env";

export default function Home() {
  const { isConfigured } = getSupabaseEnv();
  const missingEnvNames = getSupabaseMissingEnvNames();

  const foundationCards = [
    {
      title: "App Router and Vercel ready",
      description:
        "Bootstrapped with the latest Next.js App Router stack so the project can stay aligned with Vercel hosting from day one.",
      icon: LayoutTemplate,
    },
    {
      title: "UI system in place",
      description:
        "shadcn/ui is initialized, Lucide is available for icons, and Tailwind is already wired for fast iteration.",
      icon: Palette,
    },
    {
      title: "Supabase without hard failure",
      description:
        "Supabase helpers are present, but they safely return null until you decide to add your environment variables.",
      icon: Database,
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(241,245,249,0.92),rgba(226,232,240,0.78))]">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
          <Card className="border border-border/70 bg-card/85 shadow-sm backdrop-blur">
            <CardHeader className="gap-4">
              <Badge variant="outline" className="w-fit gap-1.5">
                <WandSparkles className="size-3.5" />
                Foundation ready
              </Badge>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                  A clean Next.js starting point for the app we&apos;ll shape
                  together next.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  The project now uses the App Router, TypeScript, Supabase,
                  shadcn/ui, and Lucide. It is safe to run immediately, even
                  before you add database environment variables.
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Next.js App Router</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Supabase</Badge>
                <Badge variant="secondary">shadcn/ui</Badge>
                <Badge variant="secondary">Lucide</Badge>
                <Badge variant="secondary">Vercel-ready</Badge>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="https://nextjs.org/docs/app/getting-started/installation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  Read the Next.js docs
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted"
                >
                  Review Supabase setup
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/92 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isConfigured ? (
                  <CircleCheck className="size-5 text-emerald-600" />
                ) : (
                  <TriangleAlert className="size-5 text-amber-600" />
                )}
                Current project status
              </CardTitle>
              <CardDescription>
                The app can boot now. Supabase configuration stays optional
                until you are ready to connect it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border/70 bg-background/80 p-4">
                <div className="flex items-center gap-3">
                  <CloudCheck className="size-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Local dev environment</p>
                    <p className="text-sm text-muted-foreground">
                      Ready to run with `npm run dev`.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/80 p-4">
                <div className="flex items-center gap-3">
                  <Database className="size-5 text-sky-700" />
                  <div>
                    <p className="font-medium">Supabase configuration</p>
                    <p className="text-sm text-muted-foreground">
                      {isConfigured
                        ? "Environment variables detected."
                        : "No database environment variables yet, which is fine for now."}
                    </p>
                  </div>
                </div>
                {!isConfigured ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Missing: {missingEnvNames.join(", ")}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {foundationCards.map(({ title, description, icon: Icon }) => (
            <Card
              key={title}
              className="border border-border/70 bg-card/88 shadow-sm"
            >
              <CardHeader className="gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Icon className="size-5" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
