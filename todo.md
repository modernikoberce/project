# Moderní Koberce - TODO List

## Fáze 1: Datový model a Backend Infrastruktura ✅ HOTOVO

### Databáze a Schema
- [x] Vytvořit tabulku `feeds` (id, name, url, lastImportedAt, productCount, status)
- [x] Vytvořit tabulku `products` (id, feedId, externalId, name, price, image, retailerUrl, affiliateUrl, parameters JSON)
- [x] Vytvořit tabulku `product_parameters` (id, productId, parameterName, parameterValue) - pro snadné filtrování
- [x] Vytvořit tabulku `seo_metadata` a `click_tracking` pro SEO a CPC

### XML Feed Parser
- [x] Vytvořit XML parser pro import produktů (Heureka format)
- [x] Implementovat tRPC proceduru `feeds.import` (manuální import)
- [x] Implementovat tRPC proceduru `feeds.list` (seznam všech feedů)
- [x] Implementovat tRPC proceduru `feeds.add` a `feeds.delete`
- [x] Přidat validaci XML struktury a error handling

### Product API
- [x] Vytvořit tRPC proceduru `products.list` (s filtry a paginací)
- [x] Vytvořit tRPC proceduru `products.getById` (detail produktu)
- [x] Vytvořit tRPC proceduru `products.getFilters` (dostupné filtry)
- [x] Implementovat generování long-tail URL slugů z parametrů
- [x] Implementovat `products.search` a `products.recordClick` pro CPC tracking

---

## Fáze 2: Frontend - Landing Page a Navigace (Přístup)

### Landing Page (Hero + CTA)
- [ ] Vytvořit hero sekci s backgroundem
- [ ] Přidat search field s autocomplete (volat `products.search`)
- [ ] Přidat sekci "Populární kategorie" (např. Červené koberce, Vlněné koberce, atd.)
- [ ] Přidat CTA button "Prohlédnout galerii"
- [ ] Optimalizovat pro mobile

### Navigation
- [ ] Vytvořit top navigation bar
- [ ] Přidat logo a branding
- [ ] Přidat odkaz na admin panel (pro přihlášené adminy)
- [ ] Integrace s `trpc.auth.me` pro detekci admin roli

---

## Fáze 3: Frontend - Galerie a Filtry (Přístup)

### Product Gallery
- [ ] Vytvořit grid layout pro produkty (responsive)
- [ ] Přidat product card komponentu (obrázek, název, cena, odkaz)
- [ ] Implementovat lazy loading obrázků
- [ ] Přidat placeholder během načítání
- [ ] Volat `trpc.products.list` s filtry

### Advanced Filters
- [ ] Vytvořit filter sidebar komponentu
- [ ] Implementovat filtry: barva, materiál, rozměry, cena, tvar (z `trpc.products.getFilters`)
- [ ] Implementovat dynamické generování URL z filtrů (long-tail)
- [ ] Přidat "Vymazat filtry" button
- [ ] Optimalizovat filtery pro mobile (drawer/modal)

### Sorting a Pagination
- [ ] Přidat dropdown pro sorting (cena vzestupně, cena sestupně, nejnovější)
- [ ] Implementovat pagination s prev/next buttons
- [ ] Přidat informaci o počtu výsledků
- [ ] Integrace s `trpc.products.list` pro sortování

---

## Fáze 4: Frontend - Detail Produktu (Přístup)

### Product Detail Page
- [ ] Vytvořit layout pro detail stránku
- [ ] Přidat galerii obrázků (lightbox)
- [ ] Zobrazit všechny parametry produktu (z `trpc.products.getById`)
- [ ] Přidat cenu a dostupnost
- [ ] Přidat CTA button "Koupit na [retailer]" (affiliate link + `trpc.products.recordClick`)
- [ ] Přidat related products (doporučení)
- [ ] Optimalizovat pro mobile

---

## Fáze 5: SEO a Meta Tags (Přístup)

### Dynamic Meta Generation
- [ ] Vytvořit funkci pro generování meta title z filtrů/produktu
- [ ] Vytvořit funkci pro generování meta description z filtrů/produktu
- [ ] Implementovat Open Graph meta tags (og:title, og:description, og:image)
- [ ] Přidat Twitter Card meta tags
- [ ] Implementovat structured data (JSON-LD) pro produkty
- [ ] Integrace s `trpc.seo` procedurami (bude vytvořeno)

### Long-Tail URL Structure
- [x] Implementovat URL pattern: `/koberce` (home)
- [x] Implementovat URL pattern: `/koberce/[barva]` (filtr barvy) - v slug.ts
- [x] Implementovat URL pattern: `/koberce/[barva]/[material]` (více filtrů) - v slug.ts
- [x] Implementovat URL pattern: `/koberce/[barva]/[material]/[rozmer]` (komplexní filtry) - v slug.ts
- [x] Implementovat URL pattern: `/koberce/[slug]` (detail produktu) - v slug.ts
- [ ] Vytvořit sitemap.xml
- [ ] Vytvořit robots.txt

---

## Fáze 6: Admin Panel (Přístup)

### Feed Management
- [ ] Vytvořit admin dashboard komponentu
- [ ] Přidat tabulku se seznamem feedů (volat `trpc.feeds.list`)
- [ ] Přidat button pro manuální import feedu (volat `trpc.feeds.import`)
- [ ] Zobrazit status, počet produktů, čas posledního importu
- [ ] Přidat možnost přidat nový feed (volat `trpc.feeds.add`)
- [ ] Přidat možnost smazat feed (volat `trpc.feeds.delete`)
- [ ] Přidat error logging a notifikace

### Analytics
- [ ] Přidat počet produktů v databázi (z `trpc.feeds.list`)
- [ ] Přidat počet filtrů (z `trpc.products.getFilters`)
- [ ] Přidat poslední import čas (z `trpc.feeds.list`)

---

## Fáze 7: Optimalizace a Monetizace (Přístup)

### Affiliate/CPC Links
- [x] Implementovat tracking pro affiliate linky (click_tracking tabulka)
- [ ] Přidat možnost konfigurovat affiliate parametry
- [ ] Přidat možnost A/B testovat různé affiliate sítě

### Performance
- [ ] Optimalizovat databázové dotazy (indexy) - částečně hotovo
- [ ] Přidat caching pro filtery a produkty
- [ ] Optimalizovat obrázky (WebP, lazy loading)
- [ ] Přidat CDN pro statické assety

### Monitoring
- [ ] Přidat error tracking (Sentry)
- [ ] Přidat analytics (Google Analytics)
- [ ] Přidat uptime monitoring

---

## Fáze 8: Testování a Deployment (Přístup)

### Testing
- [ ] Napsat unit testy pro XML parser
- [ ] Napsat testy pro API endpointy
- [ ] Napsat testy pro URL generování
- [ ] Napsat testy pro meta tag generování

### Deployment
- [ ] Nastavit CI/CD pipeline
- [ ] Nastavit production databázi
- [ ] Nastavit monitoring a alerting
- [ ] Vytvořit deployment dokumentaci

---

## Poznámky

- **Testovací XML feed**: https://www.gazu.cz/heureka/export/products.xml (Heureka format)
- **Affiliate sítě**: Bude se platit za proklik na vlastní web z karty produktu (zatím 0 Kč, postupně 3 Kč)
- **Hosting**: Manus (vestavěný hosting s vlastní doménou)
- **Monetizace**: Začít s CPC (tracking již implementován), postupně přidat další modely
- **Backend**: Hotovo - XML parser, databáze, tRPC API
- **Frontend**: Přístup - landing page, galerie, filtry, detail produktu
