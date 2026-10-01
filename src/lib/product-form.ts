import type { NewProduct, Product } from "@/db/schema";
import { CURRENCIES, guessStore, isValidHttpUrl } from "./utils";

export type ProductFormValues = {
  name: string;
  affiliateUrl: string;
  imageUrl: string;
  price: string;
  currency: string;
  store: string;
  category: string;
  rating: string;
  description: string;
  note: string;
  featured: boolean;
  published: boolean;
};

export type FieldErrors = Partial<Record<keyof ProductFormValues, string>>;

export type FormState = {
  error?: string;
  fieldErrors?: FieldErrors;
  values?: ProductFormValues;
} | null;

export const emptyProductFormValues: ProductFormValues = {
  name: "",
  affiliateUrl: "",
  imageUrl: "",
  price: "",
  currency: "USD",
  store: "",
  category: "",
  rating: "",
  description: "",
  note: "",
  featured: false,
  published: true,
};

export function productToFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    affiliateUrl: product.affiliateUrl,
    imageUrl: product.imageUrl ?? "",
    price: product.price ? Number(product.price).toFixed(2) : "",
    currency: product.currency,
    store: product.store ?? "",
    category: product.category ?? "",
    rating: product.rating ? Number(product.rating).toFixed(1) : "",
    description: product.description ?? "",
    note: product.note ?? "",
    featured: product.featured,
    published: product.published,
  };
}

export function readFormValues(formData: FormData): ProductFormValues {
  const text = (key: string) => (formData.get(key)?.toString() ?? "").trim();
  return {
    name: text("name"),
    affiliateUrl: text("affiliateUrl"),
    imageUrl: text("imageUrl"),
    price: text("price"),
    currency: text("currency") || "USD",
    store: text("store"),
    category: text("category"),
    rating: text("rating"),
    description: text("description"),
    note: text("note"),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  };
}

export type ParsedProduct = Omit<NewProduct, "id" | "slug" | "clicks" | "createdAt" | "updatedAt">;

export type ValidationResult =
  | { ok: true; data: ParsedProduct }
  | { ok: false; fieldErrors: FieldErrors };

export function validateProductForm(values: ProductFormValues): ValidationResult {
  const fieldErrors: FieldErrors = {};

  if (!values.name) {
    fieldErrors.name = "Give the product a name.";
  } else if (values.name.length > 160) {
    fieldErrors.name = "Keep the name under 160 characters.";
  }

  if (!values.affiliateUrl) {
    fieldErrors.affiliateUrl = "The affiliate link is required.";
  } else if (!isValidHttpUrl(values.affiliateUrl)) {
    fieldErrors.affiliateUrl = "Enter a full URL starting with http:// or https://.";
  }

  if (values.imageUrl && !isValidHttpUrl(values.imageUrl) && !values.imageUrl.startsWith("/")) {
    fieldErrors.imageUrl = "Enter a full image URL (or a path starting with /).";
  }

  let price: string | null = null;
  if (values.price) {
    const amount = Number(values.price.replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(amount) || amount < 0) {
      fieldErrors.price = "Enter a valid price, e.g. 49.99.";
    } else if (amount > 9_999_999_999) {
      fieldErrors.price = "That price is too large.";
    } else {
      price = amount.toFixed(2);
    }
  }

  const currency = values.currency.toUpperCase();
  if (!(CURRENCIES as readonly string[]).includes(currency)) {
    fieldErrors.currency = "Pick a supported currency.";
  }

  let rating: string | null = null;
  if (values.rating) {
    const score = Number(values.rating);
    if (!Number.isFinite(score) || score < 0 || score > 5) {
      fieldErrors.rating = "Rating must be between 0 and 5.";
    } else {
      rating = score.toFixed(1);
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    data: {
      name: values.name,
      affiliateUrl: values.affiliateUrl,
      imageUrl: values.imageUrl || null,
      price,
      currency,
      store: values.store || guessStore(values.affiliateUrl),
      category: values.category || null,
      rating,
      description: values.description || null,
      note: values.note || null,
      featured: values.featured,
      published: values.published,
    },
  };
}
