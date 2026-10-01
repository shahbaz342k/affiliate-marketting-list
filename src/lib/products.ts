import { and, asc, count, desc, eq, ilike, isNotNull, ne, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { products, type Product } from "@/db/schema";
import type { SortValue } from "./utils";

export type StorefrontFilters = {
  q?: string;
  category?: string;
  sort?: SortValue;
};

function orderFor(sort: SortValue | undefined) {
  switch (sort) {
    case "popular":
      return [desc(products.clicks), desc(products.createdAt)];
    case "rating":
      return [sql`${products.rating} desc nulls last`, desc(products.createdAt)];
    case "price-asc":
      return [sql`${products.price} asc nulls last`, desc(products.createdAt)];
    case "price-desc":
      return [sql`${products.price} desc nulls last`, desc(products.createdAt)];
    case "newest":
    default:
      return [desc(products.createdAt), desc(products.id)];
  }
}

export async function getPublishedProducts(
  filters: StorefrontFilters = {},
): Promise<Product[]> {
  const conditions = [eq(products.published, true)];

  const q = filters.q?.trim();
  if (q) {
    const pattern = `%${q.replace(/[%_]/g, (m) => `\\${m}`)}%`;
    const search = or(
      ilike(products.name, pattern),
      ilike(products.description, pattern),
      ilike(products.note, pattern),
      ilike(products.store, pattern),
      ilike(products.category, pattern),
    );
    if (search) conditions.push(search);
  }

  const category = filters.category?.trim();
  if (category) {
    conditions.push(eq(products.category, category));
  }

  return db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(...orderFor(filters.sort));
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(and(eq(products.published, true), eq(products.featured, true)))
    .orderBy(desc(products.clicks), desc(products.createdAt))
    .limit(limit);
}

export type CategorySummary = { category: string; count: number };

export async function getPublishedCategories(): Promise<CategorySummary[]> {
  const rows = await db
    .select({ category: products.category, count: count() })
    .from(products)
    .where(and(eq(products.published, true), isNotNull(products.category)))
    .groupBy(products.category)
    .orderBy(asc(products.category));

  return rows
    .filter((row): row is { category: string; count: number } => Boolean(row.category))
    .map((row) => ({ category: row.category, count: Number(row.count) }));
}

export async function getAllCategoryNames(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ category: products.category })
    .from(products)
    .where(isNotNull(products.category))
    .orderBy(asc(products.category));
  return rows.map((row) => row.category).filter((c): c is string => Boolean(c));
}

export async function getAllStoreNames(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ store: products.store })
    .from(products)
    .where(isNotNull(products.store))
    .orderBy(asc(products.store));
  return rows.map((row) => row.store).filter((s): s is string => Boolean(s));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const [row] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  return row ?? null;
}

export async function getProductById(id: number): Promise<Product | null> {
  if (!Number.isInteger(id)) return null;
  const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return row ?? null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const conditions = [eq(products.published, true), ne(products.id, product.id)];
  if (product.category) {
    conditions.push(eq(products.category, product.category));
  }
  return db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(desc(products.featured), desc(products.clicks), desc(products.createdAt))
    .limit(limit);
}

export async function getAllProductsForAdmin(): Promise<Product[]> {
  return db.select().from(products).orderBy(desc(products.createdAt), desc(products.id));
}

export type AdminStats = {
  total: number;
  published: number;
  featured: number;
  clicks: number;
  topProducts: Product[];
};

export async function getAdminStats(): Promise<AdminStats> {
  const [totals] = await db
    .select({
      total: count(),
      published: sql<number>`count(*) filter (where ${products.published})`.mapWith(Number),
      featured: sql<number>`count(*) filter (where ${products.featured})`.mapWith(Number),
      clicks: sql<number>`coalesce(sum(${products.clicks}), 0)`.mapWith(Number),
    })
    .from(products);

  const topProducts = await db
    .select()
    .from(products)
    .where(sql`${products.clicks} > 0`)
    .orderBy(desc(products.clicks))
    .limit(5);

  return {
    total: Number(totals?.total ?? 0),
    published: totals?.published ?? 0,
    featured: totals?.featured ?? 0,
    clicks: totals?.clicks ?? 0,
    topProducts,
  };
}
