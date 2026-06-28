import asyncio
import json
from datetime import datetime
from celery_app import app
from services.supabase_client import get_supabase_client
from services.api_key_manager import APIKeyManager
from services.score_fusion import calculate_final_score, DEFAULT_WEIGHTS
from services.pool_aggregator import check_pool_completion
from api.llm.router import LLMRouter
from api.llm.engine import MoAOrchestrator
from api.llm.schemas.interrogation_schema import InterrogationSchema
from api.llm.schemas.ghost_comparison_schema import GhostComparisonSchema
from config import settings
from tenacity import retry, stop_after_attempt, wait_exponential

INTERROGATION_SYSTEM_PROMPT = """You are a surgical technical interviewer.
Generate exactly 3 targeted questions to audit the candidate's top red flags, dates gaps, or credibility concerns.
Your output must strictly follow the InterrogationSchema.

Important Rules:
1. Output valid JSON matching the schema and nothing else.
2. Target specific claims in the resume.
3. Provide precise evaluation guidelines: what a real answer must include and evasion indicators to watch out for."""

@app.task(
    bind=True,
    max_retries=3,
    default_retry_delay=30,
    name="tasks.analyze.analyze_candidate_task"
)
def analyze_candidate_task(self, candidate_id: str, org_id: str):
    """
    Celery task to run the multi-agent reasoning, score fusion, and interrogation questions setup.
    """
    supabase = get_supabase_client()
    
    try:
        # Update candidate status to 'analyzing'
        supabase.table("candidates") \
            .update({"analysis_status": "analyzing", "analysis_started_at": datetime.utcnow().isoformat()}) \
            .eq("id", candidate_id) \
            .execute()

        # 1. Fetch candidate + project context
        response = supabase.table("candidates") \
            .select("*") \
            .eq("id", candidate_id) \
            .eq("org_id", org_id) \
            .execute()
            
        if not response.data or len(response.data) == 0:
            raise ValueError(f"Candidate {candidate_id} not found.")
            
        candidate = response.data[0]
        project_id = candidate["project_id"]
        
        proj_res = supabase.table("projects").select("*").eq("id", project_id).execute()
        if not proj_res.data or len(proj_res.data) == 0:
            raise ValueError(f"Project {project_id} not found.")
            
        project = proj_res.data[0]
        
        # 2. Get API key details
        key_res = supabase.table("api_keys").select("*").eq("org_id", org_id).eq("is_active", True).execute()
        if key_res.data:
            km = APIKeyManager()
            api_key_str = km.decrypt(key_res.data[0]["encrypted_key"], org_id)
            provider = key_res.data[0]["provider"]
            model = key_res.data[0]["model"]
        else:
            api_key_str = ""
            provider = "gemini"
            model = "gemini-1.5-flash"

        # Resolve weights from project configurations (default to standard settings)
        jd_structured = project.get("jd_structured") or {}
        weights = jd_structured.get("weights") or DEFAULT_WEIGHTS

        # Extract parsed texts
        resume_text = candidate.get("resume_raw_text") or ""
        parsed_resume = candidate.get("resume_parsed") or {}
        
        # Format structures for input variables
        work_history_json = json.dumps(parsed_resume.get("work_history") or [])
        skill_claims_json = json.dumps(parsed_resume.get("skill_claims") or [])
        jd_audit_json = json.dumps(jd_structured)
        ghost_candidate_json = json.dumps(project.get("ghost_candidate") or {})

        # If in development and no Supabase URL configured, default to bypass dummy
        if not api_key_str and settings.SUPABASE_URL in ["", "your_supabase_project_url"]:
            # Setup dummy scores for local dev verification
            dummy_comparison = {
                "ghost_match_score": 75,
                "dimensional_scores": {
                    "trajectory_match": 80,
                    "behaviour_match": 70,
                    "insider_match": 85,
                    "credibility_match": 90,
                    "skill_match": 75
                },
                "gap_report": [],
                "ghost_match_narrative": "Dummy match summary for development",
                "would_disqualify": False,
                "disqualification_reason": None
            }
            dummy_questions = {
                "interrogation_questions": [
                    {
                        "question_id": 1,
                        "targets_claim": "Python development experience",
                        "flag_type": "credibility",
                        "question_text": "Detail how you solved query latency issues in your senior role?",
                        "what_a_real_answer_includes": ["Index optimization", "profiler analysis"],
                        "red_flags_in_poor_answer": ["vague answers", "simply adding hardware"],
                        "difficulty": "probing"
                    }
                ]
            }
            
            # Save dummy analysis results
            supabase.table("candidates") \
                .update({
                    "trajectory_score": dummy_comparison["dimensional_scores"]["trajectory_match"],
                    "behaviour_score": dummy_comparison["dimensional_scores"]["behaviour_match"],
                    "ghost_score": dummy_comparison["ghost_match_score"],
                    "insider_score": dummy_comparison["dimensional_scores"]["insider_match"],
                    "credibility_score": dummy_comparison["dimensional_scores"]["credibility_match"],
                    "final_score": 78,
                    "trajectory_label": "Accelerating",
                    "red_flags": [],
                    "interrogation_qs": dummy_questions["interrogation_questions"],
                    "insider_signals": ["Python expertise"],
                    "narrative": dummy_comparison["ghost_match_narrative"],
                    "analysis_status": "complete",
                    "analysis_completed_at": datetime.utcnow().isoformat()
                }) \
                .eq("id", candidate_id) \
                .execute()
        else:
            router = LLMRouter(api_key=api_key_str or "dummy", provider=provider, model=model)
            orchestrator = MoAOrchestrator(router)
            
            # Execute Mixture of Agents (MoA) pipeline inside asyncio
            comparison: GhostComparisonSchema = resilient_moa_call(
                orchestrator=orchestrator,
                resume_text=resume_text,
                work_history_json=work_history_json,
                skill_claims_json=skill_claims_json,
                jd_audit_json=jd_audit_json,
                ghost_candidate_json=ghost_candidate_json
            )

            # We can run another prompt engine execution to retrieve the exact raw red flags list
            # Credibility analysis contains the list of flags. Let's resolve the final score calculation
            # For simplicity, we can fetch flags from the final ghost comparison report or run a small query
            # We map: scores = { ghost_match, trajectory, behaviour, insider_signal, credibility }
            dim_scores = {
                "ghost_match": comparison.dimensional_scores.ghost_match,
                "trajectory": comparison.dimensional_scores.trajectory_match,
                "behaviour": comparison.dimensional_scores.behaviour_match,
                "insider_signal": comparison.dimensional_scores.insider_match,
                "credibility": comparison.dimensional_scores.credibility_match
            }
            
            # Calculate final score via score fusion math
            # Since the MoA orchestrator gathers all reports locally, let's extract flag details
            # We can extract red flags from the gap reports or generate from the comparator
            red_flags = []
            for gap in comparison.gap_report:
                if gap.gap_severity in ["major", "disqualifying"]:
                    red_flags.append({
                        "flag_type": gap.dimension,
                        "severity": "HIGH" if gap.gap_severity == "disqualifying" else "MEDIUM",
                        "evidence": gap.gap_description,
                        "plain_english": gap.bridge_requirement
                    })

            final_score = calculate_final_score(dim_scores, weights, red_flags)

            # Generate Targeted Interrogation Questions
            interrogation_res: InterrogationSchema = resilient_llm_call(
                router=router,
                task_type="interrogation",
                system_prompt=INTERROGATION_SYSTEM_PROMPT,
                user_prompt=f"Red Flags:\n{json.dumps(red_flags, indent=2)}\n\nCandidate Resume:\n{resume_text}",
                schema=InterrogationSchema
            )

            # Persist results
            supabase.table("candidates") \
                .update({
                    "trajectory_score": dim_scores["trajectory"],
                    "behaviour_score": dim_scores["behaviour"],
                    "ghost_score": dim_scores["ghost_match"],
                    "insider_score": dim_scores["insider_signal"],
                    "credibility_score": dim_scores["credibility"],
                    "final_score": final_score,
                    "trajectory_label": "Steady",  # Standard baseline fallback
                    "red_flags": red_flags,
                    "interrogation_qs": [q.model_dump() for q in interrogation_res.interrogation_questions],
                    "insider_signals": comparison.model_dump().get("gap_report", []),
                    "narrative": comparison.ghost_match_narrative,
                    "analysis_status": "complete",
                    "analysis_completed_at": datetime.utcnow().isoformat()
                }) \
                .eq("id", candidate_id) \
                .execute()

        # Trigger project-level health recalculation check
        check_pool_completion(project_id, org_id)

    except Exception as exc:
        supabase.table("candidates") \
            .update({
                "analysis_status": "failed",
                "narrative": f"Analysis stage failed: {str(exc)}"
            }) \
            .eq("id", candidate_id) \
            .execute()
        raise self.retry(exc=exc, countdown=60 * (self.request.retries + 1))

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=30),
    reraise=True
)
def resilient_llm_call(router: LLMRouter, **kwargs):
    """Resilient LLM call handler."""
    return asyncio.run(router.complete(**kwargs))

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=30),
    reraise=True
)
def resilient_moa_call(orchestrator: MoAOrchestrator, **kwargs):
    """Resilient Mixture of Agents (MoA) execution handler."""
    return asyncio.run(orchestrator.evaluate_candidate(**kwargs))
