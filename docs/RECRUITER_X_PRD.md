# RECRUITER-X
## Product Requirements Document — v2.0
### Classification: Startup Launch Document | Not a Hackathon Submission

---

> **One-line thesis.**
> Recruiter-X is the AI intelligence layer that sits between candidate applications and recruiter decisions — interrogating resumes, benchmarking against the ideal, and delivering ranked shortlists with surgical interview questions attached.

---

## TABLE OF CONTENTS

1. Executive Summary & Vision
2. Problem Statement
3. Market Context & Positioning
4. Target Users & Personas
5. Product Goals & Success Metrics
6. Authentication & Onboarding System
7. API Key Management — BYOK Architecture
8. Feature Specifications (All 7 Components)
9. User Flows & State Machines
10. Information Architecture
11. Scale & Performance Requirements
12. Security, Privacy & Compliance
13. Monetization & Business Model
14. Roadmap — Three Phases to Scale
15. Open Questions & Decision Log

---

## 1. EXECUTIVE SUMMARY & VISION

**Vision.**
Every recruiter in the world makes better hiring decisions. Not because AI replaced them — because AI gave them information they never had before.

**Mission.**
Build the most accurate, honest, and useful hiring intelligence platform on the market. One that tells recruiters not just who applied, but who is real — and gives them the exact questions to verify it.

**What it is.**
A multi-layer AI analysis system that takes a job description and a pile of resumes and produces:
- A ranked shortlist (not just filtered — ranked with reasoning)
- A credibility assessment for every candidate
- A ghost candidate benchmark (what the perfect applicant would look like)
- Interview questions that only expose lies if the claim was a lie
- A meta-report on the health of the entire applicant pool

**What it is not.**
A resume parser. A keyword matcher. An ATS replacement. A decision-maker. A black box.

**Founding principle.**
Recruiter-X surfaces truth. It never makes hiring decisions. It gives recruiters better inputs to make better decisions themselves. Every score is explained. Every flag is documented. The recruiter remains in control.

---

## 2. PROBLEM STATEMENT

### 2.1 The Recruiter's Reality

A typical technical recruiter at a mid-market tech company receives 150–400 applications per senior role. Of those:
- 60–70% do not meet baseline requirements but are not disqualified by ATS (they know the keywords)
- 15–25% significantly inflate their experience (titles, team sizes, skill depth)
- 5–10% are genuinely excellent but write poor resumes and surface low in keyword-based ranking
- The average recruiter spends 6–8 seconds on an initial resume scan

**Result:** The current system rewards resume writers, not capable candidates. The best candidate in the pile frequently does not get the job. The recruiter's time is consumed by noise.

### 2.2 What Existing Tools Fail At

| Tool Category | What It Does | What It Misses |
|---|---|---|
| ATS (Workday, Greenhouse) | Keyword filtering, pipeline management | Semantic understanding, depth assessment |
| LinkedIn Recruiter | Sourcing, basic filtering | Credibility, trajectory analysis |
| Resume parsers | Structured data extraction | Meaning, context, inflation detection |
| GPT-wrappers | Summarize resumes | No benchmarking, no interrogation, no pool analysis |
| Assessment tools | Test skills after shortlisting | Don't help with the shortlisting problem |

**The gap:** No tool tells a recruiter *who is actually qualified* vs *who just looks qualified*. Recruiter-X fills this gap.

### 2.3 The Inflation Problem

Research across hiring platforms (LinkedIn, Indeed, internal studies) consistently shows:
- 40–50% of resumes contain at least one materially inflated claim
- The most over-inflated domains: Machine Learning, System Design, Team Leadership, Startup Founding
- The most under-represented signals: Failure experience, cross-functional coordination, production incident handling

Recruiter-X was built specifically to detect this inflation — not by catching people lying, but by measuring the evidence that real expertise always leaves behind.

---

## 3. MARKET CONTEXT & POSITIONING

### 3.1 Market Size

- Global HR Tech market: $38.4B (2024), projected $81.8B by 2032
- AI in recruitment specifically: $890M (2024) → $3.8B by 2030
- Target segment (mid-market tech companies, 200–5000 employees): ~120,000 companies globally
- Average spend per company on recruitment tooling: $18,000–$60,000/year

### 3.2 Competitive Positioning

| Competitor | Positioning | Recruiter-X Advantage |
|---|---|---|
| HireVue | Video interview AI | Pre-interview intelligence, not interview assessment |
| Eightfold AI | Talent intelligence, internal mobility | Focused on external hiring depth, not breadth |
| Pymetrics | Games-based assessment | Resume-first, no games required |
| Covey | AI screening | Ghost benchmarking, pool analysis, interrogation engine are unique |
| Ashby | ATS + analytics | We are the intelligence layer *on top of* any ATS |

