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
