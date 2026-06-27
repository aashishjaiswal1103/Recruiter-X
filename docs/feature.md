RECRUITER-X — Complete Final Solution
 CORE PRODUCT COMPONENTS
Component 1 — JD Audit Engine
Purpose: Transform a messy, over-written job description into a clean structured hiring benchmark. Most JDs list 15 requirements when 5 are real. This engine surfaces the truth.
Input: Raw JD text (paste or file upload, .pdf / .docx / .txt)
Processing:

LLM prompt constructs a structured analysis of the JD
Separates requirements into: must-have, nice-to-have, implied-but-unstated
Infers seniority level independently of the stated title
Extracts working style signals: pace (fast/careful), collaboration style (independent/team), mode (builder/maintainer/operator)
Extracts culture signals: startup pace, enterprise structure, process-heavy vs autonomy-heavy
Identifies hidden expectations — things any real practitioner at this level would know are required but the JD doesn't say
Flags JD quality issues: vague language, impossible experience combinations, contradictory requirements

Output Schema:
json{
  "jd_audit": {
    "must_have_skills": ["string"],
    "nice_to_have_skills": ["string"],
    "implied_requirements": ["string"],
    "inferred_seniority": "junior|mid|senior|staff|principal|director",
    "stated_seniority": "string",
    "seniority_mismatch": "boolean",
    "working_style": {
      "pace": "fast|measured|careful",
      "collaboration": "independent|hybrid|team-dependent",
      "mode": "builder|maintainer|operator|researcher"
    },
    "culture_signals": ["string"],
    "hidden_expectations": ["string"],
    "jd_quality_score": 0-100,
    "jd_quality_flags": [
      {
        "flag_type": "vague_language|impossible_requirement|contradiction|missing_context",
        "location": "string",
        "recommendation": "string"
      }
    ],
    "audit_narrative": "string"
  }
}
Triggers: Runs immediately after JD upload. Blocks candidate upload until complete.

Component 2 — Ghost Candidate Engine
Purpose: Construct a synthetic ideal candidate entirely from the JD. This ghost becomes the fixed benchmark against which every real candidate is measured.
Input: JD Audit output
Processing:

LLM is prompted: "If the perfect candidate for this role existed, what would their career history look like?"
Ghost is constructed with: career arc, companies they would have worked at (by type, not specific names), problems they would have solved, insider signals they would show, things that would be conspicuously absent from their resume because they're too obvious to mention
Ghost includes negative space: what a fully-qualified candidate would never lead with, what would embarrass a real expert to highlight

Output Schema:
json{
  "ghost_candidate": {
    "ideal_career_arc": "string",
    "expected_trajectory": "accelerating|steady",
    "expected_companies_by_type": ["string"],
    "expected_problems_solved": ["string"],
    "expected_insider_signals": ["string"],
    "expected_absence_signals": [
      {
        "signal": "string",
        "reason_absent": "string"
      }
    ],
    "ghost_narrative": "string",
    "benchmark_dimensions": {
      "trajectory_benchmark": "string",
      "behaviour_benchmark": "string",
      "insider_benchmark": "string",
      "credibility_benchmark": "string"
    }
  }
}

Component 3 — Resume Ingestion Pipeline
Purpose: Transform raw resume files into structured, normalized data ready for analysis.
Input: .pdf or .docx files (bulk upload, up to 500 files per batch)
Processing layers:

File validation — format check, virus scan header check, size limit (10MB per file)
Text extraction — pdfplumber for PDFs, python-docx for Word files; fallback OCR (pytesseract) for scanned PDFs
Structure normalization — LLM extracts structured data: contact info, work history, education, skills, certifications, projects
Timeline construction — all roles assembled into chronological timeline with gap detection
Data enrichment — company classification (startup/mid/enterprise/FAANG), industry tagging, tech stack identification

