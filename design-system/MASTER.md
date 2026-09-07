# Varada Crystal — Design System Master File (MASTER.md)

> **LOGIC:** When building or modifying a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules documented below.

---

**Brand:** Varada Crystal — Natural Deodorant Spray  
**Vibe:** Clean, Elegant, Natural, Trustworthy, Gender-Neutral, Clinical Purity  
**Target Audience:** Health-conscious individuals seeking aluminum chlorohydrate-free, alcohol-free odor protection without synthetic parabens or staining.

---

## 1. Color Palette & Token System

Extracted directly from the Varada Crystal brand bottle artwork:

| Role | Color Name | Hex Code | HSL | CSS Variable | Purpose |
|------|------------|----------|-----|--------------|---------|
| **Primary** | Deep Navy Blue | `#0B2545` | `hsl(212, 73%, 16%)` | `--color-primary` | Main headings, brand mark, primary buttons, structural accents |
| **Primary Dark** | Midnight Navy | `#061528` | `hsl(213, 74%, 9%)` | `--color-primary-dark` | Footer background, deep contrasts, high emphasis |
| **Accent Primary** | Warm Gold / Bronze | `#C59B27` | `hsl(44, 67%, 46%)` | `--color-accent-gold` | Gold badges, leaf accents, "Alum Infused" subheaders, ratings |
| **Accent Light** | Champagne Gold | `#E8D399` | `hsl(43, 65%, 75%)` | `--color-accent-gold-light` | Borders, subtle highlights, badge glows |
| **Secondary Wave** | Crystal Aqua / Breeze | `#26A8D0` | `hsl(194, 69%, 48%)` | `--color-accent-cyan` | 'V' wave graphic, freshness indicators, focus rings |
| **Secondary Glow** | Soft Aqua Mist | `#E7F7FA` | `hsl(188, 62%, 94%)` | `--color-accent-cyan-bg` | Icon badge background circles, highlight chips |
| **Background Base** | Crisp White | `#FFFFFF` | `hsl(0, 0%, 100%)` | `--color-bg-base` | Main card surfaces, hero contrast, clean clinical base |
| **Background Warm** | Soft Mineral Cream | `#FBF9F5` | `hsl(40, 43%, 97%)` | `--color-bg-warm` | Page background, alternating section fills |
| **Background Card** | Alum Off-White | `#F5F3EC` | `hsl(45, 24%, 94%)` | `--color-bg-card` | Benefit card backgrounds, ingredient tiles |
| **Text Primary** | Deep Navy Slate | `#0E2A47` | `hsl(211, 67%, 17%)` | `--color-text-primary` | Main copy headings, key benefits (Contrast > 11:1) |
| **Text Secondary** | Muted Slate Navy | `#4A6078` | `hsl(212, 24%, 38%)` | `--color-text-secondary` | Body text, feature descriptions (Contrast > 5.2:1) |
| **Text Muted** | Slate Silver | `#7A8F9E` | `hsl(206, 16%, 55%)` | `--color-text-muted` | Meta labels, batch info, copyright |
| **Border Soft** | Mineral Sand | `#E6DEC8` | `hsl(42, 35%, 84%)` | `--color-border-soft` | Card dividers, packaging box stroke replication |
| **Success / Safe** | Botanical Green | `#2D7A58` | `hsl(153, 46%, 33%)` | `--color-success` | "Pure Promise", verified checkmarks, safe badges |

---

## 2. Typography & Hierarchy

Carefully pairing a timeless, luxury serif for elegance with a crisp, geometric modern sans-serif for crystal clarity.

### Font Families
- **Display & Headings:** `'Cinzel', 'Playfair Display', serif`
- **Body, UI & Meta:** `'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif`

