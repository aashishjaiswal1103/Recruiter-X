import sys
import os
# Add api directory to python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
import logging
from config import settings
from utils.auth import authenticate_jwt, RequireRole

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

@app.get("/api/v1/protected")
def protected_route(user_id: str = Depends(authenticate_jwt)):
    """A route that requires a valid JWT token."""
    return {
        "message": "Access granted to authenticated user.",
        "user_id": user_id
    }

@app.get("/api/v1/admin-only")
def admin_only_route(org_id: str = Depends(RequireRole(["owner", "admin"]))):
    """A route that requires 'owner' or 'admin' organizational role."""
    return {
        "message": "Access granted to admin/owner.",
        "org_id": org_id
    }

@app.get("/api/v1/recruiter-only")
def recruiter_only_route(org_id: str = Depends(RequireRole(["owner", "admin", "recruiter", "interviewer"]))):
    """A route that requires any candidate review role (owner, admin, recruiter, interviewer)."""
    return {
        "message": "Access granted to candidate review operations.",
        "org_id": org_id
    }

