import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { DashboardData } from "@/lib/domain/types";
import type { SessionIdentity } from "@/lib/session";

const { getCurrentSessionIdentity, getDashboardData, getSupabaseEnv } = vi.hoisted(() => ({
  getCurrentSessionIdentity: vi.fn(),
  getDashboardData: vi.fn(),
  getSupabaseEnv: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => createElement("a", { ...props, href }, children),
}));

vi.mock("@/lib/session", async () => {
  const actual = await vi.importActual<typeof import("@/lib/session")>("@/lib/session");

  return {
    ...actual,
    getCurrentSessionIdentity,
  };
});

vi.mock("@/lib/data/dashboard", () => ({
  getDashboardData,
}));

vi.mock("@/lib/supabase/env", () => ({
  getSupabaseEnv,
}));

vi.mock("@/components/auth/session-debug-logger", () => ({
  SessionDebugLogger: () => null,
}));

vi.mock("@/components/auth/google-sign-in-button", () => ({
  GoogleSignInButton: () => createElement("button", { type: "button" }, "Google sign-in"),
}));

vi.mock("@/components/app-shell/app-shell-nav", () => ({
  AppShellNav: () => createElement("nav", null, "Navigation"),
}));

vi.mock("@/components/trips/active-trip-panel", () => ({
  ActiveTripPanel: () => createElement("section", null, "Active trip panel"),
}));

vi.mock("@/components/trips/trips-overview", () => ({
  TripsOverview: () => createElement("section", null, "Trips overview"),
}));

vi.mock("@/components/templates/templates-overview", () => ({
  TemplatesOverview: () => createElement("section", null, "Templates overview"),
}));

import AppLayout from "@/app/(app)/layout";
import DashboardPage from "@/app/(app)/dashboard/page";

function createDashboardData(): DashboardData {
  return {
    activeTrip: null,
    isSupabaseConfigured: true,
    profile: {
      authMode: "google",
      displayName: "Traveler Example",
      email: "traveler@example.com",
      id: "22222222-2222-4222-8222-222222222222",
      notes: [],
      source: "supabase",
    },
    templates: [
      {
        id: "template-default",
        isDefault: true,
        itemCount: 3,
        items: [],
        name: "Weekend city break",
      },
    ],
    trips: [],
  };
}

describe("/dashboard authenticated render", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getSupabaseEnv.mockReturnValue({
      isConfigured: true,
      publishableKey: "test-key",
      url: "http://127.0.0.1:54321",
    });
  });

  it("shows the authenticated user's name and email on the dashboard page", async () => {
    const sessionIdentity: SessionIdentity = {
      authMode: "google",
      avatarUrl: "https://lh3.googleusercontent.com/a/avatar-session",
      email: "traveler@example.com",
      label: "Traveler Example",
      userId: "22222222-2222-4222-8222-222222222222",
    };

    getCurrentSessionIdentity.mockResolvedValue(sessionIdentity);
    getDashboardData.mockResolvedValue(createDashboardData());

    const page = await DashboardPage();
    const layout = await AppLayout({ children: page });
    const html = renderToStaticMarkup(layout);

    expect(html).toContain("Google workspace");
    expect(html).toContain("Traveler Example");
    expect(html).toContain("traveler@example.com");
    expect(html).toContain("Packmap");
    expect(html).toContain("Log out");
    expect(html).toContain("Switch to guest");
  });
});
