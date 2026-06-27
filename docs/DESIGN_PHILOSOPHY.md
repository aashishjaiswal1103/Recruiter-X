# Recruiter-X — Design Philosophy & Brand Identity

---

## 1. DESIGN PHILOSOPHY

### 1.1 Core Thesis

The interface is a control room. Not a consumer app. Not a landing page. A high-information, high-stakes workspace where every decision a recruiter makes has a $30,000–$300,000 consequence (a wrong hire, a missed hire, a delayed close).

Recruiter-X communicates this weight through restraint, precision, and data density. The design does not celebrate itself. It gets out of the way and lets the intelligence be the product.

### 1.2 The Five Design Laws (V1.1 - Minimal Light Overhaul)

**Law 1 — Monospace is signal, not style.**
Every number, every score, every data value is rendered in monospace. This is not a font choice. It is a system communication: *this is computed, not written.* It creates a visual distinction between human input and machine output that the recruiter reads subconsciously.

**Law 2 — Blue is the voice, not the exception.**
`#0000FF` is the brand voice. It leads all interactive, structural, and computational cues: buttons, links, active navigation, icons, score fills, borders, and highlights. If you remove all color from a screen and add back only blue, it must look fully "on-brand".

**Law 3 — White is gravity.**
Pure white (`#FFFFFF`) replaces navy as the default canvas background, sidebar default surface, and primary card container. The interface is clean, spacious, and highly scannable, minimizing visual fatigue.

**Law 4 — Every state is explicit.**
The recruiter never wonders what the system is doing. Loading is loading. Analyzing is analyzing. Failed is failed. Error states are honest and specific — not friendly apology screens.

**Law 5 — The machine's work looks like work.**
AI analysis outputs should feel computed, not generated. Structured JSON display, terminal-style progress, monospaced results. The product should feel like it ran 10,000 calculations on a resume — because it did.

### 1.3 What This Is Not

- Not a consumer SaaS in blue (Airtable, Linear aesthetic)
- Not a government database (dense but ugly)
- Not a fintech dashboard (charts everywhere, data for data's sake)
- Not a dark-mode-as-aesthetic product (navy is restricted to single accent bands per screen fold)

### 1.4 Aesthetic Reference Points

- **Bloomberg Terminal** — density, monospace, information above beauty
- **Vercel Dashboard** — minimal, precise, developer-grade trust, white gravity with electric accents
- **Linear** — speed, interaction quality, clean grid lines
- **NASA mission control** — purposeful, high-stakes, zero decoration

---

## 2. BRAND IDENTITY & VOICE

### 2.1 Brand Personality

| Attribute | Expression |
|---|---|
| Intelligent | Every output is explained. The system shows its work. |
| Direct | No padding. No softening. Truth in plain language. |
| Fast | Interactions are instant. Feedback is immediate. |
| Trustworthy | Errors are honest. Confidence intervals shown. |
| Relentless | The system doesn't tire. The interface communicates this. |

### 2.2 Voice & Tone

**In interface copy:**
- Active voice. Always.
- Short sentences. No filler.
- Machine-side outputs in all-caps labels. Human-side copy in sentence case.
- Error messages: specific, actionable, never apologetic.

**Example contrasts:**

| Bad | Good |
|---|---|
| "Oops! Something went wrong." | "Analysis failed: Gemini API returned 429 — quota exceeded on key ••••3891." |
| "We're processing your candidates." | "Analyzing 47 candidates — 12 complete, 35 queued." |
| "Thanks for uploading your JD!" | "JD received. Audit running." |
| "No candidates found." | "No candidates. Upload resumes to begin analysis." |

### 2.3 Logo

- Wordmark: **RECRUITER-X** in Syncopate Bold
- The `-X` is rendered in `#0000FF`
- Monogram: `RX` in Syncopate Bold, used at `32×32px` minimum
- Background: `#000022` (deep navy) for dark contexts, `#FFFFFF` for light contexts
- Never on a coloured background other than `#000022` or `#FFFFFF`
