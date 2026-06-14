# Moderní Koberce - Produktový Agregátor

Specializovaný agregátor koberců s XML feed importem, galerií s filtry, long-tail SEO URL a CPC monetizací.

## 🎯 Cíl

Dosáhnout **20 000 Kč měsíčního zisku** z prokliků na retailery. Postupně zvyšovat na 3 Kč za proklik.

## ✨ Hlavní Funkce

- ✅ **XML Feed Import** - Automatický import produktů z Gazu.cz (Heureka formát)
- ✅ **Produktová Galerie** - Elegantní grid s lazy loading
- ✅ **Pokročilé Filtry** - Barva, materiál, rozměry, cena, tvar
- ✅ **Long-Tail URL** - SEO-friendly URL struktura (`/koberce/cervene/vlnene/200x300`)
- ✅ **Meta Tags** - Automaticky generované z filtrů a produktů
- ✅ **CPC Tracking** - Sledování prokliků pro monetizaci
- ✅ **Admin Panel** - Správa feedů a import
- ✅ **Responsive Design** - Optimalizováno pro mobile

## 🏗️ Tech Stack

- **Frontend**: React 19 + TypeScript + TailwindCSS 4
- **Backend**: Express 4 + tRPC 11
- **Database**: MySQL (Drizzle ORM)
- **Hosting**: Manus (vestavěný)
- **Authentication**: Manus OAuth

## 📁 Struktura

```
modernikoberce-cz/
├── client/                 # React frontend
├── server/                 # Express + tRPC backend
├── drizzle/               # Database migrations
├── scripts/               # Utility scripts
├── ARCHITECTURE.md        # Technická dokumentace
├── CLAUDE_GUIDE.md        # Průvodce pro Claude
└── XML_FEED_ANALYSIS.md   # Analýza XML feedu
```

## 🚀 Rychlý Start

```bash
# Instalace
pnpm install

# Dev server
pnpm dev

# Testy
pnpm test

# TypeScript check
pnpm check
```

## 📊 Databáze

6 tabulek:
- `feeds` - XML feedy
- `products` - Produkty
- `product_parameters` - Filtrovatelné parametry
- `filter_cache` - Cache filtrů
- `seo_metadata` - Cache SEO meta tagů
- `click_tracking` - CPC tracking

## 🔄 XML Feed

Importuje z: `https://www.gazu.cz/heureka/export/products.xml`

Parsované parametry:
- Rozměr koberce
- Barva
- Materiál
- Tvar
- Délka vlasu
- Kolekce
- Kvalita a gramáž

## 📚 Dokumentace

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technická architektura
- **[CLAUDE_GUIDE.md](./CLAUDE_GUIDE.md)** - Průvodce pro Claude a vývojáře
- **[XML_FEED_ANALYSIS.md](./XML_FEED_ANALYSIS.md)** - Analýza XML feedu
- **[todo.md](./todo.md)** - Seznam úkolů a stav projektu

## 🔐 Autentizace

- Manus OAuth (vestavěný)
- Admin role pro správu feedů
- Public access pro galerii

## 💰 Monetizace

CPC (Cost Per Click):
1. Uživatel klikne na "Koupit"
2. Zaznamená se proklik
3. Uživatel je přesměrován na retailer
4. Admin vidí statistiky

Cena za proklik: Zatím 0 Kč, postupně 3 Kč.

## 🌐 URL Struktura

```
/                                    # Landing page
/koberce                            # Všechny koberce
/koberce/[barva]                   # Filtr barvy
/koberce/[barva]/[material]        # Filtr barvy + materiál
/koberce/[barva]/[material]/[size] # Komplexní filtry
/koberce/[slug]                    # Detail produktu
/admin                             # Admin panel (auth required)
```

## 🎨 Design

Inspirace: Favi.cz, Biano.cz

Elegantní, minimalistický design s důrazem na:
- Čitelnost
- Rychlost
- Konverze
- SEO

## 📈 Plán Vývoje

**Fáze 1-2**: Backend ✅
- Datový model
- XML parser
- tRPC API

**Fáze 3**: GitHub Setup (TEĎKA)
- GitHub repo
- Claude projekty
- Dokumentace

**Fáze 4-6**: Frontend
- Landing page
- Galerie s filtry
- Detail produktu
- Admin panel

**Fáze 7**: Nasazení
- Manus hosting
- Doména modernikoberce.cz
- Monitoring

## 🤝 Přispěvatelé

- **Manus** - Backend, infrastruktura
- **Claude** - Frontend, optimalizace
- **Vy** - Product owner, feedback

## 📞 Kontakt

Máte otázky? Podívejte se na:
1. [CLAUDE_GUIDE.md](./CLAUDE_GUIDE.md)
2. [ARCHITECTURE.md](./ARCHITECTURE.md)
3. [todo.md](./todo.md)

---

**Vytvořeno s ❤️ pro Moderní Koberce**
