# Recruiter-X — Component Library Reference (V2.0 — Premium AI-SaaS)

---

## 6. BUTTONS

### 6.1 Primary Button — Black Pill

The default action button. Black as punctuation — grounding, confident, impossible to miss on a white canvas.

```css
.btn-primary {
  background: #0A0A0A;
  color: #FFFFFF;
  font: 500 15px/1 'Space Grotesk', sans-serif;
  height: 44px;
  padding: 0 28px;
  border-radius: 999px;          /* Full pill shape */
  border: none;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.btn-primary:active {
  transform: scale(0.97);
  transition: transform 120ms ease-in-out;
}

.btn-primary:disabled {
  background: #E5E5E5;
  color: #8C8C8C;
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}
```

### 6.2 Gradient CTA Button

Used exclusively in hero sections and CTA bands — the highest-emphasis action on the page. Blue gradient fill, white text, pill shape, soft glow on hover.

```css
.btn-cta {
  background: linear-gradient(135deg, #0000FF, #2563EB, #8FB3FF);
  color: #FFFFFF;
  font: 600 16px/1 'Space Grotesk', sans-serif;
  height: 48px;
  padding: 0 36px;
  border-radius: 999px;
  border: none;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}

.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0,0,255,0.25);
}

.btn-cta:active {
  transform: scale(0.97);
  transition: transform 120ms ease-in-out;
}
```

### 6.3 Secondary Button

White fill, subtle border, pill shape. For secondary actions sitting alongside a primary or CTA button.

```css
.btn-secondary {
  background: #FFFFFF;
  color: #0A0A0A;
  font: 500 15px/1 'Space Grotesk', sans-serif;
  height: 44px;
  padding: 0 28px;
  border-radius: 999px;
  border: 1px solid #E0E0E0;
  cursor: pointer;
  transition: transform 200ms ease-out, box-shadow 200ms ease-out, border-color 150ms ease;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  border-color: #BFBFBF;
}

.btn-secondary:active {
  transform: scale(0.97);
  transition: transform 120ms ease-in-out;
}
```

### 6.4 Ghost Button

Transparent, text only. For tertiary actions, inline links, and "learn more" moments.

```css
.btn-ghost {
  background: transparent;
  color: #4A4A4A;
  font: 500 15px/1 'Space Grotesk', sans-serif;
  height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease;
}

.btn-ghost:hover {
  color: #0A0A0A;
  background: rgba(0,0,0,0.04);
}
```

### 6.5 Destructive Button

Same shape as primary, red fill. For delete actions, cancellations, and irreversible operations.

```css
.btn-destructive {
  /* Same structure as .btn-primary */
  background: #DC2626;
  color: #FFFFFF;
  font: 500 15px/1 'Space Grotesk', sans-serif;
  height: 44px;
  padding: 0 28px;
  border-radius: 999px;
  border: none;
}

.btn-destructive:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(220,38,38,0.25);
}
```

### 6.6 Button on Dark Surfaces

When a button sits on a gradient mesh hero or dark card, invert the palette:

```css
.btn-on-dark {
  background: #FFFFFF;
  color: #0A0A0A;
  /* Same sizing, radius, and hover behavior as .btn-primary */
}

.btn-on-dark:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255,255,255,0.15);
}
```

---

## 7. SCORE DISPLAY

### 7.1 Large Score Display (Candidate Card Header)

The headline score is the largest visual moment on a candidate detail view:

```css
.score-hero {
  font: 700 88px/1 'Space Grotesk', sans-serif;
  background: linear-gradient(135deg, #0000FF, #2563EB, #8FB3FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  /* Number counts up from 0 over 1.2s via JS */
}

.score-rank {
  font: 400 14px/1.4 'Cambay', sans-serif;
  color: #8C8C8C;
  margin-top: 8px;
  /* e.g., "Stronger than 84% of this pool" */
}
```

### 7.2 Inline Score (Card / Table)

```css
.score-inline {
  font: 700 16px/1 'Space Mono', monospace;
  background: linear-gradient(90deg, #0000FF, #8FB3FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

*Document version: 2.0 | Design System: Premium Intelligence*
