import asyncio
import os
import sys
import json
from pydantic import BaseModel, Field

# Ensure project root is in python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from api.utils.errors import SchemaValidationError
from api.llm.router import LLMRouter
from api.llm.engine import (
    SemanticRouter, SelfReflector, TreeOfThoughtExplorer, 
    MoAOrchestrator, PromptEngine, RoutingDecision,
    CritiqueResponse, PathEvaluation
)
from api.llm.schemas import (
    JDAuditSchema, GhostCandidateSchema, TrajectorySchema, 
    BehaviourSchema, CredibilitySchema, InsiderSignalSchema, 
    GhostComparisonSchema, InterrogationSchema
)

# Mock model schemas for simple tests
class SimpleData(BaseModel):
    title: str
    experience_years: int

class MockRouter(LLMRouter):
    def __init__(self):
        # Initialize with dummy parameters
        self.provider = "mock"
        self.model = "mock-model"
        self.completions_call_count = 0
        self.mock_responses = {}

    def set_mock_response(self, task_type: str, response_json: str):
        self.mock_responses[task_type] = response_json

    async def complete(self, task_type: str, system_prompt: str, user_prompt: str, schema, temp_override: float = None):
        self.completions_call_count += 1
        
        # Check if we have a specific mock registered
        # If the schema is RoutingDecision
        if schema == RoutingDecision:
            if "job description" in user_prompt.lower():
                return RoutingDecision(task_type="jd_audit", confidence=0.95, reasoning="Query is about JDs.")
            elif "career history" in user_prompt.lower():
                return RoutingDecision(task_type="trajectory", confidence=0.99, reasoning="Query is about progression.")
            return RoutingDecision(task_type="behaviour", confidence=0.80, reasoning="Generic default.")
            
        if schema == CritiqueResponse:
            # First call has issues, second call does not (if we are testing reflection)
            if "issue" in user_prompt:
                return CritiqueResponse(has_issues=True, critique_points=["Experience years mismatches resume."])
            return CritiqueResponse(has_issues=False, critique_points=[])
            
        if schema == PathEvaluation:
            return PathEvaluation(
                selected_path_index=1,
                logical_depth_scores=[7.0, 9.5, 6.0],
                evidence_grounding_scores=[8.0, 9.0, 7.0],
                reasoning="Path 1 is the most comprehensive."
            )
            
        # Return specialist-specific response structures
        if schema == TrajectorySchema:
            return TrajectorySchema(
                label="Accelerating", score=88, title_progression_score=90,
                company_prestige_progression_score=85, responsibility_growth_score=90,
                career_age_normalized_score=90, gaps=[],
                trajectory_narrative="Strong timeline velocity."
            )
        if schema == BehaviourSchema:
            return BehaviourSchema(
                score=80,
                ownership_signal={"score": 85, "label": "high_ownership", "evidence": ["I designed X"]},
                impact_orientation={"score": 75, "label": "outcome_focused", "evidence": ["saved $10k"]},
                attention_distribution={"claimed_identity": "Senior", "actual_focus_area": "Senior", "mismatch_detected": False, "mismatch_detail": ""},
                problem_sophistication={"score": 80, "label": "ambiguous", "examples": ["system migration"]},
                behaviour_narrative="Strong behavior."
            )
        if schema == CredibilitySchema:
            return CredibilitySchema(
                risk_level="low", risk_score=10, flags=[], credibility_score=90,
                inflation_estimate_percentage=5, red_flag_narrative="Low risk profile."
            )
        if schema == InsiderSignalSchema:
            return InsiderSignalSchema(
                score=85, signals_expected=[], signals_present=[], signals_absent=[],
                pride_flags=[], credibility_assessment="Legitimate.", insider_narrative="Speaks like practitioner."
            )
        if schema == GhostComparisonSchema:
            return GhostComparisonSchema(
                ghost_match_score=90,
                dimensional_scores={"trajectory_match": 90, "behaviour_match": 85, "insider_match": 90, "credibility_match": 95, "skill_match": 90},
                gap_report=[], ghost_match_narrative="Matches benchmark perfectly.", would_disqualify=False
            )
            
        # Fallback standard mock
        if schema == SimpleData:
            if "correction" in system_prompt.lower():
                return SimpleData(title="Staff Engineer", experience_years=10)
            return SimpleData(title="Junior Engineer", experience_years=10)
            
        raise ValueError(f"No mock response registered for schema {schema}")


async def test_semantic_router():
    print("Testing SemanticRouter...")
    router = MockRouter()
    sr = SemanticRouter(router)
    
    # Test routing via LLM call
    task1 = await sr.route("Please audit this job description: Need 5 yrs Node experience")
    assert task1 == "jd_audit", f"Expected jd_audit, got {task1}"
    
    task2 = await sr.route("Analyze the career history: 3 years Lead, 2 years Principal")
    assert task2 == "trajectory", f"Expected trajectory, got {task2}"
    
    # Test keyword fallback when exception occurs
    def raise_err(*args, **kwargs):
        raise RuntimeError("LLM is down")
    router.complete = raise_err
    
    task3 = await sr.route("Help compare this candidate to the ghost profile")
    assert task3 == "ghost_comparison", f"Expected ghost_comparison, got {task3}"
    print("OK: SemanticRouter passed.")


async def test_self_reflector():
    print("Testing SelfReflector...")
    router = MockRouter()
    reflector = SelfReflector(router)
    
    # 1. No issues path
    draft = SimpleData(title="Junior Engineer", experience_years=10)
    res = await reflector.reflect_and_refine(
        system_prompt="Test System",
        user_prompt="Perfect data",
        draft_obj=draft,
        schema=SimpleData,
        task_type="behaviour"
    )
    assert res.title == "Junior Engineer"
    
    # 2. Issues critique and correction path
    res_corrected = await reflector.reflect_and_refine(
        system_prompt="Test System",
        user_prompt="There is an issue here",
        draft_obj=draft,
        schema=SimpleData,
        task_type="behaviour"
    )
    assert res_corrected.title == "Staff Engineer"
    print("OK: SelfReflector passed.")


async def test_tree_of_thought():
    print("Testing TreeOfThoughtExplorer...")
    router = MockRouter()
    tot = TreeOfThoughtExplorer(router)
    
    res = await tot.explore_paths(
        task_type="trajectory",
        system_prompt="Analyze resume timeline",
        user_prompt="Candidate history text",
        schema=TrajectorySchema
    )
    # The MockRouter returns TrajectorySchema for all paths.
    # Evaluation mock chooses index 1.
    assert res.label == "Accelerating"
    assert res.score == 88
    print("OK: TreeOfThoughtExplorer passed.")


async def test_moa_orchestrator():
    print("Testing MoAOrchestrator...")
    router = MockRouter()
    moa = MoAOrchestrator(router)
    
    res = await moa.evaluate_candidate(
        resume_text="Resume details",
        work_history_json="{}",
        skill_claims_json="{}",
        jd_audit_json="{}",
        ghost_candidate_json="{}"
    )
    assert res.ghost_match_score == 90
    assert res.dimensional_scores.trajectory_match == 90
    assert res.would_disqualify is False
    print("OK: MoAOrchestrator passed.")


async def run_all_tests():
    print("=== STARTING PROMPT ENGINE TESTS ===")
    await test_semantic_router()
    await test_self_reflector()
    await test_tree_of_thought()
    await test_moa_orchestrator()
    print("=== ALL PROMPT ENGINE TESTS PASSED SUCCESSFULLY ===")

if __name__ == "__main__":
    asyncio.run(run_all_tests())
