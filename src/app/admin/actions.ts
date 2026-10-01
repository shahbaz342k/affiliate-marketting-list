"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { products } from "@/db/schema";
import { sampleProducts } from "@/db/seed";
import {
  createAdminSession,
  destroyAdminSession,
  requireAdmin,
  verifyPassword,
} from "@/lib/auth";
import {
  readFormValues,
  validateProductForm,
  type FormState,
} from "@/lib/product-form";
import { slugify } from "@/lib/utils";

function revalidateStore(slug?: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/api/products");
  if (slug) revalidatePath(`/products/${slug}`);
}

async function uniqueSlug(name: string): Promise<string> {
  const base = slugify(name);
  let candidate = base;
  let attempt = 2;
  // Loop until we find a slug that is not taken.
  for (;;) {
    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, candidate))
      .limit(1);
    if (existing.length === 0) return candidate;
    candidate = `${base}-${attempt++}`;
  }
}

function safeNextPath(value: string | undefined, fallback = "/admin"): string {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

/* ---------- Auth ---------- */

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = formData.get("password")?.toString() ?? "";
  const next = safeNextPath(formData.get("next")?.toString());

  if (!password) {
    return { error: "Enter your admin password." };
  }
  if (!verifyPassword(password)) {
    return { error: "That password is incorrect. Please try again." };
  }

  await createAdminSession();
  redirect(next);
}

export async function logout(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin/login");
}

/* ---------- Products ---------- */

export async function createProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin("/admin/new");

  const values = readFormValues(formData);
  const result = validateProductForm(values);
  if (!result.ok) {
    return { error: "Please fix the highlighted fields.", fieldErrors: result.fieldErrors, values };
  }

  try {
    const slug = await uniqueSlug(result.data.name);
    await db.insert(products).values({ ...result.data, slug });
  } catch (error) {
    console.error("createProduct failed", error);
    return { error: "Could not save the product. Please try again.", values };
  }

  revalidateStore();
  redirect("/admin?msg=created");
}

export async function updateProduct(
  id: number,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin(`/admin/${id}/edit`);

  const values = readFormValues(formData);
  const result = validateProductForm(values);
  if (!result.ok) {
    return { error: "Please fix the highlighted fields.", fieldErrors: result.fieldErrors, values };
  }

  let slug: string | undefined;
  try {
    const [updated] = await db
      .update(products)
      .set({ ...result.data, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning({ slug: products.slug });
    if (!updated) {
      return { error: "This product no longer exists.", values };
    }
    slug = updated.slug;
  } catch (error) {
    console.error("updateProduct failed", error);
    return { error: "Could not save your changes. Please try again.", values };
  }

  revalidateStore(slug);
  redirect("/admin?msg=updated");
}

export async function deleteProduct(id: number): Promise<void> {
  await requireAdmin();
  const [deleted] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning({ slug: products.slug });
  revalidateStore(deleted?.slug);
  redirect("/admin?msg=deleted");
}

export async function togglePublished(id: number): Promise<void> {
  await requireAdmin();
  const [row] = await db
    .update(products)
    .set({ published: sql`not ${products.published}`, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning({ slug: products.slug });
  revalidateStore(row?.slug);
}

export async function toggleFeatured(id: number): Promise<void> {
  await requireAdmin();
  const [row] = await db
    .update(products)
    .set({ featured: sql`not ${products.featured}`, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning({ slug: products.slug });
  revalidateStore(row?.slug);
}

export async function loadSampleProducts(): Promise<void> {
  await requireAdmin();
  await db.insert(products).values(sampleProducts).onConflictDoNothing({ target: products.slug });
  revalidateStore();
  redirect("/admin?msg=seeded");
}
