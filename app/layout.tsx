import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Packing App",
    template: "%s | Packing App",
  },
  description:
    "Packing dashboard with Google sign-in and browser-based anonymous mode for templates, trips, and active-leg checklists.",
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
