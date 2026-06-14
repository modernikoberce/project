/**
 * XML Feed Parser for Heureka format
 */

import { parseStringPromise } from "xml2js";

export interface ParsedProduct {
  externalId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  retailerUrl: string;
  category?: string;
  parameters: Record<string, string>;
}

export interface ParsedFeed {
  products: ParsedProduct[];
  totalCount: number;
}

/**
 * Parsuje Heureka XML feed a vrací strukturované produkty
 */
export async function parseHeurekaXmlFeed(xmlContent: string): Promise<ParsedFeed> {
  try {
    const parsed = await parseStringPromise(xmlContent, {
      explicitArray: false,
      mergeAttrs: true,
      charkey: "#text",
    });

    if (!parsed.SHOP || !parsed.SHOP.SHOPITEM) {
      throw new Error("Invalid Heureka XML structure");
    }

    // Normalizace na pole (i když je jen jeden produkt)
    const items = Array.isArray(parsed.SHOP.SHOPITEM)
      ? parsed.SHOP.SHOPITEM
      : [parsed.SHOP.SHOPITEM];

    const products: ParsedProduct[] = items
      .map((item: any) => {
        try {
          const parameters: Record<string, string> = {};

          // Parsování parametrů
          if (item.PARAM) {
            const params = Array.isArray(item.PARAM) ? item.PARAM : [item.PARAM];
            params.forEach((param: any) => {
              if (param.name && param["#text"]) {
                parameters[param.name] = param["#text"];
              }
            });
          }

          // Parsování ceny (může být string s mezerou jako tisícový oddělovač)
          const priceStr = item.PRICE || "0";
          const price = parseFloat(priceStr.toString().replace(/\s/g, "").replace(",", "."));

          return {
            externalId: item.ITEM_ID || `item-${Date.now()}`,
            name: item.PRODUCTNAME || "Unnamed Product",
            description: item.DESCRIPTION || undefined,
            price: isNaN(price) ? 0 : price,
            imageUrl: item.IMGURL || undefined,
            retailerUrl: item.URL || "",
            category: item.CATEGORY || undefined,
            parameters,
          };
        } catch (error) {
          console.error("Error parsing individual product:", error);
          return null;
        }
      })
      .filter((p: ParsedProduct | null): p is ParsedProduct => p !== null);

    return {
      products,
      totalCount: products.length,
    };
  } catch (error) {
    console.error("Error parsing Heureka XML:", error);
    throw new Error(`Failed to parse XML feed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Stahuje a parsuje XML feed z URL
 */
export async function fetchAndParseXmlFeed(feedUrl: string): Promise<ParsedFeed> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 sekund timeout

    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent": "ModerniKoberce/1.0 (+https://modernikoberce.cz)",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const xmlContent = await response.text();
    return parseHeurekaXmlFeed(xmlContent);
  } catch (error) {
    console.error("Error fetching XML feed:", error);
    throw new Error(`Failed to fetch feed from ${feedUrl}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extrahuje klíčové parametry z produktu pro filtrování
 * Vrací seznam parametrů, které se mají indexovat
 */
export function extractFilterableParameters(product: ParsedProduct): Record<string, string> {
  const filterableParams: Record<string, string> = {};

  // Standardní parametry, které se hledají v XML
  const parameterNames = [
    "Barva",
    "Color",
    "Barva",
    "Materiál",
    "Material",
    "Rozměr",
    "Size",
    "Velikost",
    "Typ vláken",
    "Pile Type",
    "Tvar",
    "Shape",
    "Styl",
    "Style",
  ];

  parameterNames.forEach((name) => {
    const value = product.parameters[name];
    if (value) {
      const normalizedName = name.toLowerCase().replace(/\s+/g, "_");
      filterableParams[normalizedName] = value;
    }
  });

  return filterableParams;
}
