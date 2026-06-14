# Architektura Moderní Koberce

## Přehled Systému

Moderní Koberce je produktový agregátor zaměřený na koberce. Systém importuje produkty z XML feedů (Heureka formát), ukládá je do databáze a prezentuje je v elegantní galerii s pokročilými filtry a SEO optimalizací.

## Datový Model

### Tabulky

#### 1. `feeds` - Správa XML feedů
```sql
CREATE TABLE feeds (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(2048) NOT NULL UNIQUE,
  status ENUM('active', 'inactive', 'error') DEFAULT 'active',
  lastImportedAt TIMESTAMP NULL,
  lastErrorMessage TEXT NULL,
  productCount INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. `products` - Produkty z feedů
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  feedId INT NOT NULL,
  externalId VARCHAR(255) NOT NULL,
  name VARCHAR(500) NOT NULL,
  description TEXT NULL,
  price DECIMAL(10, 2) NOT NULL,
  imageUrl VARCHAR(2048) NULL,
  retailerUrl VARCHAR(2048) NOT NULL,
  affiliateUrl VARCHAR(2048) NULL,
  category VARCHAR(500) NULL,
  parametersJson JSON NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (feedId) REFERENCES feeds(id) ON DELETE CASCADE,
  UNIQUE KEY unique_external (feedId, externalId),
  INDEX idx_name (name),
  INDEX idx_price (price),
  INDEX idx_category (category),
  FULLTEXT INDEX ft_search (name, description)
);
```

#### 3. `product_parameters` - Filtrovatelné parametry
```sql
CREATE TABLE product_parameters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  productId INT NOT NULL,
  paramName VARCHAR(100) NOT NULL,
  paramValue VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product (productId),
  INDEX idx_param (paramName, paramValue)
);
```

#### 4. `filter_cache` - Cache pro dostupné filtry
```sql
CREATE TABLE filter_cache (
  id INT PRIMARY KEY AUTO_INCREMENT,
  paramName VARCHAR(100) NOT NULL UNIQUE,
  paramValues JSON NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 5. `seo_metadata` - Cache pro SEO meta tagy
```sql
CREATE TABLE seo_metadata (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pageType ENUM('home', 'filter', 'product') NOT NULL,
  pageSlug VARCHAR(500) NOT NULL,
  metaTitle VARCHAR(160) NOT NULL,
  metaDescription VARCHAR(160) NOT NULL,
  metaKeywords VARCHAR(500) NULL,
  jsonLd JSON NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_page (pageType, pageSlug),
  INDEX idx_slug (pageSlug)
);
```

#### 6. `click_tracking` - Tracking prokliků pro CPC
```sql
CREATE TABLE click_tracking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  productId INT NOT NULL,
  feedId INT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  userAgent VARCHAR(500) NULL,
  referer VARCHAR(2048) NULL,
  ipHash VARCHAR(64) NULL,
  FOREIGN KEY (productId) REFERENCES products(id),
  FOREIGN KEY (feedId) REFERENCES feeds(id),
  INDEX idx_product (productId),
  INDEX idx_timestamp (timestamp)
);
```

## URL Struktura a Routing

### Vzory URL

| Cesta | Typ | Popis |
|-------|-----|-------|
| `/` | Landing page | Úvodní stránka s hero sekcí |
| `/koberce` | Galerie | Všechny koberce |
| `/koberce/[barva]` | Filtr | Koberce filtrované podle barvy |
| `/koberce/[barva]/[material]` | Filtr | Koberce filtrované podle barvy a materiálu |
| `/koberce/[barva]/[material]/[rozmer]` | Filtr | Komplexní filtry |
| `/koberce/[slug]` | Detail | Detail konkrétního produktu |
| `/admin` | Admin | Admin panel (pouze pro adminy) |

### Generování Slugů

Slugy se generují z parametrů produktu. Příklady:
- Barva: `cervene` (z "Červená")
- Materiál: `vlnene` (z "Vlna")
- Rozměr: `200x300` (bez úpravy)
- Tvar: `obdelnik` (z "Obdélník")

Slugy se normalizují: malá písmena, bez diakritiky, nahrazení mezer pomlčkami.

## XML Feed Import

### Heureka Format

Očekávaná struktura XML feedu:

```xml
<SHOP>
  <SHOPITEM>
    <ITEM_ID>123</ITEM_ID>
    <PRODUCTNAME>Koberec Červený 200x300</PRODUCTNAME>
    <DESCRIPTION>Popis produktu</DESCRIPTION>
    <URL>https://gazu.cz/koberec-123</URL>
    <IMGURL>https://gazu.cz/img/koberec-123.jpg</IMGURL>
    <PRICE>5999</PRICE>
    <CATEGORY>Koberce > Vlněné > Červené</CATEGORY>
    <PARAM name="Barva">Červená</PARAM>
    <PARAM name="Materiál">Vlna</PARAM>
    <PARAM name="Rozměr">200x300</PARAM>
    <PARAM name="Typ vláken">Vysoký vlas</PARAM>
  </SHOPITEM>
