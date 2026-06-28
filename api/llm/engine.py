import asyncio
import json
from typing import Any, Dict, List, Type
from pydantic import BaseModel, Field

from api.utils.errors import SchemaValidationError, LLMError
from api.llm.router import LLMRouter
from api.llm.schemas import (
    JDAuditSchema, GhostCandidateSchema, TrajectorySchema,
    BehaviourSchema, CredibilitySchema, InsiderSignalSchema,
    GhostComparisonSchema, InterrogationSchema
)
from api.llm import prompts

# --- Routing Decision Schema ---
class RoutingDecision(BaseModel):
    task_type: str = Field(description="The task type: jd_audit, ghost, trajectory, behaviour, credibility, insider_signal, ghost_comparison, or interrogation")
    confidence: float = Field(description="Confidence score from 0.0 to 1.0")
    reasoning: str = Field(description="Explanation for the routing decision")

# --- Self-Reflection Schemas ---
class CritiqueResponse(BaseModel):
    has_issues: bool = Field(description="True if logical flaws, contradictions, or omissions are found in the JSON")
    critique_points: List[str] = Field(description="Specific points of criticism")

# --- Tree of Thought Schemas ---
class PathEvaluation(BaseModel):
    selected_path_index: int = Field(description="The 0-based index of the best candidate path (0, 1, or 2)")
    logical_depth_scores: List[float] = Field(description="Depth scores for path 0, 1, and 2 from 0.0 to 10.0")
    evidence_grounding_scores: List[float] = Field(description="Grounding scores for path 0, 1, and 2 from 0.0 to 10.0")
    reasoning: str = Field(description="Detailed logic for selection")


class SemanticRouter:
    """Classifies and routes queries to specialists using a structured LLM classification call."""
    
    SYSTEM_PROMPT = """You are an expert recruiter routing agent. Analyze the user query and classify it into one of these task types:
- `jd_audit`: A job description (JD) that needs to be parsed, audited, or analysed for requirements and quality flags.
- `ghost`: Creating a synthetic "Ghost Candidate" profile benchmark from a JD or JD audit.
- `trajectory`: Timelines, employment history, career growth speed, or gap analysis.
- `behaviour`: Evaluating ownership signals, attention distribution, or problem complexity in resume text.
- `credibility`: Assessing skill inflation, achievement echo, dates consistency, or exaggerations.
- `insider_signal`: Domain-specific jargon checklists, expected vs. present signals.
- `ghost_comparison`: Multi-dimensional comparison of candidate scores directly against a ghost profile.
- `interrogation`: Generating targeted follow-up/interview questions from red flags.

Output a valid RoutingDecision JSON."""

    def __init__(self, router: LLMRouter):
        self.router = router

    async def route(self, user_input: str) -> str:
        try:
            # We use a lightweight routing task type (defaulting to behavior temperature)
            decision: RoutingDecision = await self.router.complete(
                task_type="behaviour",
                system_prompt=self.SYSTEM_PROMPT,
                user_prompt=f"Input Query:\n{user_input}",
                schema=RoutingDecision,
                temp_override=0.1
            )
            return decision.task_type
        except Exception:
            # Fallback to keyword heuristics if classification fails
            lower_input = user_input.lower()
            if "job description" in lower_input or "jd" in lower_input:
                return "jd_audit"
            elif "ghost candidate" in lower_input or "synthetic" in lower_input:
                return "ghost"
            elif "trajectory" in lower_input or "progression" in lower_input or "gap" in lower_input:
                return "trajectory"
            elif "behaviour" in lower_input or "ownership" in lower_input:
                return "behaviour"
            elif "credibility" in lower_input or "exaggeration" in lower_input or "inflation" in lower_input:
                return "credibility"
            elif "insider" in lower_input or "jargon" in lower_input:
                return "insider_signal"
            elif "compare" in lower_input or "matrix" in lower_input or "matching" in lower_input:
                return "ghost_comparison"
            elif "interrogation" in lower_input or "question" in lower_input or "interview" in lower_input:
                return "interrogation"
            return "behaviour"


