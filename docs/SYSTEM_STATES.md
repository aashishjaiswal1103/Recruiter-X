# Recruiter-X — System States: Loading, Empty, & Errors (V2.0 — Premium AI-SaaS)

---

## 11. LOADING & PROCESSING STATES

All loading states use card-based layouts with gradient progress indicators — no terminal ASCII art, no monospace log dumps, no `━━━` borders.

### 11.1 JD Analysis (Post-Submit, ~15 seconds)

Renders as a soft card with animated progress:

| Element | Treatment |
|---|---|
| Card | White fill, 20px radius, `--shadow-card`, centered in workspace |
| Header | Space Grotesk 600, 18px — "Running your audit…" |
| Progress bar | Rounded pill (`border-radius: 999px`, height 8px), gradient fill (`--gradient-score`), animates from 0 to current % |
| Percentage | Space Mono 700, 16px, gradient-filled text — counts up with the bar |
| Step list | Cambay 400, 14px, `#8C8C8C` — each step appears with a fade-in as it begins |
| Timer | Space Mono 400, 14px, `#8C8C8C`, top-right of card |

Step list example (each line fades in progressively):
- ✓ Extracting must-have requirements
- ✓ Detecting seniority signals
- ● Generating insider checklist…

Completed steps show a small `✓` in `--color-success`. The active step shows a pulsing `●` in `--color-blue`.

### 11.2 Candidate Analysis (Bulk)

Progress bar at the top of the candidate list section:

| Element | Treatment |
|---|---|
| Container | Full-width bar inside a soft card header |
| Progress bar | Rounded pill, gradient fill, same treatment as §11.1 |
| Count text | Space Mono 400, 14px — "32 of 47 analyzed · 12 queued" |
| Status | Cambay 400, 14px, `#8C8C8C` — "the rest are right behind" |

Individual candidate cards show a soft shimmer animation while processing (the `scanner-soft` animation from Motion §9.3). Cards resolve to full card layout when analysis completes. Cards appear in ranked order as they complete (not upload order).

### 11.3 API Key Validation

Button state progression:

| State | Display |
|---|---|
| Default | Black pill button: "Validate & Save" |
| Validating | Button text changes to "Validating…" with a small rotating border spinner (3 lines of CSS, blue stroke) |
| Success | Button briefly shows ✓ with green tint, then settles to "Key active — 1 token used" in `--color-success` |
| Error | Red-tinted card appears below with specific error + retry action |

---

## 12. EMPTY STATES & ERRORS

### 12.1 No Projects (Dashboard)

Centered in the workspace, generous vertical padding:

| Element | Treatment |
|---|---|
| Heading | Space Grotesk 600, 24px — "Nothing here yet" |
| Description | Cambay 400, 16px, `#8C8C8C` — "Create your first project to start finding your next great hire." |
| Button | Gradient CTA pill — "+ New Project" |

No illustration. No cartoon character. The product is confident enough not to need an onboarding mascot. Generous whitespace around the text conveys premium restraint.

### 12.2 No Candidates Uploaded

Card with drag-and-drop zone:

| Element | Treatment |
|---|---|
| Card | White fill, 20px radius, dashed `2px #E5E7EB` border (changes to `#2563EB` on drag-over) |
| Heading | Space Grotesk 500, 18px — "Drop resumes here" |
| Or-text | Cambay 400, 14px, `#8C8C8C` — "or" |
| Browse link | Cambay 400, 14px, `#2563EB`, underline on hover — "browse files" |
| Limits | Cambay 400, 12px, `#8C8C8C` — "Up to 500 files · 10 MB each" |

### 12.3 Analysis Failed

Error card for a specific candidate failure:

| Element | Treatment |
|---|---|
| Card | White fill, 20px radius, `2px solid --color-danger` left border accent |
| Icon | ⚠ Warning icon in `--color-danger`, 20px |
| Heading | Space Grotesk 600, 16px — "Analysis couldn't finish" |
| Detail | Cambay 400, 14px, `#4A4A4A` — "We hit a rate limit on key ••••3891 during the behaviour analysis step." |
| Actions | Two ghost buttons: "Retry this candidate" · "Check API key status" |

Error messages are always:
- **Specific** — which key, which step, which error
- **Actionable** — clear next step the recruiter can take
- **Human** — phrased like a competent guide, not a system log

### 12.4 API Key Error (Global Banner)

Appears above the page header, below browser chrome:

| Element | Treatment |
|---|---|
| Background | `--color-warning-bg` (`#FFFBEB`) |
| Border | 1px solid `rgba(217,119,6,0.2)` |
| Icon | ⚠ in `--color-warning` |
| Text | Cambay 400, 14px, `#92400E` — "Your default key (••••3891) is returning errors. Analysis has been paused." |
| Actions | Two inline links: "Go to API Keys" · "Dismiss" |

---

*Document version: 2.0 | Design System: Premium Intelligence*
