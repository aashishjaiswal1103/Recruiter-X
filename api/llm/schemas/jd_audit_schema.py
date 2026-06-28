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
