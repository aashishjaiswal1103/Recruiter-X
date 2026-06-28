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