**Positioning statement:** Recruiter-X is not an ATS. It is the AI intelligence layer that makes any ATS dramatically more useful. We integrate, not replace.

### 3.3 Go-To-Market Strategy

**Phase 1 (0–6 months):** Direct sales to technical hiring managers and founders at seed-to-Series B startups. Focus: companies hiring 5–50 technical roles simultaneously. BYOK model reduces our infrastructure cost to near zero during early growth.

**Phase 2 (6–18 months):** Mid-market expansion. Teams of 3–10 recruiters. Native integrations with Greenhouse, Lever, Ashby, and Workday. API licensing.

**Phase 3 (18–36 months):** Enterprise and ATS partnership model. White-label licensing. Multi-tenant SaaS with full compliance certifications.

---

## 4. TARGET USERS & PERSONAS

### Persona 1 — Maya, the Startup Founder (Primary Early Adopter)

- **Role:** Co-founder, 40-person company, hiring first ML engineers
- **Pain:** Has no recruiter. Reviews 200 resumes herself. Cannot tell who is real.
- **Need:** Fast, honest ranking with reasoning. Interview questions ready to go.
- **Technical comfort:** High. Will connect Gemini API key herself.
- **Usage pattern:** 2–3 hiring sprints per year, 30–100 resumes each.

### Persona 2 — Rajan, the Technical Recruiter (Core User)

- **Role:** Senior recruiter at 500-person SaaS company, owns 8–12 open roles simultaneously
- **Pain:** Spends 60% of time on screening. Gets no signal from keyword-matched resumes.
- **Need:** Prioritized queue of candidates with confidence scores and red flags.
- **Technical comfort:** Medium. Will use the platform but won't configure APIs.
- **Usage pattern:** Daily active user. 50–200 resumes per week.

### Persona 3 — Sofia, the VP of Talent (Decision Maker / Buyer)

- **Role:** VP Talent at 1,200-person company, manages team of 6 recruiters
- **Pain:** Inconsistent evaluation quality across her team. No data on pool health.
- **Need:** Standardized evaluation framework. Pool intelligence reports. Audit trail.
- **Technical comfort:** Low on technical tooling, high on data interpretation.
- **Usage pattern:** Reviews pool health reports weekly. Views aggregated team analytics.

### Persona 4 — Lena, the Compliance Lead (Stakeholder / Blocker)

- **Role:** Legal/Compliance at EU-based company
- **Pain:** AI-assisted hiring triggers GDPR Article 22 and EU AI Act obligations
- **Need:** Full audit logs, explainability, no automated decision-making
- **Technical comfort:** N/A — she reviews documentation, not the tool
- **Usage pattern:** Reviews data processing agreements, audit exports

---

## 5. PRODUCT GOALS & SUCCESS METRICS

### 5.1 Primary Goals

| Goal | Metric | Target (12 months) |
|---|---|---|
| Recruiter time savings | Time-to-shortlist reduction | ≥ 60% reduction vs baseline |
| Ranking accuracy | Hire rate from top-5 shortlist | ≥ 70% (vs ~30% industry average) |
| Inflation detection | Precision of red flags | ≥ 80% recruiter agreement on flags |
| Adoption | Daily Active Users | 1,000 DAU by month 12 |
| Scale | Resume analyses per day | 10,000/day by month 12 |
| Retention | Monthly retention | ≥ 75% at month 3 |

### 5.2 Secondary Metrics

- Ghost Match Score correlation with eventual hire outcome (tracked via outcome logging)
- Interrogation question usefulness rating (in-app feedback per question)
- Pool Health Report open rate (do recruiters actually read it)
- Average session length per recruiter (engagement quality signal)
- API key error rate (BYOK UX quality signal)

### 5.3 North Star Metric

**Qualified shortlists delivered per week.** A qualified shortlist is defined as: ≥1 candidate from the Recruiter-X top-5 makes it to final interview stage within 30 days. This is the one metric that proves the product works.

---

## 6. AUTHENTICATION & ONBOARDING SYSTEM

### 6.1 Auth Architecture

- **Provider:** Supabase Auth (built on GoTrue)
- **Methods supported:**
  - Email + password (primary)
  - Google OAuth (one-click for most recruiters)
  - Magic link (passwordless)
  - SSO via SAML 2.0 (enterprise tier — Phase 2)

### 6.2 Organisation Model (Multi-Tenancy)

Every account belongs to one Organisation. Organisations can have multiple users with role-based access.

