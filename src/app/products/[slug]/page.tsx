import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyButton } from "@/components/BuyButton";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { Rating } from "@/components/Rating";
import { isAdmin } from "@/lib/auth";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { siteConfig } from "@/lib/site";
import { formatDate, formatNumber, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description ?? `${product.name} — recommended on ${siteConfig.name}`,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [product, admin] = await Promise.all([getProductBySlug(slug), isAdmin()]);

  if (!product || (!product.published && !admin)) {
    notFound();
  }

  const related = await getRelatedProducts(product, 3);
  const price = formatPrice(product.price, product.currency);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <nav className="flex items-center gap-2 text-sm text-stone-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-stone-900">
            All picks
          </Link>
          {product.category && (
            <>
              <span aria-hidden="true">/</span>
              <Link
                href={`/?category=${encodeURIComponent(product.category)}`}
                className="hover:text-stone-900"
              >
                {product.category}
              </Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span className="truncate text-stone-800">{product.name}</span>
        </nav>

        {!product.published && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            This product is <strong>unpublished</strong> — only you can see this page.{" "}
            <Link href={`/admin/${product.id}/edit`} className="font-semibold underline">
              Edit product
            </Link>
          </div>
        )}

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-card">
            <ProductImage
              src={product.imageUrl}
              alt={product.name}
              sizesHint="lg"
              className="aspect-square h-full w-full object-cover"
            />
            {product.featured && (
              <span className="absolute left-4 top-4 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
                Top pick
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
              {product.store && (
                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-700">{product.store}</span>
              )}
              {product.category && (
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700">{product.category}</span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-stone-900 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <span className="text-3xl font-bold tracking-tight text-stone-900">
                {price ?? <span className="text-lg font-medium text-stone-500">See price on store</span>}
              </span>
              <Rating rating={product.rating} showOutOf className="text-sm" />
            </div>

            {product.description && (
              <p className="mt-6 text-base leading-relaxed text-stone-700">{product.description}</p>
            )}

            {product.note && (
              <blockquote className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Why I recommend it</p>
                <p className="mt-2 text-base italic leading-relaxed text-stone-800">“{product.note}”</p>
              </blockquote>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <BuyButton productId={product.id} store={product.store} size="lg" />
              <CopyLinkButton path={`/products/${product.slug}`} />
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-stone-200 pt-6 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-stone-500">Added</dt>
                <dd className="mt-0.5 font-medium text-stone-800">{formatDate(product.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Friends who clicked</dt>
                <dd className="mt-0.5 font-medium text-stone-800">{formatNumber(product.clicks)}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Opens</dt>
                <dd className="mt-0.5 truncate font-medium text-stone-800">
                  {(() => {
                    try {
                      return new URL(product.affiliateUrl).hostname.replace(/^www\./, "");
                    } catch {
                      return "retailer site";
                    }
                  })()}
                </dd>
              </div>
            </dl>

            <p className="mt-6 text-xs leading-relaxed text-stone-400">{siteConfig.disclosure}</p>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">You might also like</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-900">
              {product.category ? `More in ${product.category}` : "More picks"}
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
