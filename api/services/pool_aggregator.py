from collections import Counter
import json
from pydantic import BaseModel, Field
from services.supabase_client import get_supabase_client
from api.llm.router import LLMRouter
from config import settings

def check_pool_completion(project_id: str, org_id: str):
    """
    Triggered after every candidate analysis task completion.
    Checks if all candidates have been analyzed. If so, triggers the pool report Celery task.
    """
    supabase = get_supabase_client()
    response = supabase.table("candidates") \
        .select("id", count="exact") \
        .eq("project_id", project_id) \
        .in_("analysis_status", ["pending", "parsing", "parsed", "analyzing"]) \
        .execute()
        
    pending_count = response.count or 0
    if pending_count == 0:
        # Import celery task locally to prevent circular imports
        from tasks.report import generate_pool_report_task
        generate_pool_report_task.delay(project_id, org_id)

async def build_pool_report(project_id: str, org_id: str):
    """
    Aggregates all candidate metrics, audits skills, resolves hidden gems,
    generates a summary narrative via LLM, and updates the project row.
    """
    supabase = get_supabase_client()
    
    # 1. Fetch project details
    proj_response = supabase.table("projects") \
        .select("*") \
        .eq("id", project_id) \
        .eq("org_id", org_id) \
        .execute()
        
    if not proj_response.data:
        raise ValueError("Project not found.")
        
    project = proj_response.data[0]
    jd_audit = project.get("jd_structured") or {}
    
    # 2. Fetch all candidate details
    cand_response = supabase.table("candidates") \
        .select("*") \
        .eq("project_id", project_id) \
        .eq("analysis_status", "complete") \
        .execute()
        
    candidates = cand_response.data or []
    total_applicants = len(candidates)
    
    if total_applicants == 0:
        # Save a skeleton report if no candidates are complete
        report = {
            "total_applicants": 0,
            "actually_qualified": 0,
            "qualification_rate_percentage": 0.0,
            "average_inflation_rate": 0.0,
            "honest_candidate_rate": 0.0,
            "most_over_claimed_skill": "None",
            "most_under_claimed_skill": "None",
            "score_distribution": {"0_to_25": 0, "26_to_50": 0, "51_to_75": 0, "76_to_100": 0},
            "trajectory_distribution": {"Accelerating": 0, "Steady": 0, "Plateaued": 0, "Declining": 0},
            "hidden_gems": [],
            "jd_warnings": [],
            "pool_narrative": "No candidates analyzed yet."
        }
        supabase.table("projects").update({"jd_structured": {"pool_report": report}, "status": "complete"}).eq("id", project_id).execute()
        return report

    # 3. Calculate statistics
    qualified_cands = [c for c in candidates if (c.get("final_score") or 0) > 65]
    actually_qualified = len(qualified_cands)
    qualification_rate = round((actually_qualified / total_applicants) * 100, 1)
    
    # Average inflation rate (using credibility score)
    inflation_sum = 0
    honest_count = 0
    
    for c in candidates:
        credibility_score = c.get("credibility_score")
        if credibility_score is not None:
            inflation = 100 - int(credibility_score)
            inflation_sum += inflation
            if int(credibility_score) >= 70:
                honest_count += 1
                
    average_inflation = round(inflation_sum / total_applicants, 1)
    honest_rate = round((honest_count / total_applicants) * 100, 1)
    
    # 4. Score distribution
    score_dist = {"0_to_25": 0, "26_to_50": 0, "51_to_75": 0, "76_to_100": 0}
    for c in candidates:
        score = c.get("final_score") or 0
        if score <= 25:
            score_dist["0_to_25"] += 1
        elif score <= 50:
            score_dist["26_to_50"] += 1
        elif score <= 75:
            score_dist["51_to_75"] += 1
        else:
            score_dist["76_to_100"] += 1
            
    # 5. Trajectory distribution
    traj_dist = {"Accelerating": 0, "Steady": 0, "Plateaued": 0, "Declining": 0}
    for c in candidates:
        label = c.get("trajectory_label") or "Steady"
        # Normalize casing
        label_title = label.title()
        if label_title in traj_dist:
            traj_dist[label_title] += 1
        else:
            traj_dist["Steady"] += 1
                
    # 6. Over-claimed skill
    over_claimed_list = []
    for c in candidates:
        red_flags = c.get("red_flags") or []
        for flag in red_flags:
            if "claim" in flag.get("flag_type", "").lower() or "inflation" in flag.get("flag_type", "").lower():
                evidence = flag.get("evidence", "").lower()
                for skill in jd_audit.get("must_have_skills", []):
                    if skill.lower() in evidence:
                        over_claimed_list.append(skill)
                        
    most_over = Counter(over_claimed_list).most_common(1)
    most_over_claimed = most_over[0][0] if most_over else "None"
    
    # 7. Under-claimed skill
    under_claimed_list = []
    for c in candidates:
        signals = c.get("insider_signals") or []
        for sig in signals:
            if isinstance(sig, dict) and sig.get("absence_type") == "suspicious":
                under_claimed_list.append(sig.get("signal", ""))
            elif isinstance(sig, str):
                under_claimed_list.append(sig)
                
    most_under = Counter(under_claimed_list).most_common(1)
    most_under_claimed = most_under[0][0] if most_under else "None"
    
    # 8. Hidden Gems
    hidden_gems = []
    for c in candidates:
        final_s = c.get("final_score") or 0
        insider_s = c.get("insider_score") or 0
        if final_s < 55 and insider_s > 75:
            hidden_gems.append({
                "candidate_id": c.get("id"),
                "name": c.get("name") or "Unknown",
                "final_score": final_s,
                "insider_score": insider_s,
                "reason": c.get("narrative") or "Candidate has deep practitioner insider knowledge despite lower overall keyword scores."
            })
            
    # 9. JD Warnings
    jd_warnings = []
    jd_score = jd_audit.get("jd_quality_score") or 100
    if jd_score < 75:
        jd_warnings.append({
            "warning": "Vague requirement scopes detected in original Job Description.",
            "correlation": f"The original Job Description had a quality score of {jd_score}/100. This correlated with a high rate of uncalibrated applications (qualification rate of {qualification_rate}%)."
        })
        
    # 10. LLM Generated Pool Narrative
    pool_narrative = f"Batch candidates processed successfully. Overall pool quality shows a {qualification_rate}% qualification rate."
    try:
        summary_data = {
            "total_applicants": total_applicants,
            "qualified_count": actually_qualified,
            "qualification_rate": qualification_rate,
            "average_inflation": average_inflation,
            "most_over_claimed": most_over_claimed,
            "most_under_claimed": most_under_claimed
        }
        
        # Resolve active key
        key_res = supabase.table("api_keys").select("*").eq("org_id", org_id).eq("is_active", True).execute()
        if key_res.data:
            from services.api_key_manager import APIKeyManager
            km = APIKeyManager()
            api_key_str = km.decrypt(key_res.data[0]["encrypted_key"], org_id)
            provider = key_res.data[0]["provider"]
            model = key_res.data[0]["model"]
        else:
            api_key_str = ""
            provider = "gemini"
            model = "gemini-1.5-flash"
            
        if api_key_str or settings.SUPABASE_URL in ["", "your_supabase_project_url"]:
            router = LLMRouter(api_key=api_key_str or "dummy", provider=provider, model=model)
            prompt = f"""You are a senior talent acquisition advisor. Summarize the quality of this applicant pool based on the statistics below:
            {json.dumps(summary_data, indent=2)}
            
            Write a professional 3-sentence summary of the candidate pool suitability, highlighting strengths and weaknesses. Do not include JSON formatting or HTML tags in your response. Just write raw text."""
            
            class NarrativeSchema(BaseModel):
                narrative: str = Field(description="The generated 3-sentence summary")
                
            res = await router.complete(
                task_type="behaviour",
                system_prompt="You are a helpful recruitment advisor. Output valid JSON matching the schema.",
                user_prompt=prompt,
                schema=NarrativeSchema
            )
            pool_narrative = res.narrative
    except Exception:
        pass

    # 11. Assemble and Save report
    report = {
        "total_applicants": total_applicants,
        "actually_qualified": actually_qualified,
        "qualification_rate_percentage": qualification_rate,
        "average_inflation_rate": average_inflation,
        "honest_candidate_rate": honest_rate,
        "most_over_claimed_skill": most_over_claimed,
        "most_under_claimed_skill": most_under_claimed,
        "score_distribution": score_dist,
        "trajectory_distribution": traj_dist,
        "hidden_gems": hidden_gems,
        "jd_warnings": jd_warnings,
        "pool_narrative": pool_narrative
    }
    
    # Save directly to PostgreSQL (combining with existing jd_structured)
    new_jd_structured = dict(jd_audit)
    new_jd_structured["pool_report"] = report
    
    supabase.table("projects") \
        .update({
            "jd_structured": new_jd_structured,
            "status": "complete"
        }) \
        .eq("id", project_id) \
        .execute()
        
    return report
