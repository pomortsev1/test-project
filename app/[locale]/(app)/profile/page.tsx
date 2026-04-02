import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { normalizeLocale } from "@/lib/i18n/config";
import { getServerI18n } from "@/lib/i18n/server";
import {
  ensureProfileForUserId,
  getAuthChoicePathWithLocale,
  getCurrentSessionIdentity,
  getLocalizedPathname,
} from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Profile",
};

export default async function LocalizedProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);

  if (!locale) {
    redirect("/");
  }

  const { t } = await getServerI18n(locale);
  const identity = await getCurrentSessionIdentity();

  if (!identity) {
    redirect(getAuthChoicePathWithLocale("/profile", locale));
  }

  const profile = await ensureProfileForUserId(identity.userId, identity);
  const firstName = identity.firstName ?? profile.displayName ?? t("Not provided");
  const lastName =
    identity.lastName ?? (identity.authMode === "google" ? t("Not provided") : "");
  const email =
    profile.email ?? identity.email ?? (identity.authMode === "google" ? t("Not provided") : "");
  const fullName = identity.fullName ?? profile.displayName ?? firstName;
  const nameLine = [firstName, lastName].filter((value) => value.length > 0).join(" ");
  const details = [nameLine, email].filter((value) => value.length > 0);

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="packing-panel-strong border-0">
        <CardContent className="space-y-8 px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex justify-end">
            <Button
              nativeButton={false}
              variant="outline"
              className="w-fit rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              render={<Link href={getLocalizedPathname("/dashboard", locale)} />}
            >
              {t("Back")}
            </Button>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex flex-col items-center gap-5">
              <UserAvatar
                avatarUrl={identity.avatarUrl}
                name={fullName}
                size="xl"
                className="border-white/70"
              />

              <div className="space-y-2 text-lg text-slate-100">
                {details.map((value) => (
                  <p key={value}>{value}</p>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
