/**
 * Database helpers for products and feeds
 */

import { eq, and, gte, lte, inArray, like, desc, asc, sql } from "drizzle-orm";
import { getDb } from "./db";
import {
  products,
  productParameters,
  feeds,
  filterCache,
  seoMetadata,
  clickTracking,
  InsertProduct,
  InsertProductParameter,
  InsertFeed,
  Product,
} from "../drizzle/schema";

/**
 * Vytvoří nebo aktualizuje produkt v databázi
 */
export async function upsertProduct(
  feedId: number,
  product: Omit<InsertProduct, "feedId">
): Promise<Product> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(products)
    .values({
      ...product,
      feedId,
    } as InsertProduct)
    .onDuplicateKeyUpdate({
      set: {
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        retailerUrl: product.retailerUrl,
        affiliateUrl: product.affiliateUrl,
        category: product.category,
        parametersJson: product.parametersJson,
        updatedAt: new Date(),
      },
    });

  // Vrátit upsertnutý produkt
  const inserted = await db
    .select()
    .from(products)
    .where(and(eq(products.feedId, feedId), eq(products.externalId, product.externalId!)))
    .limit(1);

  return inserted[0]!;
}

/**
 * Uloží parametry produktu pro filtrování
 */
export async function saveProductParameters(
  productId: number,
  parameters: Record<string, string>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Smazat staré parametry
  await db.delete(productParameters).where(eq(productParameters.productId, productId));

  // Vložit nové parametry
  const paramList = Object.entries(parameters).map(([name, value]) => ({
    productId,
    paramName: name,
    paramValue: value,
  }));

  if (paramList.length > 0) {
    await db.insert(productParameters).values(paramList);
  }
}

/**
 * Získá dostupné filtry a jejich hodnoty
 */
export async function getAvailableFilters(): Promise<Record<string, string[]>> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const cached = await db.select().from(filterCache).limit(1);

  if (cached.length > 0 && cached[0]!.paramValues) {
    return cached[0]!.paramValues as Record<string, string[]>;
  }

  // Pokud není cache, vytvoř ji
  const filters = await db
    .selectDistinct({
      paramName: productParameters.paramName,
      paramValue: productParameters.paramValue,
    })
    .from(productParameters)
    .orderBy(productParameters.paramName, productParameters.paramValue);

  const result: Record<string, string[]> = {};
  filters.forEach(({ paramName, paramValue }) => {
    if (!result[paramName]) {
      result[paramName] = [];
    }
    if (!result[paramName]!.includes(paramValue)) {
      result[paramName]!.push(paramValue);
    }
  });

  // Ulož do cache
  await db
    .insert(filterCache)
    .values({
      paramName: "all_filters",
      paramValues: result,
    })
    .onDuplicateKeyUpdate({
      set: {
        paramValues: result,
        updatedAt: new Date(),
      },
    });

  return result;
}

/**
 * Invaliduje cache filtrů
 */
export async function invalidateFilterCache(): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(filterCache).where(eq(filterCache.paramName, "all_filters"));
}

/**
 * Získá produkty s filtry, sortováním a paginací
 */
export async function getProductsWithFilters(options: {
  filters?: Record<string, string[]>;
  sortBy?: "price_asc" | "price_desc" | "newest" | "relevance";
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ products: Product[]; total: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const page = options.page || 1;
  const limit = options.limit || 50;
  const offset = (page - 1) * limit;

  let whereConditions: any[] = [];

  // Aplikuj filtry
  if (options.filters && Object.keys(options.filters).length > 0) {
    for (const [paramName, values] of Object.entries(options.filters)) {
      if (values.length > 0) {
        const matchingProducts = await db
          .select({ productId: productParameters.productId })
          .from(productParameters)
          .where(and(eq(productParameters.paramName, paramName), inArray(productParameters.paramValue, values)));

        const productIds = matchingProducts.map((p) => p.productId);
        if (productIds.length > 0) {
          whereConditions.push(inArray(products.id, productIds));
        }
      }
    }
  }

  // Aplikuj search
  if (options.search) {
    whereConditions.push(like(products.name, `%${options.search}%`));
  }

  // Vytvořit query
  let baseQuery: any = db.select().from(products);

  if (whereConditions.length > 0) {
    baseQuery = baseQuery.where(and(...whereConditions));
  }

  // Aplikuj sorting
  let query: any = baseQuery;
  switch (options.sortBy) {
    case "price_asc":
      query = baseQuery.orderBy(asc(products.price));
      break;
    case "price_desc":
      query = baseQuery.orderBy(desc(products.price));
      break;
    case "newest":
      query = baseQuery.orderBy(desc(products.createdAt));
      break;
    default:
      query = baseQuery.orderBy(desc(products.createdAt));
  }

  // Spočítej celkový počet
  let countQuery = db.select({ count: sql<number>`COUNT(*)` }).from(products);

  if (whereConditions.length > 0) {
    countQuery = countQuery.where(and(...whereConditions)) as any;
  }

  const countResult = await countQuery;
  const total = countResult[0]?.count || 0;

  // Aplikuj paginaci
  const result = await query.limit(limit).offset(offset);

  return { products: result, total };
}

/**
 * Získá detail produktu podle ID
 */
export async function getProductById(productId: number): Promise<Product | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(products).where(eq(products.id, productId)).limit(1);

  return result.length > 0 ? result[0]! : null;
}

