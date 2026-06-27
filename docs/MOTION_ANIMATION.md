# Recruiter-X — Motion & Animation System (V2.0 — Premium AI-SaaS)

---

## 9. MOTION & ANIMATION

### 9.1 Principles

Motion is what turns a static layout into something that feels alive. It's the single biggest differentiator between a page that looks like a screenshot and a page that feels like a premium product. Every animation earns its place — but "it makes the product feel premium and inviting" is now a valid purpose on its own.

- **Slow, smooth motion reads as premium.** The old system had a 300ms ceiling and banned parallax. The new system leans into slower, smoother motion because that's what reads as "considered" rather than "instant/robotic." Micro-interactions (hover, press, focus) stay snappy at 150–250ms; entrance and ambient motion are intentionally slower (400ms–1.2s for reveals, multi-second loops for ambient drift/bob).
- **Independence creates life.** Floating product mockups bob gently and *independently* — each with its own duration and delay offset so the cluster never moves in unison. This is what makes the hero read as "alive" rather than a static screenshot stack.
- **Parallax and scroll effects are core to the system.** Ambient blobs drifting, content fading up and scaling in, floating cards bobbing. This is the main thing separating the new aesthetic from the old flat/static one.
- **Bounce and spring are welcome** on hover/press micro-interactions and on entrance reveals — subtle, never cartoonish.
- **Purpose includes feel.** If an animation makes a moment feel more alive, considered, or premium, that's enough justification; it doesn't need to map to a system-state message.

### 9.2 Transition Tokens

```css
/* Micro-interactions — stay snappy */
--transition-fast:    150ms ease;                               /* Hover color/border changes */
--transition-base:    200ms ease-out;                           /* Button/card hover lift, focus states */
--transition-press:   120ms ease-in-out;                        /* Button/card press (scale down) */

/* Entrance / reveal — intentionally slower */
--transition-reveal:  600ms cubic-bezier(0.16, 1, 0.3, 1);     /* Scroll entrance, fade-up + scale */
--transition-modal:   250ms cubic-bezier(0.34, 1.56, 0.64, 1); /* Modal entry, slight overshoot */
--stagger-step:       80ms;                                     /* Delay between staggered children */

/* Ambient / long-loop motion — not interaction-driven */
--float-duration:     5s;       /* Floating mockup bob cycle */
--blob-duration:      20s;      /* Background gradient blob drift */
--countup-duration:   1.2s;     /* Score/stat number count-up */
```

### 9.3 Specific Animations

#### Scroll Entrance — "Fade Up & Settle"

Applied to every section's content block, and to individual cards within bento grids, on first scroll-into-view. This is the animation that makes content feel like it arrives with intention rather than being printed onto the page.

```css
@keyframes fade-up-settle {
  from { opacity: 0; transform: translateY(24px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.reveal {
  animation: fade-up-settle 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Children inside a bento grid stagger via animation-delay,
   incrementing by --stagger-step (80ms) per child */
.reveal:nth-child(1) { animation-delay: 0ms; }
.reveal:nth-child(2) { animation-delay: 80ms; }
.reveal:nth-child(3) { animation-delay: 160ms; }
.reveal:nth-child(4) { animation-delay: 240ms; }
```

#### Floating Mockup Bob — Hero & "How It Works" Product Cards

Each floating card gets its own duration/delay offset so the cluster never moves in unison. This is the key to making the hero feel alive:

```css
@keyframes float-bob {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}

.float-card {
  animation: float-bob var(--float-duration) ease-in-out infinite;
}

/* Each card bobs at a different pace */
.float-card:nth-child(1) { animation-duration: 5.0s; animation-delay: 0s; }
.float-card:nth-child(2) { animation-duration: 5.6s; animation-delay: -1.2s; }
.float-card:nth-child(3) { animation-duration: 4.8s; animation-delay: -2.4s; }
.float-card:nth-child(4) { animation-duration: 6.2s; animation-delay: -0.8s; }
```

#### Ambient Gradient Blob Drift — Hero & CTA Band Background

```css
@keyframes blob-drift {
  0%   { transform: translate(0, 0) scale(1); }
  33%  { transform: translate(20px, -15px) scale(1.05); }
  66%  { transform: translate(-15px, 10px) scale(0.97); }
  100% { transform: translate(0, 0) scale(1); }
}

.ambient-blob {
  filter: blur(120px);
  opacity: 0.3;
  animation: blob-drift var(--blob-duration) ease-in-out infinite;
}

/* Multiple blobs with offset timing for organic feel */
.ambient-blob:nth-child(2) { animation-delay: -7s; opacity: 0.2; }
.ambient-blob:nth-child(3) { animation-delay: -14s; opacity: 0.25; }
```

#### Mouse Parallax — Hero Blobs (Desktop Only)

```js
// Blobs drift a few px opposite to cursor movement,
// layered on top of their own drift loop
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * -12;
  const y = (e.clientY / window.innerHeight - 0.5) * -12;
  blobEl.style.translate = `${x}px ${y}px`;
});
```

#### Score / Stat Count-Up — On Scroll Into View

Numbers animate from 0 to their final value when they enter the viewport, eased with an out-cubic curve so the acceleration feels natural:

```js
function countUp(el, target, duration = 1200) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Trigger with IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      countUp(el, parseInt(el.dataset.target), 1200);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.3 });
```

#### Score Bar / Stat Fill — Gradient Version

```css
@keyframes bar-fill-gradient {
  from { width: 0%; }
  to   { width: var(--score-pct); }
}

.score-bar-fill {
  background: var(--gradient-score);
  border-radius: 999px;
  height: 10px;
  animation: bar-fill-gradient 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Within a 5-bar dimension group, each bar delays by --stagger-step * index
   so bars fill in sequence rather than all at once */
.score-bar-fill:nth-child(1) { animation-delay: 0ms; }
.score-bar-fill:nth-child(2) { animation-delay: 100ms; }
.score-bar-fill:nth-child(3) { animation-delay: 200ms; }
.score-bar-fill:nth-child(4) { animation-delay: 300ms; }
.score-bar-fill:nth-child(5) { animation-delay: 400ms; }
```

#### Button & Card Hover — Lift + Soft Settle

```css
.lift-on-hover {
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.lift-on-hover:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
}

.lift-on-hover:active {
  transform: scale(0.97);
  transition: transform var(--transition-press);
}
```

#### Modal Entry — Soft Overshoot

```css
@keyframes modal-enter-soft {
  from { opacity: 0; transform: scale(0.94) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.modal {
  animation: modal-enter-soft 250ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
  /* the 1.56 overshoot term gives a faint, premium "settle" */
}
```

#### Processing / Analysis State — Softened Scanner Shimmer

```css
@keyframes scanner-soft {
  0%   { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}

.analyzing {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0,0,255,0.06) 40%,
    rgba(0,0,255,0.14) 50%,
    rgba(0,0,255,0.06) 60%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: scanner-soft 2.4s ease-in-out infinite;
}
```

#### Status Dot — Live Processing Indicator

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.3; }
}

.status-live {
  animation: pulse 1.2s ease-in-out infinite;
}
```

### 9.4 Reduced Motion

All animations are wrapped in `@media (prefers-reduced-motion: no-preference)`. When reduced motion is preferred:
- Float-bob → disabled (static position)
- Blob-drift → disabled (static position)
- Fade-up-settle → instant appearance (opacity: 1, no transform)
- Count-up → shows final number immediately
- Bar-fill → shows final width immediately
- Hover lift → color change only (no transform)
- Parallax → disabled

---

*Document version: 2.0 | Design System: Premium Intelligence*