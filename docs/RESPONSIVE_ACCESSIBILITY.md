# Recruiter-X — Responsive Layout & Accessibility Standards

---

## 13. RESPONSIVE SYSTEM

### 13.1 Breakpoints

| Token | Width | Layout change |
|---|---|---|
| `--bp-mobile` | < 768px | Sidebar collapses to hamburger menu |
| `--bp-tablet` | 768px–1024px | 2-column candidate grid (from 3) |
| `--bp-desktop` | 1024px–1280px | Standard layout |
| `--bp-wide` | > 1280px | Content centered, max 1280px |

### 13.2 Mobile Behaviour

- Sidebar: hidden by default, slide-in on hamburger tap (from left, `#000022` background, full height)
- Candidate cards: single column, vertically stacked
- Pool Health stats: 2×2 grid (from 4×1)
- Interrogation questions: collapsible accordion (3 questions in one card, expand on tap)
- Score bars: labels above bar instead of inline

**Note:** The primary use case is desktop (recruiters work at desks). Mobile is a review-only context. No bulk upload from mobile.

---

## 14. ACCESSIBILITY STANDARDS

- **Contrast minimum:** WCAG AA for all text. Electric blue `#0000FF` on white fails AA — never use it for body text. Use for UI chrome and data display only.
- **Focus states:** All interactive elements have visible focus ring: `0 0 0 3px rgba(0,0,255,0.35)` (blue glow).
- **ARIA labels:** All icon-only buttons have `aria-label`. All score bars have `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- **Keyboard navigation:** Full Tab order, Escape closes modals, Enter activates buttons.
- **`prefers-reduced-motion`:** All animations wrapped in `@media (prefers-reduced-motion: no-preference)`. Falls back to instant transitions.
- **Screen reader:** All loading states have `aria-live="polite"` regions. Progress updates announced.
