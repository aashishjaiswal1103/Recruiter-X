# Recruiter-X — Dashboard Page Design Prompt

**Route:** `/`
**Job of this page:** Show every project's results for the org. Read-heavy, write-light — the recruiter lands here to see the state of every analysis run, past and present, and to jump into the one they care about right now.

---

## Visual System (no type specs — just the rules)

- **Canvas:** pure white, generous margins. Nothing touches the edge.
- **Hero zone:** white background, blue text, thin blue border. This is the "quiet" zone — one focal point, no competing elements.
- **Card zone:** inverted — blue fill, white text. This contrast is what separates "the one thing you're doing now" (hero) from "everything you've already done" (grid).
- **Spacing rule of thumb:** if a section feels like it needs a divider line to separate it from the next, add padding instead. Breathing room *is* the separator.
- **One focal point per section** — every section should have exactly one thing the eye lands on first, everything else is support.

---

## Page Structure (top → bottom)

### 1. Top Navigation Bar
- **Left:** logo / org name, primary nav if needed (just Dashboard for now — don't add nav items that don't exist yet)
- **Right:** the **+ New Project** button — biggest, boldest, filled-blue element in the nav. This is the primary action of the entire page; it should look like it.
- Opens the New Project modal (name, role, API key selector → POST → redirect to `/project/:id`)

### 2. Hero — Current / Last Project
**Purpose:** continuity. Whatever the recruiter was last working on (most recently updated project, any status), surface it so they never have to hunt for "where was I."

**Content (adapts to status):**
- Eyebrow label, e.g. *"Pick up where you left off"*
- Project name + role title
- Status badge
- One primary metric, status-dependent:
  - Analyzing → live progress ("47 of 60 candidates analyzed") with a small pulsing "Live" dot — this is a realtime subscription, not a poll, so it should visually feel like it's updating itself
  - Complete → qualification rate / pool health score / top candidate, pick the single most important one as the headline number, rest as small support text
- One CTA: *Continue* or *View Results*

**Visual:** full-width, white bg, blue border, rounded, lots of internal padding. Resist the urge to cram in every available stat — 1 headline number + 2 support stats, max. This card should feel calm, not like a data dashboard.

**Optional — Global Stats Strip:** the four org-level numbers (total candidates analyzed, average qualification rate, active project count, API key status) can sit as a quiet strip directly under or inside the hero — small labels, bigger numbers, thin vertical dividers between them, no card chrome of their own. These are static after load (not realtime), so don't visually imply they're live.

### 3. Controls Row
One row, three jobs, all client-side (no API calls — everything filters/sorts/searches data already loaded on page load):

- **Filter tabs:** All / Analyzing / Complete / Archived, each with a count badge next to the label so users immediately know if filtering will leave them with zero results. Active tab = filled blue; inactive = blue outline on white.
- **Search:** filters by project name + role title. Instant, no spinner needed.
- **Sort:** Most recent / Highest pool score / Most candidates / Role A–Z

This row is utility, not content — keep it visually quiet so it doesn't compete with the hero above or the grid below.

### 4. Project Grid
**3 cards per row** (collapses to 1 per row on mobile). Default look is the blue-fill/white-text style you described — but the dashboard always has a mix of statuses, so the card needs variants:

| Status | Treatment | Shows | Primary action |
|---|---|---|---|
| **Created** | Outline only (not filled — nothing's happened yet) | name, role, created date, "add a JD to start" prompt | Add JD → `/project/:id` |
| **Analyzing** | Filled blue, live pulse indicator | name, role, candidate count, live progress | View progress → `/project/:id` |
| **Complete** | Filled blue (your default look) | name, role, date, candidate count, qualified count, qualification rate, hidden gems count, top candidate + score | View results → `/project/:id` |
| **Failed** | Blue card, red/amber accent override | name, role, which step failed, error message, candidates that did succeed | Retry button (re-queues failed candidates without leaving the card) |
| **Archived** | Desaturated / muted blue | name, role, completed date | Restore button (PATCH status) |

**Card anatomy (consistent across all variants so the eye doesn't have to relearn the layout each time):**
- Top: name + role + status badge
- Middle: the one number/visual that matters most for that status
- Bottom: 2–3 secondary stats + the card's action

**Interaction note:** the whole card is clickable to `/project/:id`, except the Retry/Restore buttons, which need their own click target so they don't accidentally fire a navigation.

For the Complete cards specifically — you listed candidate count, role, date, top-candidates info. Don't try to show all five complete-project fields with equal visual weight; pick one hero number (qualification rate is the strongest candidate) and let the rest sit as smaller supporting text underneath. That's what keeps it feeling minimal instead of like a spec sheet.

### 5. Empty State
No projects yet. Centered, single message, single button. This is an invitation, not an apology — something like *"No projects yet — start your first analysis"* with one button that opens the New Project modal. No placeholder/fake cards.

---

## UX / Content Notes

- **Live = visibly live.** Anything backed by a realtime subscription (the Analyzing hero, Analyzing cards) needs a small visual tell — a pulse dot, a subtly animated counter — so the user trusts the number without needing to refresh to check.
- **Counts prevent confusion.** Filter tab counts mean a user filtering to "Archived" with 0 archived projects sees that *before* clicking, not after.
- **Static vs. live data should look different.** The global stats strip doesn't update in real time — don't give it the same pulsing/live treatment as the realtime cards, or it'll feel broken when it doesn't move.
- **Errors are specific, not vague.** A Failed card should name the step that failed, not just say "something went wrong."
- **Labels are short, numbers are the hero.** 1–2 word labels under big numbers — the label's job is just to disambiguate, not to explain.
- **Card copy by status should read like a status, not a generic label:** "Add a JD to start" (Created) vs. "47 of 60 analyzed" (Analyzing) vs. "Top candidate: Priya R. — 94" (Complete). Each status has a different job to communicate, so each gets different copy, not the same template with different numbers swapped in.

---

## Data → UI Reference

| Field (from API) | Where it shows |
|---|---|
| `name`, `role` | Hero, every card |
| `status` | Drives card variant |
| `candidate_count`, `candidates_complete` | Analyzing card progress |
| `qualified_count`, `qualification_rate` | Complete card hero number |
| `average_inflation_rate` | Complete card secondary stat |
| `hidden_gems_count` | Complete card secondary stat |
| `top_candidate_name`, `top_candidate_score` | Complete card + hero (if most recent) |
| `created_at` / `updated_at` | Created/Archived card dates, list ordering |
| Org aggregate (total analyzed, avg qual rate, active count, API key status) | Global stats strip only |

---

### One thing worth deciding before you build
Right now the hero is "most recently updated project regardless of status" — that's the most useful "continue where you left off" behavior, but means the hero could occasionally be a Failed project. Worth confirming that's the intent vs. always biasing toward Analyzing/Complete projects in the hero slot.