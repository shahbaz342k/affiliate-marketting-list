import { cn } from "@/lib/utils";

type Props = {
  productId: number;
  store?: string | null;
  size?: "sm" | "lg";
  className?: string;
};

export function BuyButton({ productId, store, size = "sm", className }: Props) {
  const label = store ? `Buy on ${store}` : "Buy now";
  return (
    <a
      href={`/go/${productId}`}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full bg-stone-900 font-semibold text-white shadow-sm transition hover:bg-brand-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 active:scale-[0.98]",
        size === "sm" ? "px-4 py-2 text-sm" : "px-6 py-3 text-base",
        className,
      )}
    >
      {label}
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"}
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
          clipRule="evenodd"
        />
      </svg>
    </a>
  );
}
