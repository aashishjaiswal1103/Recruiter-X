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
