# 14. Error Handling, Responses & Definition of Done

This document specifies the standard error response format, FastAPI global exception handler configurations, and the Definition of Done (DoD) for the completed backend.

---

## 1. Unified Error Response Format

To ensure the client UI can display actionable, contextual errors, all backend failures must return a structured JSON body with a standard HTTP status code.

### JSON Error Payload Structure
```json
{
  "status": 400,
  "code": "INVALID_API_KEY",
  "message": "The API key validation failed for provider 'gemini' using key ID '01af3340-9a3b-4170-b1ff-0d29abcb2ea1'. Connection timed out.",
  "timestamp": "2026-06-28T10:40:00Z"
}
```

### Response Fields:
*   **`status` (int):** The HTTP response status code (e.g. `400`, `401`, `403`, `404`, `429`, `500`).
*   **`code` (string):** A unique, machine-readable string (screaming snake case) matching the error type.
*   **`message` (string):** A specific, human-readable description that names the resource that failed, the step it failed at, and any IDs involved.
*   **`timestamp` (string):** ISO timestamp of the error event.

---

## 2. Global Exception Handlers

Configure global exception middleware in `main.py` to intercept custom exceptions and serialize them:

```python
# main.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from datetime import datetime, timezone
from utils.errors import LLMError, RateLimitError, APITimeoutError, APIAuthError, ExtractionError

app = FastAPI()

@app.exception_handler(RateLimitError)
async def rate_limit_exception_handler(request: Request, exc: RateLimitError):
    return JSONResponse(
        status_code=429,
        content={
            "status": 429,
            "code": "RATE_LIMIT_EXHAUSTED",
            "message": f"LLM API rate limits exceeded: {str(exc)}",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )

@app.exception_handler(APIAuthError)
async def auth_exception_handler(request: Request, exc: APIAuthError):
    return JSONResponse(
        status_code=401,
        content={
            "status": 401,
            "code": "API_KEY_INVALID",
            "message": f"Provider credentials invalid or expired: {str(exc)}",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )

@app.exception_handler(ExtractionError)
async def extraction_exception_handler(request: Request, exc: ExtractionError):
    return JSONResponse(
        status_code=422,
        content={
            "status": 422,
            "code": "PARSING_FAILED",
            "message": f"Resume text extraction failed: {str(exc)}",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )

# Fallback internal error handler
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    # Log the full traceback locally for debugging
    import traceback
    traceback.print_exc() 
    
    return JSONResponse(
        status_code=500,
        content={
            "status": 500,
            "code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred in our systems. Please contact support.",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )
```

> [!CAUTION]
> Stack trace logs must **never** be returned in the API responses sent to the client. Full traceback details must remain sandboxed in server-side logs (or sent to Sentry).

---

## 3. Definition of Done (DoD)

The backend build is complete and ready for deployment when it satisfies the following end-to-end user criteria:

1.  **Speed Baseline:** A recruiter can create an organization account, save an API key, construct a hiring project, upload a Job Description, and view the JD audit report and Ghost Candidate benchmark in under **15 seconds** total.
2.  **Concurrency Support:** The queue can take a batch upload of **50 candidate resumes** and process extraction, multi-dimensional LLM analysis, scoring, and questions generation in parallel.
3.  **Real-Time Subscriptions:** As each candidate task completes, client-side UI rankings must update instantly using **Supabase Realtime subscriptions** to table changes.
4.  **Complete candidate profile output:** Recruiter can drill down into a candidate profile and view:
    *   Five distinct dimension scores (Trajectory, Behaviour, Ghost Match, Insider, Credibility).
    *   Risk and credibility flags.
    *   Three targeted interrogation questions with evaluation keys.
5.  **Pool Health Metrics:** The system successfully generates and retrieves a bulk cohort report showing qualification metrics, hidden gems, and skill claims warnings.
6.  **Data Portability:** Recruiter can download a CSV file matching the candidate list schema details exactly.
7.  **Audit Compliance:** Every score, flag, and interview question generated must be persisted in candidate rows alongside the raw JSON output payload from the LLMRouter for downstream verification.
