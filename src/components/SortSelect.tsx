"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SORT_OPTIONS, storefrontHref } from "@/lib/utils";

type Props = {
  q?: string;
  category?: string;
  sort: string;
};

export function SortSelect({ q, category, sort }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className="inline-flex items-center gap-2 text-sm text-stone-600">
      <span className="hidden sm:inline">Sort by</span>
      <select
        value={sort}
        disabled={pending}
        onChange={(event) => {
          const href = `${storefrontHref({ q, category, sort: event.target.value })}#categories`;
          startTransition(() => router.push(href, { scroll: false }));
        }}
        className="field field-focus w-auto cursor-pointer rounded-full py-2 pr-8 text-sm font-medium text-stone-800 disabled:opacity-60"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
