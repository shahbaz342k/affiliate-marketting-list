import type { Metadata } from "next";
import Link from "next/link";
import { AccountAuthForm } from "@/components/AccountAuthForm";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <main className="hero-glow grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-sm font-medium text-stone-600 hover:text-stone-900">← Back to picks</Link>
        <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-8 shadow-card">
          <h1 className="text-2xl font-bold text-stone-900">Reset your password</h1>
          <p className="mt-1 text-sm text-stone-600">We’ll email a secure link if an account matches.</p>
          <AccountAuthForm mode="forgot" />
        </div>
      </div>
    </main>
  );
}