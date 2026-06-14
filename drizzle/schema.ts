import { decimal, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar, index, uniqueIndex } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Feeds - XML feed sources
 */
export const feeds = mysqlTable(
  "feeds",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    url: varchar("url", { length: 2048 }).notNull(),
    status: mysqlEnum("status", ["active", "inactive", "error"]).default("active"),
    lastImportedAt: timestamp("lastImportedAt"),
    lastErrorMessage: text("lastErrorMessage"),
    productCount: int("productCount").default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    urlUnique: uniqueIndex("url_unique").on(table.url),
  })
);

export type Feed = typeof feeds.$inferSelect;
export type InsertFeed = typeof feeds.$inferInsert;

/**
 * Products - Carpet products from feeds
 */
export const products = mysqlTable(
  "products",
  {
    id: int("id").autoincrement().primaryKey(),
    feedId: int("feedId").notNull(),
    externalId: varchar("externalId", { length: 255 }).notNull(),
    name: varchar("name", { length: 500 }).notNull(),
    description: text("description"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    imageUrl: varchar("imageUrl", { length: 2048 }),
    retailerUrl: varchar("retailerUrl", { length: 2048 }).notNull(),
    affiliateUrl: varchar("affiliateUrl", { length: 2048 }),
    category: varchar("category", { length: 500 }),
    parametersJson: json("parametersJson"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    feedIdFk: index("idx_feedId").on(table.feedId),
    nameIdx: index("idx_name").on(table.name),
    priceIdx: index("idx_price").on(table.price),
    categoryIdx: index("idx_category").on(table.category),
    externalUnique: uniqueIndex("unique_external").on(table.feedId, table.externalId),
  })
);

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Product Parameters - Filterable attributes
 */
export const productParameters = mysqlTable(
  "product_parameters",
  {
    id: int("id").autoincrement().primaryKey(),
    productId: int("productId").notNull(),
    paramName: varchar("paramName", { length: 100 }).notNull(),
    paramValue: varchar("paramValue", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    productIdIdx: index("idx_productId").on(table.productId),
    paramIdx: index("idx_param").on(table.paramName, table.paramValue),
  })
);

export type ProductParameter = typeof productParameters.$inferSelect;
export type InsertProductParameter = typeof productParameters.$inferInsert;

/**
 * Filter Cache - Available filter values
 */
export const filterCache = mysqlTable(
  "filter_cache",
  {
    id: int("id").autoincrement().primaryKey(),
    paramName: varchar("paramName", { length: 100 }).notNull().unique(),
    paramValues: json("paramValues").notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type FilterCache = typeof filterCache.$inferSelect;
export type InsertFilterCache = typeof filterCache.$inferInsert;

/**
 * SEO Metadata Cache
 */
export const seoMetadata = mysqlTable(
  "seo_metadata",
  {
    id: int("id").autoincrement().primaryKey(),
    pageType: mysqlEnum("pageType", ["home", "filter", "product"]).notNull(),
    pageSlug: varchar("pageSlug", { length: 500 }).notNull(),
    metaTitle: varchar("metaTitle", { length: 160 }).notNull(),
    metaDescription: varchar("metaDescription", { length: 160 }).notNull(),
    metaKeywords: varchar("metaKeywords", { length: 500 }),
    jsonLd: json("jsonLd"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    pageUnique: uniqueIndex("unique_page").on(table.pageType, table.pageSlug),
    slugIdx: index("idx_slug").on(table.pageSlug),
  })
);

export type SeoMetadata = typeof seoMetadata.$inferSelect;
export type InsertSeoMetadata = typeof seoMetadata.$inferInsert;

/**
 * Click Tracking - CPC tracking
 */
export const clickTracking = mysqlTable(
  "click_tracking",
  {
    id: int("id").autoincrement().primaryKey(),
    productId: int("productId").notNull(),
    feedId: int("feedId").notNull(),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
    userAgent: varchar("userAgent", { length: 500 }),
    referer: varchar("referer", { length: 2048 }),
    ipHash: varchar("ipHash", { length: 64 }),
  },
  (table) => ({
    productIdIdx: index("idx_productId").on(table.productId),
    timestampIdx: index("idx_timestamp").on(table.timestamp),
  })
);

export type ClickTracking = typeof clickTracking.$inferSelect;
export type InsertClickTracking = typeof clickTracking.$inferInsert;