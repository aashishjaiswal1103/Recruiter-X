# Recruiter-X — Color System

---

## 3. COLOR SYSTEM

The interface is driven by a clean, minimal light-mode developer aesthetic. Color is structured with purpose:
- **Blue (`#0000FF`)** is the default voice of the system (active states, calculations, scoring, and primary CTAs).
- **White/Near-white** is gravity, anchoring all backgrounds, sidebars, and cards.
- **Navy (`#000022`)** is restricted to a single accent band per screen fold (e.g. hero headers, footers).
- **Beige/Cream** is texture, used sparingly for visual rest in background transitions.

---

### 3.1 Primary Palette (Dominant — Use Everywhere)

| Token | Hex | Usage |
|---|---|---|
| `--color-blue` | `#0000FF` | Primary accent — buttons, links, active states, icons, score fills, header accents |
| `--color-blue-dim` | `#0000CC` | Hover state for primary actions |
| `--color-blue-light` | `#F0F4FF` | Resting Blue — tinted card backgrounds, hover background fills, info backgrounds |
| `--bg-base` | `#FFFFFF` | Core Canvas — page background, sidebar background, primary cards |
| `--bg-subtle` | `#FAFAFA` | Rest Texture — section alternation on white backgrounds |

### 3.2 Secondary Palette (Sparing — Accent Bands Only)

| Token | Hex | Usage |
|---|---|---|
| `--color-navy` | `#000022` | Hero gradients, footers, and maximum ONE stat band per page viewport |
| `--color-navy-soft` | `#00003A` | Navy gradient endpoints |
| `--color-cream` | `#FFF5EC` | Alternate section background texture (never for cards) |
| `--color-peach` | `#FCE9D7` | Warm card variant, used on less than 20% of card layouts |

### 3.3 Text Palette

| Token | Hex | Usage |
|---|---|---|
| `--text-primary` | `#0A0A0A` | Headings, core descriptive text, active content |
| `--text-secondary` | `#4A4A4A` | Secondary descriptions, labels, default icons |
| `--text-tertiary` | `#8C8C8C` | Helpers, metadata, placeholders, disabled states |
| `--text-on-navy` | `#FFFFFF` | Text rendered on navy background bands |

*Note: In computed outputs or calculations on white backgrounds, text may be highlighted in `#0000FF` (Electric Blue).*

### 3.4 Semantic Palette (Unchanged)

| Token | Hex | Usage |
|---|---|---|
| `--color-danger` | `#D32F2F` | Critical red flags, high severity, destructive actions |
| `--color-danger-bg` | `#FFF5F5` | Background behind danger elements |
| `--color-warning` | `#B45309` | Medium risk, caution states |
| `--color-warning-bg` | `#FFFBF0` | Background behind warning elements |
| `--color-success` | `#166534` | Strong signals, positive assessments, verified |
| `--color-success-bg` | `#F0FDF4` | Background behind success elements |
| `--color-info` | `#0000FF` | Informational — shares with primary blue |
| `--color-info-bg` | `#F0F0FF` | Background behind info elements (shares with blue-light) |

---

### 3.5 Color Usage Rules

**Rule 1 — Blue is the voice, not the exception.**
If you removed all other colors (navy, cream) from a screen, the product should still look completely "on-brand" with Blue (`#0000FF`) leading all interactive, structural, and computational cues.

**Rule 2 — White is gravity.**
White (`#FFFFFF`) replaces navy as the default canvas, default sidebar background, default card surface. The dashboard is clean, spacious, and low-contrast except where actions demand attention.

**Rule 3 — Navy is seasoning.**
Navy (`#000022`) must never be used for full-page fills, sidebar default states, or general card surfaces. It is restricted to a maximum of one accent band per screen fold (e.g. either the header OR the footer, never both visible at once).
