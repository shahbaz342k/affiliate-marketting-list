import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    note: text("note"),
    price: numeric("price", { precision: 12, scale: 2 }),
    currency: text("currency").notNull().default("USD"),
    imageUrl: text("image_url"),
    affiliateUrl: text("affiliate_url").notNull(),
    store: text("store"),
    category: text("category"),
    rating: numeric("rating", { precision: 2, scale: 1 }),
    featured: boolean("featured").notNull().default(false),
    published: boolean("published").notNull().default(true),
    clicks: integer("clicks").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("products_category_idx").on(table.category),
    index("products_published_idx").on(table.published),
  ],
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
