# RECRUITER-X — Design System Index

## Premium Intelligence Aesthetic — v2.0

> **Design thesis.**
> Recruiter-X is an intelligent ally that proves its intelligence through polish and craft — soft gradients, bento layouts, floating product moments, and a deliberate three-color system of white, blue, and black. The interface doesn't perform "serious tech" through density; it earns trust the way a $299/mo AI-SaaS product should: generous whitespace, motion that feels alive, and product moments that make the intelligence visible and inviting.

---

To make analysis and maintenance easier, the design system has been modularized into separate, focused documentation files. Click on any section below to view its specific guidelines:

### 1. Core Guidelines

- [**Design Philosophy & Brand Voice**](./DESIGN_PHILOSOPHY.md)
  - Core Thesis & Five Design Laws (v2.0)
  - Three-color system: white (resting space), blue (hero color), black (punctuation)
  - Brand Personality, Copy Tone, and "Poster Moment" concept
  - Logo placement and gradient treatment

- [**Color System**](./COLOR_SYSTEM.md)
  - Three-color system: white canvas, blue hero, black punctuation
  - Gradient mesh family and ambient blob tokens
  - Glass / frosted-card surface tokens
  - Semantic palette (danger, warning, success, info)

### 2. Styling Foundation & Tokens

- [**Typography System**](./TYPOGRAPHY.md)
  - Font families: Space Grotesk (headings), Cambay (body), Bitcount Single (poster moments), Space Mono (data / mono accent)
  - Type scale with generous sizing (56–72px hero → 16px body)
  - "Poster moment" rules — where expressive type is allowed

- [**Spacing & Grid**](./SPACING_GRID.md)
  - 4px base spacing unit table
  - Bento-style asymmetric layout system (one big card + small cards)
  - Content widths, generous gutters, and breathing room
  - Border radius tokens (rounded, premium — 12–24px)

- [**Design Tokens Reference**](./DESIGN_TOKENS.md)
  - Global CSS `:root` variable definitions for colors, typography, sizing, transitions, shadows, gradients, and glass effects

### 3. Components Reference

- [**Buttons & Components**](./button.md)
  - Black pill primary, gradient CTA variant, ghost and secondary styles
  - Premium sizing (44px height), hover lift behavior
  - Score display with gradient-filled text and count-up animation

### 4. Interactive States & UX Behaviors

- [**Layout Architecture**](./LAYOUT_ARCHITECTURE.md)
  - Bento-style asymmetric grid layouts
  - Hero with floating product mockup cluster
  - CTA band with gradient mesh background

- [**Data Visualization**](./DATA_VISUALIZATION.md)
  - Gradient-filled score bars with staggered entrance
  - Bento stat cluster (hero stat + supporting cards)
  - Expressive data viz moments (radial rings, animated charts)

- [**Motion & Animation**](./MOTION_ANIMATION.md)
  - Floating product mockups that bob gently and independently
  - Background blobs that drift slowly
  - Scroll-triggered fade-up-and-settle reveals
  - Score count-up animations on scroll into view
  - Button lift-on-hover with soft bounce settle

- [**System States & Feedback**](./SYSTEM_STATES.md)
  - Card-based loading states with shimmer and gradient progress
  - Warm, human empty states
  - Specific, actionable error cards

- [**Responsive & Accessibility Standards**](./RESPONSIVE_ACCESSIBILITY.md)
  - Breakpoints & bento-to-stacked mobile behavior
  - Float animation reduction on mobile
  - Screen reader, focus states, keyboard tab order, and color contrast standards

---

*Document version: 2.0 | Design System: Premium Intelligence*
*Recruiter-X — All design decisions derive from these documents. No component is created without a corresponding token.*
