"use client";

import Link from "next/link";
import { useActionState, useState, type ReactNode } from "react";
import { ProductImage } from "@/components/ProductImage";
import type { FormState, ProductFormValues } from "@/lib/product-form";
import { CURRENCIES, cn } from "@/lib/utils";

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initialValues: ProductFormValues;
  categories: string[];
  stores: string[];
  submitLabel: string;
  cancelHref?: string;
};

function Field({
  label,
  htmlFor,
  error,
  hint,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-center justify-between text-sm font-medium text-stone-800">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-stone-400">Optional</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-stone-500">{hint}</p>
      ) : null}
    </div>
  );
}

function Toggle({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-stone-300">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-brand-600"
      />
      <span>
        <span className="block text-sm font-medium text-stone-900">{label}</span>
        <span className="block text-xs text-stone-500">{description}</span>
      </span>
    </label>
  );
}

export function ProductForm({
  action,
  initialValues,
  categories,
  stores,
  submitLabel,
  cancelHref = "/admin",
}: Props) {
  const [state, formAction, pending] = useActionState(action, null);
  const values = state?.values ?? initialValues;
  const errors = state?.fieldErrors ?? {};
  const [imagePreview, setImagePreview] = useState(values.imageUrl);

  const inputClass = (hasError?: string) =>
    cn("field field-focus", hasError && "border-red-400 focus:border-red-500");

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      {state?.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 lg:col-span-2">
          {state.error}
        </div>
      )}

      {/* Main column */}
      <div className="space-y-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-card sm:p-8">
        <Field label="Product name" htmlFor="name" error={errors.name}>
          <input
            id="name"
            name="name"
            required
            maxLength={160}
            defaultValue={values.name}
            placeholder="e.g. Noise-Cancelling Wireless Headphones"
            className={inputClass(errors.name)}
          />
        </Field>

        <Field
          label="Affiliate link"
          htmlFor="affiliateUrl"
          error={errors.affiliateUrl}
          hint="Paste the full tracking link from your affiliate program. Friends will be sent here when they click “Buy”."
        >
          <input
            id="affiliateUrl"
            name="affiliateUrl"
            type="url"
            required
            inputMode="url"
            defaultValue={values.affiliateUrl}
            placeholder="https://www.amazon.com/dp/B0XXXX?tag=yourtag-20"
            className={inputClass(errors.affiliateUrl)}
          />
        </Field>

        <Field
          label="Image URL"
          htmlFor="imageUrl"
          error={errors.imageUrl}
          optional
          hint="Right-click a product photo on the store page and copy the image address."
        >
          <div className="flex gap-4">
            <input
              id="imageUrl"
              name="imageUrl"
              inputMode="url"
              defaultValue={values.imageUrl}
              onChange={(event) => setImagePreview(event.target.value.trim())}
              placeholder="https://…/product.jpg"
              className={inputClass(errors.imageUrl)}
            />
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
              <ProductImage
                key={imagePreview || "empty"}
                src={imagePreview || null}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </Field>

        <Field label="Short description" htmlFor="description" error={errors.description} optional>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={values.description}
            placeholder="What is it and what makes it good? One or two sentences."
            className={cn(inputClass(errors.description), "resize-y")}
          />
        </Field>

        <Field
          label="Why I recommend it"
          htmlFor="note"
          error={errors.note}
          optional
          hint="Your personal take — this is what friends trust most."
        >
          <textarea
            id="note"
            name="note"
            rows={3}
            defaultValue={values.note}
            placeholder="I've used this daily for a year and…"
            className={cn(inputClass(errors.note), "resize-y")}
          />
        </Field>
      </div>

      {/* Side column */}
      <div className="space-y-6">
        <div className="space-y-5 rounded-3xl border border-stone-200 bg-white p-6 shadow-card">
          <div className="grid grid-cols-[1fr_7rem] gap-3">
            <Field label="Price" htmlFor="price" error={errors.price} optional>
              <input
                id="price"
                name="price"
                inputMode="decimal"
                defaultValue={values.price}
                placeholder="49.99"
                className={inputClass(errors.price)}
              />
            </Field>
            <Field label="Currency" htmlFor="currency" error={errors.currency}>
              <select
                id="currency"
                name="currency"
                defaultValue={values.currency}
                className={inputClass(errors.currency)}
              >
                {CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label="Store"
            htmlFor="store"
            error={errors.store}
            optional
            hint="Leave blank to detect it from the link (Amazon, Flipkart, eBay…)."
          >
            <input
              id="store"
              name="store"
              list="store-suggestions"
              defaultValue={values.store}
              placeholder="Amazon"
              className={inputClass(errors.store)}
            />
            <datalist id="store-suggestions">
              {Array.from(new Set(["Amazon", "Flipkart", "eBay", "Walmart", "Etsy", ...stores])).map((store) => (
                <option key={store} value={store} />
              ))}
            </datalist>
          </Field>

          <Field label="Category" htmlFor="category" error={errors.category} optional>
            <input
              id="category"
              name="category"
              list="category-suggestions"
              defaultValue={values.category}
              placeholder="Audio, Kitchen, Desk Setup…"
              className={inputClass(errors.category)}
            />
            <datalist id="category-suggestions">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </Field>

          <Field label="Your rating (0–5)" htmlFor="rating" error={errors.rating} optional>
            <input
              id="rating"
              name="rating"
              type="number"
              min={0}
              max={5}
              step={0.1}
              inputMode="decimal"
              defaultValue={values.rating}
              placeholder="4.5"
              className={inputClass(errors.rating)}
            />
          </Field>
        </div>

        <div className="space-y-3">
          <Toggle
            name="published"
            label="Published"
            description="Visible on the storefront. Turn off to keep it as a draft."
            defaultChecked={values.published}
          />
          <Toggle
            name="featured"
            label="Top pick"
            description="Highlight it in the featured section at the top of the page."
            defaultChecked={values.featured}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Saving…" : submitLabel}
          </button>
          <Link
            href={cancelHref}
            className="rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-400"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
