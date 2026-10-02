import Link from "next/link";
import { AccountNav } from "@/components/AccountNav";
import { isAdmin } from "@/lib/auth";
import { userAuth } from "@/lib/user-auth";
import { siteConfig } from "@/lib/site";
import { headers } from "next/headers";

export async function Navbar() {
  const [admin, userSession] = await Promise.all([
    isAdmin(),
    userAuth.api.getSession({ headers: await headers() }),
  ]);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-stone-50/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-stone-900 text-white shadow-sm transition group-hover:bg-brand-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight text-stone-900">{siteConfig.name}</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 text-stone-600 transition hover:bg-stone-200/60 hover:text-stone-900"
          >
            All picks
          </Link>
          <Link
            href="/#categories"
            className="hidden rounded-full px-3 py-1.5 text-stone-600 transition hover:bg-stone-200/60 hover:text-stone-900 sm:inline-block"
          >
            Categories
          </Link>
          <Link
            href="/admin"
            className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-stone-700 shadow-sm transition hover:border-stone-400 hover:text-stone-900"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${admin ? "bg-emerald-500" : "bg-stone-300"}`} />
            {admin ? "Dashboard" : "Admin"}
          </Link>
          <AccountNav signedIn={Boolean(userSession)} />
        </nav>
      </div>
    </header>
  );
}