Output Schema per candidate:
json{
  "candidate_id": "uuid",
  "raw_text": "string",
  "structured_data": {
    "name": "string",
    "contact": { "email": "string", "location": "string" },
    "work_history": [
      {
        "company": "string",
        "company_type": "startup|mid-market|enterprise|FAANG|consulting|agency|government",
        "title": "string",
        "inferred_seniority_at_role": "string",
        "start_date": "YYYY-MM",
        "end_date": "YYYY-MM|present",
        "duration_months": "integer",
        "responsibilities": ["string"],
        "achievements": ["string"],
        "technologies": ["string"],
        "team_size_mentioned": "integer|null",
        "scope_keywords": ["string"]
      }
    ],
    "education": [
      {
        "institution": "string",
        "degree": "string",
        "field": "string",
        "graduation_year": "integer|null",
        "prestige_tier": "tier1|tier2|tier3|unranked"
      }
    ],
    "skills_claimed": ["string"],
    "certifications": ["string"],
    "total_experience_years": "float",
    "career_start_year": "integer"
  }
}

Component 4 — Candidate Deep Analysis
Three layers run in parallel via Celery workers.
Layer A — Trajectory Analyzer
What it measures: Not who the candidate is today. Who they are becoming.
Analysis logic:

Title weight progression: are titles getting heavier (IC → Lead → Staff → Principal) or flat?
Company prestige progression: are companies getting harder to get into?
Responsibility scope growth: is the scope of described work expanding?
Normalization by career age: a 3-year candidate climbing steeply outscores a 10-year candidate at the same level
Gap analysis: unexplained gaps over 6 months flagged with severity
Cross-industry moves: classified as intentional pivot vs aimless drift based on pattern

Labels: Accelerating | Steady | Plateaued | Declining | Insufficient_Data
Output:
json{
  "trajectory_analysis": {
    "label": "Accelerating|Steady|Plateaued|Declining|Insufficient_Data",
    "score": 0-100,
    "title_progression_score": 0-100,
    "company_prestige_progression_score": 0-100,
    "responsibility_growth_score": 0-100,
    "career_age_normalized_score": 0-100,
    "gaps": [
      {
        "period": "YYYY-MM to YYYY-MM",
        "duration_months": "integer",
        "severity": "minor|moderate|significant",
        "explanation_present": "boolean"
      }
    ],
    "trajectory_narrative": "string"
  }
}

Layer B — Behaviour Signal Analyzer
What it measures: Actual working style extracted from how the candidate writes, not what they claim.
Signals extracted:
SignalHow DetectedWhat It RevealsOwnership signalPronoun analysis: "I built" vs "We built" vs "The team built"Personal accountability vs team credit vs anonymizationImpact orientationVerb-outcome ratio: "implemented X" vs "implemented X which reduced Y by Z%"Output focus vs outcome focusAttention distributionBullet count and word count per role/skill clusterWhere they actually lived vs what they claim to be their identityProblem sophisticationProblem description taxonomy: routine/known/ambiguous/novelDepth of real-world experienceCommunication precisionVagueness index: ratio of specific claims to vague claimsThinking clarity
Output:
json{
  "behaviour_analysis": {
    "score": 0-100,
    "ownership_signal": {
      "score": 0-100,
      "label": "high_ownership|shared_credit|diffused_credit",
      "evidence": ["string"]
    },
    "impact_orientation": {
      "score": 0-100,
      "label": "outcome_focused|output_focused|activity_focused",
      "evidence": ["string"]
    },
    "attention_distribution": {
      "claimed_identity": "string",
      "actual_focus_area": "string",
      "mismatch_detected": "boolean",
      "mismatch_detail": "string"
    },
    "problem_sophistication": {
      "score": 0-100,
      "label": "novel|ambiguous|known|routine",
      "examples": ["string"]
    },
    "behaviour_narrative": "string"
  }
}

Layer C — Red Flag Detector
What it detects: Surface-level patterns that look acceptable but signal underlying risk.
Flags checked:
Flag TypeDetection LogicSeverityjob_hopper3+ moves in 4 years with no upward title patternHighresponsibility_inflationClaims leadership language (led, managed, owned) without a leadership title in that roleHighskill_claim_mismatchClaims N years of technology X but total time in roles using X is significantly lessHighplateau_signalSame title, same company type, for 4+ years with no scope growthMediumpride_signalWrites enthusiastically about things that are completely routine for the claimed seniority levelHighachievement_echo_absentMajor claimed achievement not followed by any career advancement in 12-18 monthsMediumeducation_title_gapDegree field has no relationship to career and no transition explanationLowrecency_gapMost recent role ended 12+ months ago with no explanationMediumscope_inconsistencyClaims large-scale impact but tool choices, team sizes, and problem descriptions suggest much smaller contextHigh
Output:
json{
  "red_flag_analysis": {
    "risk_level": "low|medium|high|critical",
    "risk_score": 0-100,
    "flags": [
      {
        "flag_type": "string",
        "severity": "low|medium|high",
        "evidence": "string",
        "plain_english": "string"
      }
    ],
    "credibility_score": 0-100,
    "inflation_estimate_percentage": 0-100,
    "red_flag_narrative": "string"
  }
}

