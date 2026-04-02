import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web App Foundation",
  description:
    "Next.js App Router starter with TypeScript, Supabase, shadcn/ui, and Lucide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
