"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentListIds,
  mergeGuestLists,
  setListMembership,
  type ListType,
} from "@/app/account/lists-actions";

type ProductLists = Record<ListType, number[]>;
type ProductListsContextValue = {
  lists: ProductLists;
  ready: boolean;
  toggle: (productId: number, listType: ListType) => Promise<void>;
};

const storageKey = "product-picks:lists:v1";
const emptyLists: ProductLists = { cart: [], wishlist: [] };
const ProductListsContext = createContext<ProductListsContextValue | null>(null);

function cleanIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is number => Number.isInteger(id) && id > 0))].slice(0, 150);
}

function readGuestLists(): ProductLists {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || "null") as Partial<ProductLists> | null;
    return { cart: cleanIds(value?.cart), wishlist: cleanIds(value?.wishlist) };
  } catch {
    return emptyLists;
  }
}

function writeGuestLists(lists: ProductLists) {
  localStorage.setItem(storageKey, JSON.stringify(lists));
}

export function ProductListsProvider({
  userId,
  children,
}: {
  userId?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [lists, setLists] = useState<ProductLists>(emptyLists);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const guestLists = readGuestLists();

    if (!userId) {
      void Promise.resolve().then(() => {
        if (!cancelled) {
          setLists(guestLists);
          setReady(true);
        }
      });
      return () => {
        cancelled = true;
      };
    }

    void (async () => {
      try {
        if (guestLists.cart.length > 0 || guestLists.wishlist.length > 0) {
          const merged = await mergeGuestLists(guestLists);
          if (merged.ok) localStorage.removeItem(storageKey);
        }
        const savedLists = await getCurrentListIds();
        if (!cancelled) setLists(savedLists);
      } catch {
        if (!cancelled) setLists(guestLists);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function toggle(productId: number, listType: ListType) {
    const included = !lists[listType].includes(productId);

    if (userId) {
      const result = await setListMembership(productId, listType, included);
      if (!result.ok) {
        if (result.needsLogin) {
          window.location.assign(`/account/login?next=${encodeURIComponent(window.location.pathname)}`);
        }
        return;
      }
      router.refresh();
    }

    setLists((current) => {
      const next = {
        ...current,
        [listType]: included
          ? [...current[listType], productId]
          : current[listType].filter((id) => id !== productId),
      };
      if (!userId) writeGuestLists(next);
      return next;
    });
  }

  return (
    <ProductListsContext.Provider value={{ lists, ready, toggle }}>
      {children}
    </ProductListsContext.Provider>
  );
}

export function useProductLists() {
  const context = useContext(ProductListsContext);
  if (!context) throw new Error("useProductLists must be used inside ProductListsProvider");
  return context;
}