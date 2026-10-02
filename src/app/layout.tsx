import type { Metadata } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import "./globals.css";
import { ProductListsProvider } from "@/components/ProductListsProvider";
import { userAuth } from "@/lib/user-auth";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon-180.png",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await userAuth.api.getSession({ headers: await headers() });

  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased">
        <ProductListsProvider userId={session?.user.id}>{children}</ProductListsProvider>
      </body>
    </html>
  );
}
