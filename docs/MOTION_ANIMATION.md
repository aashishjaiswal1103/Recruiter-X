# Recruiter-X — Motion & Animation System

---

## 9. MOTION & ANIMATION

### 9.1 Principles

Motion communicates system state, not decoration. Every animation must answer the question: "What would the user not know if this animation didn't exist?"

- **No bounce.** No spring. No parallax. No scroll effects.
- **Duration ceiling: 300ms.** Most interactions should resolve in 150–200ms.
- **Purpose before polish.** If an animation's purpose cannot be stated in one sentence, remove it.

### 9.2 Transition Tokens

```css
--transition-fast: 100ms ease;      /* Hover state colour changes */
--transition-base: 150ms ease;      /* Focus states, button interactions */
--transition-slow: 250ms ease;      /* Panel expansions, tab switches */
--transition-modal: 200ms ease-out; /* Modal entry */
```

### 9.3 Specific Animations

#### Processing / Analysis state — "Scanner" animation:
```css
/* Applied to candidate card while analyzing */
@keyframes scanner {
  0%   { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}
.analyzing {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0,0,255,0.08) 40%,
    rgba(0,0,255,0.15) 50%,
    rgba(0,0,255,0.08) 60%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: scanner 1.8s ease-in-out infinite;
}
```

#### Progress bar — analysis completion:
```css
@keyframes progress-fill {
  from { width: 0; }
  to   { width: var(--progress-pct); }
}
/* Blue fill, height 3px, at top of card while processing */
```

#### Modal entry:
```css
@keyframes modal-enter {
  from { opacity: 0; transform: scale(0.97) translateY(-4px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
```

#### Score bar fill (on card render):
```css
@keyframes bar-fill {
  from { width: 0%; }
  to   { width: var(--score-pct); }
}
animation: bar-fill 400ms ease-out 100ms both;
```

#### Status dot — live processing indicator:
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
.status-live { animation: pulse 1.2s ease-in-out infinite; }
```
