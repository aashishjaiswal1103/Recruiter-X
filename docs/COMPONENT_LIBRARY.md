# Recruiter-X — Component Library Reference

---

## 6. COMPONENT LIBRARY

This document details all non-card components in the Recruiter-X design system. For cards, please refer to the dedicated [docs/CARDS.md](file:///d:/2026/college%20pro/hack/docs/CARDS.md).

### 6.1 Buttons

#### Primary Button
Uses the primary brand voice.
```
background: #0000FF
color: #FFFFFF
font: Space Mono 700 14px
height: 36px
padding: 0 20px
border-radius: 4px
border: none
letter-spacing: 0.04em
hover: background: #0000CC (darkened 20%)
active: background: #000099
disabled: background: #E5E5E5, color: #8C8C8C
```

#### Secondary Button
```
background: transparent
color: #0A0A0A
border: 1px solid #0000FF /* Blue borders */
font: Space Mono 400 14px
height: 36px
padding: 0 20px
border-radius: 4px
hover: background: #F0F4FF, border-color: #0000CC /* Resting blue tint */
```

#### Ghost Button
```
background: transparent
color: #4A4A4A
border: none
font: Space Mono 400 14px
height: 36px
padding: 0 12px
border-radius: 4px
hover: background: #F0F4FF
```

#### Destructive Button
```
Same as Primary but:
background: #D4382C
hover: background: #B52E23
```

---

### 6.3 Score Bars

Horizontal bar component for all dimension scores.

```
Structure:
  [LABEL: ALL CAPS, Space Mono 11px 700]
  [BAR TRACK ─────────────────────────────] [SCORE: JetBrains 14px]
  
Track: height 6px, background #E5E5E5, border-radius 3px
Fill: background based on score:
  0–39: #D4382C (danger)
  40–69: #C47D10 (warning)  
  70–100: #0000FF (brand blue)
Score label: right-aligned, JetBrains Mono, same color as fill
```

#### Large Score Display (candidate card header):
```
[FINAL SCORE: 84]     — JetBrains Mono 48px 400
[RANKED #2 OF 47]     — Space Mono 12px, color: #8C8C8C
```

---

### 6.4 Inputs

#### Standard Input
```css
height: 36px;
border: 1px solid #0000FF; /* Blue is default voice */
border-radius: 4px;
padding: 0 12px;
font-family: Space Mono;
font-size: 14px;
color: #0A0A0A;
background: #FFFFFF;
outline: none;

/* Focus */
border-color: #0000CC;
box-shadow: 0 0 0 3px rgba(0,0,255,0.15);
```

#### Textarea (for JD paste)
```css
min-height: 240px;
resize: vertical;
padding: 16px;
/* Same border/focus rules as input */
font-family: Space Mono;
font-size: 14px;
line-height: 1.65;
```

#### API Key Input (sensitive)
```css
/* Same as input but: */
font-family: JetBrains Mono; /* so key is clearly machine text */
letter-spacing: 0.08em;
/* Reveal toggle button on right side */
```

---

### 6.5 Tags & Badges

#### Trajectory Badges
```
ACCELERATING  bg: rgba(0,0,255,0.08)  text: #0000FF  border: 1px solid rgba(0,0,255,0.2)
STEADY        bg: #FAFAFA              text: #4A4A4A  border: 1px solid #E5E5E5
PLATEAUED     bg: rgba(196,125,16,.08) text: #C47D10  border: 1px solid rgba(196,125,16,.2)
DECLINING     bg: rgba(212,56,44,.08)  text: #D4382C  border: 1px solid rgba(212,56,44,.2)
```

#### All Badges Base Rules:
```css
display: inline-flex;
align-items: center;
height: 24px;
padding: 0 8px;
border-radius: 2px; /* sharp — not pill */
font-family: Space Mono;
font-size: 11px;
font-weight: 700;
letter-spacing: 0.06em;
text-transform: uppercase;
```

---

### 6.6 Tables

Used for candidate list view and pool health data.

```
Header row: background #FAFAFA, Space Mono 11px 700 uppercase, color #4A4A4A
Body rows: background alternates #FFFFFF / #F0F4FF (resting blue)
Row height: 48px
Cell padding: 0 16px
Border: 1px solid #E5E5E5 between rows only (no vertical separators)
Hover row: background #F0F4FF (light blue tint — signals interactivity)

Number cells: JetBrains Mono, right-aligned
Text cells: Space Mono, left-aligned
Badge cells: centered
```

---

### 6.7 Navigation (Sidebar)

In alignment with **White is gravity**, the sidebar is now rendered in light-mode.

```css
/* Sidebar container */
width: 240px;
height: 100vh;
background: #FFFFFF;
position: fixed;
left: 0;
top: 0;
padding: 24px 0;
display: flex;
flex-direction: column;
border-right: 1px solid #E5E5E5;

/* Logo area */
padding: 0 20px 24px;
border-bottom: 1px solid #E5E5E5;

/* Nav item */
height: 40px;
padding: 0 20px;
display: flex;
align-items: center;
gap: 10px;
color: #4A4A4A;
font-family: Space Mono;
font-size: 13px;
cursor: pointer;
transition: all 150ms ease;

/* Nav item — active */
color: #0000FF;
background: #F0F4FF;
border-left: 2px solid #0000FF;

/* Nav item — hover */
background: #FAFAFA;
color: #0A0A0A;
```

---

### 6.8 Modals

```css
/* Backdrop */
position: fixed;
inset: 0;
background: rgba(0,0,34,0.4); /* navy tinted overlay (sparing usage) */
display: flex;
align-items: center;
justify-content: center;
z-index: 1000;

/* Modal container */
background: #FFFFFF;
max-width: 560px;
width: 100%;
border-radius: 8px;
padding: 32px;
position: relative;
border: 1px solid #E5E5E5;

/* Header */
font-family: Syncopate;
font-size: 18px;
font-weight: 700;
color: #0A0A0A;
margin-bottom: 24px;
```

---

### 6.9 API Key Management UI

#### Key list item:
```
[• ACTIVE]  [gemini-1.5-pro]  [••••••••••••••••3891]  [Production Key]  [Last used: 2h ago]  [Delete]
```

#### Fields visible:
- Status dot (blue = active, gray = inactive, red = error)
- Provider icon + model name (Space Mono)
- Masked key (last 4 chars visible, JetBrains Mono)
- User label (editable inline)
- Last used timestamp (relative)
- Actions: Test | Deactivate | Delete
