# Analýza XML Feedu Gazu.cz

## Struktura produktu

Feedu z Gazu.cz má tuto strukturu (odlišně od standardního Heureka formátu):

```xml
<SHOPITEM>
  <ITEM_ID>TA20185</ITEM_ID>
  <PRODUCTNAME>Kusový koberec Atlas - orientální 5 - červený Rozměr koberce: 120x170 cm</PRODUCTNAME>
  <PRODUCT>Kusový koberec Atlas - orientální 5 - červený Rozměr koberce: 120x170 cm</PRODUCT>
  <DESCRIPTION><![CDATA[...HTML obsah...]]></DESCRIPTION>
  <URL>https://www.gazu.cz/moderni-koberec-atlas-orientalni-5-cerveny/?variantId=25854</URL>
  <IMGURL>https://cdn.myshoptet.com/usr/www.gazu.cz/user/shop/orig/14574-10_moderni-koberec-atlas-orientalni-5-cerveny.jpg?67b4b77b</IMGURL>
  <IMGURL_ALTERNATIVE>...více obrázků...</IMGURL_ALTERNATIVE>
  <PRICE_VAT>849,00</PRICE_VAT>
  <VAT>21%</VAT>
  <PARAM>
    <PARAM_NAME>Rozměr koberce</PARAM_NAME>
    <VAL>120x170 cm</VAL>
  </PARAM>
  <!-- Více parametrů... -->
  <MANUFACTURER>Chemex</MANUFACTURER>
  <CATEGORYTEXT>Heureka.cz | Bydlení a doplňky | Koberce a koberečky</CATEGORYTEXT>
  <EAN>8680401345621</EAN>
  <DELIVERY_DATE>10</DELIVERY_DATE>
  <DELIVERY>
    <DELIVERY_ID>TOPTRANS</DELIVERY_ID>
    <DELIVERY_PRICE>199,00</DELIVERY_PRICE>
    <DELIVERY_PRICE_COD>248,00</DELIVERY_PRICE_COD>
  </DELIVERY>
  <!-- Více delivery možností... -->
  <ITEMGROUP_ID>14574</ITEMGROUP_ID>
  <ACCESSORY>TA24500</ACCESSORY>
  <!-- Více accessorií - IGNOROVAT -->
</SHOPITEM>
```

## Klíčové rozdíly od standardního Heureka formátu

1. **Cena**: `<PRICE_VAT>` místo `<PRICE>` (s DPH)
2. **Parametry**: Struktura `<PARAM><PARAM_NAME>` a `<VAL>` místo `<PARAM name="">`
3. **Obrázky**: Více `<IMGURL_ALTERNATIVE>` místo jednoho `<IMGURL>`
4. **Kategorie**: `<CATEGORYTEXT>` místo `<CATEGORY>`
5. **Doručení**: Strukturované `<DELIVERY>` bloky s cenami
6. **Skupiny produktů**: `<ITEMGROUP_ID>` pro varianty
7. **Accessory tagy**: Ignorovat (související produkty)

## Parametry k filtrování

Z příkladu:
- **Rozměr koberce**: 120x170 cm
- **Barva**: Červená
- **Tvar**: Obdélníkový
- **Kolekce koberců**: Atlas
- **Délka vlasu**: Krátký vlas (6–10 mm)
- **Kvalita a gramáž**: Standardní kvalita (1251 – 1500 g/m²)
- **Vzor**: Orientální & Klasické
- **Materiál**: Polypropylen (Standard)
- **Přesná výška vlasu**: 8 mm
- **Průměrná gramáž na m²**: 1350 g/m²

## Akce potřebné

1. ✅ Aktualizovat XML parser pro nový formát
2. ✅ Přidat extrakci všech relevantních parametrů
3. ✅ Ignorovat ACCESSORY tagy
4. ✅ Zpracovat více IMGURL_ALTERNATIVE
5. ✅ Zpracovat DELIVERY informace (zatím nepoužíváme)
6. ✅ Testovat parser na reálných datech