```
Organisation
  ├── Owner (1, cannot be removed)
  ├── Admin (manage users, billing, API keys)
  ├── Recruiter (create projects, upload candidates, view reports)
  └── Viewer (read-only access to reports — for hiring managers)
```

Row-Level Security (RLS) at the Supabase layer enforces that no organisation can ever access another organisation's data. This is enforced at the database level, not just application level.

### 6.3 Onboarding Flow

```
Step 1 — Create account (email or Google)
Step 2 — Create organisation (name, industry, company size)
Step 3 — Add API key (mandatory before first analysis)
         ├── Add Gemini 1.5 Pro key (recommended)
         ├── Add Anthropic Claude key (alternative)
         └── Validate key is active with test call
Step 4 — Create first project (guided)
Step 5 — Upload first JD (guided with inline tips)
Step 6 — View sample output (pre-loaded demo data)
Step 7 — Upload real resumes
```

**Onboarding completion gate:** Users cannot run analysis without at least one validated API key. The product clearly communicates this is BYOK and explains why (their data never passes through our LLM billing, giving them full cost control and data sovereignty).

### 6.4 Session Management

- JWT tokens via Supabase Auth (15-minute access tokens, 7-day refresh)
- Refresh handled client-side silently
- Force logout on all devices available from Security settings
- Audit log of all login events (timestamp, IP, device)

---

## 7. API KEY MANAGEMENT — BYOK ARCHITECTURE

### 7.1 Core Principle

Recruiter-X does not hold any central LLM API keys for user-facing analysis. Every analysis call is made using the user's own API key. This means:

- **Cost:** Users pay their own LLM costs directly (transparency, no markup)
- **Privacy:** Resume data is sent to the LLM provider the user chose, under the user's own account — recruiter-X does not intermediate
- **Scale:** Our backend cost does not scale with analysis volume (only infrastructure does)
- **Trust:** Data sovereignty is maintained — recruiter-X never touches the content in-flight beyond routing

### 7.2 Supported Providers & Models

| Provider | Models Supported | Best For |
|---|---|---|
| Google (Gemini) | gemini-1.5-pro, gemini-1.5-flash, gemini-2.0-flash | Default recommendation, best cost/quality ratio |
| Anthropic (Claude) | claude-opus-4-6, claude-sonnet-4-6, claude-haiku-4-5 | Highest quality analysis, higher cost |
| OpenAI | gpt-4o, gpt-4o-mini | Familiar for users already in OpenAI ecosystem |

### 7.3 Key Storage Architecture

```
User adds key in UI
        │
        ▼
Frontend: key never stored in state longer than the POST request
        │
        ▼
Backend API: receives key over HTTPS
        │
        ▼
Encryption: AES-256-GCM with key derived from org-specific secret
(key is never stored in plaintext, not even in logs)
        │
        ▼
Supabase: stores encrypted blob + org_id + provider + model + label
        │
        ▼
Analysis Job: backend decrypts key at runtime, uses for API call, 
              decrypted key exists in memory only for duration of call
```

**What is never stored:** The plaintext API key at rest. Ever.
**What is stored:** Encrypted blob, provider name, model preference, display label (e.g. "Gemini Production Key"), created_at, last_used_at, is_active flag.

### 7.4 Key Validation

On add:
1. User pastes key and selects provider + model
2. Backend makes a minimal test call (1-token completion: "Say: OK")
3. If call succeeds: key stored as valid, user sees green confirmation
4. If call fails: error message with specific reason (invalid key, rate limited, quota exceeded)
5. Key is never stored for failed validations

### 7.5 Model Switching

Users can:
- Set a default model per organisation
- Override model per project
- See estimated cost per analysis before running (based on token count estimate)
- View actual token usage per project (pulled from LLM provider response metadata)

The UI shows a model selector with a live cost estimate panel. Example:
```
Model: gemini-1.5-pro
Estimated tokens: ~45,000 per candidate
Estimated cost per candidate: $0.067
Estimated cost for 50 candidates: $3.35
```

### 7.6 Key Rotation & Management

- Users can add multiple keys per provider (e.g. separate keys per project for billing isolation)
- Keys can be labelled, activated, deactivated, or deleted from the Settings > API Keys page
- Deactivating a key pauses any queued jobs using that key
- Last-used timestamp shown for each key so dead keys are obvious
- Automatic key health check runs every 24 hours; if a key fails, the org admin is notified via email

---

## 8. FEATURE SPECIFICATIONS

### 8.1 Component 1 — JD Audit Engine

**Purpose:** Transform a raw, often poorly-written job description into a clean hiring benchmark before any candidate analysis runs.

**Trigger:** Recruiter pastes or uploads a JD. Analysis runs automatically.

