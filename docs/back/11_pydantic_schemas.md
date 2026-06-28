# 11. Pydantic Output Schemas

This document defines all structured output validation schemas inside `llm/schemas/`. 

---

## 1. Job Description Audit Schema (`llm/schemas/jd_audit_schema.py`)

```python
from pydantic import BaseModel, Field
from typing import List
from enum import Enum

class SeniorityEnum(str, Enum):
    junior = "junior"
    mid = "mid"
    senior = "senior"
    staff = "staff"
    principal = "principal"
    director = "director"

class PaceEnum(str, Enum):
    fast = "fast"
    measured = "measured"
    careful = "careful"

class CollaborationEnum(str, Enum):
    independent = "independent"
    hybrid = "hybrid"
    team_dependent = "team_dependent"

class WorkingModeEnum(str, Enum):
    builder = "builder"
    maintainer = "maintainer"
    operator = "operator"
    researcher = "researcher"

class WorkingStyle(BaseModel):
    pace: PaceEnum
    collaboration: CollaborationEnum
    mode: WorkingModeEnum

class JDQualityFlag(BaseModel):
    flag_type: str = Field(description="Type of issue, e.g. vague_skills, impossible_combination")
    location: str = Field(description="Sentence or section where the issue is found")
    recommendation: str = Field(description="Proposed fix for the JD writer")

class JDAuditSchema(BaseModel):
    must_have_skills: List[str]
    nice_to_have_skills: List[str]
    implied_requirements: List[str]
    inferred_seniority: SeniorityEnum
    stated_seniority: str
    seniority_mismatch: bool
    working_style: WorkingStyle
    culture_signals: List[str]
    hidden_expectations: List[str]
    jd_quality_score: int = Field(description="Quality score from 0 to 100")
    jd_quality_flags: List[JDQualityFlag]
    audit_narrative: str
```

---

## 2. Ghost Candidate Schema (`llm/schemas/ghost_candidate_schema.py`)

```python
from pydantic import BaseModel, Field
from typing import List
from enum import Enum

class ExpectedTrajectoryEnum(str, Enum):
    accelerating = "accelerating"
    steady = "steady"

class AbsenceSignal(BaseModel):
    signal: str = Field(description="What should be absent on an expert resume")
    reason_absent: str = Field(description="Why an expert wouldn't put this")

class BenchmarkDimensions(BaseModel):
    trajectory_benchmark: str
    behaviour_benchmark: str
    insider_benchmark: str
    credibility_benchmark: str

class GhostCandidateSchema(BaseModel):
    ideal_career_arc: str
    expected_trajectory: ExpectedTrajectoryEnum
    expected_companies_by_type: List[str] = Field(description="Target companies, e.g., product, agency")
    expected_problems_solved: List[str]
    expected_insider_signals: List[str]
    expected_absence_signals: List[AbsenceSignal]
    ghost_narrative: str
    benchmark_dimensions: BenchmarkDimensions
```

---

## 3. Trajectory Schema (`llm/schemas/trajectory_schema.py`)

```python
from pydantic import BaseModel, Field
from typing import List
from enum import Enum

class TrajectoryLabelEnum(str, Enum):
    Accelerating = "Accelerating"
    Steady = "Steady"
    Plateaued = "Plateaued"
    Declining = "Declining"
    Insufficient_Data = "Insufficient_Data"

class GapSeverityEnum(str, Enum):
    minor = "minor"
    moderate = "moderate"
    significant = "significant"

class CareerGap(BaseModel):
    period: str = Field(description="Date range of the gap")
    duration_months: int
    severity: GapSeverityEnum
    explanation_present: bool

class TrajectorySchema(BaseModel):
    label: TrajectoryLabelEnum
    score: int = Field(description="Trajectory score from 0 to 100")
    title_progression_score: int
    company_prestige_progression_score: int
    responsibility_growth_score: int
    career_age_normalized_score: int
    gaps: List[CareerGap]
    trajectory_narrative: str
```

---

## 4. Behaviour Schema (`llm/schemas/behaviour_schema.py`)

