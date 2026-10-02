"use client";

import { useProductLists } from "@/components/ProductListsProvider";

export function ProductListButtons({ productId }: { productId: number }) {
  const { lists, ready, toggle } = useProductLists();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={!ready}
        aria-label={lists.cart.includes(productId) ? "Remove from cart" : "Add to cart"}
        title={lists.cart.includes(productId) ? "Remove from cart" : "Add to cart"}
        onClick={() => void toggle(productId, "cart")}
        className={`grid h-10 w-10 place-items-center rounded-full border transition disabled:opacity-50 ${
          lists.cart.includes(productId)
            ? "border-stone-900 bg-stone-900 text-white"
            : "border-stone-300 bg-white text-stone-700 hover:border-stone-900 hover:text-stone-900"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.4 11.2a2 2 0 002 1.6h8.9a2 2 0 001.9-1.4L22 8H6" />
          <circle cx="10" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>
      </button>
      <button
        type="button"
        disabled={!ready}
        aria-label={lists.wishlist.includes(productId) ? "Remove from wishlist" : "Add to wishlist"}
        title={lists.wishlist.includes(productId) ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => void toggle(productId, "wishlist")}
        className={`grid h-10 w-10 place-items-center rounded-full border transition disabled:opacity-50 ${
          lists.wishlist.includes(productId)
            ? "border-rose-600 bg-rose-600 text-white"
            : "border-stone-300 bg-white text-stone-700 hover:border-rose-500 hover:text-rose-600"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 00-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 00-.1-7.8z" />
        </svg>
      </button>
    </div>
  );
}