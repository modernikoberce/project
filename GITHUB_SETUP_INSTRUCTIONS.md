# Instrukce pro Kopírování Souborů do GitHub Repo

Máte repo na: `D:\github\project`

## 📋 Soubory k Přidání

### 1️⃣ DOKUMENTACE (Přidejte do kořene projektu)

Tyto soubory zkopírujte do `D:\github\project\`:

```
ARCHITECTURE.md
CLAUDE_GUIDE.md
README.md
XML_FEED_ANALYSIS.md
todo.md
```

---

### 2️⃣ SERVER - BACKEND (Vytvořte složku `server/`)

Vytvořte tuto strukturu:

```
D:\github\project\server\
├── routers\
│   ├── feeds.ts
│   └── products.ts
├── utils\
│   ├── slug.ts
│   └── xmlParser.ts
├── db.products.ts
└── routers.ts
```

**Soubory:**
- `server/routers/feeds.ts` - Správa XML feedů
- `server/routers/products.ts` - Produkty a galerie
- `server/utils/slug.ts` - Generování SEO URL
- `server/utils/xmlParser.ts` - XML parser
- `server/db.products.ts` - Databázové funkce
- `server/routers.ts` - Hlavní router (NAHRADIT existující)

---

### 3️⃣ DATABÁZE - DRIZZLE (Vytvořte složku `drizzle/`)

Vytvořte tuto strukturu:

```
D:\github\project\drizzle\
├── 0000_real_mulholland_black.sql
├── 0001_noisy_lady_ursula.sql
├── meta\
│   ├── 0000_snapshot.json
│   └── 0001_snapshot.json
└── schema.ts (NAHRADIT existující)
```

**Soubory:**
- `drizzle/schema.ts` - Datový model (NAHRADIT)
- `drizzle/0000_real_mulholland_black.sql` - Migrace 1
- `drizzle/0001_noisy_lady_ursula.sql` - Migrace 2
- `drizzle/meta/0000_snapshot.json` - Snapshot 1
- `drizzle/meta/0001_snapshot.json` - Snapshot 2

---

### 4️⃣ OSTATNÍ SOUBORY (V kořeni)

```
D:\github\project\
├── drizzle.config.ts (NAHRADIT existující)
├── vite.config.ts (NAHRADIT existující)
├── vitest.config.ts (NAHRADIT existující)
└── tsconfig.json (NAHRADIT existující)
```

---

## 🚀 Postup Kopírování

### Krok 1: Dokumentace
1. Otevřete `D:\github\project\`
2. Zkopírujte tyto soubory:
   - ARCHITECTURE.md
   - CLAUDE_GUIDE.md
   - README.md
   - XML_FEED_ANALYSIS.md
   - todo.md

### Krok 2: Server
1. Vytvořte složku `D:\github\project\server\`
2. Vytvořte podsložku `D:\github\project\server\routers\`
3. Vytvořte podsložku `D:\github\project\server\utils\`
4. Zkopírujte soubory:
   - `server/routers/feeds.ts` → `D:\github\project\server\routers\feeds.ts`
   - `server/routers/products.ts` → `D:\github\project\server\routers\products.ts`
   - `server/utils/slug.ts` → `D:\github\project\server\utils\slug.ts`
   - `server/utils/xmlParser.ts` → `D:\github\project\server\utils\xmlParser.ts`
   - `server/db.products.ts` → `D:\github\project\server\db.products.ts`
   - `server/routers.ts` → `D:\github\project\server\routers.ts` (NAHRADIT)

### Krok 3: Databáze
1. Vytvořte složku `D:\github\project\drizzle\` (pokud neexistuje)
2. Vytvořte podsložku `D:\github\project\drizzle\meta\`
3. Zkopírujte soubory:
   - `drizzle/schema.ts` → `D:\github\project\drizzle\schema.ts` (NAHRADIT)
   - `drizzle/0000_real_mulholland_black.sql` → `D:\github\project\drizzle\0000_real_mulholland_black.sql`
   - `drizzle/0001_noisy_lady_ursula.sql` → `D:\github\project\drizzle\0001_noisy_lady_ursula.sql`
   - `drizzle/meta/0000_snapshot.json` → `D:\github\project\drizzle\meta\0000_snapshot.json`
   - `drizzle/meta/0001_snapshot.json` → `D:\github\project\drizzle\meta\0001_snapshot.json`

### Krok 4: Ostatní
1. Zkopírujte/nahraďte v `D:\github\project\`:
   - `drizzle.config.ts` (NAHRADIT)
   - `vite.config.ts` (NAHRADIT)
   - `vitest.config.ts` (NAHRADIT)
   - `tsconfig.json` (NAHRADIT)

---

## 📝 Po Kopírování

1. Otevřete GitHub Desktop
2. Měl by vidět všechny změny (nové soubory)
3. Klikněte "Commit to main" a napište:
   ```
   Initial commit: Backend infrastructure with XML parser, database, and tRPC API
   ```
4. Klikněte "Push origin"
5. Hotovo! ✅

---

## 📍 Kde Najít Soubory

Všechny soubory jsou v Manus projektu:
- Cesta: `/home/ubuntu/modernikoberce-cz/`

Já vám je mohu poslat jako ZIP nebo vám dám přesné obsahy každého souboru.

---

## ⚠️ Důležité

- **NAHRADIT** znamená, že soubor již existuje v repo, musíte ho přepsat
- Zachovejte strukturu složek
- Nemazejte `node_modules`, `.git`, `package.json`, `pnpm-lock.yaml`
- Po kopírování spusťte `pnpm install` v terminálu (v `D:\github\project\`)

---

Jakmile to uděláte, pošlete mi screenshot GitHub Desktop a řekneme si, co dělat dál! 🚀
