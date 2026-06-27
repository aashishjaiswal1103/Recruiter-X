# Recruiter-X — Iconography Reference

---

## 10. ICONOGRAPHY

### Library
**Lucide Icons** (MIT licensed, open source).

### Style settings
```css
--icon-size: 18px;
--icon-stroke: 1.5;
--icon-color: #4A4A4A; /* default — graphite */
```

### Color overrides
- **Interactive icons:** `#1A1A1A`
- **Success / Positive signals:** `#2D8A4E` (Signal Green)
- **Warnings / Muted risk:** `#C47D10` (Signal Amber)
- **Danger / Red flags:** `#D4382C` (Signal Red)
- **Active / Primary calculations:** `#0000FF` (Electric Blue)
- **On dark navy backgrounds:** `rgba(255,255,255,0.7)`

### Icon Usage Rules
1. **Always label icons:** Icons must appear with text labels—never as sole affordance (except for well-established layout actions like closing a modal: `×`).
2. **Size consistency:** Always `18px` in general navigation sidebar, `16px` inside candidate cards, and `24px` in empty status grids.
3. **Flat rendering:** No background badge fills around icons (avoid surrounding icons with colored circles or frames). Keep rendering flat and inline.
