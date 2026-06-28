from pydantic import BaseModel, Field
from typing import List, Optional

class WorkHistoryEntry(BaseModel):
    company: str = Field(description="Name of the company")
    role: str = Field(description="Stated role title")
    start_date: str = Field(description="Start date or period")
    end_date: str = Field(description="End date or period")
    achievements_and_tasks: List[str] = Field(description="Details of achievements, scope, and technical responsibilities")

class SkillClaim(BaseModel):
    skill: str = Field(description="Skill name or keyword")
    years_of_experience: float = Field(description="Estimated years of experience using this skill")
    evidence_context: str = Field(description="Brief evidence text showing context of use")

class ResumeParsedSchema(BaseModel):
    candidate_name: str = Field(description="Stated candidate name")
    candidate_email: Optional[str] = Field(None, description="Candidate email address if found")
    work_history: List[WorkHistoryEntry] = Field(description="Employment history entries")
    skill_claims: List[SkillClaim] = Field(description="Key skill claims with context")
