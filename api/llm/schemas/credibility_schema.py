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