**Input:** Raw JD text (paste), .pdf, or .docx upload (extracted server-side)

**LLM Prompt Intent (structured JSON output enforced):**
```
Given this job description, extract and structure the following:
- must_have_skills: string[] — non-negotiable technical and domain requirements
- nice_to_have_skills: string[] — desirable but not disqualifying if absent
- implied_seniority: enum(junior|mid|senior|staff|principal|executive)
- stated_seniority: string — exact title from JD
- seniority_mismatch: boolean — true if stated != implied
- required_mindset: object — pace(fast/careful), style(independent/collaborative), mode(builder/maintainer/figure-it-out)
- culture_signals: string[] — inferences about company culture from JD language
- hidden_expectations: string[] — domain knowledge a real practitioner would have that the JD doesn't mention
- jd_quality_score: 0-100 — how clearly written the JD is
- jd_warnings: string[] — specific language in the JD that may attract wrong candidates
- rewrite_suggestions: string[] — specific line-level suggestions to improve the JD
```

**Output displayed to recruiter:**
- Structured benchmark card (must-haves, nice-to-haves, seniority)
- JD Quality score with warnings highlighted
- Inline rewrite suggestions for vague language
- "Implied vs. Stated Seniority" conflict alert if detected
- Option to edit/override any extracted requirement before analysis runs

**Performance target:** < 15 seconds from JD submission to audit output.

---

### 8.2 Component 2 — Ghost Candidate Engine

**Purpose:** Create a fictional ideal candidate constructed entirely from the JD — not from who applied. This becomes the fixed benchmark every real candidate is measured against.

**Why it matters:** Standard ranking tells you the best of who applied. Ghost benchmarking tells you how close anyone actually is to what the role truly needs. If nobody is close, the recruiter knows to reopen the search or reset expectations. That's a $50,000 insight.

**Trigger:** Runs immediately after JD Audit completes.

**LLM Prompt Intent:**
```
Given this JD and its audit output, construct the ideal candidate profile:
- ghost_career_history: Career arc the ideal candidate would have
- ghost_trajectory: What their growth pattern would look like
- ghost_insider_signals: Domain knowledge they'd demonstrate naturally
- ghost_conspicuous_absences: Things they'd never lead with because too obvious
- ghost_problem_history: Types of problems they'd have solved
- ghost_failure_signals: Productive failures the ideal candidate would have experienced
- ghost_skill_depth: For each must-have skill, what depth of evidence we'd expect
```

**Output:**
- Ghost Candidate Profile card (displayed to recruiter as reference)
- Internal benchmark JSON used by all subsequent analysis components
- Ghost Match Score formula seeded with ghost attributes

---

### 8.3 Component 3 — Resume Ingestion Pipeline

**Purpose:** Convert uploaded resumes into structured, analysis-ready data.

**Supported formats:** .pdf, .docx (required). Future: .txt, LinkedIn import URL.

**Processing pipeline:**
```
Upload (drag-drop, bulk)
        │
        ▼
File validation (type, size ≤ 10MB per file, batch ≤ 500 files)
        │
        ▼
Text extraction:
  ├── PDF: pdfplumber (primary) → fallback to pytesseract OCR for scanned
  └── DOCX: python-docx
        │
        ▼
Structured parsing (LLM call):
  Extract: name, email, phone, current_title, current_company,
           work_history[], education[], skills[], certifications[],
           projects[], tenure_per_role[], career_start_year
        │
        ▼
Validation: flag incomplete extractions for recruiter review
        │
        ▼
Store structured JSON in Supabase + raw file in Supabase Storage
        │
        ▼
Queue for analysis pipeline
```

**Bulk upload spec:**
- Maximum 500 resumes per batch
- Progress bar with live count (WebSocket or polling every 2s)
- Failed extractions isolated and surfaced with reason
- Recruiter can manually edit extracted data before re-queuing

---

### 8.4 Component 4 — Candidate Deep Analysis

Three layers run simultaneously (parallel LLM calls) per candidate.

#### Layer A — Trajectory Analyzer

**What it measures:** Career growth velocity, not just career length.

**Logic:**
- Title progression: is seniority weight increasing over time?
- Company progression: are companies getting harder to get into (by funding, headcount, brand)?
- Responsibility growth: are the problems described getting harder?
- Normalisation: trajectory scored relative to career age (a 3-year person climbing steeply beats a 10-year person plateaued at mid-level)
- Role gap detection: gaps of >6 months flagged (not penalised by default — recruiter decides)

**Output labels:** `ACCELERATING` / `STEADY` / `PLATEAUED` / `DECLINING`
**Output score:** 0–100 trajectory score