### Google Fonts Import
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Type Scale
| Element | Font Family | Size | Weight | Line Height | Letter Spacing |
|---------|-------------|------|--------|-------------|----------------|
| **Display H1** | Cinzel / Playfair | `3.25rem` (52px) | 700 | 1.15 | `-0.02em` |
| **Section H2** | Cinzel | `2.25rem` (36px) | 700 | 1.25 | `0.02em` (All-Caps where appropriate) |
| **Card H3** | Cinzel | `1.25rem` (20px) | 600 | 1.35 | `0.05em` |
| **Subhead / Lead**| Plus Jakarta Sans | `1.125rem` (18px)| 400 | 1.6 | `normal` |
| **Body Regular** | Plus Jakarta Sans | `1.0rem` (16px) | 400 | 1.65 | `normal` |
| **Body Small / Badges**| Plus Jakarta Sans | `0.875rem` (14px)| 600 | 1.4 | `0.08em` uppercase |
| **Meta / Tagline**| Plus Jakarta Sans | `0.75rem` (12px) | 500 | 1.3 | `0.1em` uppercase |

---

## 3. Spatial & Elevation Tokens

### Spacing System
```css
:root {
  --space-2xs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;
  
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-pill: 9999px;
  
  --shadow-subtle: 0 4px 20px rgba(11, 37, 69, 0.05);
  --shadow-card: 0 10px 30px rgba(11, 37, 69, 0.08);
  --shadow-hover: 0 18px 40px rgba(11, 37, 69, 0.14);
  --shadow-gold: 0 8px 25px rgba(197, 155, 39, 0.28);
  --shadow-cyan: 0 8px 25px rgba(38, 168, 208, 0.25);
}
```

---

## 4. UI Components & Interaction Specs

### 4.1 Primary CTA Button (`.btn-gold`)
- **Background:** Gradient `linear-gradient(135deg, #D4A853 0%, #C59B27 50%, #B38023 100%)`
- **Text:** `#0B2545` (Deep Navy), bold weight 700
- **Border:** `1px solid rgba(255, 255, 255, 0.4)`
- **Hover:** `transform: translateY(-2px); box-shadow: var(--shadow-gold);`
- **Transition:** `all 250ms cubic-bezier(0.16, 1, 0.3, 1)`

### 4.2 Secondary Button (`.btn-navy`)
- **Background:** `#0B2545`
- **Text:** `#FFFFFF`, weight 600
- **Hover:** `background: #112C4D; transform: translateY(-2px);`

### 4.3 Benefit & Feature Cards (`.benefit-card`)
- **Background:** `#FFFFFF` with delicate gold border `1px solid rgba(230, 222, 200, 0.7)`
- **Icon Container:** 56px circular badge with `#E7F7FA` or `#F5F3EC` fill and primary navy/gold vector SVG icon.
- **Hover:** Subtle 3px elevation + border highlight `border-color: #C59B27`.

### 4.4 Circular Safety Badges (`.safety-badge`)
- Distinct circular rings echoing the "NO ALCOHOL", "NO PARABENS", "NO SILICONES" stamps from the bottle.
- Navy outline with gold leaf accents and crisp SVG icons.

---

## 5. Anti-Patterns & Accessibility Guardrails (UI/UX Pro Max)

- ❌ **NO EMOJIS AS ICONS**: Always use clean, dedicated vector SVGs with `aria-hidden="true"` and appropriate semantic titles.
- ❌ **NO LOW CONTRAST**: All text over cream/white backgrounds must exceed WCAG 2.1 AA (minimum 4.5:1 ratio; Navy `#0B2545` over white yields 13.5:1).
- ❌ **NO UNRESPONSIVE MATRICES**: Flexbox/CSS Grid layouts must smoothly adapt from 320px mobile up to 4K displays with zero horizontal overflow.
- ❌ **NO MISSING POINTERS**: Every button, accordion header, tab, and card must explicitly declare `cursor: pointer`.
- ❌ **NO ABRUPT HOVERS**: Micro-interactions must use smooth easing transitions (150ms–300ms).
