import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AccountSettings } from "@/components/AccountSettings";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { userAuth } from "@/lib/user-auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your account" };

export default async function AccountPage() {
  const session = await userAuth.api.getSession({ headers: await headers() });
  if (!session) redirect("/account/login?next=%2Faccount");

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Account</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">Hello, {session.user.name}</h1>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/account/cart" className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 hover:border-stone-500">Your cart</Link>
          <Link href="/account/wishlist" className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 hover:border-stone-500">Your wishlist</Link>
        </div>
        <div className="mt-8 max-w-3xl rounded-2xl border border-stone-200 bg-white p-6 shadow-card sm:p-8">
          <AccountSettings name={session.user.name} email={session.user.email} />
        </div>
      </main>
      <Footer />
    </>
  );
}