/**
 * Získá parametry produktu
 */
export async function getProductParameters(productId: number): Promise<Record<string, string>> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const params = await db
    .select()
    .from(productParameters)
    .where(eq(productParameters.productId, productId));

  const result: Record<string, string> = {};
  params.forEach((p) => {
    result[p.paramName] = p.paramValue;
  });

  return result;
}

/**
 * Zaznamenává proklik na produkt
 */
export async function recordProductClick(
  productId: number,
  feedId: number,
  userAgent?: string,
  referer?: string,
  ipHash?: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(clickTracking).values({
    productId,
    feedId,
    userAgent,
    referer,
    ipHash,
  });
}

/**
 * Získá statistiky kliků
 */
export async function getClickStats(options?: {
  productId?: number;
  feedId?: number;
  startDate?: Date;
  endDate?: Date;
}): Promise<{ totalClicks: number; uniqueIps: number; lastClick: Date | null }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let whereConditions: any[] = [];

  if (options?.productId) {
    whereConditions.push(eq(clickTracking.productId, options.productId));
  }

  if (options?.feedId) {
    whereConditions.push(eq(clickTracking.feedId, options.feedId));
  }

  if (options?.startDate && options?.endDate) {
    whereConditions.push(
      and(gte(clickTracking.timestamp, options.startDate), lte(clickTracking.timestamp, options.endDate))
    );
  }

  let query = db.select().from(clickTracking);

  if (whereConditions.length > 0) {
    query = query.where(and(...whereConditions)) as any;
  }

  const clicks = await query;

  const uniqueIps = new Set(clicks.map((c) => c.ipHash).filter(Boolean)).size;

  return {
    totalClicks: clicks.length,
    uniqueIps,
    lastClick: clicks.length > 0 ? new Date(Math.max(...clicks.map((c) => c.timestamp.getTime()))) : null,
  };
}

/**
 * Vytvoří nebo aktualizuje feed
 */
export async function upsertFeed(feedData: InsertFeed): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .insert(feeds)
    .values(feedData)
    .onDuplicateKeyUpdate({
      set: {
        name: feedData.name,
        status: feedData.status,
        lastImportedAt: feedData.lastImportedAt,
        lastErrorMessage: feedData.lastErrorMessage,
        productCount: feedData.productCount,
        updatedAt: new Date(),
      },
    });

  // Vrátit ID feedu
  const inserted = await db.select().from(feeds).where(eq(feeds.url, feedData.url!)).limit(1);

  return inserted[0]!.id;
}

/**
 * Získá všechny feedy
 */
export async function getAllFeeds() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(feeds).orderBy(desc(feeds.createdAt));
}

/**
 * Získá feed podle ID
 */
export async function getFeedById(feedId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(feeds).where(eq(feeds.id, feedId)).limit(1);

  return result.length > 0 ? result[0]! : null;
}

/**
 * Aktualizuje počet produktů v feedu
 */
export async function updateFeedProductCount(feedId: number, count: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(feeds)
    .set({
      productCount: count,
      updatedAt: new Date(),
    })
    .where(eq(feeds.id, feedId));
}

/**
 * Smaže všechny produkty z feedu
 */
export async function deleteProductsByFeedId(feedId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(products).where(eq(products.feedId, feedId));
}
