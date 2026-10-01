import Link from "next/link";
import type { Product } from "@/db/schema";
import { formatPrice } from "@/lib/utils";
import { BuyButton } from "./BuyButton";
import { ProductImage } from "./ProductImage";
import { Rating } from "./Rating";

export function ProductCard({ product }: { product: Product }) {
  const price = formatPrice(product.price, product.currency);
  const href = `/products/${product.slug}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-stone-100">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {product.store ? (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-stone-700 shadow-sm backdrop-blur">
              {product.store}
            </span>
          ) : (
            <span />
          )}
          {product.featured && (
            <span className="rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
              Top pick
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-2">
          {product.category ? (
            <Link
              href={`/?category=${encodeURIComponent(product.category)}`}
              className="text-[11px] font-semibold uppercase tracking-wider text-brand-700 hover:underline"
            >
              {product.category}
            </Link>
          ) : (
            <span />
          )}
          <Rating rating={product.rating} />
        </div>

        <h3 className="text-base font-semibold leading-snug text-stone-900">
          <Link href={href} className="hover:text-brand-700">
            {product.name}
          </Link>
        </h3>

        {product.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-stone-600">{product.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="text-lg font-bold tracking-tight text-stone-900">
            {price ?? <span className="text-sm font-medium text-stone-500">See price</span>}
          </span>
          <BuyButton productId={product.id} />
        </div>
      </div>
    </article>
  );
}
