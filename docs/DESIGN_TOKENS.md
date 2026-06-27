# Recruiter-X — Design Tokens Reference (V2.0 — Premium AI-SaaS)

---

## 15. DESIGN TOKENS REFERENCE

No component is created without a corresponding token. All design decisions derive from this master list.

```css
:root {
  /* ─── THREE-COLOR SYSTEM ─── */

  /* White — Resting Space */
  --bg-base:             #FFFFFF;
  --bg-subtle:           #FAFAFA;
  --bg-muted:            #F5F5F5;

  /* Blue — Hero Color */
  --color-blue:          #0000FF;
  --color-blue-mid:      #2563EB;
  --color-blue-light:    #8FB3FF;
  --color-blue-pale:     #EEF2FF;

  /* Black — Punctuation */
  --color-black:         #0A0A0A;
  --color-black-soft:    #111111;
  --color-black-muted:   #1A1A1A;


  /* ─── GRADIENTS ─── */
  --gradient-hero:       linear-gradient(135deg, #000033 0%, #0000FF 40%, #2563EB 70%, #8FB3FF 100%);
  --gradient-score:      linear-gradient(90deg, #0000FF, #2563EB, #8FB3FF);
  --gradient-blob:       radial-gradient(circle, rgba(0,0,255,0.15), transparent 70%);


  /* ─── GLASS / FROSTED SURFACES ─── */
  --glass-bg:            rgba(255, 255, 255, 0.60);
  --glass-bg-dark:       rgba(0, 0, 0, 0.40);
  --glass-border:        rgba(255, 255, 255, 0.20);
  --glass-blur:          blur(20px);


  /* ─── TEXT COLORS ─── */
  --text-primary:        #0A0A0A;
  --text-secondary:      #4A4A4A;
  --text-tertiary:       #8C8C8C;
  --text-on-dark:        #FFFFFF;
  --text-on-blue:        #FFFFFF;


  /* ─── SEMANTIC COLORS ─── */
  --color-danger:        #DC2626;
  --color-danger-bg:     #FEF2F2;
  --color-warning:       #D97706;
  --color-warning-bg:    #FFFBEB;
  --color-success:       #16A34A;
  --color-success-bg:    #F0FDF4;
  --color-info:          #2563EB;
  --color-info-bg:       #EEF2FF;


  /* ─── TYPOGRAPHY ─── */
  --font-display:        'Space Grotesk', sans-serif;
  --font-body:           'Cambay', sans-serif;
  --font-data:           'Space Mono', monospace;
  --font-poster:         'Bitcount Single', monospace;

  /* TYPE SCALE */
  --type-hero:           700 clamp(56px, 5vw, 72px)/1.05 var(--font-display);
  --type-display:        700 42px/1.1 var(--font-display);
  --type-h1:             700 32px/1.15 var(--font-display);
  --type-h2:             600 24px/1.2 var(--font-display);
  --type-h3:             600 18px/1.3 var(--font-display);
  --type-body-lg:        400 18px/1.6 var(--font-body);
  --type-body:           400 16px/1.65 var(--font-body);
  --type-body-bold:      700 16px/1.65 var(--font-body);
  --type-small:          400 14px/1.5 var(--font-body);
  --type-label:          700 11px/1.0 var(--font-data);
  --type-code:           400 14px/1.5 var(--font-data);
  --type-data-hero:      700 48px/1.1 var(--font-data);
  --type-data:           400 16px/1.4 var(--font-data);
  --type-data-sm:        400 12px/1.4 var(--font-data);
  --type-poster:         400 clamp(48px, 6vw, 96px)/1.0 var(--font-poster);


  /* ─── SPACING ─── */
  --space-1:   4px;
  --space-2:   8px;
  --space-3:   12px;
  --space-4:   16px;
  --space-5:   20px;
  --space-6:   24px;
  --space-8:   32px;
  --space-10:  40px;
  --space-12:  48px;
  --space-16:  64px;
  --space-20:  80px;
  --space-24:  96px;


  /* ─── BORDERS ─── */
  --radius-sm:    8px;
  --radius-md:    12px;
  --radius-lg:    16px;
  --radius-xl:    20px;
  --radius-2xl:   24px;
  --radius-full:  9999px;

  --border-default: 1px solid #E5E7EB;
  --border-subtle:  1px solid #F0F0F0;


  /* ─── TRANSITIONS ─── */
  --transition-fast:    150ms ease;
  --transition-base:    200ms ease-out;
  --transition-press:   120ms ease-in-out;
  --transition-reveal:  600ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-modal:   250ms cubic-bezier(0.34, 1.56, 0.64, 1);
  --stagger-step:       80ms;

  /* Ambient / long-loop */
  --float-duration:     5s;
  --blob-duration:      20s;
  --countup-duration:   1.2s;


  /* ─── LAYOUT ─── */
  --content-max:     1320px;
  --page-padding:    48px;
  --section-gap:     96px;     /* Vertical space between major page sections */
  --card-gap:        24px;     /* Gap between bento grid cards */


  /* ─── SHADOWS ─── */
  --shadow-card:       0 4px 16px rgba(0,0,34,0.06);
  --shadow-card-hover: 0 12px 32px rgba(0,0,34,0.10);
  --shadow-float:      0 20px 48px rgba(0,0,34,0.12);
  --shadow-modal:      0 24px 64px rgba(0,0,34,0.18);
  --shadow-glow-blue:  0 0 60px rgba(0,0,255,0.15);
  --shadow-focus:      0 0 0 3px rgba(37,99,235,0.25);
}
```

---

*Document version: 2.0 | Design System: Premium Intelligence*
