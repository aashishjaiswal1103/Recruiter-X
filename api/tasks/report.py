import asyncio
from celery_app import app
from services.supabase_client import get_supabase_client
from services.pool_aggregator import build_pool_report
from tenacity import retry, stop_after_attempt, wait_exponential

@app.task(
    bind=True,
    max_retries=3,
    default_retry_delay=30,
    name="tasks.report.generate_pool_report_task"
)
def generate_pool_report_task(self, project_id: str, org_id: str):
    """
    Celery task to compile the overall pool health dashboard report.
    This runs asynchronously once all candidate analysis tasks for the project are complete.
    """
    supabase = get_supabase_client()
    
    try:
        print(f"Starting pool report generation for project {project_id}...")
        
        # Mark project status as 'auditing' during compilation
        supabase.table("projects") \
            .update({"status": "auditing"}) \
            .eq("id", project_id) \
            .eq("org_id", org_id) \
            .execute()
            
        # Execute async builder inside synchronous Celery loop
        report = asyncio.run(build_pool_report(project_id, org_id))
        
        print(f"SUCCESS: Pool report compiled and stored on project {project_id} successfully.")
        
    except Exception as exc:
        print(f"ERROR: Failed to compile pool report for project {project_id}. Details: {exc}")
        # Mark project status as failed
        supabase.table("projects") \
            .update({"status": "failed"}) \
            .eq("id", project_id) \
            .eq("org_id", org_id) \
            .execute()
        raise self.retry(exc=exc, countdown=60 * (self.request.retries + 1))
