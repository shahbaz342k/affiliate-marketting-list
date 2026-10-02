import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AccountAuthForm } from "@/components/AccountAuthForm";
import { userAuth } from "@/lib/user-auth";

export const metadata: Metadata = { title: "Sign in" };

type SearchParams = Promise<{ next?: string }>;

export default async function AccountLoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") && !params.next.startsWith("//") ? params.next : "/account";
  const session = await userAuth.api.getSession({ headers: await headers() });
  if (session) redirect(next);

  return (
    <main className="hero-glow grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-sm font-medium text-stone-600 hover:text-stone-900">← Back to picks</Link>
        <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-8 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Your account</p>
          <h1 className="mt-2 text-2xl font-bold text-stone-900">Sign in</h1>
          <p className="mt-1 text-sm text-stone-600">Keep your saved picks together on every device.</p>
          <AccountAuthForm mode="login" next={next} />
        </div>
      </div>
    </main>
  );
}