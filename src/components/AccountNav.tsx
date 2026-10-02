"use client";

import Link from "next/link";
import { useProductLists } from "@/components/ProductListsProvider";

function CountLink({ href, label, count, children }: {
  href: string;
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={`${label}, ${count} items`}
      title={label}
      className="relative grid h-9 w-9 place-items-center rounded-full text-stone-600 transition hover:bg-stone-200/70 hover:text-stone-900"
    >
      {children}
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

export function AccountNav({ signedIn }: { signedIn: boolean }) {
  const { lists } = useProductLists();

  return (
    <div className="flex items-center gap-1">
      <CountLink href="/account/cart" label="Cart" count={lists.cart.length}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.4 11.2a2 2 0 002 1.6h8.9a2 2 0 001.9-1.4L22 8H6" />
          <circle cx="10" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>
      </CountLink>
      <CountLink href="/account/wishlist" label="Wishlist" count={lists.wishlist.length}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 00-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 00-.1-7.8z" />
        </svg>
      </CountLink>
      <Link
        href={signedIn ? "/account" : "/account/login"}
        className="ml-1 inline-flex h-9 items-center justify-center rounded-full border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-400 hover:text-stone-900"
      >
        {signedIn ? "Account" : "Sign in"}
      </Link>
    </div>
  );
}