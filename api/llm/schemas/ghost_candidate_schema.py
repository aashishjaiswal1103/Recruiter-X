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
