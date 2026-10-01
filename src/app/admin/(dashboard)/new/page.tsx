import type { Metadata } from "next";
import Link from "next/link";
import { createProduct } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { emptyProductFormValues } from "@/lib/product-form";
import { getAllCategoryNames, getAllStoreNames } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Add product" };

export default async function NewProductPage() {
  await requireAdmin("/admin/new");
  const [categories, stores] = await Promise.all([getAllCategoryNames(), getAllStoreNames()]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm font-medium text-stone-500 hover:text-stone-900">
          ← Back to products
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">Add a product</h1>
        <p className="mt-1 text-sm text-stone-600">
          Paste your affiliate link, add a photo and tell your friends why you love it.
        </p>
      </div>

      <ProductForm
        action={createProduct}
        initialValues={emptyProductFormValues}
        categories={categories}
        stores={stores}
        submitLabel="Add product"
      />
    </div>
  );
}
