# Recruiter-X — System States: Loading, Empty, & Errors

---

## 11. LOADING & PROCESSING STATES

### 11.1 JD Analysis (Post-Submit, ~15 seconds)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  AUDIT RUNNING                         0:08
  ─────────────────────────────────────
  ████████████████████████░░░░░░░░░░░░  68%
  
  → Extracting must-have requirements
  → Detecting seniority signals
  → Generating insider checklist...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

- Monospace throughout (this output looks like terminal logs)
- Each step appears progressively as it resolves
- Blue progress bar with JetBrains Mono percentage
- Elapsed time counter (JetBrains Mono, top right)

### 11.2 Candidate Analysis (Bulk)

Progress bar at top of candidate list section + live count:

```
ANALYZING CANDIDATES                    [■■■■■■■■■■■■■■■■░░░░░░░░]  32 / 47 — 12 queued
```

Individual cards show scanner shimmer animation while processing, resolve to full card when done. Cards appear in ranked order as they complete (not upload order).

### 11.3 API Key Validation

```
[VALIDATE & SAVE]  →  [Validating...] (spinner)  →  [✓ Key active — 1 token used]
```

Spinner: simple blue rotating border-radius circle. Not a spinner library. 3 lines of CSS.

---

## 12. EMPTY STATES & ERRORS

### 12.1 No Projects (Dashboard)

```
                NO PROJECTS YET
                ───────────────
        Start by creating your first project.
        Add a job description and upload resumes.
        
                [+ NEW PROJECT]
```

No illustration. No cartoon character. Text and button. The product is confident enough not to need an onboarding mascot.

### 12.2 No Candidates Uploaded

```
  CANDIDATES       0 uploaded
  
  Drop .pdf or .docx files here, or [browse files]
  
  Max 500 files · 10MB per file
```

### 12.3 Analysis Failed

```
  ⚠  ANALYSIS FAILED — candidate_id 4f8a...
 
  Gemini API returned: 429 Too Many Requests
  Key used: ••••3891 (Production)
  Failed at: BEHAVIOUR_ANALYZER step
  
  [Retry this candidate]  [Check API key status]
```

Error messages are always specific. Always actionable. Always show which key failed and which step failed.

### 12.4 API Key Error (Global Banner)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚠  Default API key (••••3891) is returning errors. 
     Analysis has been paused.  [Go to API Keys]  [Dismiss]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

This banner appears above the page header, below the browser chrome. Orange background (`rgba(196,125,16,0.12)`), amber text.