</SHOP>
```

### Import Process

1. Stažení XML feedu
2. Parsování XML
3. Validace dat
4. Upsert produktů (INSERT OR UPDATE)
5. Aktualizace `product_parameters`
6. Invalidace cache filtrů a SEO metadat
7. Aktualizace `feeds.lastImportedAt` a `productCount`

## SEO Strategie

### Meta Tagy - Automatické Generování

#### Home Page
- **Title**: "Moderní Koberce - Kvalitní Koberce Online | Srovnění Cen"
- **Description**: "Najděte si ideální koberec. Srovnění cen, filtrování podle barvy, materiálu, rozměru. Nejlepší nabídka koberců online."

#### Filter Pages (např. `/koberce/cervene/vlnene`)
- **Title**: "[Barva] [Materiál] Koberce - Srovnění Cen | Moderní Koberce"
- **Description**: "Koberce [barva] [materiál] s rozměry [rozměr]. Porovnání cen od různých prodejců. Koupit online."

#### Product Detail Page
- **Title**: "[Název produktu] - [Cena] Kč | Moderní Koberce"
- **Description**: "[Popis] Barva: [barva], Materiál: [materiál], Rozměr: [rozměr]. Koupit na [retailer]."

### Structured Data (JSON-LD)

Každá stránka bude obsahovat JSON-LD structured data pro:
- Produkty (Product schema)
- Organizaci (Organization schema)
- Breadcrumbs (BreadcrumbList schema)

### Sitemap

Automaticky generovaný `sitemap.xml` obsahující:
- Home page
- Všechny filter kombinace
- Všechny produkty

## API Endpointy (tRPC)

### Public Procedures

- `products.list(filters, sort, page, limit)` - Seznam produktů s filtry
- `products.getBySlug(slug)` - Detail produktu
- `products.getFilters()` - Dostupné filtry
- `products.search(query)` - Full-text search
- `seo.getMetadata(pageType, pageSlug)` - SEO metadata
- `tracking.recordClick(productId, feedId)` - Zaznamenání proklik

### Protected Procedures (Admin)

- `feeds.list()` - Seznam feedů
- `feeds.import(feedId)` - Manuální import
- `feeds.add(name, url)` - Přidání nového feedu
- `feeds.remove(feedId)` - Smazání feedu
- `feeds.getStatus(feedId)` - Status feedu
- `admin.getStats()` - Statistiky

## Caching Strategie

| Co | Jak dlouho | Kdy invalidovat |
|----|-----------|----|
| Filtry | 24 hodin | Po importu |
| SEO metadata | 7 dní | Po importu |
| Produkty | 1 hodina | Po importu |
| Search index | 1 den | Po importu |

## Performance Optimalizace

1. **Databázové indexy** - Na `feedId`, `price`, `category`, `paramName`, `paramValue`
2. **Full-text search** - Na `products.name` a `products.description`
3. **Lazy loading** - Obrázky se načítají až když jsou viditelné
4. **Image optimization** - WebP formát s fallbackem
5. **CDN** - Obrázky se servírují přes CDN
6. **Pagination** - Maximálně 50 produktů na stránku
7. **Query optimization** - Minimalizace N+1 problémů

## Monetizace - CPC Model

### Tracking

Každý proklik na retailer se zaznamenává v `click_tracking` tabulce:
- `productId` - Který produkt
- `feedId` - Který feed/retailer
- `timestamp` - Kdy
- `userAgent` - Jaký browser
- `referer` - Odkud přišel uživatel
- `ipHash` - Anonymizovaná IP (pro deduplikaci)

### Affiliate URL

Affiliate URL se generuje z `products.affiliateUrl` a obsahuje tracking parametry:
```
https://gazu.cz/koberec-123?utm_source=modernikoberce&utm_medium=cpc&utm_campaign=carpet_agg
```

### Reporting

Admin panel bude zobrazovat:
- Počet kliků za den/týden/měsíc
- Průměrná cena za klik
- Nejpopulárnější produkty
- ROI per feed

## Bezpečnost

1. **Input validation** - Všechny vstupy se validují
2. **SQL injection prevention** - Prepared statements
3. **XSS prevention** - HTML escaping
4. **CSRF protection** - CSRF tokens
5. **Rate limiting** - Na API endpointech
6. **Admin authentication** - OAuth2 (Manus)

## Budoucí Rozšíření

1. **Machine Learning** - Doporučování produktů
2. **User Reviews** - Recenze od uživatelů
3. **Wishlist** - Oblíbené produkty
4. **Price Alerts** - Upozornění na změnu ceny
5. **Social Sharing** - Sdílení na sociálních sítích
6. **Mobile App** - Mobilní aplikace
7. **Multiple Feeds** - Podpora více feedů
8. **Custom Branding** - White-label řešení