class SelfReflector:
    """Verifies generated specialist outputs against the input data, correcting contradictions."""
    
    SYSTEM_CRITIQUE_PROMPT = """You are a critical quality auditor. Compare the draft JSON object against the original input and check for:
1. Contradictions (e.g. claiming 10 years experience on a resume that only has 3 years).
2. Omissions (e.g. missing stated must-have skills from the JD audit).
3. Score alignment (e.g. giving a high score despite flagging critical risks).
4. Bad data structures (e.g. empty lists where details are required).

Output a CritiqueResponse JSON indicating if there are issues and listing the critique points."""

    SYSTEM_CORRECTION_PROMPT = """You are an expert correction agent.
Given the original system instructions, original user input, a draft JSON output, and the critique points, revise and output a corrected, fully-compliant JSON object matching the target schema."""

    def __init__(self, router: LLMRouter):
        self.router = router

    async def reflect_and_refine(self, system_prompt: str, user_prompt: str, draft_obj: Any, schema: Type[BaseModel], task_type: str) -> Any:
        draft_json = draft_obj.model_dump_json(indent=2)
        
        # 1. Generate Critique
        critique: CritiqueResponse = await self.router.complete(
            task_type="behaviour",  # low temperature
            system_prompt=self.SYSTEM_CRITIQUE_PROMPT,
            user_prompt=f"Original Input:\n{user_prompt}\n\nDraft JSON:\n{draft_json}",
            schema=CritiqueResponse,
            temp_override=0.05
        )
        
        if not critique.has_issues:
            return draft_obj
            
        # 2. Apply Correction
        correction_user_prompt = (
            f"Original System Prompt:\n{system_prompt}\n\n"
            f"Original User Input:\n{user_prompt}\n\n"
            f"Draft JSON:\n{draft_json}\n\n"
            f"Critique Points:\n" + "\n".join(f"- {c}" for c in critique.critique_points)
        )
        
        try:
            corrected_obj = await self.router.complete(
                task_type=task_type,
                system_prompt=self.SYSTEM_CORRECTION_PROMPT,
                user_prompt=correction_user_prompt,
                schema=schema
            )
            return corrected_obj
        except Exception:
            # Fallback to the original draft if correction fails
            return draft_obj


