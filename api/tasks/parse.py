import os
from celery_app import app
from services.supabase_client import get_supabase_client
from services.resume_extractor import extract_text
from services.storage import download_file
from api.llm.router import LLMRouter
from api.llm.schemas.resume_parsed_schema import ResumeParsedSchema
from config import settings
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# System prompt to parse resume text into structured Pydantic schema
PARSE_RESUME_SYSTEM_PROMPT = """You are an expert resume parsing intelligence system.
Analyze the raw resume text provided and extract the details.
Ensure your output strictly follows the ResumeParsedSchema.

Important Rules:
1. Extract candidate's name and email.
2. Structure the work history chronologically, list tasks/achievements per role.
3. Extract key skill claims and calculate estimated years of experience based on role durations. Give evidence context for each claim.
4. Output valid JSON matching the schema and nothing else."""

@app.task(
    bind=True,
    max_retries=3,
    default_retry_delay=30,
    name="tasks.parse.parse_resume_task"
)
def parse_resume_task(self, candidate_id: str, org_id: str):
    """
    Asynchronous Celery task to download, extract raw text, and structured-parse a resume.
    """
    supabase = get_supabase_client()
    
    try:
        # 1. Fetch candidate
        response = supabase.table("candidates") \
            .select("*") \
            .eq("id", candidate_id) \
            .eq("org_id", org_id) \
            .execute()
            
        if not response.data or len(response.data) == 0:
            raise ValueError(f"Candidate {candidate_id} not found.")
            
        candidate = response.data[0]
        file_url = candidate["resume_file_url"]  # This is the storage path, e.g. org/project/id/original.pdf
        
        # Determine content type from file extension
        ext = os.path.splitext(file_url)[1].lower()
        if ext == ".pdf":
            content_type = "application/pdf"
        elif ext == ".docx":
            content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        else:
            content_type = "application/pdf"  # Fallback
            
        # Update candidate status to 'parsing'
        supabase.table("candidates") \
            .update({"analysis_status": "parsing"}) \
            .eq("id", candidate_id) \
            .execute()

        # 2. Download from Storage
        # The file_url is the storage path within the bucket 'resumes'
        file_bytes = download_file("resumes", file_url)
        
        # 3. Extract text
        raw_text = extract_text(file_bytes, content_type)
        
        # 4. Update raw text in candidate row
        supabase.table("candidates") \
            .update({
                "resume_raw_text": raw_text
            }) \
            .eq("id", candidate_id) \
            .execute()
            
        # 5. Extract structured work history and skills using LLM
        # Determine organization's default API Key for LLM
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
            
        # If in development and no Supabase URL configured, default to bypass dummy
        if not api_key_str and settings.SUPABASE_URL in ["", "your_supabase_project_url"]:
            # Setup dummy parsed object for local dev verification
            dummy_parsed = {
                "candidate_name": "Developer Test",
                "candidate_email": "test@example.com",
                "work_history": [
                    {
                        "company": "FAANG Corp",
                        "role": "Senior Engineer",
                        "start_date": "2020-01",
                        "end_date": "2024-01",
                        "achievements_and_tasks": ["Designed cache layers", "Optimized queries"]
                    }
                ],
                "skill_claims": [
                    {
                        "skill": "Python",
                        "years_of_experience": 4.0,
                        "evidence_context": "Used in core FAANG backend project"
                    }
                ]
            }
            supabase.table("candidates") \
                .update({
                    "name": dummy_parsed["candidate_name"],
                    "email": dummy_parsed["candidate_email"],
                    "resume_parsed": dummy_parsed,
                    "analysis_status": "parsed"
                }) \
                .eq("id", candidate_id) \
                .execute()
        else:
            router = LLMRouter(api_key=api_key_str or "dummy", provider=provider, model=model)
            
            # Execute structured output completion
            parsed_data: ResumeParsedSchema = resilient_llm_call(
                router=router,
                task_type="behaviour",
                system_prompt=PARSE_RESUME_SYSTEM_PROMPT,
                user_prompt=f"Resume Text:\n{raw_text}",
                schema=ResumeParsedSchema
            )
            
            # Update database
            supabase.table("candidates") \
                .update({
                    "name": parsed_data.candidate_name,
                    "email": parsed_data.candidate_email,
                    "resume_parsed": parsed_data.model_dump(),
                    "analysis_status": "parsed"
                }) \
                .eq("id", candidate_id) \
                .execute()
                
        # 6. Trigger analyze task
        from tasks.analyze import analyze_candidate_task
        analyze_candidate_task.delay(candidate_id, org_id)
        
    except Exception as exc:
        # Mark candidate analysis as failed
        supabase.table("candidates") \
            .update({
                "analysis_status": "failed",
                "narrative": f"Ingestion stage failed: {str(exc)}"
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
    """Resilient LLM invocation helper."""
    # Since router.complete is async, we execute it in a sync context using asyncio if needed
    import asyncio
    return asyncio.run(router.complete(**kwargs))