#### Layer B — Behaviour Signal Analyzer

**What it measures:** Working style extracted from how the candidate writes their resume — not what they claim.

**Signals:**
- **Ownership signal:** Do they say "I built" / "I led" / "we delivered" / "the team shipped"? Solo ownership vs. collective credit vs. responsibility dissolution.
- **Impact orientation:** Do they describe what they did or what changed because of what they did? "Built ML pipeline" vs. "Reduced inference latency 40%, enabling 3x throughput at same cost."
- **Attention distribution:** The resume section that has the most words is the area where they actually spent their time. A candidate with "ML" in their title who writes 60% of their bullets about project management is a project manager.
- **Problem sophistication:** Are the problems described routine, known, ambiguous, or genuinely novel? Cannot fake having solved a hard problem in detail.
- **Communication clarity:** Can they explain complex things simply? Inverse: do they hide shallow experience behind jargon?

**Output:** Behaviour Fit Score (0–100) + behavioural profile JSON

#### Layer C — Credibility Auditor (Red Flag Detection)

**Flags detected:**

| Flag | Definition | Severity |
|---|---|---|
| Job Hopper | 3+ moves in 4 years with no upward pattern | Medium |
| Responsibility Inflation | Claims "led team" but no leadership title exists | High |
| Skill-Claim Mismatch | Claims 5yr ML but only 1 ML role of 9 months | High |
| Plateau Pattern | Same title, same company type, for 5+ years | Low |
| Pride Signal | Enthusiastically describes things routine for claimed level | High |
| Achievement Echo Failure | Major claim but no career advancement in 12-18mo after | Medium |
| Tenure Collapse | Average tenure declining over career (not just once) | Medium |
| Scope Compression | More recent roles have narrower scope than earlier ones | Medium |

**Pride Signal detection logic:** LLM is fed seniority level + skill claims + specific achievement descriptions. Asked: "Would a real practitioner at this level consider this achievement brag-worthy or embarrassingly basic?" If basic: Pride Flag raised.

**Achievement Echo logic:** For each major claimed achievement, LLM checks: did title, company calibre, or scope increase in the 12–18 months following? Real achievement gets rewarded. Inflated achievement leaves no trace.

---

### 8.5 Component 5 — Insider Signal Detector

**Core idea:** Every real expert at a given level knows certain things so deeply they would never think to mention them. They would also never brag about things too basic — it would be embarrassing. This asymmetry is the detector.

**How it works:**
1. JD Audit + Ghost Engine defines what insider signals look like for this role
2. LLM generates a full insider checklist: 10 signals a real practitioner would show, 5 things they would never lead with
3. Each resume is checked against this checklist
4. Insider Signals Present / Absent tallied
5. Pride Flags raised when candidate brags about items on the "never lead with" list

**Output per candidate:**
```
Insider Signals Present:   7/10
Insider Signals Absent:    3
  - Production incident handling
  - Cross-team dependency resolution
  - System failure post-mortems
Pride Flags Raised:        2
  - Set up CI/CD pipeline as Senior Engineer
  - "First to implement Docker in the team" (2024)
Credibility Assessment:    Mid-level experience, Senior-level claims
```

**Insider Signal Score:** 0–100 (weighted by signal importance, normalised by role level)

---

### 8.6 Component 6 — Hybrid Ranker

**Purpose:** Fuse all dimension scores into a single final rank. Configurable. Transparent.

**Default weight formula:**
```
Final Score = 
  (Trajectory Score     × 0.25) +
  (Behaviour Fit Score  × 0.25) +
  (Ghost Match Score    × 0.25) +
  (Insider Signal Score × 0.15) +
  (Credibility Score    × 0.10) −
  (Risk Penalty)
```

**Risk Penalty calculation:**
- HIGH flag: −8 points per flag
- MEDIUM flag: −4 points per flag
- LOW flag: −1 point per flag
- Cap: maximum penalty of −30 (floor at 0)

**Recruiter-configurable weights (UI sliders):**
- Sliders per dimension (must sum to 100%)
- Preset contexts: "Startup Founding Engineer" / "Enterprise Compliance Role" / "Research Heavy" / "IC Execution Focus"
- Each preset reconfigures weights automatically
- Custom presets saveable per organisation

**Diversity Pass:**
- After initial ranking, system checks if top 10 are from same 2–3 company backgrounds
- If yes: light reshuffle to surface variety without dropping quality threshold
- This is flagged as "Diversity Reshuffle Applied" for transparency — recruiter can toggle off

---

### 8.7 Component 7 — Interrogation Engine

**Purpose:** Auto-generate 3 surgical interview questions per candidate, calibrated to their exact suspicious gaps or inflated claims. Not generic. Not templated.

