/**
 * Bulk upload products from a CSV file into the `products` table.
 *
 * Usage:
 *   npx dotenv -e .env.local -- npx tsx src/db/bulk-upload.ts src/db/products-template.csv
 *
 * CSV columns expected (header row required):
 *   url,name,price,currency,category,imageUrl,note,store,rating,featured,published
 *
 * Only `url` is required. Everything else is optional — blank cells become
 * sensible defaults (see buildRow below). You can safely re-run this script;
 * rows whose slug already exists are skipped, not duplicated.
 */
import fs from "node:fs";
import path from "node:path";
import { db } from "./index";
import { products } from "./schema";
import { eq } from "drizzle-orm";

type Row = Record<string, string>;

function parseCsv(content: string): Row[] {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    // simple CSV split that respects "quoted, commas"
    const cells: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') inQuotes = !inQuotes;
      else if (ch === "," && !inQuotes) {
        cells.push(cur);
        cur = "";
      } else cur += ch;
    }
    cells.push(cur);
    const row: Row = {};
    headers.forEach((h, i) => (row[h] = (cells[i] ?? "").trim()));
    return row;
  });
}

function extractAsin(url: string): string {
  const match = url.match(/\/([A-Za-z0-9]{8,12})\/?(?:[?#].*)?$/);
  return match ? match[1] : Math.random().toString(36).slice(2, 10);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toBool(value: string): boolean {
  return ["yes", "true", "1"].includes(value.toLowerCase());
}

function buildRow(row: Row) {
  const asin = extractAsin(row.url);
  const name = row.name?.trim() || `Product ${asin}`;
  const slug = row.name?.trim() ? `${slugify(row.name)}-${asin.toLowerCase()}` : asin.toLowerCase();

  return {
    name,
    slug,
    description: row.note?.trim() || null,
    note: row.note?.trim() || null,
    price: row.price?.trim() ? row.price.trim() : null,
    currency: row.currency?.trim() || "INR",
    imageUrl: row.imageUrl?.trim() || null,
    affiliateUrl: row.url.trim(),
    store: row.store?.trim() || "Amazon",
    category: row.category?.trim() || null,
    rating: row.rating?.trim() ? row.rating.trim() : null,
    featured: toBool(row.featured ?? ""),
    published: toBool(row.published ?? ""),
    clicks: 0,
  };
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: tsx bulk-upload.ts <path-to-csv>");
    process.exit(1);
  }

  const fullPath = path.resolve(csvPath);
  const content = fs.readFileSync(fullPath, "utf-8");
  const rows = parseCsv(content).filter((r) => r.url && r.url.trim().length > 0);

  console.log(`Found ${rows.length} rows in ${csvPath}`);

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const raw of rows) {
    const record = buildRow(raw);
    try {
      const existing = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.slug, record.slug))
        .limit(1);

      if (existing.length > 0) {
        console.log(`SKIP  (already exists) -> ${record.slug}`);
        skipped++;
        continue;
      }

      await db.insert(products).values(record);
      console.log(`OK    -> ${record.slug}`);
      inserted++;
    } catch (err) {
      console.error(`FAIL  -> ${record.slug}:`, (err as Error).message);
      failed++;
    }
  }

  console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}, Failed: ${failed}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Bulk upload failed:", err);
  process.exit(1);
});
