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
