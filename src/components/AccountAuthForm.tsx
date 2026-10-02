"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { userAuthClient } from "@/lib/user-auth-client";

type Mode = "login" | "signup" | "forgot" | "reset";

export function AccountAuthForm({ mode, next = "/account", token }: {
  mode: Mode;
  next?: string;
  token?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    try {
      if (mode === "login") {
        const result = await userAuthClient.signIn.email({ email, password });
        if (result.error) throw new Error(result.error.message);
        router.push(next);
        router.refresh();
      } else if (mode === "signup") {
        const result = await userAuthClient.signUp.email({
          name: String(form.get("name") || "").trim(),
          email,
          password,
        });
        if (result.error) throw new Error(result.error.message);
        setMessage("Your request was sent to the admin. You can sign in after your account is approved.");
      } else if (mode === "forgot") {
        const result = await userAuthClient.requestPasswordReset({
          email,
          redirectTo: `${window.location.origin}/account/reset-password`,
        });
        if (result.error) throw new Error(result.error.message);
        setMessage("If an account exists for that email, a password reset link is on its way.");
      } else {
        if (!token) throw new Error("This password reset link is invalid or expired.");
        const result = await userAuthClient.resetPassword({ newPassword: password, token });
        if (result.error) throw new Error(result.error.message);
        setMessage("Your password has been reset. You can now sign in.");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";
  const title = isLogin ? "Welcome back" : isSignup ? "Create your account" : isForgot ? "Reset your password" : "Choose a new password";
  const submitLabel = isLogin ? "Sign in" : isSignup ? "Create account" : isForgot ? "Send reset link" : "Update password";

  return (
    <form id="account-auth-form" onSubmit={submit} className="mt-6 space-y-4">
      {mode === "signup" && (
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-stone-800">Name</label>
          <input id="name" name="name" autoComplete="name" required maxLength={80} className="field field-focus" />
        </div>
      )}
      {mode !== "reset" && (
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-stone-800">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} className="field field-focus" />
        </div>
      )}
      {(isLogin || isSignup || mode === "reset") && (
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-stone-800">
            {mode === "reset" ? "New password" : "Password"}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={128}
            autoComplete={isLogin ? "current-password" : "new-password"}
            className="field field-focus"
          />
        </div>
      )}
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Please wait…" : submitLabel}
      </button>
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        {(isLogin || isSignup) && (
          <Link href={isLogin ? "/account/forgot-password" : "/account/login"} className="text-stone-600 hover:text-stone-900 hover:underline">
            {isLogin ? "Forgot password?" : "Already have an account? Sign in"}
          </Link>
        )}
        {isLogin && <Link href="/account/signup" className="text-brand-700 hover:underline">Create account</Link>}
        {isSignup && <Link href="/account/login" className="text-brand-700 hover:underline">Sign in</Link>}
        {(isForgot || mode === "reset") && <Link href="/account/login" className="text-brand-700 hover:underline">Back to sign in</Link>}
      </div>
      <h2 className="sr-only">{title}</h2>
    </form>
  );
}