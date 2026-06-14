/**
 * tRPC router for products and gallery
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../_core/trpc";
import {
  getProductsWithFilters,
  getProductById,
  getProductParameters,
  getAvailableFilters,
  recordProductClick,
} from "../db.products";
import { generateProductUrl } from "../utils/slug";

export const productsRouter = router({
  /**
   * Získá seznam produktů s filtry, sortováním a paginací
   */
  list: publicProcedure
    .input(
      z.object({
        filters: z.record(z.string(), z.array(z.string())).optional(),
        sortBy: z.enum(["price_asc", "price_desc", "newest", "relevance"]).optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(50),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { products, total } = await getProductsWithFilters({
        filters: input.filters,
        sortBy: input.sortBy,
        page: input.page,
        limit: input.limit,
        search: input.search,
      });

      const totalPages = Math.ceil(total / input.limit);

      return {
        products: products.map((p) => ({
          ...p,
          price: p.price.toString(),
          url: generateProductUrl(p.name, p.id),
        })),
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages,
        },
      };
    }),

  /**
   * Získá detail produktu podle ID
   */
  getById: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      const product = await getProductById(input.productId);
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const parameters = await getProductParameters(input.productId);

      return {
        ...product,
        price: product.price.toString(),
        parameters,
        url: generateProductUrl(product.name, product.id),
      };
    }),

  /**
   * Získá dostupné filtry
   */
  getFilters: publicProcedure.query(async () => {
    return getAvailableFilters();
  }),

  /**
   * Zaznamenává proklik na produkt (pro CPC tracking)
   */
  recordClick: publicProcedure
    .input(
      z.object({
        productId: z.number(),
        feedId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Extrahuj user agent a referer z headeru
      const userAgent = (ctx.req?.headers["user-agent"] as string) || undefined;
      const referer = (ctx.req?.headers["referer"] as string) || undefined;

      // Vytvoř hash z IP adresy (anonymizace)
      let ipHash = (ctx.req?.headers["x-forwarded-for"] as string) || (ctx.req?.socket?.remoteAddress as string) || "unknown";
      if (Array.isArray(ipHash)) {
        ipHash = ipHash[0] || "unknown";
      }
      const crypto = await import("crypto");
      const ipHashValue = crypto.createHash("sha256").update(ipHash).digest("hex");

      await recordProductClick(input.productId, input.feedId, userAgent || undefined, referer || undefined, ipHashValue);

      return { success: true };
    }),

  /**
   * Vyhledávání produktů (full-text search)
   */
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(2),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      const { products } = await getProductsWithFilters({
        search: input.query,
        limit: input.limit,
        sortBy: "relevance",
      });

      return products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price.toString(),
        imageUrl: p.imageUrl,
        url: generateProductUrl(p.name, p.id),
      }));
    }),
});
