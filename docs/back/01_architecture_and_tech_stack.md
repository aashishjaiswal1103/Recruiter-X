# 01. Architecture & Tech Stack

This document details the high-level architecture, technology stack, and directory structure for the **Recruiter-X** backend—an enterprise-grade AI hiring intelligence platform designed for 10,000 candidate analyses per day with zero compromise on security.

---

## 1. System Architecture

Recruiter-X takes a job description and a batch of resumes, runs a multi-layered AI analysis on every candidate, benchmarks them against a synthetically constructed ideal candidate (the **Ghost Candidate**), and returns a ranked shortlist with credibility scores, red flags, and tailored interview questions.

The system is separated into two clean layers that communicate via strict boundaries:

```mermaid
graph TD
    subgraph Core Backend Layer
        API[FastAPI Routers]
        DB[(Supabase PostgreSQL)]
        Storage[(Supabase Storage)]
        Queue[Celery + Redis Queue]
        Workers[Celery Workers]
    end

    subgraph LLM Layer
        Router[LLM Router]
        Providers[Gemini / Claude / OpenAI]
        Schemas[Pydantic Validation Schemas]
    end

    API -->|Triggers Tasks| Queue
    Queue -->|Pops Work| Workers
    Workers -->|Queries / Mutates| DB
    Workers -->|Fetches PDF| Storage
    Workers -->|Calls complete()| Router
    Router -->|Sends Prompt| Providers
    Providers -->|Returns JSON| Router
    Router -->|Validates JSON| Schemas
    Router -->|Returns Typed Pydantic Object| Workers
```

### The Separation of Concerns
*   **Core Backend Layer:** Handles all routing, authentication, request lifecycle, file parsing, task queuing, database access, score fusion math, and general infrastructure.
*   **LLM Layer:** Handles prompt construction, LLM client connections, token budgeting, temperature configurations, and structured output parsing/validation.
*   **Communication:** These layers communicate *exclusively* through the `LLMRouter.complete()` method and validated Pydantic schemas. 
    *   No business logic leaks into routes.
    *   No LLM-specific logic (like prompt construction or client handling) leaks into Celery tasks.

---

## 2. Technology Stack

The backend is built using modern, fast, and production-ready Python libraries:

| Component | Technology | Description / Usage |
| :--- | :--- | :--- |
| **Framework** | FastAPI (Python 3.11) | High-performance, asynchronous web framework. |
| **Web Server** | Uvicorn + Gunicorn | ASGI server and process manager for production. |
| **Task Queue** | Celery + Upstash Redis | Asynchronous job processing (resume extraction, LLM analysis). |
| **Database** | Supabase (PostgreSQL) | Data persistence, indexing, and transactional integrity. |
| **Auth** | Supabase GoTrue + python-jose | JWT extraction and verification. |
| **Storage** | Supabase Storage | Secure hosting for candidate resumes (original and parsed). |
| **PDF Extraction** | `pdfplumber` + `pytesseract` OCR | Dual-mode parsing (native text with scanned fallback). |
| **DOCX Extraction**| `python-docx` | Word document text parsing. |
| **Encryption** | AES-256-GCM (`cryptography`) | Encrypting customer LLM API keys at rest. |
| **LLM Clients** | Gemini, Anthropic, OpenAI | Multi-provider orchestration with user-supplied keys. |
| **Retry Logic** | `tenacity` | Declarative retry rules for LLM call resilience. |
| **Rate Limiting** | `slowapi` | Endpoint-level rate limiting (IP & token based). |
| **Error Tracking**| Sentry | Distributed tracing and error logging. |

---

## 3. Project Directory Structure

Ensure the directory structure matches this layout exactly. Do not place business logic outside this tree.

```text
backend/
  main.py                        # FastAPI application entrypoint
  celery_app.py                  # Celery application configuration
  config.py                      # Pydantic BaseSettings config loading
  middleware/
    auth.py                      # JWT decoding and state injection
    org_context.py               # Organization context loading
    rate_limit.py                # Slowapi rate limiting definitions
    logging.py                   # Request logging and API key masking
  routes/
    projects.py                  # Project creation, retrieval, and JD upload
    candidates.py                # Resume upload, status, list, and details
    analysis.py                  # Task triggers and job status checks
    pool.py                      # Pool health aggregator endpoint
    export.py                    # CSV exporter
    api_keys.py                  # BYOK key management (CRUD)
    auth.py                      # Supabase authentication helpers
  services/
    api_key_manager.py           # Keys encryption/decryption (AES-256-GCM)
    resume_extractor.py          # PDF/DOCX and OCR text parsing
    score_fusion.py              # Score calculation, penalties, and presets
    pool_aggregator.py           # Bulk candidate metric synthesis
    supabase_client.py           # Supabase client instantiation
    storage.py                   # Storage wrappers (signed URLs)
  tasks/
    parse.py                     # Celery task for resume file parsing
    analyze.py                   # Celery task for multi-step AI analysis
    report.py                    # Celery task for generating project reports
  llm/
    router.py                    # Provider router and token budget checks
    providers/
      gemini.py                  # Gemini API wrapper (response_schema)
      anthropic.py               # Anthropic API wrapper (tool_choice)
      openai.py                  # OpenAI API wrapper (response_format)
    prompts/
      jd_audit.py                # Prompt templates
      ghost_candidate.py
      trajectory.py
      behaviour.py
      credibility.py
      insider_signal.py
      ghost_comparator.py
      interrogation.py
    schemas/
      jd_audit_schema.py         # Pydantic models for structured outputs
      ghost_candidate_schema.py
      trajectory_schema.py
      behaviour_schema.py
      credibility_schema.py
      insider_signal_schema.py
      ghost_comparison_schema.py
      interrogation_schema.py
  models/
    db_models.py                 # Pydantic validation/DB schema mapping models
  utils/
    errors.py                    # Custom exception hierarchy
    token_budget.py              # Token count estimators
    masking.py                   # Sensitive string regex filters
```