Component 5 — Insider Signal Detector
Purpose: Test whether the candidate's experience reflects actual practitioner-depth or surface-level familiarity.
Core insight: Every real expert at a given level knows certain things so deeply they'd never bother to mention them. And they'd never brag about things that are basic — because it would be embarrassing. This asymmetry is exploitable.
Processing:

Feed JD audit + role seniority to LLM
Generate insider_signal_list: things a real practitioner at this level would have in their history
Generate embarrassment_list: things a real expert would never lead with because it's too obvious
Score the candidate's resume against both lists
For each absent insider signal, classify as: plausible absence (wasn't required in their context) vs suspicious absence (should definitely be there)

Output:
json{
  "insider_signal_analysis": {
    "score": 0-100,
    "signals_expected": ["string"],
    "signals_present": ["string"],
    "signals_absent": [
      {
        "signal": "string",
        "absence_type": "plausible|suspicious",
        "implication": "string"
      }
    ],
    "pride_flags": [
      {
        "claim": "string",
        "expected_level": "string",
        "actual_level_implied": "string",
        "flag_detail": "string"
      }
    ],
    "credibility_assessment": "string",
    "insider_narrative": "string"
  }
}

Component 6 — Ghost Candidate Comparator
Purpose: Score every real candidate against the Ghost Candidate benchmark. Produces the Ghost Match Score and Gap Report.
Processing:

Compare candidate's structured data + all analysis layers against the Ghost Candidate profile
Dimensional scoring: how close is the candidate's trajectory to the ghost's trajectory? Behaviour? Insider signals? Credibility?
Gap identification: exactly what is missing and what it would take for this candidate to reach full match

Output:
json{
  "ghost_comparison": {
    "ghost_match_score": 0-100,
    "dimensional_scores": {
      "trajectory_match": 0-100,
      "behaviour_match": 0-100,
      "insider_match": 0-100,
      "credibility_match": 0-100,
      "skill_match": 0-100
    },
    "gap_report": [
      {
        "dimension": "string",
        "gap_description": "string",
        "gap_severity": "minor|moderate|major|disqualifying",
        "bridge_requirement": "string"
      }
    ],
    "ghost_match_narrative": "string",
    "would_disqualify": "boolean",
    "disqualification_reason": "string|null"
  }
}

Component 7 — Hybrid Ranker
Purpose: Fuse all component scores into a single final ranking with configurable weights.
Default weights:
DimensionDefault WeightMinMaxGhost Match Score0.250.050.50Trajectory Score0.250.050.50Behaviour Fit Score0.250.050.50Insider Signal Score0.150.050.40Credibility Score0.100.050.30
Constraint: All weights must sum to 1.0. UI enforces this with a normalization step.
Risk penalty: Red flags reduce final score. Penalty scale:

High severity flag: -5 points per flag
Medium severity flag: -2 points per flag
Low severity flag: -0.5 points per flag
Maximum penalty: -25 points (cap)

Diversity pass:

After initial ranking, system checks top 10 for homogeneity. If 7+ of the top 10 share the same company type or background type, a diversity reshuffle surfaces variety without dropping quality below a threshold. Diversity pass is opt-in, configurable per project.
Use-case presets (recruiter can apply in one click):
PresetWeight Profilefounding_engineerTrajectory 0.35, Behaviour 0.30, Ghost 0.20, Insider 0.10, Credibility 0.05senior_icGhost 0.35, Insider 0.30, Credibility 0.20, Trajectory 0.10, Behaviour 0.05compliance_riskCredibility 0.40, Insider 0.30, Ghost 0.20, Trajectory 0.05, Behaviour 0.05growth_hireTrajectory 0.40, Behaviour 0.35, Ghost 0.15, Insider 0.05, Credibility 0.05balancedDefault weights

Component 8 — Interrogation Engine
Purpose: Auto-generate 3 surgical interview questions per candidate, calibrated to their specific suspicious gaps and inflated claims.
Processing:

Takes candidate's red flags, credibility gaps, and insider signal absences
For each top-3 concern, generates a question designed to expose fabrication if present — and produce a detailed, impressive answer if the claim is genuine
Questions are calibrated to the role level: a junior question for a senior candidate is a gift; the question must match the complexity of the claimed experience

Question quality criteria:

Cannot be answered with yes/no
Requires specific operational detail to answer correctly
A person who lived through the experience answers in 60 seconds
A person who fabricated the experience cannot fake specific operational detail

Output:
json{
  "interrogation_questions": [
    {
      "question_id": "integer",
      "targets_claim": "string",
      "flag_type": "credibility|inflation|absent_insider_signal|scope_inconsistency",
      "question_text": "string",
      "what_a_real_answer_includes": ["string"],
      "red_flags_in_poor_answer": ["string"],
      "difficulty": "probing|surgical|adversarial"
    }
  ]
}

Component 9 — Pool Health Intelligence Report
Purpose: After all candidates are analyzed, produce a meta-report about the entire applicant pool — not individuals. This is the recruiter's big-picture intelligence layer.
Output:
json{
  "pool_health_report": {
    "total_applicants": "integer",
    "actually_qualified": "integer",
    "qualification_rate_percentage": "float",
    "average_inflation_rate": "float",
    "most_over_claimed_skill": "string",
    "most_under_claimed_skill": "string",
    "hidden_gems": [
      {
        "candidate_id": "uuid",
        "reason": "string"
      }
    ],
    "honest_candidate_rate": "float",
    "pool_quality_score": 0-100,
    "jd_warnings": [
      {
        "warning_type": "string",
        "location_in_jd": "string",
        "effect": "string",
        "recommendation": "string"
      }
    ],
    "market_signal": "string",
    "pool_narrative": "string",
    "distribution_data": {
      "trajectory_distribution": { "Accelerating": "integer", "Steady": "integer", "Plateaued": "integer", "Declining": "integer" },
      "score_distribution": { "0-25": "integer", "26-50": "integer", "51-75": "integer", "76-100": "integer" },
      "inflation_distribution": { "low_0-20": "integer", "medium_21-50": "integer", "high_51-100": "integer" }
    }
  }
}

5. USER FLOWS
5.1 Primary Flow — New Project
Landing / Dashboard
        │
        ▼
Click "New Project"
        │
        ▼
Modal: Project Name, Role Title, Department, Seniority Target
User selects active API key (BYOK)
        │
        ▼
Project created → state: CREATED
Redirect to Project Workspace
        │
        ▼
Step 1 of 3 — Upload Job Description
  Option A: Paste text directly
  Option B: Upload .pdf or .docx
        │
        ▼
System runs JD Audit + Ghost Candidate generation (background)
Loading state shown with real-time status
        │
        ▼
JD Audit complete → state: JD_ANALYZED
Display JD Audit panel:
  - Must-have vs nice-to-have breakdown
  - Seniority mismatch warning (if present)
  - JD quality score + flags
  - Ghost Candidate summary card
        │
        ▼
Step 2 of 3 — Upload Resumes
Drag-and-drop zone accepts multiple .pdf / .docx
Progress bar per file during upload
Batch processing begins automatically
Real-time progress feed shows candidates being processed
        │
        ▼
State: ANALYZING
Per-candidate status: queued → extracting → analyzing → complete
Candidates appear in ranked list as they complete (streaming results)
        │
        ▼
All candidates complete → state: COMPLETE
Pool Health Report generates and appears at top
        │
        ▼
Step 3 of 3 — Review & Export
Recruiter reviews ranked cards
Can adjust weights → list re-ranks in real time
Can click into any candidate for full deep-dive
Can export CSV________________________________________

The Output UI
Single page. Clean. Three sections.
Section 1 — Ranked Candidate Cards
Each card shows:
•	Rank, name, final score
•	Trajectory label (Accelerating / Steady / Plateaued)
•	Ghost match score
•	Insider signal assessment
•	Red flags in plain English
•	3 interrogation questions
•	One paragraph: what the resume says vs what the system actually found
Section 2 — Pool Health Report
Full meta-analysis of the applicant pool. Sits above the individual cards so the recruiter sees the big picture first.
Section 3 — Download
One button. Downloads CSV with all scores, flags, reasons, and interrogation questions included.

