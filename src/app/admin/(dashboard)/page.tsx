import Link from "next/link";
import {
  deleteProduct,
  loadSampleProducts,
  toggleFeatured,
  togglePublished,
} from "@/app/admin/actions";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { ProductImage } from "@/components/ProductImage";
import { Rating } from "@/components/Rating";
import { requireAdmin } from "@/lib/auth";
import { getAdminStats, getAllProductsForAdmin } from "@/lib/products";
import { cn, formatDate, formatNumber, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const FLASH_MESSAGES: Record<string, string> = {
  created: "Product added to your list.",
  updated: "Changes saved.",
  deleted: "Product deleted.",
  seeded: "Sample products loaded — edit or delete them any time.",
};

type SearchParams = Promise<{ msg?: string }>;

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-5 shadow-card",
        accent ? "border-brand-200 bg-brand-50" : "border-stone-200 bg-white",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</p>
      <p className={cn("mt-2 text-3xl font-bold tracking-tight", accent ? "text-brand-700" : "text-stone-900")}>
        {value}
      </p>
    </div>
  );
}

export default async function AdminDashboardPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin("/admin");
  const { msg } = await searchParams;
  const [items, stats] = await Promise.all([getAllProductsForAdmin(), getAdminStats()]);
  const flash = msg ? FLASH_MESSAGES[msg] : undefined;
  const maxClicks = stats.topProducts[0]?.clicks ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Your products</h1>
          <p className="mt-1 text-sm text-stone-600">
            Everything here powers the storefront. Add links, mark top picks and watch the clicks roll in.
          </p>
        </div>
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
        >
          <span className="text-lg leading-none">+</span> Add product
        </Link>
      </div>

      {flash && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
          {flash}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value={formatNumber(stats.total)} />
        <StatCard label="Published" value={formatNumber(stats.published)} />
        <StatCard label="Top picks" value={formatNumber(stats.featured)} />
        <StatCard label="Buy clicks" value={formatNumber(stats.clicks)} accent />
      </div>

      {stats.topProducts.length > 0 && (
        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-card">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">Most clicked</h2>
          <ul className="mt-4 space-y-3">
            {stats.topProducts.map((product) => (
              <li key={product.id} className="grid grid-cols-[1fr_auto] items-center gap-4 text-sm">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <Link href={`/admin/${product.id}/edit`} className="font-medium text-stone-900 hover:text-brand-700">
                      {product.name}
                    </Link>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${maxClicks ? Math.max(4, (product.clicks / maxClicks) * 100) : 0}%` }}
                    />
                  </div>
                </div>
                <span className="tabular-nums font-semibold text-stone-700">{formatNumber(product.clicks)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center shadow-card">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-3xl">🛍️</div>
          <h2 className="mt-4 text-xl font-semibold text-stone-900">Your list is empty</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
            Add your first affiliate product, or load a handful of sample products to see how everything looks.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/admin/new"
              className="inline-flex items-center rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              Add a product
            </Link>
            <form action={loadSampleProducts}>
              <button
                type="submit"
                className="inline-flex items-center rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-stone-400"
              >
                Load sample products
              </button>
            </form>
          </div>
        </div>
      ) : (
        <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead className="bg-stone-50 text-xs font-semibold uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Price</th>
                  <th className="px-3 py-3">Rating</th>
                  <th className="px-3 py-3 text-right">Clicks</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {items.map((product) => (
                  <tr key={product.id} className="align-middle hover:bg-stone-50/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
                          <ProductImage
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/${product.id}/edit`}
                            className="block truncate font-medium text-stone-900 hover:text-brand-700"
                          >
                            {product.name}
                          </Link>
                          <p className="truncate text-xs text-stone-500">
                            {[product.store, `added ${formatDate(product.createdAt)}`].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-stone-700">{product.category ?? <span className="text-stone-300">—</span>}</td>
                    <td className="px-3 py-3 font-medium text-stone-900">
                      {formatPrice(product.price, product.currency) ?? <span className="text-stone-300">—</span>}
                    </td>
                    <td className="px-3 py-3">
                      <Rating rating={product.rating} /> {!product.rating && <span className="text-stone-300">—</span>}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums font-semibold text-stone-800">
                      {formatNumber(product.clicks)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <form action={togglePublished.bind(null, product.id)}>
                          <button
                            type="submit"
                            title={product.published ? "Click to unpublish" : "Click to publish"}
                            className={cn(
                              "rounded-full px-2.5 py-1 text-xs font-semibold transition",
                              product.published
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200",
                            )}
                          >
                            {product.published ? "Published" : "Draft"}
                          </button>
                        </form>
                        <form action={toggleFeatured.bind(null, product.id)}>
                          <button
                            type="submit"
                            title={product.featured ? "Remove from top picks" : "Mark as top pick"}
                            className={cn(
                              "rounded-full px-2.5 py-1 text-xs font-semibold transition",
                              product.featured
                                ? "bg-brand-100 text-brand-700 hover:bg-brand-200"
                                : "bg-stone-100 text-stone-500 hover:bg-stone-200",
                            )}
                          >
                            {product.featured ? "★ Top pick" : "☆ Feature"}
                          </button>
                        </form>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          rel="noopener"
                          className="rounded-full px-2.5 py-1 text-xs font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/${product.id}/edit`}
                          className="rounded-full px-2.5 py-1 text-xs font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-900"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton
                          action={deleteProduct.bind(null, product.id)}
                          productName={product.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
