from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from config import settings

# Configure standard logging format
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("recruiter_x")

app = FastAPI(
    title="Recruiter-X API",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to specific domains in production settings
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "supabase_connected": settings.SUPABASE_URL != ""
    }

@app.get("/api/python")
def hello_world():
    return {"message": "Hello from FastAPI"}
