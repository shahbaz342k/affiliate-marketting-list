import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProduct, updateProduct } from "@/app/admin/actions";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { productToFormValues } from "@/lib/product-form";
import { getAllCategoryNames, getAllStoreNames, getProductById } from "@/lib/products";
import { formatDate, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Edit product" };

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  await requireAdmin(`/admin/${id}/edit`);

  const productId = Number(id);
  const product = Number.isInteger(productId) ? await getProductById(productId) : null;
  if (!product) notFound();

  const [categories, stores] = await Promise.all([getAllCategoryNames(), getAllStoreNames()]);
  const action = updateProduct.bind(null, product.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin" className="text-sm font-medium text-stone-500 hover:text-stone-900">
            ← Back to products
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">Edit product</h1>
          <p className="mt-1 text-sm text-stone-600">
            Added {formatDate(product.createdAt)} · {formatNumber(product.clicks)}{" "}
            {product.clicks === 1 ? "buy click" : "buy clicks"} so far
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            rel="noopener"
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400"
          >
            View page ↗
          </Link>
          <DeleteProductButton
            action={deleteProduct.bind(null, product.id)}
            productName={product.name}
            className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          />
        </div>
      </div>

      <ProductForm
        action={action}
        initialValues={productToFormValues(product)}
        categories={categories}
        stores={stores}
        submitLabel="Save changes"
      />
    </div>
  );
}
