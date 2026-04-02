import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Luggage,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Route,
} from "lucide-react";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBootstrapPath } from "@/lib/session";

type HomeLandingProps = {
  authErrorValue: string | null;
  isSupabaseConfigured: boolean;
  nextPath: string;
};

const onboardingSteps = [
  {
    icon: MapPinned,
    title: "Set the route",
    description: "We open the trip builder immediately, so you can add where you are going first.",
  },
  {
    icon: Luggage,
    title: "Get the checklist",
    description: "Your essentials are ready when the trip is created, and the first leg starts right away.",
  },
  {
    icon: ShieldCheck,
    title: "Keep it anywhere",
    description: "Start as a guest now, then connect Google later if you want the same trip on another device.",
  },
] as const;

const previewItems = [
  { name: "Passport", packed: true },
  { name: "Phone charger", packed: true },
  { name: "Socks", packed: false },
  { name: "Toothbrush", packed: false },
] as const;

export function HomeLanding({
  authErrorValue,
  isSupabaseConfigured,
  nextPath,
}: HomeLandingProps) {
  return (
    <main className="packing-stage min-h-screen px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.32),transparent_58%)]" />
      <div className="pointer-events-none absolute left-[5%] top-24 -z-10 size-44 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.2),transparent_68%)] blur-3xl packing-float" />
      <div className="pointer-events-none absolute right-[8%] top-32 -z-10 size-64 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.18),transparent_72%)] blur-3xl packing-float-delayed" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center gap-6">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_380px] xl:items-stretch">
          <Card className="packing-panel-strong border-0 packing-reveal">
            <CardHeader className="gap-6">
              <div className="flex flex-wrap items-center gap-2 text-slate-50">
                <Badge className="gap-1.5 border-white/15 bg-white/10 text-white">
                  <Sparkles className="size-3.5" />
                  Packmap
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/15 bg-white/10 text-slate-100"
                >
                  Trip-first packing
                </Badge>
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] lg:items-end">
                <div className="space-y-5">
                  <div className="space-y-4">
                    <h1 className="max-w-4xl font-heading text-5xl leading-none text-balance sm:text-6xl">
                      Start a trip.
                      <br />
                      Pack only what this leg needs.
                    </h1>
                    <p className="max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                      Jump straight into the trip builder, set your route, and get a live
                      checklist instead of a lecture about internal setup.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm text-slate-100">
                    <div className="rounded-full border border-white/15 bg-white/10 px-3 py-2">
                      No account required
                    </div>
                    <div className="rounded-full border border-white/15 bg-white/10 px-3 py-2">
                      Opens the trip builder
                    </div>
                    <div className="rounded-full border border-white/15 bg-white/10 px-3 py-2">
                      Google stays optional
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.7rem] border border-white/14 bg-white/10 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.16)] backdrop-blur">
                  <div className="rounded-[1.35rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,250,252,0.9))] p-4 text-slate-900">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                          Preview
                        </p>
                        <p className="mt-2 text-xl font-semibold">Lisbon weekend</p>
                        <p className="mt-1 text-sm text-slate-500">
                          Current leg: Home to Lisbon
                        </p>
                      </div>
                      <Badge className="bg-emerald-600 text-white">Live</Badge>
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Route className="size-4 text-sky-700" />
                        Route
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                        <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs text-white">
                          Home
                        </span>
                        <div className="h-px flex-1 bg-slate-300" />
                        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs text-sky-900">
                          Lisbon
                        </span>
                        <div className="h-px flex-1 bg-slate-300" />
                        <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs text-slate-700">
                          Home
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-slate-700">Checklist</p>
                        <p className="text-sm text-slate-500">2 of 4 packed</p>
                      </div>
                      <div className="mt-3 space-y-2">
                        {previewItems.map((item) => (
                          <div
                            key={item.name}
                            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-2.5"
                          >
                            <span className="text-sm font-medium text-slate-700">
                              {item.name}
                            </span>
                            {item.packed ? (
                              <CheckCircle2 className="size-4 text-emerald-600" />
                            ) : (
                              <Circle className="size-4 text-slate-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-6">
            <Card className="packing-panel border-0 packing-reveal packing-reveal-delay">
              <CardHeader className="gap-4">
                <Badge variant="outline" className="w-fit gap-1.5 border-sky-200 bg-sky-50/80">
                  <ArrowRight className="size-3.5" />
                  Start in under a minute
                </Badge>
                <div className="space-y-2">
                  <CardTitle className="text-3xl">Open the trip builder now</CardTitle>
                  <CardDescription className="text-base leading-7 text-slate-600">
                    One click opens the route planner immediately. No account wall, no
                    template jargon first.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {authErrorValue ? (
                  <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-6 text-destructive">
                    {decodeURIComponent(authErrorValue)}
                  </div>
                ) : null}

                <Button
                  nativeButton={false}
                  className="h-[3.25rem] w-full rounded-2xl bg-slate-950 text-base text-white shadow-[0_18px_34px_rgba(15,23,42,0.18)] hover:bg-slate-800"
                  render={<a href={getBootstrapPath(nextPath)} />}
                >
                  Start a trip now
                  <ArrowRight className="size-4" />
                </Button>

                <p className="text-sm leading-6 text-slate-600">
                  You will land in the trip builder right away and can connect Google later
                  if you want the same trip on another device.
                </p>

                <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4">
                  <p className="text-sm font-medium text-slate-900">Prefer to keep it synced?</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Start with Google and we will bring you to the same place.
                  </p>
                  <GoogleSignInButton
                    nextPath={nextPath}
                    variant="outline"
                    className="mt-3 h-12 w-full rounded-2xl border-slate-300 bg-white/88"
                    disabled={!isSupabaseConfigured}
                    label="Start with Google"
                  />
                </div>

                {!isSupabaseConfigured ? (
                  <div className="rounded-2xl border border-amber-300/60 bg-amber-50/[0.85] px-4 py-3 text-sm leading-6 text-amber-950">
                    Google sign-in is not ready in this environment yet, but guest mode still
                    opens the full trip flow.
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {onboardingSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Card
                key={step.title}
                className={`packing-panel-soft border-0 packing-reveal ${
                  index === 0
                    ? "packing-reveal-delay-2"
                    : index === 1
                      ? "packing-reveal-delay-3"
                      : "packing-reveal-delay-4"
                }`}
              >
                <CardHeader className="gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Step {index + 1}
                      </p>
                      <CardTitle className="mt-1 text-xl">{step.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-sm leading-6 text-slate-600">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}
