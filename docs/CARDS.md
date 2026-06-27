# Recruiter-X — Card Components Reference

---

## 6.2 CARDS

Cards are the primary structural container of the Recruiter-X interface. They group related metadata, analysis narrations, and actions.

### Standard Card
Used for general panels, settings layout blocks, and secondary information containers.
```css
background: #FFFFFF;
border: 1px solid #E5E5E5;
border-radius: 6px;
padding: 20px;
```

### Candidate Card
Used in the candidate ranked list. Features a left-side colored border representing the candidate's trajectory velocity.
```css
background: #FFFFFF;
border: 1px solid #E5E5E5;
border-left: 3px solid [status-color];
border-radius: 6px;
padding: 20px;
```

#### Trajectory Status Borders:
- **Accelerating:** `#0000FF` (Electric Blue)
- **Steady:** `#8C8C8C` (Slate Gray)
- **Plateaued:** `#C47D10` (Amber)
- **Declining:** `#D4382C` (Signal Red)

### Ghost/Benchmark Card
Used to present the synthetic ideal candidate benchmark. Rendered in midnight navy with light borders for maximum visual contrast and priority emphasis.
```css
background: #000022;
color: #FFFFFF;
border: 1px solid rgba(255,255,255,0.1);
border-radius: 6px;
padding: 20px;
```

### Stat Card
Used in dashboard summaries and metrics grids to list numbers and scores.
```css
background: #FFF5EC;
border: 1px solid #FCE9D7;
border-radius: 6px;
padding: 20px 24px;
```

### Interrogation Question Card
A specialized card component formatted to look like code terminal output, isolating deep-probing interview questions.
```css
background: #000022;
border: 1px solid rgba(0,0,255,0.3);
border-radius: 6px;
padding: 20px;
```

```
// Content structure layout:

[Q1]   — JetBrains Mono 11px, color: #0000FF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Walk me through the specific bottleneck you hit when   — Space Mono 14px, color: #FFFFFF
you crossed 1M daily requests — what failed first,
what your initial diagnosis was, and what the actual
fix turned out to be."

PROBING: "Scaled ML pipeline to 10M users"             — Space Mono 11px, color: rgba(255,255,255,0.4)
CLAIM CREDIBILITY: LOW                                 — color: #D4382C
```
