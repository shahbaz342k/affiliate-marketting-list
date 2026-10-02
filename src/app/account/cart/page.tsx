import type { Metadata } from "next";
import { headers } from "next/headers";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SavedListPage } from "@/components/SavedListPage";
import { getCurrentListProducts } from "@/app/account/lists-actions";
import { userAuth } from "@/lib/user-auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your cart" };

export default async function CartPage() {
  const session = await userAuth.api.getSession({ headers: await headers() });
  const products = session ? await getCurrentListProducts("cart") : [];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <SavedListPage listType="cart" initialProducts={products} guest={!session} />
      </main>
      <Footer />
    </>
  );
}