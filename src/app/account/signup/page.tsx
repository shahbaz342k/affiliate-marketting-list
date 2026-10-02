import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AccountAuthForm } from "@/components/AccountAuthForm";
import { userAuth } from "@/lib/user-auth";

export const metadata: Metadata = { title: "Create account" };

export default async function AccountSignupPage() {
  const session = await userAuth.api.getSession({ headers: await headers() });
  if (session) redirect("/account");

  return (
    <main className="hero-glow grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-sm font-medium text-stone-600 hover:text-stone-900">← Back to picks</Link>
        <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-8 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Save your finds</p>
          <h1 className="mt-2 text-2xl font-bold text-stone-900">Create account</h1>
          <AccountAuthForm mode="signup" />
        </div>
      </div>
    </main>
  );
}