**Principle:** A real practitioner answers these instantly. Someone who inflated cannot answer them without revealing the inflation.

**Generation logic:**
- Input: candidate's top 1–3 high-claims + detected red flags + role context from JD
- LLM generates questions that: (a) probe the specific technical depth of the claim, (b) require recollection of a specific failure or decision point, (c) cannot be answered generically
- Each question is tagged with the claim it probes and the expected signal from a real expert

**Question typology:**
- **Depth probe:** Walk me through [specific technical decision] in your [claimed achievement]. What were the tradeoffs?
- **Failure probe:** What was the hardest production failure you experienced at [company], and what was your specific role in the fix?
- **Recency probe:** You list [skill] as core. What's the last time you used it in a context where it actually mattered? What were the constraints?
- **Magnitude probe:** You claim [achievement at scale]. What broke first when you crossed [specific threshold]?

**Output per candidate:** 3 questions minimum, each with:
- The question text
- The claim it probes
- What a strong answer looks like (recruiter guidance note)
- What a weak/vague answer signals

---

### 8.8 Component 8 — Pool Health Intelligence Report

**Purpose:** After all candidates are analyzed, step back and give a meta-report on the entire applicant pool — something no recruiter would think to ask for but can't unsee once they have it.

**Trigger:** Runs automatically when all candidate analyses in a batch are complete.

**Report sections:**
```
Pool Health Report — [Role Title]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Applicants:           [N]
Actually Qualified:         [N] ([%])
Average Inflation Rate:     [%] — [interpretation]
Most Over-Claimed Skill:    [skill] — [N]% claim it, [N]% show real evidence
Most Under-Claimed Skill:   [skill] — present in work history but rarely highlighted
Hidden Gems Found:          [N] candidates scored low on surface, high on insider signals
Honest Candidate Rate:      [%] show low inflation overall
JD Quality Warning:         [specific language causing wrong-candidate attraction]
Recommendation:             [reopen / proceed / lower bar / rewrite JD]
```

