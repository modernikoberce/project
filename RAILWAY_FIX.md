# Oprava Railway Deploy

## Co bylo špatně

1. **Chyběl `client/index.html`** – Vite ho potřebuje jako vstupní bod, bez něj build padá s `Could not resolve entry module "client/index.html"`
2. **`vite.config.ts` závisel na Manus pluginech** – `vite-plugin-manus-runtime` a `@builder.io/vite-plugin-jsx-loc` na Railway neexistují

## Soubory k přidání/úpravě v repozitáři

### Nové soubory (přidat):
- `client/index.html`
- `client/src/main.tsx`
- `client/src/App.tsx`
- `client/src/index.css`
- `railway.toml`

### Upravené soubory (nahradit):
- `vite.config.ts` – bez Manus pluginů

## Postup

```bash
# 1. Naklonuj repo
git clone https://github.com/modernikoberce/project.git
cd project

# 2. Zkopíruj všechny soubory z tohoto zipu

# 3. Odstraň Manus devDependencies z package.json:
#    - "vite-plugin-manus-runtime"
#    - "@builder.io/vite-plugin-jsx-loc"

# 4. Commitni a pushni
git add .
git commit -m "fix: add missing client/index.html and fix vite.config for Railway"
git push

# Railway automaticky spustí nový build
```

## Environment variables na Railway

Nastav v Railway Settings → Variables:
- `DATABASE_URL` – MySQL connection string
- `NODE_ENV` = `production`
- `PORT` = `3000` (Railway to nastaví automaticky)
