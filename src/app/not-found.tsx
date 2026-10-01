import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">404</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900">That pick isn&apos;t here</h1>
        <p className="mt-2 text-sm text-stone-600">
          The product may have been removed or the link is wrong.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Back to all picks
        </Link>
      </div>
    </main>
  );
}