**Additional analytics:**
- Score distribution histogram across the pool
- Red flag frequency analysis (what's the most common lie in this pool?)
- Career background clustering (where are most candidates coming from?)
- Seniority spread (is the pool skewed junior/senior vs. target?)

---

## 9. USER FLOWS & STATE MACHINES

### 9.1 Project State Machine

```
CREATED
   │
   ├─(submit JD)──────────────► JD_UPLOADED
   │                                   │
   │                         (audit complete)
   │                                   │
   │                             JD_ANALYZED
   │                                   │
   │                       (upload ≥1 resume)
   │                                   │
   │                         CANDIDATES_UPLOADED
   │                                   │
   │                        (start analysis)
   │                                   │
   │                             ANALYZING ──(failure)──► ANALYSIS_FAILED
   │                                   │
   │                        (all complete)
   │                                   │
   │                             COMPLETE
   │                                   │
   │                          (export CSV)
   │                                   │
   │                             EXPORTED ──(informational only)
   │
   └─(archive)──────────────► ARCHIVED (from any state)
```

### 9.2 Analysis Job State Machine (Per Candidate)

```
QUEUED ──► PARSING ──► PARSED
                            │
                   (parallel dispatch)
                  ┌─────────┼─────────┐
                  ▼         ▼         ▼
           TRAJECTORY  BEHAVIOUR  CREDIBILITY
           ANALYZING   ANALYZING   ANALYZING
                  └─────────┼─────────┘
                            ▼
                      INSIDER_CHECK
                            │
                      GHOST_MATCHING
                            │
                      SCORE_FUSION
                            │
                    QUESTION_GENERATION
                            │
                        COMPLETE
```

### 9.3 Critical Path Timing Targets

| Step | Target Time |
|---|---|
| JD Audit | < 15 seconds |
| Ghost Generation | < 20 seconds |
| Resume Parsing (single) | < 5 seconds |
| Full Candidate Analysis | < 45 seconds |
| Pool Health Report | < 60 seconds after last candidate |
| End-to-end (50 candidates) | < 15 minutes |

---

## 10. INFORMATION ARCHITECTURE

### 10.1 Pages

| Page | Path | Purpose |
|---|---|---|
| Auth | `/login`, `/signup`, `/invite/:token` | Entry, authentication |
| Onboarding | `/onboarding` | First-time setup flow |
| Dashboard | `/` | All projects, global stats |
| Project Workspace | `/project/:id` | JD + candidates + analysis |
| Candidate Detail | `/project/:id/candidate/:cid` | Full deep-dive, one candidate |
| Pool Intelligence | `/project/:id/pool` | Meta-analysis of entire pool |
| Settings — General | `/settings` | Profile, org, preferences |
| Settings — API Keys | `/settings/api-keys` | BYOK management |
| Settings — Team | `/settings/team` | Invite, roles, members |
| Settings — Billing | `/settings/billing` | Plan, usage, invoices |
| Settings — Security | `/settings/security` | Sessions, audit log |

### 10.2 Navigation Structure

```
Sidebar (persistent, left, 240px):
├── Dashboard
├── Active Projects (last 5)
├── ─────────────
├── Settings
└── (User avatar + org name at bottom)
```

### 10.3 Data Model (Core Entities)

```
Organisation
  ├── id, name, plan, created_at
  ├── api_keys[] (encrypted)
  └── users[] (via org_members table)

Project
  ├── id, org_id, title, role, department, seniority
  ├── jd_raw_text, jd_structured_json
  ├── ghost_candidate_json
  ├── status (state machine above)
  └── candidates[]

Candidate
  ├── id, project_id
  ├── resume_file_url (Supabase Storage)
  ├── resume_raw_text
  ├── resume_parsed_json
  ├── trajectory_score, behaviour_score, ghost_score
  ├── insider_score, credibility_score, final_score
  ├── red_flags_json, interrogation_questions_json
  ├── analysis_status, analysis_started_at, analysis_completed_at
  └── rank (computed, stored after all analyses complete)

AnalysisJob
  ├── id, candidate_id, job_type
  ├── status, queued_at, started_at, completed_at
  ├── api_key_id (which key was used)
  ├── tokens_used, estimated_cost_usd
  └── error_message (if failed)

AuditLog
  ├── id, org_id, user_id
  ├── action, resource_type, resource_id
  ├── timestamp, ip_address
  └── metadata_json
```

---

## 11. SCALE & PERFORMANCE REQUIREMENTS

### 11.1 Capacity Targets

| Metric | Target |
|---|---|
| Daily Active Users | 1,000 |
| Resume analyses per day | 10,000 |
| Peak burst | 500 concurrent analyses |
| API response time (p95) | < 200ms (non-LLM calls) |
| LLM call timeout | 90 seconds (hard limit) |
| File upload size limit | 10MB per file |
| Batch upload limit | 500 files per batch |
| Data retention | 24 months (configurable per org) |

### 11.2 Queue Architecture

- Celery workers backed by Redis (Redis Streams for ordered processing)
- Worker tiers: Parsing workers (fast, lightweight) / Analysis workers (LLM-heavy)
- Priority queues: paid plans jump ahead of free tier
- Job deduplication: same resume + same JD does not re-run (hash check)
- Dead letter queue: failed jobs with full error context, auto-retry 3× with exponential backoff

### 11.3 Rate Limiting

- Per-user: 100 analyses/hour (configurable per plan)
- Per-API-key: 50 concurrent LLM calls (prevents accidental quota exhaustion)
- API endpoint rate limiting: 1000 req/min per org at the API gateway

---

## 12. SECURITY, PRIVACY & COMPLIANCE

### 12.1 Security Architecture

- All data encrypted at rest (AES-256 via Supabase)
- All transit encrypted (TLS 1.3 minimum)
- API keys encrypted with org-specific AES-256-GCM (never plaintext at rest)
- Supabase Row-Level Security on all tables (org_id filter enforced at DB level)
- No PII logged in application logs
- Secrets management: environment variables via Railway/Render secret store (never in codebase)
- Dependency scanning: automated via GitHub Dependabot

### 12.2 GDPR Compliance (EU Article 22)

Recruiter-X processes resumes that contain personal data. Under GDPR Article 22, individuals have the right not to be subject to solely automated decisions that significantly affect them.

**How we comply:**
- All outputs are explicitly recommendations — Recruiter-X never makes hiring decisions
- Every score is accompanied by human-readable reasoning (no black boxes)
- System prompt for all LLM calls includes instruction: "Output is a recruiter recommendation tool only. Human review is required before any decision."
- Data Subject Access Requests (DSAR): candidates can request deletion of their data via recruiter (recruiter has delete-candidate function, triggers cascade delete from all tables and Storage)
- Retention limits: raw resume files deleted after configurable period (default 12 months)
- Processing records maintained as required by GDPR Article 30

### 12.3 EU AI Act Compliance (Applicable Clauses)

Employment screening AI falls under the EU AI Act as high-risk AI under Annex III. Requirements for high-risk AI systems include:

- **Risk management system:** documented
- **Data governance:** training data (prompt examples) documented
- **Technical documentation:** this document + API documentation
- **Transparency:** users informed they are interacting with an AI
- **Human oversight:** mandatory — recruiter must review before any action
- **Accuracy and robustness:** error rates documented, model degradation monitoring
- **Logging:** all inputs and outputs logged for audit (AnalysisJob table)

**Compliance flag in UI:** Every analysis result page shows: *"This is an AI-generated recommendation. Human review is required before any hiring decision."*

### 12.4 Audit Logging

Every action that affects candidate data, scoring, or API key usage is logged:
```
{
  "timestamp": "ISO-8601",
  "org_id": "uuid",
  "user_id": "uuid",
  "action": "CANDIDATE_ANALYZED | KEY_ADDED | PROJECT_CREATED | EXPORT_DOWNLOADED",
  "resource_type": "candidate | project | api_key",
  "resource_id": "uuid",
  "ip_address": "hashed",
  "metadata": {}
}
```

Logs retained 24 months minimum. Exportable as JSON or CSV from Security settings.

---

## 13. MONETIZATION & BUSINESS MODEL

### 13.1 Pricing Tiers

| Tier | Price | Limits | Target |
|---|---|---|---|
| **Starter** | Free | 3 projects, 50 candidates/mo, 1 user | Founders, trying the product |
| **Growth** | $99/mo | Unlimited projects, 500 candidates/mo, 5 users | Small teams, startups |
| **Scale** | $299/mo | Unlimited projects, 2,000 candidates/mo, 20 users | Mid-market recruiters |
| **Enterprise** | Custom | Unlimited everything, SSO, SLA, white-label | Large orgs, ATS partners |

**Note:** BYOK means we have near-zero marginal cost per analysis — pricing is based on platform value, not LLM cost. This is a significant structural advantage over competitors who bill per analysis.

### 13.2 Revenue Streams

1. **SaaS subscription** (primary)
2. **ATS integration licensing** (Phase 2) — API access fee for Greenhouse/Lever/Ashby integrations
3. **White-label** (Phase 3) — enterprise customers rebrand the product
4. **Outcome data** (long-term) — anonymised, aggregated hiring outcome data as a benchmark product (opt-in only)

---

## 14. ROADMAP — THREE PHASES

### Phase 1 — PoC to Production (Months 0–6)

**Goal:** Prove the core loop works at quality. Acquire first 50 paying customers.

- Complete all 7 components as fully functional
- BYOK system live (Gemini + Claude + OpenAI)
- Auth + Org model + RLS
- Dashboard + Project workspace + Candidate Detail pages
- CSV export
- 10 beta testers providing outcome feedback

### Phase 2 — Scale & Integrate (Months 6–18)

**Goal:** 1,000 DAU. ATS integrations. Team features.

- Greenhouse, Lever, Ashby native integrations (push ranked candidates directly)
- SSO via SAML 2.0
- Team analytics dashboard (VP Talent persona)
- Webhook system (trigger external actions on analysis completion)
- Mobile-responsive (recruiter can review on tablet)
- Outcome tracking (recruiter marks who got hired → feeds validation dataset)
- Pool Health Report API endpoint for ATS embeds

### Phase 3 — Enterprise & Intelligence (Months 18–36)

**Goal:** Enterprise contracts. White-label. Platform business.

- White-label / custom domain support
- SOC 2 Type II certification
- Full EU AI Act technical documentation package
- Anonymised benchmark data product (hiring intelligence reports by role/industry)
- Fine-tuned scoring model trained on outcome data (replaces pure prompt-based scoring)
- Multi-language resume support (Spanish, Portuguese, German, French priority)

---

## 15. OPEN QUESTIONS & DECISION LOG

| # | Question | Status | Decision |
|---|---|---|---|
| 1 | Do we allow prompt customisation per org? | Open | Risk: users can remove compliance instructions. Requires guardrails. |
| 2 | Should Ghost Candidate be visible to recruiter or only internal? | Decided | Visible — it's a key differentiator and helps recruiter understand scoring |
| 3 | Does Diversity Pass comply with GDPR? | Open | Legal review required before enabling in EU orgs. May be opt-in only. |
| 4 | OpenAI API support priority? | Decided | Phase 1 (Gemini + Claude first, OpenAI added if demand exists) |
| 5 | Resume language detection | Open | Phase 2 — currently English only |
| 6 | Candidate consent for AI analysis | Open | Currently recruiter's responsibility. May need consent tracking feature in Phase 2. |
| 7 | Outcome feedback data use | Decided | Opt-in only. Never used without explicit org consent. Anonymised before any aggregation. |

---

*Document version: 2.0 | Last updated: June 2026 | Owner: Product*
*This document is the source of truth for all product decisions. Conflicts between this document and any implementation must be resolved against this document.*
