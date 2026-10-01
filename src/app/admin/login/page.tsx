import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAdmin, isUsingDefaultPassword } from "@/lib/auth";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin sign in" };

type SearchParams = Promise<{ next?: string }>;

export default async function AdminLoginPage({ searchParams }: { searchParams: SearchParams }) {
  const { next } = await searchParams;
  const target = next && next.startsWith("/") && !next.startsWith("//") ? next : "/admin";

  if (await isAdmin()) {
    redirect(target);
  }

  const showDefaultHint = isUsingDefaultPassword();

  return (
    <main className="hero-glow grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-sm font-medium text-stone-600 hover:text-stone-900">
          ← Back to {siteConfig.name}
        </Link>

        <div className="mt-4 rounded-3xl border border-stone-200 bg-white p-8 shadow-card">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-stone-900 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-stone-900">Admin sign in</h1>
          <p className="mt-1 text-sm text-stone-600">
            Sign in to add, edit and track your affiliate products.
          </p>

          <LoginForm next={target} />

          
        </div>
      </div>
    </main>
  );
}
