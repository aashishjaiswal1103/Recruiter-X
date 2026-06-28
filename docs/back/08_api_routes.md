# 08. API Routes & Controller Specifications

This document defines the route interfaces, HTTP verbs, payload validation parameters, and response schemas for all Recruiter-X FastAPI endpoints.

---

## 1. Routing Principles

*   **Thin Controllers:** Routers must strictly handle parameter deserialization, validation, background job dispatching, and output serialization. No business logic, database mutations, or LLM parsing code belongs in these route handler files.
*   **Uniform Prefix:** All endpoints are grouped under the `/api/v1` namespace.
*   **Security:** All endpoints (except auth and webhooks) require the `Authorization: Bearer <JWT>` header.

---

## 2. Endpoint Catalog

### 1. Projects Routes (`routes/projects.py`)

#### `POST /projects`
Creates a project record.
*   **Request Body:**
    ```json
    {
      "title": "Senior Frontend Engineer",
      "role": "Frontend",
      "department": "Engineering",
      "seniority": "senior"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "project_id": "7ca64b85-d6d7-463b-9a84-18ef55711200",
      "status": "draft"
    }
    ```

#### `GET /projects`
Retrieves all projects for the authenticated organization.
*   **Sorting:** `updated_at DESC`
*   **Response (200 OK):**
    ```json
    [
      {
        "id": "7ca64b85-d6d7-463b-9a84-18ef55711200",
        "title": "Senior Frontend Engineer",
        "status": "complete",
        "updated_at": "2026-06-28T10:00:00Z"
      }
    ]
    ```

#### `GET /projects/{id}`
Retrieves a single project with JD audit details and the ghost candidate.
*   **Response (200 OK):**
    ```json
    {
      "id": "7ca64b85-d6d7-463b-9a84-18ef55711200",
      "title": "Senior Frontend Engineer",
      "jd_raw_text": "...",
      "jd_structured": { "must_have_skills": ["React"], "nice_to_have_skills": ["Tailwind"] },
      "ghost_candidate": { "ideal_career_arc": "...", "benchmark_dimensions": {} },
      "status": "complete"
    }
    ```

#### `PATCH /projects/{id}`
Updates details of an existing project.
*   **Request Body:** (Partial fields allowed)
    ```json
    {
      "title": "Lead Frontend Engineer",
      "seniority": "staff"
    }
    ```
*   **Response (200 OK):** Success confirmation object.

#### `DELETE /projects/{id}`
Soft deletes / archives a project.
*   **Response (204 No Content)**

#### `POST /projects/{id}/jd`
Uploads a Job Description. Accept raw text or file uploads (multipart).
*   **Action:** Stores raw text, updates project status to `auditing`, and queues a Celery JD audit task.
*   **Response (202 Accepted):**
    ```json
    {
      "job_id": "18f9c063-e380-4cf8-8c10-2f778ea23f99"
    }
    ```

#### `GET /projects/{id}/jd/status`
Returns status of the JD audit task.
*   **Response (200 OK):**
    ```json
    {
      "status": "completed",
      "result": { "jd_quality_score": 85, "jd_quality_flags": [] }
    }
    ```

---

### 2. Candidates Routes (`routes/candidates.py`)

#### `POST /candidates/bulk-upload`
Uploads candidate resumes. Accepts `multipart/form-data` with key `files` (up to 500 files) and `project_id`.
*   **Validation:** Rejects files exceeding 10MB or having non-PDF/DOCX mime types.
*   **Response (202 Accepted):**
    ```json
    {
      "batch_id": "aa47343e-c6c7-45bf-97c7-6e6b528a2a22",
      "candidates": [
        { "candidate_id": "8f89ea34-d021-4f9e-b9b5-7798da2b3a1a", "filename": "resume_john.pdf" }
      ]
    }
    ```

#### `GET /candidates?project_id={id}`
Lists candidates within a project.
*   **Sorting:** `final_score DESC` for completed analyses, then `created_at` for pending candidates.
*   **Response (200 OK):**
    ```json
    [
      {
        "id": "8f89ea34-d021-4f9e-b9b5-7798da2b3a1a",
        "name": "John Doe",
        "final_score": 88,
        "analysis_status": "complete",
        "trajectory_label": "Accelerating"
      }
    ]
    ```

#### `GET /candidates/{id}`
Returns the comprehensive evaluation details for a candidate.
*   **Response (200 OK):** Returns all candidate database fields including parsed resume text, 5 scores, flag list, and interview questions.

#### `POST /candidates/{id}/retry`
Re-queues a candidate whose parsing or analysis task failed.
*   **Response (202 Accepted):** returns a new task `job_id`.

---

### 3. Analysis Orchestration Routes (`routes/analysis.py`)

#### `POST /analysis/start`
Triggers bulk analysis.
*   **Request Body:**
    ```json
    {
      "project_id": "7ca64b85-d6d7-463b-9a84-18ef55711200",
      "candidate_ids": ["8f89ea34-d021-4f9e-b9b5-7798da2b3a1a"] // Optional. Analyzes all if empty.
    }
    ```
*   **Response (202 Accepted):**
    ```json
    {
      "job_ids": ["42ab77f3-e5e7-494c-83b6-9bb8346a0aa1"]
    }
    ```

#### `GET /analysis/job/{job_id}`
Checks the execution status of a background job.
*   **Response (200 OK):**
    ```json
    {
      "job_id": "42ab77f3-e5e7-494c-83b6-9bb8346a0aa1",
      "status": "running",
      "progress_percentage": 45
    }
    ```

---

### 4. Pool Reports & Export Routes (`routes/pool.py` / `routes/export.py`)

#### `GET /pool?project_id={id}`
Retrieves synthesized metrics for a candidate pool.
*   **Response Codes:**
    *   `200 OK`: Returns the JSON pool health report.
    *   `404 Not Found`: Returns `{"code": "POOL_NOT_READY", "message": "Pool report not yet generated — analysis in progress"}`.

#### `GET /export?project_id={id}`
Generates a downloadable CSV summary of candidate analysis outputs.
*   **Response (200 OK):** File response stream with headers `Content-Disposition: attachment; filename=project_id_export.csv`.

---

### 5. API Key BYOK Routes (`routes/api_keys.py`)

#### `GET /api-keys`
Lists stored API keys.
*   **Response (200 OK):** Returns keys list. Plaintext keys are stripped; values are replaced with masked displays.
    ```json
    [
      { "id": "01af3340-9a3b-4170-b1ff-0d29abcb2ea1", "provider": "gemini", "label": "Dev Team Key", "is_default": true, "key_masked": "••••••••••••••••39f2" }
    ]
    ```

#### `POST /api-keys`
Registers a new API key. Encrypts the key payload before database persistence.
*   **Request Body:**
    ```json
    {
      "provider": "gemini",
      "model": "gemini-1.5-pro",
      "key": "AIzaSyD-...",
      "label": "Production Key"
    }
    ```
*   **Response (210 Created):** Returns key ID.

#### `POST /api-keys/{id}/validate`
Makes a lightweight 1-token query to the target provider to verify credentials.
*   **Response (200 OK):** `{"valid": true}` or `{"valid": false, "reason": "API_EXHAUSTED"}`.

#### `DELETE /api-keys/{id}`
Hard deletes a key.
*   **Response (204 No Content)**
