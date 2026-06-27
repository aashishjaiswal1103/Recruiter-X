# Recruiter-X — Layout Architecture Reference

---

## 7. LAYOUT ARCHITECTURE

### 7.1 Page Template

```
┌─────────────────────────────────────────────────────────────────┐
│ SIDEBAR (240px, navy #000022, fixed)                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ RECRUITER-X logo                                           │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ Dashboard                                                  │ │
│  │ ● Active Project: Senior ML Eng                           │ │
│  │   Project 2                                                │ │
│  │   Project 3                                                │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ Settings                                                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  MAIN CONTENT (margin-left: 240px, padding: 32px 40px)        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ PAGE HEADER                                               │  │
│  │ [Syncopate 24px] Page Title        [Action Buttons]      │  │
│  │ [Space Mono 12px] Breadcrumb / context                   │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ CONTENT AREA                                              │  │
│  │ (varies by page)                                          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Project Workspace Layout

```
┌─────────────────────────────────────────────────────┐
│ Pool Health Report (full width, #000022 bg)         │
│ [BIG NUMBER] [BIG NUMBER] [BIG NUMBER] [BIG NUMBER] │
│   Qualified    Avg Inflation  Hidden Gems  Honest %  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ RANKED CANDIDATES                   [Filters] [↓ Export] │
├──────────────────────────┬──────────────────────────┤
│ Candidate Card           │ Candidate Card           │
│ #1 — Arjun Sharma        │ #2 — Sofia Mendes        │
│ Score: 87                │ Score: 81                │
│ [ACCELERATING]           │ [STEADY]                 │
│ Ghost Match: 91          │ Ghost Match: 78          │
│ ⚑ 1 flag                │ ⚑ 0 flags               │
├──────────────────────────┼──────────────────────────┤
│ Candidate Card           │ Candidate Card           │
│ ...                      │ ...                      │
└──────────────────────────┴──────────────────────────┘
```

### 7.3 Candidate Detail Layout

```
┌───────────────────────────────────────────────────────────┐
│ HEADER                                                    │
│ [Rank #1]  Arjun Sharma  — Senior ML Engineer            │
│ Final Score: [87] ████████████████░░░░                   │
│ [ACCELERATING] [Ghost: 91] [Insider: 8/10]               │
└───────────────────────────────────────────────────────────┘

┌────────────────┬──────────────────────────────────────────┐
│ LEFT (65%)     │ RIGHT (35%)                              │
│                │                                          │
│ Score breakdown│ INTERROGATION ENGINE                     │
│ All 5 bars     │ [Q1] [Q2] [Q3] — monospace cards        │
│                │                                          │
│ Red Flags      │ RED FLAGS                                │
│ (if any)       │ Detailed flag breakdown                  │
│                │                                          │
│ System         │ GHOST GAP REPORT                         │
│ Narrative      │ What's missing vs. ideal                 │
│ (what resume   │                                          │
│ says vs what   │                                          │
│ system found)  │                                          │
└────────────────┴──────────────────────────────────────────┘
```
