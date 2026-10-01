import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";

export const dynamic = "force-dynamic";

function redirectHome() {
  return new Response(null, {
    status: 302,
    headers: { Location: "/", "Cache-Control": "no-store" },
  });
}

/**
 * Click-tracking redirect: increments the product's click counter and sends
 * the visitor to the affiliate URL.
 */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return redirectHome();
  }

  const [row] = await db
    .update(products)
    .set({ clicks: sql`${products.clicks} + 1` })
    .where(eq(products.id, productId))
    .returning({ affiliateUrl: products.affiliateUrl });

  if (!row?.affiliateUrl) {
    return redirectHome();
  }

  const response = NextResponse.redirect(row.affiliateUrl, { status: 302 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
