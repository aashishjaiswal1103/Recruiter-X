# Recruiter-X — Responsive Layout & Accessibility Standards (V2.0 — Premium AI-SaaS)

---

## 13. RESPONSIVE SYSTEM

### 13.1 Breakpoints

| Token | Width | Layout Change |
|---|---|---|
| `--bp-mobile` | < 768px | Bento grids collapse to single column, sidebar hidden |
| `--bp-tablet` | 768px–1024px | Bento grids become 2-column symmetric, sidebar overlay |
| `--bp-desktop` | 1024px–1320px | Standard bento layout |
| `--bp-wide` | > 1320px | Content centered, max `--content-max` (1320px) |

### 13.2 Bento Grid Responsive Behavior

The asymmetric bento layout is the defining visual pattern. Here's how it adapts:

| Viewport | Bento Behavior |
|---|---|
| **Desktop (> 1024px)** | Full asymmetric layout — hero card (60%) + 2 stacked small cards (40%), stat cluster with 2×2 hero |
| **Tablet (768–1024px)** | Simplified 2-column grid — hero card spans full width, small cards stack below as 2-column pairs |
| **Mobile (< 768px)** | Single column — all cards stack vertically, hero card first, same padding and radius |

### 13.3 Float & Animation on Mobile

| Animation | Mobile Behavior |
|---|---|
| Float-bob | **Reduced amplitude** — `translateY(-4px)` instead of `-8px`, slower duration |
| Blob-drift | **Disabled** — blobs render at static position to preserve performance |
| Parallax (mouse) | **Disabled** — no mouse events on touch devices |
| Fade-up-settle | **Kept** — entrance reveals still work, stagger reduced to 40ms |
| Count-up | **Kept** — numbers still animate on scroll into view |
| Hover lift | **Replaced with press feedback** — `:active` scale(0.97) instead of hover lift |

### 13.4 Mobile-Specific Layout

- **Navigation:** Sidebar hidden by default. Hamburger icon (top-left) triggers a slide-in overlay panel — white background with `--glass-blur` backdrop, full height, 280px width
- **Candidate cards:** Single column, full-width, vertically stacked
- **Pool health stats:** 2-column grid (from bento asymmetric)
- **Score bars:** Labels positioned above the bar instead of inline
- **Interrogation questions:** Collapsible accordion (3 questions in one card, expand on tap)
- **Hero section:** Gradient mesh background maintained, floating cards stack and reduce bob
- **Buttons:** Full-width on mobile for primary actions, pill shape preserved

**Note:** The primary use case is desktop (recruiters work at desks). Mobile is a review-only context. No bulk upload from mobile.

---

## 14. ACCESSIBILITY STANDARDS

### 14.1 Color Contrast

- **Minimum standard:** WCAG AA for all text
- **Body text:** `#0A0A0A` on `#FFFFFF` = 19.3:1 ✓ | `#4A4A4A` on `#FFFFFF` = 8.6:1 ✓
- **Text on dark surfaces:** `#FFFFFF` on `#0A0A0A` = 19.3:1 ✓ | `#FFFFFF` on gradient hero = verified per stop
- **Blue accent text:** `#2563EB` on `#FFFFFF` = 4.6:1 ✓ (AA). Use `--color-blue-mid` for interactive text, never `#0000FF` for body text (fails AA at 3.9:1)
- **Score gradient text:** Gradient-filled text uses clip — underlying color must meet AA independently at each gradient stop

### 14.2 Focus States

All interactive elements have a visible focus ring:

```css
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.25);
  border-radius: inherit;
}
```

### 14.3 ARIA Labels

- All icon-only buttons have `aria-label`
- All score bars have `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Gradient-filled text numbers include `aria-label` with the plain number value (screen readers can't parse gradient-clipped text)
- Glass/frosted cards maintain proper contrast with their content regardless of backdrop

### 14.4 Keyboard Navigation

- Full Tab order through all interactive elements
- `Escape` closes modals and overlay panels
- `Enter` activates buttons
- Arrow keys navigate within bento stat grids and candidate lists

### 14.5 Reduced Motion

All animations are wrapped in `@media (prefers-reduced-motion: no-preference)`:
- Float-bob → static position
- Blob-drift → static position
- Fade-up-settle → instant appearance
- Count-up → shows final number immediately
- Bar-fill → shows final width immediately
- Hover lift → color change only (no transform)
- Parallax → disabled

### 14.6 Screen Reader Support

- All loading states have `aria-live="polite"` regions
- Progress updates are announced (percentage changes debounced to avoid spam)
- Candidate rank changes during re-ranking are announced
- Empty states include descriptive text accessible to screen readers

---

*Document version: 2.0 | Design System: Premium Intelligence*
