# Recruiter-X — Design Tokens Reference

---

## 15. DESIGN TOKENS REFERENCE

No component is created without a corresponding token. All design decisions derive from this master list.

```css
:root {
  /* PRIMARY COLORS (Dominant) */
  --color-blue:          #0000FF;
  --color-blue-dim:      #0000CC;
  --color-blue-light:    #F0F4FF;
  --bg-base:             #FFFFFF;
  --bg-subtle:           #FAFAFA;

  /* SECONDARY COLORS (Sparing) */
  --color-navy:          #000022;
  --color-navy-soft:     #00003A;
  --color-cream:         #FFF5EC;
  --color-peach:         #FCE9D7;

  /* TEXT COLORS */
  --text-primary:        #0A0A0A;
  --text-secondary:      #4A4A4A;
  --text-tertiary:       #8C8C8C;
  --text-on-navy:        #FFFFFF;

  /* SEMANTIC COLORS */
  --color-danger:        #D4382C;
  --color-danger-bg:     #FFF5F5;
  --color-warning:       #C47D10;
  --color-warning-bg:    #FFFBF0;
  --color-success:       #2D8A4E;
  --color-success-bg:    #F0FDF4;
  --color-info:          #0000FF;
  --color-info-bg:       #F0F0FF;

  /* TYPOGRAPHY */
  --font-display:        'Syncopate', sans-serif;
  --font-body:           'Space Mono', monospace;
  --font-data:           'JetBrains Mono', monospace;

  /* TYPE SCALE */
  --type-display:        700 32px/1.1 var(--font-display);
  --type-h1:             700 24px/1.2 var(--font-display);
  --type-h2:             700 18px/1.25 var(--font-display);
  --type-h3:             700 16px/1.3 var(--font-body);
  --type-body:           400 14px/1.65 var(--font-body);
  --type-body-bold:      700 14px/1.65 var(--font-body);
  --type-small:          400 12px/1.5 var(--font-body);
  --type-label:          700 11px/1.0 var(--font-body);
  --type-data-lg:        400 48px/1.1 var(--font-data);
  --type-data:           400 14px/1.4 var(--font-data);
  --type-data-sm:        400 12px/1.4 var(--font-data);

  /* SPACING */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* BORDERS */
  --radius-sm:   2px;
  --radius-md:   4px;
  --radius-lg:   6px;
  --radius-xl:   8px;
  --radius-full: 9999px;

  /* TRANSITIONS */
  --transition-fast: 100ms ease;
  --transition-base: 150ms ease;
  --transition-slow: 250ms ease;

  /* LAYOUT */
  --sidebar-width:    240px;
  --content-max:      1280px;
  --page-padding:     40px;

  /* SHADOWS */
  --shadow-card:    0 1px 3px rgba(0,0,0,0.06);
  --shadow-modal:   0 20px 60px rgba(0,0,34,0.3);
  --shadow-focus:   0 0 0 3px rgba(0,0,255,0.12);
}
```

---

*Document version: 1.1 | Design System: Electric Intelligence*
