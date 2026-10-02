"use server";

import { and, desc, eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { products, userProductLists } from "@/db/schema";
import { userAuth } from "@/lib/user-auth";

export type ListType = "cart" | "wishlist";

function isListType(value: string): value is ListType {
  return value === "cart" || value === "wishlist";
}

async function getSession() {
  return userAuth.api.getSession({ headers: await headers() });
}

export async function getCurrentListIds(): Promise<Record<ListType, number[]>> {
  const session = await getSession();
  if (!session) return { cart: [], wishlist: [] };

  const rows = await db
    .select({ productId: userProductLists.productId, listType: userProductLists.listType })
    .from(userProductLists)
    .where(eq(userProductLists.userId, session.user.id));

  return rows.reduce<Record<ListType, number[]>>(
    (lists, row) => {
      if (isListType(row.listType)) lists[row.listType].push(row.productId);
      return lists;
    },
    { cart: [], wishlist: [] },
  );
}

export async function getCurrentListProducts(listType: ListType) {
  if (!isListType(listType)) return [];
  const session = await getSession();
  if (!session) return [];

  return db
    .select({ product: products })
    .from(userProductLists)
    .innerJoin(products, eq(userProductLists.productId, products.id))
    .where(
      and(
        eq(userProductLists.userId, session.user.id),
        eq(userProductLists.listType, listType),
        eq(products.published, true),
      ),
    )
    .orderBy(desc(userProductLists.createdAt))
    .then((rows) => rows.map((row) => row.product));
}

export async function getGuestListProducts(productIds: number[]) {
  const ids = [...new Set(productIds.filter((id) => Number.isInteger(id) && id > 0))].slice(0, 150);
  if (ids.length === 0) return [];
  return db
    .select()
    .from(products)
    .where(and(inArray(products.id, ids), eq(products.published, true)));
}

export async function mergeGuestLists(lists: Record<ListType, number[]>) {
  const session = await getSession();
  if (!session) return { ok: false as const };

  const cartIds = [...new Set(lists.cart.filter((id) => Number.isInteger(id) && id > 0))].slice(0, 150);
  const wishlistIds = [...new Set(lists.wishlist.filter((id) => Number.isInteger(id) && id > 0))].slice(0, 150);
  const allIds = [...new Set([...cartIds, ...wishlistIds])];
  if (allIds.length === 0) return { ok: true as const };

  const availableRows = await db
    .select({ id: products.id })
    .from(products)
    .where(and(inArray(products.id, allIds), eq(products.published, true)));
  const availableIds = new Set(availableRows.map((row) => row.id));
  const entries = [
    ...cartIds.filter((id) => availableIds.has(id)).map((productId) => ({ userId: session.user.id, productId, listType: "cart" })),
    ...wishlistIds.filter((id) => availableIds.has(id)).map((productId) => ({ userId: session.user.id, productId, listType: "wishlist" })),
  ];

  if (entries.length > 0) {
    await db.insert(userProductLists).values(entries).onConflictDoNothing({
      target: [userProductLists.userId, userProductLists.productId, userProductLists.listType],
    });
  }
  revalidatePath("/account/cart");
  revalidatePath("/account/wishlist");
  return { ok: true as const };
}

export async function setListMembership(productId: number, listType: ListType, included: boolean) {
  if (!Number.isInteger(productId) || productId < 1 || !isListType(listType)) {
    return { ok: false as const, needsLogin: false as const };
  }

  const session = await getSession();
  if (!session) return { ok: false as const, needsLogin: true as const };

  if (included) {
    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.id, productId), eq(products.published, true)))
      .limit(1);
    if (!product) return { ok: false as const, needsLogin: false as const };

    await db.insert(userProductLists).values({
      userId: session.user.id,
      productId,
      listType,
    }).onConflictDoNothing({
      target: [userProductLists.userId, userProductLists.productId, userProductLists.listType],
    });
  } else {
    await db
      .delete(userProductLists)
      .where(
        and(
          eq(userProductLists.userId, session.user.id),
          eq(userProductLists.productId, productId),
          eq(userProductLists.listType, listType),
        ),
      );
  }

  revalidatePath("/account/cart");
  revalidatePath("/account/wishlist");
  return { ok: true as const, needsLogin: false as const };
}