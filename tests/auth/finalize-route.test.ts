import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { createSupabaseServerClient } = vi.hoisted(() => ({
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient,
}));

import { GET } from "@/app/auth/finalize/route";

const anonymousUserId = "11111111-1111-4111-8111-111111111111";
const googleUserId = "22222222-2222-4222-8222-222222222222";

function createRequest(cookieHeader?: string) {
  return new NextRequest("http://localhost/auth/finalize?next=%2Fdashboard", {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });
}

describe("GET /auth/finalize", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("authorizes the google user, merges the guest profile, and clears guest cookies", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const rpc = vi.fn().mockResolvedValue({
      data: { merged: true },
      error: null,
    });
    const getUser = vi.fn().mockResolvedValue({
      data: {
        user: {
          id: googleUserId,
          email: "traveler@example.com",
          user_metadata: {
            avatar_url: "https://lh3.googleusercontent.com/a/avatar-1",
            full_name: "Traveler Example",
          },
        },
      },
      error: null,
    });

    createSupabaseServerClient.mockResolvedValue({
      auth: {
        getUser,
      },
      from: vi.fn((table: string) => {
        expect(table).toBe("profiles");

        return {
          upsert,
        };
      }),
      rpc,
    });

    const response = await GET(
      createRequest(
        `packmap_user_id=${anonymousUserId}; packmap_auth_next=%2Fdashboard`
      )
    );

    expect(response.headers.get("location")).toBe("http://localhost/dashboard");
    expect(getUser).toHaveBeenCalledTimes(1);
    expect(upsert).toHaveBeenCalledWith(
      {
        id: googleUserId,
        avatar_url: "https://lh3.googleusercontent.com/a/avatar-1",
        display_name: "Traveler Example",
        email: "traveler@example.com",
      },
      { onConflict: "id" }
    );
    expect(rpc).toHaveBeenCalledWith("merge_packing_profiles", {
      p_source_profile_id: anonymousUserId,
      p_target_profile_id: googleUserId,
    });

    const setCookies = response.headers.getSetCookie();

    expect(
      setCookies.some((cookie) => cookie.startsWith("packmap_user_id=;"))
    ).toBe(true);
    expect(
      setCookies.some((cookie) => cookie.startsWith("packmap_auth_next=;"))
    ).toBe(true);
  });

  it("skips the merge when there is no guest profile cookie", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const rpc = vi.fn();

    createSupabaseServerClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: googleUserId,
              email: "traveler@example.com",
              user_metadata: {
                full_name: "Traveler Example",
                picture: "https://lh3.googleusercontent.com/a/avatar-2",
              },
            },
          },
          error: null,
        }),
      },
      from: vi.fn(() => ({
        upsert,
      })),
      rpc,
    });

    const response = await GET(createRequest());

    expect(response.headers.get("location")).toBe("http://localhost/dashboard");
    expect(upsert).toHaveBeenCalledTimes(1);
    expect(upsert).toHaveBeenCalledWith(
      {
        id: googleUserId,
        avatar_url: "https://lh3.googleusercontent.com/a/avatar-2",
        display_name: "Traveler Example",
        email: "traveler@example.com",
      },
      { onConflict: "id" }
    );
    expect(rpc).not.toHaveBeenCalled();
  });

  it("falls back to the legacy profile payload when avatar_url is unavailable", async () => {
    const upsert = vi
      .fn()
      .mockResolvedValueOnce({
        error: {
          code: "42703",
          details: null,
          hint: null,
          message: 'column "avatar_url" of relation "profiles" does not exist',
        },
      })
      .mockResolvedValueOnce({ error: null });

    createSupabaseServerClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: googleUserId,
              email: "traveler@example.com",
              user_metadata: {
                avatar_url: "https://lh3.googleusercontent.com/a/avatar-3",
                full_name: "Traveler Example",
              },
            },
          },
          error: null,
        }),
      },
      from: vi.fn(() => ({
        upsert,
      })),
      rpc: vi.fn(),
    });

    const response = await GET(createRequest());

    expect(response.headers.get("location")).toBe("http://localhost/dashboard");
    expect(upsert).toHaveBeenNthCalledWith(
      1,
      {
        id: googleUserId,
        avatar_url: "https://lh3.googleusercontent.com/a/avatar-3",
        display_name: "Traveler Example",
        email: "traveler@example.com",
      },
      { onConflict: "id" }
    );
    expect(upsert).toHaveBeenNthCalledWith(
      2,
      {
        id: googleUserId,
        display_name: "Traveler Example",
        email: "traveler@example.com",
      },
      { onConflict: "id" }
    );
  });
});
