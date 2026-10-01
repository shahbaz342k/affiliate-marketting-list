import Link from "next/link";
import { FeaturedCard } from "@/components/FeaturedCard";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { SortSelect } from "@/components/SortSelect";
import {
  getFeaturedProducts,
  getPublishedCategories,
  getPublishedProducts,
} from "@/lib/products";
import { siteConfig } from "@/lib/site";
import { cn, isSortValue, storefrontHref } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">{title}</h2>
    </div>
  );
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
        active
          ? "border-stone-900 bg-stone-900 text-white shadow-sm"
          : "border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:text-stone-900",
      )}
    >
      {children}
    </Link>
  );
}

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = first(params.q)?.trim() || undefined;
  const category = first(params.category)?.trim() || undefined;
  const sortParam = first(params.sort);
  const sort = isSortValue(sortParam) ? sortParam : "newest";
  const filtering = Boolean(q || category);

  const [items, categories, featured] = await Promise.all([
    getPublishedProducts({ q, category, sort }),
    getPublishedCategories(),
    filtering ? Promise.resolve([]) : getFeaturedProducts(4),
  ]);

  const storeIsEmpty = !filtering && items.length === 0;
  const catalogueTitle = category
    ? category
    : q
      ? `Results for “${q}”`
      : "All picks";

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="hero-glow border-b border-stone-200/60">
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
              Hand-picked · Honest · Shared with friends
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              {siteConfig.tagline}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
              {siteConfig.description}
            </p>

            <form
              action="/"
              method="get"
              role="search"
              className="mt-8 flex max-w-xl items-center gap-2 rounded-full border border-stone-300 bg-white p-1.5 pl-4 shadow-sm transition focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100"
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5 shrink-0 text-stone-400"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="search"
                name="q"
                defaultValue={q ?? ""}
                placeholder="Search headphones, coffee, desk gear…"
                className="min-w-0 flex-1 bg-transparent py-2 text-base text-stone-900 outline-none placeholder:text-stone-400"
              />
              {category && <input type="hidden" name="category" value={category} />}
              {sort !== "newest" && <input type="hidden" name="sort" value={sort} />}
              <button
                type="submit"
                className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Search
              </button>
            </form>

            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-stone-600">
              <div className="flex items-baseline gap-2">
                <dt className="sr-only">Products</dt>
                <dd className="text-2xl font-bold text-stone-900">{filtering ? items.length : items.length}</dd>
                <span>{filtering ? "matching picks" : "curated picks"}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="sr-only">Categories</dt>
                <dd className="text-2xl font-bold text-stone-900">{categories.length}</dd>
                <span>categories</span>
              </div>
            </dl>
          </div>
        </section>

        {/* Featured */}
        {featured.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
            <SectionHeading eyebrow="Top picks" title="If you only look at a few, look at these" />
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {featured.map((product) => (
                <FeaturedCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Catalogue */}
        <section id="categories" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-12 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Browse" title={catalogueTitle} />
            <SortSelect q={q} category={category} sort={sort} />
          </div>

          {categories.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              <Chip href={storefrontHref({ q, sort: sort !== "newest" ? sort : undefined })} active={!category}>
                All
              </Chip>
              {categories.map((entry) => (
                <Chip
                  key={entry.category}
                  href={storefrontHref({
                    q,
                    category: entry.category,
                    sort: sort !== "newest" ? sort : undefined,
                  })}
                  active={category === entry.category}
                >
                  {entry.category}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px] font-semibold",
                      category === entry.category ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500",
                    )}
                  >
                    {entry.count}
                  </span>
                </Chip>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between text-sm text-stone-500">
            <p>
              Showing <span className="font-semibold text-stone-800">{items.length}</span>{" "}
              {items.length === 1 ? "product" : "products"}
              {category && (
                <>
                  {" "}
                  in <span className="font-semibold text-stone-800">{category}</span>
                </>
              )}
              {q && (
                <>
                  {" "}
                  matching <span className="font-semibold text-stone-800">“{q}”</span>
                </>
              )}
            </p>
            {filtering && (
              <Link href="/" className="font-medium text-brand-700 hover:underline">
                Clear filters
              </Link>
            )}
          </div>

          {items.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : storeIsEmpty ? (
            <div className="mt-8 rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-3xl">🛍️</div>
              <h3 className="mt-4 text-xl font-semibold text-stone-900">No products yet</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
                Head over to the admin panel to add your first affiliate product, or load a set of sample
                products to see how the storefront looks.
              </p>
              <Link
                href="/admin"
                className="mt-6 inline-flex items-center rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Open admin panel
              </Link>
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
              <h3 className="text-xl font-semibold text-stone-900">Nothing matched that search</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
                Try a different keyword or browse a category instead.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-stone-400"
              >
                Show everything
              </Link>
            </div>
          )}
        </section>

        {/* Disclosure */}
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
          <div className="rounded-3xl bg-stone-900 px-6 py-8 text-stone-200 sm:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">How this works</p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed sm:text-base">{siteConfig.disclosure}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
