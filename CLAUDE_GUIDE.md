# Claude Guide - Moderní Koberce Agregátor

Vítejte! Tato dokumentace vám pomůže pochopit projekt a začít s vývojem.

## 📋 Přehled projektu

**Moderní Koberce** je produktový agregátor zaměřený na koberce. Importuje produkty z XML feedů (Gazu.cz), zobrazuje je v galerii s filtry a monetizuje přes CPC (cost-per-click).

**Cíl**: 20 000 Kč měsíčně zisk z prokliků.

## 🏗️ Architektura

```
Frontend (React 19)
    ↓
tRPC API (TypeScript)
    ↓
Backend (Express 4)
    ↓
MySQL Database
    ↓
XML Feed Parser
```

## 📁 Struktura projektu

```
modernikoberce-cz/
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── pages/         # Stránky (Home, Gallery, ProductDetail, Admin)
│   │   ├── components/    # Komponenty (ProductCard, Filters, etc.)
│   │   └── App.tsx        # Routing
│   └── index.html
├── server/                 # Backend (Express + tRPC)
│   ├── routers/
│   │   ├── feeds.ts       # Správa XML feedů
│   │   └── products.ts    # Produkty a galerie
│   ├── utils/
│   │   ├── xmlParser.ts   # XML parser pro Heureka formát
│   │   └── slug.ts        # Generování SEO-friendly URL
│   ├── db.products.ts     # Databázové funkce
│   └── routers.ts         # Hlavní router
├── drizzle/               # Databázové migrace
│   └── schema.ts          # Datový model
├── ARCHITECTURE.md        # Technická dokumentace
├── XML_FEED_ANALYSIS.md   # Analýza XML feedu
└── todo.md                # Seznam úkolů
```

## 🗄️ Databázový model

### Tabulky

1. **feeds** - XML feedy
   - `id`, `name`, `url`, `status`, `lastImportedAt`, `productCount`, `lastErrorMessage`

2. **products** - Produkty
   - `id`, `feedId`, `externalId`, `name`, `price`, `imageUrl`, `retailerUrl`, `affiliateUrl`, `category`, `parametersJson`, `createdAt`, `updatedAt`

3. **product_parameters** - Filtrovatelné parametry
   - `id`, `productId`, `parameterName`, `parameterValue`

4. **filter_cache** - Cache dostupných filtrů
   - `id`, `filterKey`, `filterValues`, `updatedAt`

5. **seo_metadata** - Cache SEO meta tagů
   - `id`, `urlSlug`, `metaTitle`, `metaDescription`, `jsonLd`, `updatedAt`

6. **click_tracking** - Tracking prokliků pro CPC
   - `id`, `productId`, `feedId`, `userAgent`, `referer`, `ipHash`, `timestamp`

## 🔄 XML Feed Parser

Parser importuje produkty z Gazu.cz (Heureka formát):

```typescript
// Příklad parsování
const feed = await fetchAndParseXmlFeed('https://www.gazu.cz/heureka/export/products.xml');
// Vrací: { products: [...], totalCount: 1234 }
```

**Parsované parametry:**
- Rozměr koberce (120x170 cm)
- Barva (Červená, Modrá, atd.)
- Materiál (Polypropylen, Vlna, atd.)
- Tvar (Obdélníkový, Čtvercový, atd.)
- Délka vlasu (Krátký, Dlouhý, atd.)
- Kolekce (Atlas, Maya, atd.)

## 🌐 tRPC API Endpointy

### Feeds (Admin Only)

```typescript
// Získá seznam všech feedů
trpc.feeds.list.useQuery()

// Přidá nový feed
trpc.feeds.add.useMutation({ name, url })

// Smaže feed
trpc.feeds.delete.useMutation({ feedId })

// Importuje produkty z feedu
trpc.feeds.import.useMutation({ feedId })

// Importuje všechny feedy
trpc.feeds.importAll.useMutation()
```

### Products (Public)

```typescript
// Získá seznam produktů s filtry
trpc.products.list.useQuery({ filters, sortBy, page, limit })

// Získá detail produktu
trpc.products.getById.useQuery({ productId })

// Získá dostupné filtry
trpc.products.getFilters.useQuery()

// Vyhledávání
trpc.products.search.useQuery({ query, limit })

// Zaznamenává proklik (CPC)
trpc.products.recordClick.useMutation({ productId, feedId })
```

