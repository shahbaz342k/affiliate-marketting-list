"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/db/schema";
import { getGuestListProducts, type ListType } from "@/app/account/lists-actions";
import { ProductCard } from "@/components/ProductCard";
import { useProductLists } from "@/components/ProductListsProvider";

export function SavedListPage({ listType, initialProducts, guest }: {
  listType: ListType;
  initialProducts: Product[];
  guest: boolean;
}) {
  const { lists, ready } = useProductLists();
  const [guestProducts, setGuestProducts] = useState<Product[]>([]);
  const [loadedIds, setLoadedIds] = useState("");
  const productIds = lists[listType];
  const currentIds = productIds.join(",");
  const loading = guest && (!ready || loadedIds !== currentIds);

  useEffect(() => {
    if (!guest || !ready) return;
    let active = true;
    void getGuestListProducts(productIds).then((rows) => {
      if (active) {
        setGuestProducts(rows);
        setLoadedIds(currentIds);
      }
    }).finally(() => {
      if (active) setLoadedIds(currentIds);
    });
    return () => {
      active = false;
    };
  }, [guest, ready, currentIds, productIds]);

  const items = guest ? guestProducts : initialProducts;
  const title = listType === "cart" ? "Your cart" : "Your wishlist";

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Saved picks</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">{title}</h1>
          {listType === "cart" && <p className="mt-2 max-w-xl text-sm text-stone-600">These picks are saved here for you. Checkout and payment happen on each retailer’s site.</p>}
        </div>
        {!guest && <Link href="/account" className="text-sm font-semibold text-brand-700 hover:underline">Account settings</Link>}
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-stone-500">Loading your saved picks…</p>
      ) : items.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="mt-8 border-y border-stone-200 py-14 text-center">
          <h2 className="text-xl font-semibold text-stone-900">Nothing saved here yet</h2>
          <p className="mt-2 text-sm text-stone-600">Browse the picks and save the ones you want to revisit.</p>
          <Link href="/" className="mt-5 inline-flex rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600">Browse picks</Link>
          {guest && <p className="mt-4 text-sm text-stone-500">Sign in to sync your lists across devices. <Link href="/account/signup" className="font-semibold text-brand-700 hover:underline">Create account</Link></p>}
        </div>
      )}
    </>
  );
}