# Recruiter-X — Typography System (V2.0 — Premium AI-SaaS)

---

## 4. TYPOGRAPHY SYSTEM

### 4.1 Font Stack

**Display & Headings: Space Grotesk**
- Google Fonts: `Space Grotesk`
- Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- Character: Geometric, modern, confident but approachable. The workhorse heading font — clean enough for body-adjacent use, distinctive enough for hero-scale display.
- Usage: All section headings, card titles, navigation labels, the logo wordmark. Uppercase or title case for section labels; title case or sentence case for card headings.

**Body: Cambay**
- Google Fonts: `Cambay`
- Weights: 400 (Regular), 700 (Bold)
- Character: Humanist sans-serif with good x-height and readability. Warm but professional — the voice of the product for all readable text.
- Usage: All body text, descriptions, paragraphs, tooltips, help text, longer labels. Never for headings or data.

**Poster / Expressive: Bitcount Single**
- Source: Self-hosted (bitmap/pixel display typeface)
- Weights: Regular
- Character: Pixelated, graphic, deliberately lo-fi. Used for exactly 1–2 "poster moments" per page where the design breaks the uniform template — the hero headline, a section-break statement, a promotional callout.
- Usage rule: **Maximum 2 uses per page.** Always at oversized scale (48px+). Never for body text, labels, or data. This is the font that makes the page feel designed rather than templated.

**Data & Mono Accent: Space Mono**
- Google Fonts: `Space Mono`
- Weights: 400 (Regular), 700 (Bold)
- Character: Geometric monospace with tabular figures. Clear, developer-grade number rendering.
- Usage: ALL numerical scores, percentages, token counts, cost estimates, timestamps, file sizes, code snippets, ALL CAPS section labels, badges. Never for prose or body text.

**Import declarations:**
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Cambay:wght@400;700&family=Space+Mono:wght@400;700&display=swap');

/* Bitcount Single — self-hosted, load via @font-face */
@font-face {
  font-family: 'Bitcount Single';
  src: url('/fonts/bitcount-single.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

### 4.2 Type Scale

| Token | Font | Size | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| `--type-hero` | Space Grotesk | 56–72px | 700 | 1.05 | Hero headline (landing page only) |
| `--type-display` | Space Grotesk | 42px | 700 | 1.1 | Page titles, major section headings |
| `--type-heading-1` | Space Grotesk | 32px | 700 | 1.15 | Section headers |
| `--type-heading-2` | Space Grotesk | 24px | 600 | 1.2 | Sub-section titles |
| `--type-heading-3` | Space Grotesk | 18px | 600 | 1.3 | Card titles, group headers |
| `--type-body` | Cambay | 16px | 400 | 1.65 | Body text, descriptions, narrative |
| `--type-body-large` | Cambay | 18px | 400 | 1.6 | Hero subtitles, feature descriptions, lead paragraphs |
| `--type-body-bold` | Cambay | 16px | 700 | 1.65 | Emphasized body, inline labels |
| `--type-small` | Cambay | 14px | 400 | 1.5 | Metadata, timestamps, helper text |
| `--type-label` | Space Mono | 11px | 700 | 1.0 | ALL CAPS section labels, badges, tags |
| `--type-code` | Space Mono | 14px | 400 | 1.5 | Code snippets, monospace inline elements |
| `--type-data-hero` | Space Mono | 48px | 700 | 1.1 | Big number display — pool stats, hero scores |
| `--type-data` | Space Mono | 16px | 400 | 1.4 | Inline scores, table data, stat values |
| `--type-data-small` | Space Mono | 12px | 400 | 1.4 | Small data, secondary numbers |
| `--type-poster` | Bitcount Single | 48–96px | 400 | 1.0 | Poster moments — hero headline accent, section break |

### 4.3 Typography Rules

1. **Space Grotesk is the confident voice — use it for structure.** All headings, all navigation, all section titles. Clean, geometric, modern. It's the font that says "this product was designed."

2. **Cambay is the warm voice — use it for conversation.** All body text, all descriptions, all paragraphs. Readable, humanist, professional. It's the font that says "this product was written for you."

3. **Bitcount Single is the poster moment — use it sparingly.** Maximum 2 per page. It's the moment that breaks the template and makes the page feel like a designed composition instead of a filled-in wireframe. Hero headline, section break, promotional callout — that's it.

4. **Space Mono is for data and labels only.** If a number is on screen, it's in Space Mono. If a label is ALL CAPS, it's in Space Mono. If it's a code snippet, it's in Space Mono. Never for prose. Tabular figures by default — columns of numbers align perfectly.

5. **Mixed weights within a headline are allowed.** In poster moments and hero headlines, you can mix weights within the same line (e.g., "Find your **next hire** before they even apply" where "next hire" is bold and the rest is regular). This creates visual rhythm and draws the eye.

6. **Badges and icons can sit inside text.** In headline moments, a small badge (e.g., "AI-Powered" pill) or icon can be tucked into the text rather than sitting separately. This is part of the "poster moment" permission.

7. **Letter spacing:**
   - Space Grotesk at hero scale (56px+): `-0.02em` (slightly tightened for impact)
   - Space Grotesk at body-adjacent sizes: `0em` (default)
   - Space Mono ALL CAPS labels: `0.08em` (widened for readability)
   - Bitcount Single: `0.02em` (slight tracking for pixel clarity)

---

*Document version: 2.0 | Design System: Premium Intelligence*
