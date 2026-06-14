/**
 * tRPC router for feed management
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import {
  getAllFeeds,
  getFeedById,
  upsertFeed,
  deleteProductsByFeedId,
  updateFeedProductCount,
  invalidateFilterCache,
  upsertProduct,
  saveProductParameters,
} from "../db.products";
import { fetchAndParseXmlFeed, extractFilterableParameters } from "../utils/xmlParser";
import { normalizeSlug } from "../utils/slug";

export const feedsRouter = router({
  /**
   * Získá seznam všech feedů (admin only)
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return getAllFeeds();
  }),

  /**
   * Získá detail feedu (admin only)
   */
  getById: protectedProcedure.input(z.object({ feedId: z.number() })).query(async ({ ctx, input }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    const feed = await getFeedById(input.feedId);
    if (!feed) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return feed;
  }),

  /**
   * Přidá nový feed (admin only)
   */
  add: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        url: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const feedId = await upsertFeed({
        name: input.name,
        url: input.url,
        status: "active",
        productCount: 0,
      });

      return { feedId };
    }),

  /**
   * Smaže feed a všechny jeho produkty (admin only)
   */
  delete: protectedProcedure
    .input(z.object({ feedId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const feed = await getFeedById(input.feedId);
      if (!feed) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Smazat všechny produkty
      await deleteProductsByFeedId(input.feedId);

      // Invalidovat cache
      await invalidateFilterCache();

      return { success: true };
    }),

  /**
   * Importuje produkty z XML feedu (admin only)
   * Toto je dlouhodobá operace, která se může spustit na pozadí
   */
  import: protectedProcedure
    .input(z.object({ feedId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const feed = await getFeedById(input.feedId);
      if (!feed) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      try {
        // Aktualizuj status na "processing"
        await upsertFeed({
          ...feed,
          status: "active",
        });

        // Stáhni a parsuj XML
        const parsedFeed = await fetchAndParseXmlFeed(feed.url);

        // Smazat staré produkty
        await deleteProductsByFeedId(input.feedId);

        // Vložit nové produkty
        let importedCount = 0;
        for (const parsedProduct of parsedFeed.products) {
          try {
            const product = await upsertProduct(input.feedId, {
              externalId: parsedProduct.externalId,
              name: parsedProduct.name,
              description: parsedProduct.description,
              price: parsedProduct.price.toString(),
              imageUrl: parsedProduct.imageUrl,
              retailerUrl: parsedProduct.retailerUrl,
              affiliateUrl: parsedProduct.retailerUrl,
              category: parsedProduct.category,
              parametersJson: parsedProduct.parameters as any,
            });

            // Uložit filtrovatelné parametry
            const filterableParams = extractFilterableParameters(parsedProduct);
            await saveProductParameters(product.id, filterableParams);

            importedCount++;
          } catch (error) {
            console.error("Error importing product:", error);
            // Pokračuj s dalším produktem
          }
        }

        // Aktualizuj počet produktů
        await updateFeedProductCount(input.feedId, importedCount);

        // Invaliduj cache
        await invalidateFilterCache();

        // Aktualizuj feed status
        await upsertFeed({
          name: feed.name,
          url: feed.url,
          status: "active",
          lastImportedAt: new Date(),
          lastErrorMessage: undefined,
          productCount: importedCount,
        });

        return {
          success: true,
          importedCount,
          totalCount: parsedFeed.totalCount,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        // Aktualizuj feed status na error
        await upsertFeed({
          name: feed.name,
          url: feed.url,
          status: "error",
          lastErrorMessage: errorMessage,
          productCount: feed.productCount || 0,
        });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to import feed: ${errorMessage}`,
        });
      }
    }),

  /**
   * Manuálně spustí import všech feedů (admin only)
   */
  importAll: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    const feeds = await getAllFeeds();
    const results = [];

    for (const feed of feeds) {
      try {
        const result = await fetchAndParseXmlFeed(feed.url);
        results.push({
          feedId: feed.id,
          feedName: feed.name,
          success: true,
          productCount: result.totalCount,
        });
      } catch (error) {
        results.push({
          feedId: feed.id,
          feedName: feed.name,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return { results };
  }),
});
