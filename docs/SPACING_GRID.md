# Recruiter-X — Spacing & Grid System

---

## 5. SPACING & GRID

### 5.1 Base Unit

**Base: 4px.** All spacing is a multiple of 4.

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Icon-to-label gap, tag internal padding |
| `--space-2` | 8px | Compact list items, badge padding |
| `--space-3` | 12px | Card internal section gap |
| `--space-4` | 16px | Standard padding inside cards |
| `--space-5` | 20px | Card padding |
| `--space-6` | 24px | Section separation within page |
| `--space-8` | 32px | Major section gaps |
| `--space-10` | 40px | Page-level padding (sides) |
| `--space-12` | 48px | Hero section padding |
| `--space-16` | 64px | Full section vertical rhythm |

### 5.2 Layout Grid

- **Max content width:** 1280px
- **Sidebar:** Fixed left, 240px, `background: --color-navy`
- **Main content:** `margin-left: 240px`, `padding: 32px 40px`
- **Content grid:** 12-column, 24px gutter
- **Card grid:** Typically 3-column (4 on wide) for candidate cards, 1-column for reports

### 5.3 Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 2px | Tags, badges, small elements |
| `--radius-md` | 4px | Buttons, inputs, score bars |
| `--radius-lg` | 6px | Cards |
| `--radius-xl` | 8px | Modals |
| `--radius-full` | 9999px | Pills, status dots |
