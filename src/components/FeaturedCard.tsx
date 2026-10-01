import Link from "next/link";
import type { Product } from "@/db/schema";
import { formatPrice } from "@/lib/utils";
import { BuyButton } from "./BuyButton";
import { ProductImage } from "./ProductImage";
import { Rating } from "./Rating";

export function FeaturedCard({ product }: { product: Product }) {
  const price = formatPrice(product.price, product.currency);
  const href = `/products/${product.slug}`;

  return (
    <article className="group grid overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:grid-cols-[11rem_1fr]">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-stone-100 sm:aspect-auto sm:h-full">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
          Top pick
        </span>
      </Link>

      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
          <span>{[product.store, product.category].filter(Boolean).join(" · ")}</span>
          <Rating rating={product.rating} />
        </div>
        <h3 className="text-lg font-semibold leading-snug text-stone-900">
          <Link href={href} className="hover:text-brand-700">
            {product.name}
          </Link>
        </h3>
        {(product.note || product.description) && (
          <p className="line-clamp-2 text-sm leading-relaxed text-stone-600">
            {product.note ? `“${product.note}”` : product.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="text-xl font-bold tracking-tight text-stone-900">
            {price ?? <span className="text-sm font-medium text-stone-500">See price</span>}
          </span>
          <BuyButton productId={product.id} store={product.store} />
        </div>
      </div>
    </article>
  );
}
