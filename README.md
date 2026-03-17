# DATOR3 Web

Webová stránka společnosti DATOR3

## 📋 Technologie

Projekt je postaven na moderních webových technologiích bez zbytečných závislostí:

- **HTML5** - Sémantická struktura a moderní web API
- **Tailwind CSS v4** - Utility-first CSS framework pro rychlý design
- **CSS3** - Animace a moderní stylování (flip cardy, hover efekty, carousel)
- **Vanilla JavaScript** - Bez frameworků (hamburger menu, mobilní navigace)
- **Responsive Design** - Optimalizováno pro mobil, tablet i desktop

### Struktura projektu

```
dator3-web/
├── index.html                 # Hlavní stránka
├── o-nas/index.html          # Stránka O nás
├── nase-sluzby/index.html    # Stránka Naše služby
├── partneri/index.html       # Stránka Partneři
├── reference/index.html      # Stránka Reference
├── kontakt/index.html        # Stránka Kontakt
├── assets/
│   ├── output-tailwind.css   # Zkompilovaný CSS (vygenerovaný Tailwindem)
│   ├── carousel.css          # Animace partnery carouselu
│   ├── hamburger.js          # Hamburger menu script
│   ├── cards.css             # Styling pro referenční karty
│   ├── logo.png              # Logo DATOR3
│   ├── hero-background.jpg   # Hero section obrázek
│   ├── favicon/              # Favicon varianty
│   ├── icons/                # SVG ikony
│   ├── partners/             # Loga partnerů
│   ├── support/              # Ostatní obrázky
│   ├── refs/
│   │   ├── main/             # Loga hlavních referenčních klientů
│   │   └── other/            # Loga ostatních klientů
│   └── partners/             # Loga partnerů
├── input-tailwind.css        # Zdrojový Tailwind CSS (custom theme)
├── build.js                  # Build script pro packování
├── package.json              # NPM konfigurace
└── README.md                 # Tento soubor
```

## 🚀 Rychlý start

### Požadavky

- Node.js 18+ a npm
- Textový editor (VS Code doporučen)

### Instalace

```bash
# Nainstalovat závislosti
npm install
```

## 💻 Vývoj

### Sledování změn stylu

Pro vývoj s live aktualizací CSS během úprav `input-tailwind.css`:

```bash
npx @tailwindcss/cli -i input-tailwind.css -o assets/output-tailwind.css --watch
```

**Co dělá:**

- Automaticky kompiluje do `assets/output-tailwind.css`
- Aktualizuje se při každé změně
- Optimalizuje CSS na základě použitých tříd v HTML

### Live Preview

Při vývoji si zapněte HTTP server:

```bash
# Python 3
python -m http.server 8000

# Nebo Node.js http-server
npx http-server
```

Poté otevřete http://localhost:8000 v prohlížeči.

## 📦 Build pro produkci

Vytvoří optimalizovanou verzi webu připravenou pro nasazení:

```bash
npm run build
```

**Co dělá:**

- Vytvoří složku `dist/`
- Nakopíruje všechny HTML stránky
- Nakopíruje složku `assets/` se všemi obrázky, CSS a favicon
- Vymaže zbytečné vývojové soubory (package.json, build.js, .DS_Store)
- Zobrazí statistiku (počet souborů)

**Výsledek:** Složka `dist/` obsahuje všechno potřebné pro nasazení na web server.

**Poslední aktualizace:** 16. března 2026