class TreeOfThoughtExplorer:
    """Generates three parallel paths focusing on different aspects, then selects the best one."""
    
    SYSTEM_EVALUATOR_PROMPT = """You are a senior recruitment panel.
Analyze these 3 candidate evaluation JSON responses and determine which one offers the deepest logical analysis, best evidence grounding, and matches the input instructions.

Output a PathEvaluation JSON indicating the selected path index (0, 1, or 2) and detailed scores."""

    def __init__(self, router: LLMRouter):
        self.router = router

    async def explore_paths(self, task_type: str, system_prompt: str, user_prompt: str, schema: Type[BaseModel]) -> Any:
        # Define 3 slightly different instructions to explore alternative paths
        variations = [
            "\n[Focus Instruction: Pay close attention to chronological timeline progression, exact transitions, and gaps.]",
            "\n[Focus Instruction: Pay close attention to tech stack depth, architectural complexity, and engineering scale evidence.]",
            "\n[Focus Instruction: Pay close attention to risk vectors, exaggerations, passive voice patterns, and claims consistency.]"
        ]
        
        # Run 3 paths in parallel
        tasks = [
            self.router.complete(
                task_type=task_type,
                system_prompt=system_prompt + variation,
                user_prompt=user_prompt,
                schema=schema
            )
            for variation in variations
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        valid_candidates = []
        valid_indices = []
        
        for idx, res in enumerate(results):
            if isinstance(res, Exception):
                continue
            valid_candidates.append(res)
            valid_indices.append(idx)
            
        if not valid_candidates:
            # Re-raise the first exception if all failed
            failed_exp = next(r for r in results if isinstance(r, Exception))
            raise failed_exp
            
        if len(valid_candidates) == 1:
            return valid_candidates[0]
            
        # 2. Evaluate Candidates
        eval_input = ""
        for i, cand in enumerate(valid_candidates):
            eval_input += f"Candidate Path {i} (Original Index {valid_indices[i]}):\n{cand.model_dump_json(indent=2)}\n\n"
            
        evaluation: PathEvaluation = await self.router.complete(
            task_type="behaviour",
            system_prompt=self.SYSTEM_EVALUATOR_PROMPT,
            user_prompt=f"Original Input:\n{user_prompt}\n\nCandidates:\n{eval_input}",
            schema=PathEvaluation,
            temp_override=0.05
        )
        
        # Return the best selected path
        selected_index = evaluation.selected_path_index
        # Boundary check
        if 0 <= selected_index < len(valid_candidates):
            return valid_candidates[selected_index]
        return valid_candidates[0]


class MoAOrchestrator:
    """Executes parallel analysis specialist sub-agents, and merges their outputs using the Ghost Comparator."""

    def __init__(self, router: LLMRouter):
        self.router = router
        self.reflector = SelfReflector(router)
        self.tot_explorer = TreeOfThoughtExplorer(router)

    async def evaluate_candidate(self, resume_text: str, work_history_json: str, skill_claims_json: str, jd_audit_json: str, ghost_candidate_json: str) -> GhostComparisonSchema:
        # Initialize tasks for the 4 specialist agents
        # 1. Trajectory Agent (Using Tree of Thought due to high complexity)
        trajectory_task = self.tot_explorer.explore_paths(
            task_type="trajectory",
            system_prompt=prompts.trajectory.SYSTEM_PROMPT,
            user_prompt=prompts.trajectory.get_user_prompt(
                work_history_json=work_history_json,
                jd_audit_json=jd_audit_json
            ),
            schema=TrajectorySchema
        )
        
        # 2. Behaviour Agent
        behaviour_task = self.router.complete(
            task_type="behaviour",
            system_prompt=prompts.behaviour.SYSTEM_PROMPT,
            user_prompt=prompts.behaviour.get_user_prompt(resume_raw_text=resume_text),
            schema=BehaviourSchema
        )
        
        # 3. Credibility Agent
        credibility_task = self.router.complete(
            task_type="credibility",
            system_prompt=prompts.credibility.SYSTEM_PROMPT,
            user_prompt=prompts.credibility.get_user_prompt(
                work_history_json=work_history_json,
                skill_claims_json=skill_claims_json
            ),
            schema=CredibilitySchema
        )
        
        # 4. Insider Signal Agent
        insider_task = self.router.complete(
            task_type="insider_signal",
            system_prompt=prompts.insider_signal.SYSTEM_PROMPT,
            user_prompt=prompts.insider_signal.get_user_prompt(
                resume_raw_text=resume_text,
                ghost_candidate_json=ghost_candidate_json
            ),
            schema=InsiderSignalSchema
        )
        
        # Run 4 specialists in parallel
        trajectory_res, behaviour_res, credibility_res, insider_res = await asyncio.gather(
            trajectory_task, behaviour_task, credibility_task, insider_task
        )
        
        # Run self-reflection on the critical credibility report
        credibility_res = await self.reflector.reflect_and_refine(
            system_prompt=prompts.credibility.SYSTEM_PROMPT,
            user_prompt=prompts.credibility.get_user_prompt(
                work_history_json=work_history_json,
                skill_claims_json=skill_claims_json
            ),
            draft_obj=credibility_res,
            schema=CredibilitySchema,
            task_type="credibility"
        )
        
        # Assemble unified candidate profile JSON
        candidate_profile = {
            "trajectory_analysis": trajectory_res.model_dump(),
            "behaviour_analysis": behaviour_res.model_dump(),
            "credibility_audit": credibility_res.model_dump(),
            "insider_signals": insider_res.model_dump()
        }
        
        # 5. Consolidation Agent: Ghost Comparator
        ghost_comparison_res: GhostComparisonSchema = await self.router.complete(
            task_type="ghost_comparison",
            system_prompt=prompts.ghost_comparator.SYSTEM_PROMPT,
            user_prompt=prompts.ghost_comparator.get_user_prompt(
                candidate_profile_json=json.dumps(candidate_profile, indent=2),
                ghost_candidate_json=ghost_candidate_json
            ),
            schema=GhostComparisonSchema
        )
        
        return ghost_comparison_res


class PromptEngine:
    """The unified client interface wrapping all prompt-level reasoning systems."""

    def __init__(self, router: LLMRouter):
        self.router = router
        self.semantic_router = SemanticRouter(router)
        self.reflector = SelfReflector(router)
        self.tot_explorer = TreeOfThoughtExplorer(router)
        self.moa_orchestrator = MoAOrchestrator(router)

    async def route_and_execute(self, user_input: str, schema: Type[BaseModel], task_type_override: str = None) -> Any:
        """Dynamically routes the query to the correct task and completes it."""
        task_type = task_type_override or await self.semantic_router.route(user_input)
        
        # Load prompt definitions
        prompt_module = getattr(prompts, task_type, None)
        if not prompt_module:
            raise ValueError(f"No prompt definitions found for task type: {task_type}")
            
        system_prompt = prompt_module.SYSTEM_PROMPT
        user_prompt = user_input  # Default raw query
        
        # Resolve completion using appropriate reasoning pattern
        if task_type in ["trajectory", "credibility"]:
            # Run Tree of Thought for complex analytical steps
            return await self.tot_explorer.explore_paths(
                task_type=task_type,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                schema=schema
            )
        else:
            # Run standard routed call
            draft = await self.router.complete(
                task_type=task_type,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                schema=schema
            )
            # Run reflection refinement
            return await self.reflector.reflect_and_refine(
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                draft_obj=draft,
                schema=schema,
                task_type=task_type
            )
