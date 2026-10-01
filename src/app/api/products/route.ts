import { NextResponse, type NextRequest } from "next/server";
import { getPublishedProducts } from "@/lib/products";
import { isSortValue } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Public JSON feed of published products.
 * Supports ?q=, ?category= and ?sort= (newest | popular | rating | price-asc | price-desc).
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sortParam = searchParams.get("sort");

  const items = await getPublishedProducts({
    q: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    sort: isSortValue(sortParam) ? sortParam : "newest",
  });

  return NextResponse.json(
    {
      count: items.length,
      products: items.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        note: product.note,
        price: product.price ? Number(product.price) : null,
        currency: product.currency,
        imageUrl: product.imageUrl,
        store: product.store,
        category: product.category,
        rating: product.rating ? Number(product.rating) : null,
        featured: product.featured,
        clicks: product.clicks,
        url: `/products/${product.slug}`,
        buyUrl: `/go/${product.id}`,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
