export const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "INR",
  "CAD",
  "AUD",
  "JPY",
  "SGD",
  "AED",
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function isSortValue(value: unknown): value is SortValue {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
  return slug || "product";
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const STORE_PATTERNS: Array<[RegExp, string]> = [
  [/(^|\.)amazon\./i, "Amazon"],
  [/amzn\.to$/i, "Amazon"],
  [/flipkart\./i, "Flipkart"],
  [/(^|\.)ebay\./i, "eBay"],
  [/walmart\./i, "Walmart"],
  [/bestbuy\./i, "Best Buy"],
  [/aliexpress\./i, "AliExpress"],
  [/(^|\.)etsy\./i, "Etsy"],
  [/(^|\.)target\./i, "Target"],
  [/myntra\./i, "Myntra"],
  [/(^|\.)apple\./i, "Apple"],
  [/shopee\./i, "Shopee"],
  [/lazada\./i, "Lazada"],
  [/newegg\./i, "Newegg"],
];

export function guessStore(url: string): string | null {
  try {
    const host = new URL(url).hostname;
    for (const [pattern, name] of STORE_PATTERNS) {
      if (pattern.test(host)) return name;
    }
    const parts = host.replace(/^www\./, "").split(".");
    const brand = parts.length > 1 ? parts[parts.length - 2] : parts[0];
    return brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : null;
  } catch {
    return null;
  }
}

export function formatPrice(
  price: string | number | null | undefined,
  currency = "USD",
): string | null {
  if (price === null || price === undefined || price === "") return null;
  const amount = typeof price === "number" ? price : Number(price);
  if (!Number.isFinite(amount)) return null;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatRating(rating: string | null | undefined): string | null {
  if (!rating) return null;
  const value = Number(rating);
  if (!Number.isFinite(value)) return null;
  return value.toFixed(1);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/** Builds a storefront href like `/?q=...&category=...`, dropping empty params. */
export function storefrontHref(
  params: Record<string, string | undefined | null>,
): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) searchParams.set(key, value);
  }
  const query = searchParams.toString();
  return query ? `/?${query}` : "/";
}
