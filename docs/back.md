# Recruiter-X Backend Documentation Index

Welcome to the backend engineering documentation for **Recruiter-X**—an enterprise-grade AI hiring intelligence platform designed to handle 10,000 candidate evaluations per day. 

To make the codebase easy to build and maintain, the monolithic documentation has been split into 14 highly structured, modular files inside the [docs/back/](file:///d:/2026/college%20pro/hack/docs/back/) folder. Use the index below to navigate the guides:

---

## Documentation Index

### 1. [01. Architecture & Tech Stack](file:///d:/2026/college%20pro/hack/docs/back/01_architecture_and_tech_stack.md)
*   High-level separation of concerns between Core Backend (infrastructure) and the LLM Layer.
*   Mermaid diagram detailing the flow of data between FastAPI, Celery, Supabase, and LLM Providers.
*   Tech stack table and exact project file/directory mapping layout.

### 2. [02. Supabase Database Schema & RLS](file:///d:/2026/college%20pro/hack/docs/back/02_database_schema_and_rls.md)
*   Complete SQL DDL commands for tables: `organisations`, `org_members`, `api_keys`, `projects`, `candidates`, `analysis_jobs`, and `audit_logs`.
*   Index definitions optimized for candidate rankings, queue lookups, and audit trails.
*   Row Level Security (RLS) setup scripts and Role-Based Access Control (RBAC) database functions.

### 3. [03. Authentication & Middleware](file:///d:/2026/college%20pro/hack/docs/back/03_auth_and_middleware.md)
*   JWT token extraction and verification sequence using Supabase Auth JWT secrets.
*   Organization context middleware injecting tenant scopes (`org_id` and role permissions) on incoming requests.
*   FastAPI dependency helper definitions for securing route roles (`require_role`).

### 4. [04. API Key Manager & Cryptography](file:///d:/2026/college%20pro/hack/docs/back/04_api_key_manager.md)
*   Unique client key derivation via HKDF.
*   Symmetric encryption and decryption using AES-256-GCM.
*   Display masking functions and zero-retention/no-logging security practices.

### 5. [05. Resume Ingestion Pipeline](file:///d:/2026/college%20pro/hack/docs/back/05_resume_ingestion_pipeline.md)
*   Validation of PDF/DOCX file formats under 10MB bounds.
*   Dual-mode PDF extractor using `pdfplumber` with fallback to `pytesseract` OCR for scanned images.
*   Signed URL generation rules for Supabase Storage buckets.

### 6. [06. Celery Worker Architecture & Task Queues](file:///d:/2026/college%20pro/hack/docs/back/06_celery_worker_architecture.md)
*   Queuing structures separating parse, analyze, and report workloads.
*   Reliability configurations: late task acknowledgements, worker failure re-queuing, result caching limits.
*   Multi-stage candidate evaluation task pipelines, retry configurations, and exponential backoff bounds.

### 7. [07. Score Fusion & Ranking Engine](file:///d:/2026/college%20pro/hack/docs/back/07_score_fusion_and_ranker.md)
*   Score calculation formula combining the 5 core AI dimensions.
*   High, medium, and low flag severity deduction weights and penalty caps.
*   Sliders presets definitions (`founding_engineer`, `senior_ic`, `compliance_risk`, `growth_hire`).
*   Diversity-pass reshuffling algorithm rules.

### 8. [08. API Routes & Controller Specifications](file:///d:/2026/college%20pro/hack/docs/back/08_api_routes.md)
*   Full HTTP method, path, request bodies, and success response mappings.
*   Controller definitions for Projects, Candidates, Analysis, Pool Metrics, Exports, and API keys.

### 9. [09. Pool Health Aggregator](file:///d:/2026/college%20pro/hack/docs/back/09_pool_health_aggregator.md)
*   Batch analysis check-completion triggers.
*   Aggregated metric JSON schemas: inflation averages, over/under-claimed skill ratios, hidden gems.
*   JD Audit flags correlation warnings.

### 10. [10. LLM Router & Providers](file:///d:/2026/college%20pro/hack/docs/back/10_llm_router_and_providers.md)
*   Provider wrappers for Gemini (native schemas), Anthropic (tools constraints), and OpenAI (beta parser).
*   Unified exception mapping hierarchy.
*   Task-specific temperature rules and proactive token budget bounds checking.

### 11. [11. Pydantic Output Schemas](file:///d:/2026/college%20pro/hack/docs/back/11_pydantic_schemas.md)
*   All 8 structured analysis outputs typed in Python using Pydantic BaseModel specifications.

### 12. [12. LLM Prompt Blueprints](file:///d:/2026/college%20pro/hack/docs/back/12_llm_prompts.md)
*   System prompts, user prompt templates, and evaluation parameters for all 8 analysis stages.

### 13. [13. Security, Logging & Auditing](file:///d:/2026/college%20pro/hack/docs/back/13_security_and_logging.md)
*   Log masking regex filters for API keys.
*   Multi-tenant query constraints for bypass-RLS service clients.
*   Administrative audit log mappings.

### 14. [14. Error Handling, Responses & Definition of Done](file:///d:/2026/college%20pro/hack/docs/back/14_error_handling_and_responses.md)
*   Standard error JSON payload schemas.
*   Global exception middleware handler layouts.
*   Definition of Done criteria (DoD) for signing off the backend.