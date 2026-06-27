# Recruiter-X — Color System (V2.0 — Premium AI-SaaS)

---

## 3. COLOR SYSTEM

The interface is driven by a deliberate **three-color system**: white (resting space), blue (hero color), and black (punctuation). Color is no longer a minimal accent on a stark canvas — it's a compositional tool that creates dramatic moments (gradient mesh heroes, dark feature cards) separated by generous white breathing room.

---

### 3.1 The Three-Color System

| Color | Role | Where |
|---|---|---|
| **White** | Resting space | Canvas between dramatic moments, most card surfaces, body sections |
| **Blue** | Hero color | Hero background (gradient mesh), CTA band, score fills, ambient blobs, links, active states |
| **Black** | Punctuation | Pill buttons, dark feature cards, dark promo banners, strong headings |

---

### 3.2 Primary Palette — White Canvas

| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#FFFFFF` | Core canvas — page background, primary card surfaces, resting sections |
| `--bg-subtle` | `#FAFAFA` | Alternate section background, slight texture between white sections |
| `--bg-muted` | `#F5F5F5` | Recessed surfaces, input backgrounds, disabled card fills |

### 3.3 Hero Palette — Blue Family

| Token | Hex | Usage |
|---|---|---|
| `--color-blue` | `#0000FF` | Primary blue — gradient start, links, active icon tints |
| `--color-blue-mid` | `#2563EB` | Gradient midpoint, hover states, secondary CTAs |
| `--color-blue-light` | `#8FB3FF` | Gradient end, ambient blob color, soft glow tints |
| `--color-blue-pale` | `#EEF2FF` | Resting blue — tinted card backgrounds, hover fills, info surfaces |
| `--gradient-hero` | `linear-gradient(135deg, #000033 0%, #0000FF 40%, #2563EB 70%, #8FB3FF 100%)` | Hero section and CTA band background — navy-to-electric-blue gradient mesh |
| `--gradient-score` | `linear-gradient(90deg, #0000FF, #2563EB, #8FB3FF)` | Score bar fills, gradient-filled text, animated stat fills |
| `--gradient-blob` | `radial-gradient(circle, rgba(0,0,255,0.15), transparent 70%)` | Ambient background blobs — blurred, drifting, decorative |

### 3.4 Punctuation Palette — Black

| Token | Hex | Usage |
|---|---|---|
| `--color-black` | `#0A0A0A` | Primary button fills (black pill), strong headings, dark card backgrounds |
| `--color-black-soft` | `#111111` | Dark feature cards, promo banner backgrounds |
| `--color-black-muted` | `#1A1A1A` | Dark card hover states, secondary dark surfaces |

### 3.5 Glass & Surface Tokens

| Token | Value | Usage |
|---|---|---|
| `--glass-bg` | `rgba(255, 255, 255, 0.60)` | Frosted glass card backgrounds on gradient or dark contexts |
| `--glass-bg-dark` | `rgba(0, 0, 0, 0.40)` | Frosted glass on light contexts (inverted) |
| `--glass-border` | `rgba(255, 255, 255, 0.20)` | Glass card borders — subtle, catches light |
| `--glass-blur` | `blur(20px)` | Backdrop filter for frosted glass surfaces |

### 3.6 Text Palette

| Token | Hex | Usage |
|---|---|---|
| `--text-primary` | `#0A0A0A` | Headings, core descriptive text, active content |
| `--text-secondary` | `#4A4A4A` | Secondary descriptions, labels, default icons |
| `--text-tertiary` | `#8C8C8C` | Helpers, metadata, placeholders, disabled states |
| `--text-on-dark` | `#FFFFFF` | Text on dark cards, gradient mesh backgrounds, black surfaces |
| `--text-on-blue` | `#FFFFFF` | Text on blue gradient hero/CTA sections |

### 3.7 Semantic Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-danger` | `#DC2626` | Critical red flags, high severity, destructive actions |
| `--color-danger-bg` | `#FEF2F2` | Background behind danger elements |
| `--color-warning` | `#D97706` | Medium risk, caution states |
| `--color-warning-bg` | `#FFFBEB` | Background behind warning elements |
| `--color-success` | `#16A34A` | Strong signals, positive assessments, verified |
| `--color-success-bg` | `#F0FDF4` | Background behind success elements |
| `--color-info` | `#2563EB` | Informational — shares with blue-mid |
| `--color-info-bg` | `#EEF2FF` | Background behind info elements |

### 3.8 Border & Shadow Palette

| Token | Value | Usage |
|---|---|---|
| `--border-default` | `1px solid #E5E7EB` | Standard card borders on white canvas |
| `--border-subtle` | `1px solid #F0F0F0` | Barely-there separation, inner dividers |
| `--shadow-card` | `0 4px 16px rgba(0,0,34,0.06)` | Resting card elevation |
| `--shadow-card-hover` | `0 12px 32px rgba(0,0,34,0.10)` | Hovered card elevation (lift effect) |
| `--shadow-float` | `0 20px 48px rgba(0,0,34,0.12)` | Floating mockup cards, elevated product moments |
| `--shadow-modal` | `0 24px 64px rgba(0,0,34,0.18)` | Modals, overlays |
| `--shadow-glow-blue` | `0 0 60px rgba(0,0,255,0.15)` | Ambient blue glow behind hero cards |

---

### 3.9 Color Usage Rules

**Rule 1 — Blue is the hero color.**
Blue gets to go deep and dramatic in specific places: the hero and the closing CTA band use a navy-to-electric-blue gradient mesh as a full background — rich enough to feel like its own designed moment, not just a tint. Elsewhere, blue appears as gradient fills (scores, bars), ambient blobs (blurred, drifting), and interactive cues (links, focus rings).

**Rule 2 — Black is punctuation.**
Black comes in deliberately — solid black pill buttons, dark feature cards, a dark promo banner sitting inside an otherwise white layout. It's never the canvas default. It provides compositional weight and contrast that keeps the page from feeling uniformly soft.

**Rule 3 — White is the resting space.**
`#FFFFFF` / `#FAFAFA` is still the default canvas for most of the page. It's the breathing room between blue hero moments and black punctuation accents. Most sections live here. Cards are white. Body text sits on white. The generosity of white space is what makes the blue and black moments feel dramatic.

**Rule 4 — Glass surfaces on gradient backgrounds.**
Any card that sits on top of a gradient mesh (hero, CTA band) or dark surface uses frosted glass: `backdrop-filter: blur(20px)`, semi-transparent white fill, subtle white border. This gives floating moments richness without competing with the background color.

**Rule 5 — No flat navy blocks.**
The old `#000022` flat navy band is gone. If a dark background is needed, use the gradient mesh (`--gradient-hero`). Navy lives only as a deep gradient stop, never as a solid fill.

---

*Document version: 2.0 | Design System: Premium Intelligence*
