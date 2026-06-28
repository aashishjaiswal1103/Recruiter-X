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
    disqualification_reason: Optional[str] = None
