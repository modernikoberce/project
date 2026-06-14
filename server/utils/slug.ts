/**
 * Slug utilities for URL generation and normalization
 */

/**
 * Normalizuje string na slug (malá písmena, bez diakritiky, pomlčky místo mezer)
 */
export function normalizeSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Odstranění diakritiky
    .replace(/[^a-z0-9]+/g, "-") // Nahrazení speciálních znaků pomlčkami
    .replace(/^-+|-+$/g, ""); // Odstranění pomlček na začátku a konci
}

/**
 * Generuje slug z parametrů filtru
 * Příklad: { color: "Červená", material: "Vlna" } => "cervene-vlnene"
 */
export function generateFilterSlug(filters: Record<string, string>): string {
  const parts = Object.values(filters)
    .filter(Boolean)
    .map((v) => normalizeSlug(v));
  return parts.join("/");
}

/**
 * Parsuje filter slug zpět na objektu
 * Příklad: "cervene/vlnene/200x300" => { color: "cervene", material: "vlnene", size: "200x300" }
 */
export function parseFilterSlug(slug: string): string[] {
  return slug.split("/").filter(Boolean);
}

/**
 * Generuje SEO-friendly slug pro produkt
 * Příklad: "Koberec Červený 200x300" => "koberec-cerveny-200x300"
 */
export function generateProductSlug(productName: string, productId: number): string {
  const normalized = normalizeSlug(productName);
  return `${normalized}-${productId}`;
}

/**
 * Extrahuje ID z product slugu
 * Příklad: "koberec-cerveny-200x300-123" => 123
 */
export function extractProductIdFromSlug(slug: string): number | null {
  const parts = slug.split("-");
  const lastPart = parts[parts.length - 1];
  const id = parseInt(lastPart, 10);
  return isNaN(id) ? null : id;
}

/**
 * Generuje URL cestu pro filtrovanou stránku
 * Příklad: { color: "Červená", material: "Vlna" } => "/koberce/cervene/vlnene"
 */
export function generateFilterUrl(filters: Record<string, string>): string {
  const slug = generateFilterSlug(filters);
  return slug ? `/koberce/${slug}` : "/koberce";
}

/**
 * Generuje URL cestu pro detail produktu
 * Příklad: "Koberec Červený 200x300", 123 => "/koberce/koberec-cerveny-200x300-123"
 */
export function generateProductUrl(productName: string, productId: number): string {
  const slug = generateProductSlug(productName, productId);
  return `/koberce/${slug}`;
}
