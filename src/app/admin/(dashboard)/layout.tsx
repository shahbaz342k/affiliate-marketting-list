import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/admin/actions";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Admin" };

const navLinkClass =
  "rounded-full px-3 py-1.5 text-stone-600 transition hover:bg-stone-100 hover:text-stone-900";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100/70">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              ⚡
            </span>
            <span className="font-bold tracking-tight text-stone-900">
              {siteConfig.name} <span className="font-medium text-stone-400">/ Admin</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 text-sm font-medium">
            <Link href="/admin" className={navLinkClass}>
              Products
            </Link>
            <Link href="/admin#account-requests" className={navLinkClass}>
              Account requests
            </Link>
            <Link href="/admin/new" className={navLinkClass}>
              Add product
            </Link>
            <Link href="/" target="_blank" rel="noopener" className={`${navLinkClass} hidden sm:inline-block`}>
              View site ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="ml-1 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
              >
                Log out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
