import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-lg font-bold tracking-tight text-stone-900">{siteConfig.name}</p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600">{siteConfig.disclosure}</p>
          </div>
          <div className="flex flex-col gap-2 text-sm md:items-end">
            <Link href="/" className="text-stone-600 hover:text-stone-900">
              Browse all picks
            </Link>
            <Link href="/api/products" className="text-stone-600 hover:text-stone-900">
              JSON feed
            </Link>
            <Link href="/admin" className="text-stone-600 hover:text-stone-900">
              Manage products
            </Link>
          </div>
        </div>
        <p className="mt-8 text-xs text-stone-400">
          © {new Date().getFullYear()} {siteConfig.name}. Prices and availability are subject to change on the
          retailer&apos;s site.
        </p>
      </div>
    </footer>
  );
}