## 🎨 Frontend Stránky (TODO)

### 1. Landing Page (`/`)
- Hero sekce s backgroundem
- Search field s autocomplete
- Populární kategorie
- CTA button "Prohlédnout galerii"

### 2. Gallery (`/koberce`)
- Grid produktů
- Sidebar s filtry
- Sorting (cena, nejnovější)
- Pagination

### 3. Filtered Gallery (`/koberce/[barva]/[material]/...`)
- Stejný layout jako galerie
- URL generovaný z filtrů (long-tail SEO)
- Meta tagy generované z filtrů

### 4. Product Detail (`/koberce/[slug]`)
- Galerie obrázků
- Všechny parametry
- CTA button "Koupit na [retailer]"
- Related products

### 5. Admin Panel (`/admin`)
- Tabulka s feedy
- Button pro import
- Analytics (počet produktů, poslední import)

## 🔐 Autentizace

- Manus OAuth (vestavěný)
- Admin role pro správu feedů
- Public access pro galerii

## 📊 SEO

### Long-Tail URL Struktura

```
/koberce                                    # Všechny koberce
/koberce/cervene                           # Filtr barvy
/koberce/cervene/vlnene                    # Filtr barvy + materiál
/koberce/cervene/vlnene/200x300            # Filtr barvy + materiál + rozměr
/koberce/atlas-orientalni-5-cerveny        # Detail produktu
```

### Meta Tags

Automaticky generované z filtrů/produktu:

```html
<title>Červené vlněné koberce 200x300 cm | Moderní Koberce</title>
<meta name="description" content="Najděte si krásný červený vlněný koberec o rozměru 200x300 cm. Kvalitní koberce od 849 Kč.">
<meta property="og:title" content="Červené vlněné koberce 200x300 cm">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
```

## 💰 CPC Monetizace

1. Uživatel klikne na "Koupit" v detail stránce
2. Zavolá se `trpc.products.recordClick({ productId, feedId })`
3. Zaznamená se: IP (hash), user agent, referer, timestamp
4. Uživatel je přesměrován na retailer (Gazu.cz)
5. Admin vidí statistiky v admin panelu

## 🚀 Jak začít

### 1. Nastavení prostředí

```bash
# Instalace závislostí
pnpm install

# Spuštění dev serveru
pnpm dev

# Spuštění testů
pnpm test

# TypeScript check
pnpm check
```

### 2. Databáze

```bash
# Generování migrace
pnpm drizzle-kit generate

# Aplikace migrace (přes webdev_execute_sql)
```

### 3. Import XML feedu

```bash
# Přidat feed
POST /api/trpc/feeds.add
{ "name": "Gazu.cz", "url": "https://www.gazu.cz/heureka/export/products.xml" }

# Importovat produkty
POST /api/trpc/feeds.import
{ "feedId": 1 }
```

## 📝 Konvence

- **Soubory**: camelCase (xmlParser.ts, productCard.tsx)
- **Funkce**: camelCase (fetchAndParseXmlFeed)
- **Komponenty**: PascalCase (ProductCard, FilterSidebar)
- **Tabulky**: camelCase (product_parameters)
- **Sloupce**: camelCase (createdAt, productId)

## 🧪 Testování

```bash
# Spuštění testů
pnpm test

# Spuštění testů v watch modu
pnpm test --watch

# Spuštění konkrétního testu
pnpm test xmlParser.test.ts
```

## 🐛 Debugging

- **Dev logs**: `pnpm dev` - vidíte všechny logs
- **Browser console**: F12 v prohlížeči
- **Network tab**: Vidíte tRPC requesty
- **Database**: Přes Manus Management UI

## 📚 Užitečné linky

- [Manus Dokumentace](https://help.manus.im)
- [tRPC Dokumentace](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [React 19](https://react.dev)
- [TailwindCSS 4](https://tailwindcss.com)

## ❓ Otázky?

Pokud máte otázky, podívejte se na:
1. ARCHITECTURE.md - technická dokumentace
2. XML_FEED_ANALYSIS.md - analýza XML feedu
3. todo.md - seznam úkolů a stav projektu

Hodně štěstí! 🚀
