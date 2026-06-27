# Recruiter-X — Typography System

---

## 4. TYPOGRAPHY SYSTEM

### 4.1 Font Stack

**Display & Headers: Syncopate**
- Google Fonts: `Syncopate`
- Weights: 400 (Regular), 700 (Bold)
- Character: Geometric, wide-set, technical. Used for headings, the logotype, and section titles. Communicates machine precision and authority.
- Usage rule: Never in body copy. Always uppercase or title case. Max 2 uses per screen.

**Body: Space Mono**
- Google Fonts: `Space Mono`
- Weights: 400 (Regular), 700 (Bold)
- Character: Technical monospace with personality. This is the voice of the product for all readable text.
- Usage: All body text, descriptions, paragraphs, labels, navigation items.

**Data: JetBrains Mono**
- Google Fonts: `JetBrains Mono`
- Weights: 400 (Regular), 500 (Medium)
- Character: Developer-grade monospace. Zero ambiguity in numbers.
- Usage: ALL numerical scores, percentages, token counts, cost estimates, timestamps, file sizes, code snippets. Never for prose.

**Import declarations:**
```css
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Space+Mono:wght@400;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

### 4.2 Type Scale

| Token | Font | Size | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| `--type-display` | Syncopate | 32px | 700 | 1.1 | Page titles, hero headings |
| `--type-heading-1` | Syncopate | 24px | 700 | 1.2 | Section headers |
| `--type-heading-2` | Syncopate | 18px | 700 | 1.25 | Sub-section titles |
| `--type-heading-3` | Space Mono | 16px | 700 | 1.3 | Card titles, group headers |
| `--type-body` | Space Mono | 14px | 400 | 1.65 | Body text, descriptions, narrative |
| `--type-body-bold` | Space Mono | 14px | 700 | 1.65 | Emphasized body, labels |
| `--type-small` | Space Mono | 12px | 400 | 1.5 | Metadata, timestamps, helper text |
| `--type-label` | Space Mono | 11px | 700 | 1.0 | ALL CAPS section labels, badges |
| `--type-code` | JetBrains Mono | 13px | 400 | 1.5 | Question text, interrogation output |
| `--type-data-large` | JetBrains Mono | 28px | 400 | 1.1 | Big number display (pool stats) |
| `--type-data-small` | JetBrains Mono | 12px | 400 | 1.4 | Table data, inline scores |

### 4.3 Typography Rules

1. **Syncopate is precious — use it sparingly.** Maximum 2 Syncopate elements per screen. If it's everywhere, it's nowhere.
2. **Data is always JetBrains Mono.** Without exception. If a number is on screen, it's in JetBrains Mono.
3. **ALL CAPS labels define sections.** Small Space Mono in ALL CAPS creates hierarchy without size. Example: `TRAJECTORY SCORE` / `GHOST MATCH` / `RED FLAGS`.
4. **Tabular numbers.** JetBrains Mono has tabular figures by default — columns of numbers align perfectly without any intervention.
5. **Letter spacing on Syncopate: `0.08em`.** Syncopate's wide characters need tracking adjusted for readability at body sizes.
