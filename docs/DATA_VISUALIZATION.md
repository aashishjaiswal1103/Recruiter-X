# Recruiter-X — Data Visualization Reference (V2.0 — Premium AI-SaaS)

---

## 8. DATA VISUALIZATION

Clarity and warmth drive the visualization system. Charts and scores are still fully transparent about what they measure — but they're presented as polished, alive product moments, not printed readouts. Every number lives inside a soft card, fills in with the blue gradient, and animates into place on view.

One rule above all: **at least one data visualization moment per page should be expressive enough to break the safe-template pattern** — a radial score ring, an animated comparison chart, a bento stat cluster with a dramatically oversized hero number. Expressive data viz and one strong typographic moment keep the page from feeling like every section followed the same safe template.

---

### 8.1 Score Bars (Dimension Breakdown)

The 5 candidate dimension bars always appear in this order:

1. **Trajectory Score** — Progression velocity vs career age
2. **Behaviour Fit Score** — Ownership pronoun ratios and outcome orientation
3. **Ghost Match Score** — Fit profile against the synthetic ideal candidate benchmark
4. **Insider Signal Score** — Checklist validation of industry/seniority heuristics
5. **Credibility Score** — Absence of red flags and inflation tags

Each dimension renders as its own soft card rather than a bare row — the bento principle applied to scores:

```css
.score-card {
  background: #FFFFFF;
  border-radius: 20px;
  border: 1px solid #E5E7EB;
  padding: 20px 24px;
  box-shadow: 0 4px 16px rgba(0,0,34,0.06);
}
```

Bar treatment:

```css
.score-bar-track {
  background: #EEF2FF;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.score-bar-fill {
  background: var(--gradient-score); /* #0000FF → #2563EB → #8FB3FF */
  border-radius: 999px;
  height: 100%;
  animation: bar-fill-gradient 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Bars fill in sequence, staggered by 100ms */
```

Score label: **Space Mono 700, 11px, ALL CAPS, letter-spacing 0.08em** (e.g., `TRAJECTORY SCORE`)
Score value: **Space Mono 700, 16px, gradient-filled text** (e.g., `84`)
Caption: **Cambay 400, 14px, `#8C8C8C`** (e.g., "Accelerating — outpacing 92% of candidates at this career age")

---

### 8.2 Final Score Display

The headline score is the largest visual moment on the candidate detail page:

- **88px, Space Grotesk Bold, gradient-filled text** — counts up from 0 over 1.2s when the card enters view
- Sits inside a dedicated hero card with a faint blurred blue blob behind it for depth
- A thick gradient ring or pill bar beneath echoes the fill animation — same gradient, same easing, slightly delayed
- Small contextual caption underneath in Cambay Regular (e.g., "Stronger than 84% of this pool")

---

### 8.3 Pool Health — Bento Stat Cluster

The flat full-width navy band is gone. Pool health renders as a **bento stat cluster** on a white canvas:

- One large **hero stat card** (2×2 grid span) — the single most important number (e.g., qualification rate) — sits prominently, sized roughly double the others
- 3–5 smaller stat cards fill the remaining grid space at standard size
- A very faint blue-tinted radial glow sits behind the hero card only, drawing the eye without a dark band

```css
.stat-grid {
  background: #FAFAFA;
  padding: 48px 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: minmax(140px, auto);
  gap: 24px;
}

.stat-card {
  background: #FFFFFF;
  border-radius: 20px;
  border: 1px solid #E5E7EB;
  padding: 28px;
  box-shadow: 0 4px 16px rgba(0,0,34,0.06);
}

.stat-card--hero {
  grid-column: span 2;
  grid-row: span 2;
  position: relative;
}

/* Ambient glow behind hero stat */
.stat-card--hero::before {
  content: '';
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(0,0,255,0.08), transparent 70%);
  filter: blur(40px);
  z-index: -1;
}
```

#### Stat Content Pattern

Each stat card contains:

| Element | Font | Example |
|---|---|---|
| Label | Space Mono 700, 11px, ALL CAPS, `#8C8C8C` | `QUALIFICATION RATE` |
| Number | Space Mono 700, 48px (hero) / 28px (standard), gradient-filled | `34%` |
| Caption | Cambay 400, 14px, `#8C8C8C` | "34 of 47 candidates meet minimum bar" |

All numbers animate via count-up on scroll into view. Hero stat counts first, then smaller stats stagger in at 100ms intervals.

---

### 8.4 Expressive Data Viz Moments

Beyond bars and stat grids, one visualization per page should break the safe pattern:

- **Radial score ring** — a circular progress arc (gradient stroke) for the Ghost Match Score, centered inside a glass card on the candidate detail view
- **Trajectory sparkline** — a tiny line chart showing career arc direction (ascending, flat, descending) inside each candidate card
- **Pool distribution mini-chart** — a small horizontal stacked bar showing score quartile distribution in the Pool Health section

These are not dashboards. They're designed moments — each one a small product illustration that makes the data feel alive.

---

*Document version: 2.0 | Design System: Premium Intelligence*