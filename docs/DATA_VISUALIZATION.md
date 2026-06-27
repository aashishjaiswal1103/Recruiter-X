# Recruiter-X — Data Visualization Reference

---

## 8. DATA VISUALIZATION

Data density and clean layouts drive the visualization system in Recruiter-X. Charts and analytics communicate metrics transparently.

### 8.1 Score Bars (Dimension Breakdown)

The 5 candidate dimension bars always appear in this order:
1. **Trajectory Score:** Progression velocity vs career age.
2. **Behaviour Fit Score:** Ownership pronoun ratios and outcome orientation.
3. **Ghost Match Score:** Fit profile against the synthetic ideal candidate benchmark.
4. **Insider Signal Score:** Checklist validation of industry/seniority heuristics.
5. **Credibility Score:** Absence of red flags and inflation tags.

#### Final Score Display
Large monospaced score (48px JetBrains Mono) with a thick horizontal bar below it at full width. This is the main identifier in the candidate detail view.

---

### 8.2 Pool Health — Stat Grid
Full-width `#000022` band containing 4–6 large statistics boxes.

```css
background: #000022;
padding: 32px 40px;
display: grid;
grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
gap: 40px;
```

#### Stat Content Node:
```
[VALUE]         — JetBrains Mono 48px, color: #0000FF
[LABEL]         — Space Mono 11px 700 uppercase, color: rgba(255,255,255,0.5)
[CONTEXT]       — Space Mono 12px, color: rgba(255,255,255,0.7)
```

---

### 8.3 Insider Signal Grid
Checklist-style grid comparing present versus absent signals side by side.

```
INSIDER SIGNALS PRESENT (7)       INSIDER SIGNALS ABSENT (3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━█   ━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Production incident handling    ✗ Cross-team dependency mgmt
✓ Distributed system tradeoffs    ✗ Failure post-mortems
✓ Latency vs. throughput tensio   ✗ On-call/incident rotation
```

- **Icons:** `✓` in `#0000FF` (Electric Blue), `✗` in `#D4382C` (Signal Red)