```python
from pydantic import BaseModel, Field
from typing import List
from enum import Enum

class OwnershipLabelEnum(str, Enum):
    high_ownership = "high_ownership"
    shared_credit = "shared_credit"
    diffused_credit = "diffused_credit"

class OwnershipSignal(BaseModel):
    score: int
    label: OwnershipLabelEnum
    evidence: List[str]

class ImpactLabelEnum(str, Enum):
    outcome_focused = "outcome_focused"
    output_focused = "output_focused"
    activity_focused = "activity_focused"

class ImpactOrientation(BaseModel):
    score: int
    label: ImpactLabelEnum
    evidence: List[str]

class AttentionDistribution(BaseModel):
    claimed_identity: str
    actual_focus_area: str
    mismatch_detected: bool
    mismatch_detail: str

class ProblemLabelEnum(str, Enum):
    novel = "novel"
    ambiguous = "ambiguous"
    known = "known"
    routine = "routine"

class ProblemSophistication(BaseModel):
    score: int
    label: ProblemLabelEnum
    examples: List[str]

class BehaviourSchema(BaseModel):
    score: int = Field(description="Behavior score from 0 to 100")
    ownership_signal: OwnershipSignal
    impact_orientation: ImpactOrientation
    attention_distribution: AttentionDistribution
    problem_sophistication: ProblemSophistication
    behaviour_narrative: str
```

---

## 5. Credibility Schema (`llm/schemas/credibility_schema.py`)

```python
from pydantic import BaseModel, Field
from typing import List
from enum import Enum

class RiskLevelEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class CredibilityFlagSeverityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class CredibilityFlag(BaseModel):
    flag_type: str = Field(description="e.g. skill_inflation, dates_mismatch")
    severity: CredibilityFlagSeverityEnum
    evidence: str
    plain_english: str = Field(description="Explanation for recruiters")

class CredibilitySchema(BaseModel):
    risk_level: RiskLevelEnum
    risk_score: int = Field(description="0 to 100")
    flags: List[CredibilityFlag]
    credibility_score: int = Field(description="0 to 100")
    inflation_estimate_percentage: int = Field(description="0 to 100")
    red_flag_narrative: str
```

---

## 6. Insider Signal Schema (`llm/schemas/insider_signal_schema.py`)

```python
from pydantic import BaseModel, Field
from typing import List
from enum import Enum

class AbsenceTypeEnum(str, Enum):
    plausible = "plausible"
    suspicious = "suspicious"

class AbsentSignal(BaseModel):
    signal: str
    absence_type: AbsenceTypeEnum
    implication: str

class PrideFlag(BaseModel):
    claim: str
    expected_level: str
    actual_level_implied: str
    flag_detail: str

class InsiderSignalSchema(BaseModel):
    score: int = Field(description="0 to 100")
    signals_expected: List[str]
    signals_present: List[str]
    signals_absent: List[AbsentSignal]
    pride_flags: List[PrideFlag]
    credibility_assessment: str
    insider_narrative: str
```

---

## 7. Ghost Comparison Schema (`llm/schemas/ghost_comparison_schema.py`)

```python
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class GapSeverityEnum(str, Enum):
    minor = "minor"
    moderate = "moderate"
    major = "major"
    disqualifying = "disqualifying"

class GapReport(BaseModel):
    dimension: str
    gap_description: str
    gap_severity: GapSeverityEnum
    bridge_requirement: str

class DimensionalScores(BaseModel):
    trajectory_match: int
    behaviour_match: int
    insider_match: int
    credibility_match: int
    skill_match: int

class GhostComparisonSchema(BaseModel):
    ghost_match_score: int = Field(description="0 to 100")
    dimensional_scores: DimensionalScores
    gap_report: List[GapReport]
    ghost_match_narrative: str
    would_disqualify: bool
    disqualification_reason: Optional[str]
```

---

## 8. Interrogation Schema (`llm/schemas/interrogation_schema.py`)

```python
from pydantic import BaseModel, Field
from typing import List
from enum import Enum

class FlagTypeEnum(str, Enum):
    credibility = "credibility"
    inflation = "inflation"
    absent_insider_signal = "absent_insider_signal"
    scope_inconsistency = "scope_inconsistency"

class DifficultyEnum(str, Enum):
    probing = "probing"
    surgical = "surgical"
    adversarial = "adversarial"

class InterrogationQuestion(BaseModel):
    question_id: int
    targets_claim: str
    flag_type: FlagTypeEnum
    question_text: str
    what_a_real_answer_includes: List[str]
    red_flags_in_poor_answer: List[str]
    difficulty: DifficultyEnum

class InterrogationSchema(BaseModel):
    interrogation_questions: List[InterrogationQuestion]
```
