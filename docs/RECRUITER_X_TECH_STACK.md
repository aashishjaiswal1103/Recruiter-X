# RECRUITER-X
## Technology Stack — v1.0
### Engineering Decisions for Production at Scale

---

> **Stack thesis.**
> Every decision in this document is justified against three constraints: (1) build speed for the PoC, (2) production-grade architecture for 10k analyses/day, (3) zero compromise on security for hiring data. Where a choice optimises for speed now but requires migration later, the migration path is documented.

---

## TABLE OF CONTENTS

1. Architecture Overview
2. Frontend Stack
3. Backend Stack
4. AI / LLM Layer & BYOK System
5. Data Layer
6. Queue & Background Processing
7. Authentication & Authorisation
8. File Storage & Processing
9. Infrastructure & Hosting
10. Scale Engineering
11. Real-Time Communication
12. Security Engineering
13. Monitoring & Observability
14. DevOps & CI/CD
15. Dependency Matrix
16. Migration & Evolution Paths

---

## 1. ARCHITECTURE OVERVIEW

### 1.1 System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│  CLIENT LAYER                                                        │
│  Next.js 14 (App Router) — Vercel Edge Network                      │
│  React Query (server state) + Zustand (client state)                │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ HTTPS / WebSocket
┌──────────────────────────────▼───────────────────────────────────────┐
│  API GATEWAY                                                         │
│  FastAPI (Python 3.11) — Railway / Render                           │
│  Rate limiting (slowapi) + Auth middleware + Request validation      │
└────────────┬─────────────────┬────────────────────────────────────────┘
             │                 │
┌────────────▼──────┐  ┌──────▼──────────────────────────────────────┐
│  TASK QUEUE       │  │  SUPABASE PLATFORM                          │
│  Redis (Upstash)  │  │  ├── PostgreSQL (primary DB + pgvector)     │
│  Celery Workers   │  │  ├── Auth (GoTrue)                          │
│  (Railway)        │  │  ├── Storage (resume files)                 │
└────────────┬──────┘  │  └── Realtime (WebSocket broadcast)         │
             │         └──────────────────────────────────────────────┘
┌────────────▼──────────────────────────────────────────────────────────┐
│  LLM PROVIDERS (External — via user BYOK keys)                      │
│  ├── Google Gemini API (gemini-1.5-pro, gemini-1.5-flash)           │
│  ├── Anthropic Claude API (claude-opus-4-6, claude-sonnet-4-6)      │
│  └── OpenAI API (gpt-4o, gpt-4o-mini)                               │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Principles

**Principle 1 — Async by default.**
No blocking LLM calls in the API request cycle. Every analysis job is queued. The API returns a job ID immediately. The client polls or receives WebSocket updates for progress.

**Principle 2 — Tenant isolation at the database level.**
Row-Level Security on every table. `org_id` is not just an application-layer filter — it is a database enforced constraint. A compromised application layer cannot access another organisation's data.

**Principle 3 — BYOK = zero LLM cost at our layer.**
We never call LLM APIs from Recruiter-X's own API keys. All LLM calls use the user's key, decrypted at runtime, used for the call duration, and discarded. Our infrastructure cost scales only with compute, not LLM tokens.

**Principle 4 — Structured outputs enforced.**
All LLM calls use native JSON mode (Gemini `response_mime_type: application/json`, Anthropic structured output). We never parse free-form LLM text with regex. If an LLM call does not return valid JSON, the job fails with a clear error — not a silent data corruption.

**Principle 5 — Log everything from day one.**
Every LLM input and output, token count, latency, and API key used is logged in the `AnalysisJob` table. This is not a compliance afterthought. This is how we build the validation dataset that proves the scoring hypothesis and enables future fine-tuning.

---

## 2. FRONTEND STACK

### 2.1 Core Framework

**Next.js 14 — App Router**

| Decision | Rationale |
|---|---|
| App Router (not Pages Router) | Server Components reduce client JS bundle, critical for data-dense candidate detail pages |
| Server Components for data fetching | Eliminates client-side loading waterfalls for initial page loads |
| Route Handlers for API calls | Thin BFF layer — proxies requests to FastAPI with auth headers injected server-side |
| Edge Runtime for middleware | Auth checking at the edge, < 5ms overhead |

### 2.2 State Management

**React Query (TanStack Query) v5 — Server state**
- All server data (projects, candidates, analysis results) managed via React Query
- Automatic background refetch every 30 seconds for active analysis jobs
- Optimistic updates for status changes
- Infinite scroll for candidate lists (pagination via React Query's `useInfiniteQuery`)

**Zustand — Client state**
- UI state: sidebar open/close, active filters, weight slider positions, modal open states
- No server state in Zustand (this separation is strict)
- Persisted to `localStorage` only for: sidebar collapse preference, last selected model

**Why not Redux?** — Overcomplicated for this data model. React Query handles 90% of what Redux was solving. Zustand handles the rest in 50 lines.

### 2.3 UI Component Libraries

**shadcn/ui** — Unstyled, composable components as starting points
- Used for: Dialog, Select, Dropdown, Tooltip, Toast (Sonner)
- Every component restyled to match the design system (not using shadcn defaults)
- Components installed locally (not imported from npm) — we own the code

**Lucide React** — Icon system (already in design spec)
**Recharts** — Score distribution histograms on Pool Intelligence page
**React Dropzone** — Bulk resume upload drag-and-drop
**Sonner** — Toast notifications (lightweight, no Radix dependency)

### 2.4 Styling

**Tailwind CSS v3** — Utility-first, with design tokens configured in `tailwind.config.js`
```javascript
// tailwind.config.js (partial)
theme: {
  extend: {
    colors: {
      electric:  '#0000FF',
      navy:      '#000022',
      cream:     '#FFF5EC',
      peach:     '#FCE9D7',
      ink:       '#1A1A1A',
      graphite:  '#4A4A4A',
      slate:     '#8C8C8C',
      rule:      '#E5E5E5',
    },
    fontFamily: {
      display: ['Syncopate', 'sans-serif'],
      mono:    ['Space Mono', 'monospace'],
      data:    ['JetBrains Mono', 'monospace'],
    },
  }
}
```

**CSS Modules** — For complex component animations (scanner shimmer, progress bars) where Tailwind classes become verbose.

### 2.5 Data Fetching Pattern

```typescript
// Standard pattern: React Query + Supabase client on server side

// Server Component (data fetching)
async function CandidateList({ projectId }: { projectId: string }) {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase
    .from('candidates')
    .select('*')
    .eq('project_id', projectId)
    .order('final_score', { ascending: false });
  return <CandidateListClient initialData={data} projectId={projectId} />;
}

// Client Component (interaction + real-time updates)
function CandidateListClient({ initialData, projectId }) {
  const { data: candidates } = useQuery({
    queryKey: ['candidates', projectId],
    queryFn: () => fetchCandidates(projectId),
    initialData,
    refetchInterval: (data) => 
      data?.some(c => c.analysis_status === 'analyzing') ? 3000 : false,
  });
}
```

### 2.6 Form Handling

**React Hook Form + Zod** — All forms validated client-side with Zod schemas before submission. This catches:
- API key format validation (prefix checks per provider)
- File type validation before upload
- JD minimum length requirements

---

## 3. BACKEND STACK

### 3.1 Core Framework

**FastAPI (Python 3.11)**

| Decision | Rationale |
|---|---|
| FastAPI over Django REST | Async-native, faster iteration, perfect for LLM orchestration patterns |
| Python 3.11+ | Significant performance improvements, `tomllib` standard lib, better typing |
| Pydantic v2 | 5–50× faster validation than v1, native JSON serialisation |
| Uvicorn + Gunicorn | Uvicorn for async event loop, Gunicorn for process management |

### 3.2 API Structure

```
/api/v1/
  /auth/
    POST /login
    POST /signup
    POST /logout
    POST /refresh
  /orgs/
    GET /me
    PATCH /me
    GET /me/api-keys
    POST /me/api-keys
    PUT /me/api-keys/:id
    DELETE /me/api-keys/:id
    POST /me/api-keys/:id/validate
  /projects/
    GET /
    POST /
    GET /:id
    PATCH /:id
    DELETE /:id
    POST /:id/jd
    GET /:id/jd/status
  /candidates/
    POST /bulk-upload (project_id in body)
    GET /?project_id=:id
    GET /:id
    POST /:id/retry
  /analysis/
    POST /start (project_id, candidate_ids[])
    GET /job/:job_id
  /pool/
    GET /?project_id=:id
  /export/
    GET /?project_id=:id (returns CSV)
  /webhooks/ (Phase 2)
    GET /
    POST /
    DELETE /:id
```

### 3.3 Middleware Stack (Request Pipeline)

```python
# Order matters:
app.add_middleware(CORSMiddleware, ...)
app.add_middleware(RateLimitMiddleware, ...)   # slowapi
app.add_middleware(RequestLoggingMiddleware)    # custom
app.add_middleware(AuthMiddleware)             # JWT validation
app.add_middleware(OrgContextMiddleware)       # attaches org_id to request state
```

### 3.4 LLM Orchestration Layer

A dedicated service module handles all LLM interactions:

```
backend/
  services/
    llm/
      __init__.py
      router.py           — routes to correct provider based on org API key
      providers/
        gemini.py         — Google Generative AI SDK
        anthropic.py      — Anthropic SDK
        openai.py         — OpenAI SDK
      prompts/
        jd_audit.py       — JD Audit prompt + schema
        ghost_candidate.py
        trajectory.py
        behaviour.py
        credibility.py
        insider_signal.py
        interrogation.py
        pool_health.py
      schemas/            — Pydantic models for all LLM output shapes
```

### 3.5 Resume Processing

```python
# Extraction pipeline (per file)
def extract_text(file: UploadFile) -> str:
    if file.content_type == "application/pdf":
        return extract_pdf(file)      # pdfplumber primary
    elif file.content_type == "application/docx":
        return extract_docx(file)     # python-docx
    else:
        raise UnsupportedFormatError(file.content_type)

def extract_pdf(file) -> str:
    with pdfplumber.open(file) as pdf:
        text = "\n".join(page.extract_text() or "" for page in pdf.pages)
    if len(text.strip()) < 100:  # Likely scanned PDF
        return pytesseract.image_to_string(pdf_to_images(file))
    return text
```

---

## 4. AI / LLM LAYER & BYOK SYSTEM

### 4.1 BYOK Key Management Service

```python
# services/api_key_manager.py

import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF

class APIKeyManager:
    
    def __init__(self, master_secret: bytes):
        self.master_secret = master_secret  # From environment variable, never hardcoded
    
    def derive_org_key(self, org_id: str) -> bytes:
        """Derive a unique encryption key per organisation."""
        hkdf = HKDF(algorithm=hashes.SHA256(), length=32, salt=None,
                    info=org_id.encode())
        return hkdf.derive(self.master_secret)
    
    def encrypt(self, plaintext: str, org_id: str) -> str:
        key = self.derive_org_key(org_id)
        aesgcm = AESGCM(key)
        nonce = os.urandom(12)
        ciphertext = aesgcm.encrypt(nonce, plaintext.encode(), None)
        return base64.b64encode(nonce + ciphertext).decode()
    
    def decrypt(self, encrypted: str, org_id: str) -> str:
        key = self.derive_org_key(org_id)
        aesgcm = AESGCM(key)
        data = base64.b64decode(encrypted.encode())
        nonce, ciphertext = data[:12], data[12:]
        return aesgcm.decrypt(nonce, ciphertext, None).decode()
    
    def get_decrypted_key(self, api_key_id: str, org_id: str) -> str:
        """Decrypt key at runtime only. Never cached."""
        record = db.fetch_api_key(api_key_id, org_id)  # RLS enforced
        return self.decrypt(record.encrypted_key, org_id)
```

### 4.2 LLM Router

```python
# services/llm/router.py

class LLMRouter:
    
    def __init__(self, api_key: str, provider: str, model: str):
        self.provider = provider
        self.model = model
        self.client = self._init_client(api_key, provider)
    
    def _init_client(self, api_key: str, provider: str):
        match provider:
            case "gemini":  return GeminiClient(api_key)
            case "claude":  return AnthropicClient(api_key)
            case "openai":  return OpenAIClient(api_key)
    
    async def complete(
        self,
        system: str,
        user: str,
        schema: type[BaseModel],
        temperature: float = 0.1,
    ) -> BaseModel:
        """
        Single interface for all providers.
        Returns validated Pydantic model.
        Raises LLMError on failure.
        """
        raw = await self.client.complete(
            system=system,
            user=user,
            model=self.model,
            temperature=temperature,
            response_format="json",  # Provider-specific implementation
        )
        return schema.model_validate_json(raw)
```

### 4.3 Prompt Engineering Standards

All prompts follow this structure:

```python
SYSTEM = """
You are a senior technical recruiter and hiring intelligence system.
Your role is to analyse candidate data and produce structured assessments.

CRITICAL RULES:
1. Output ONLY valid JSON matching the schema provided. No preamble. No markdown. No explanation.
2. Your output is a RECOMMENDATION tool for human recruiters. It never constitutes a hiring decision.
3. Be specific and evidence-based. Every claim in your output must reference specific content from the resume.
4. Calibrate assessments against the seniority level implied by the role, not just stated.

OUTPUT SCHEMA:
{schema}
"""

USER = """
JOB CONTEXT:
{jd_structured}

CANDIDATE RESUME:
{resume_text}

GHOST CANDIDATE BENCHMARK:
{ghost_profile}

Produce the {analysis_type} assessment.
"""
```

**Temperature policy:**
- JD Audit: 0.1 (deterministic — same JD should produce same audit)
- Ghost Generation: 0.2 (some creativity needed)
- Trajectory / Credibility: 0.05 (maximum consistency)
- Interrogation Questions: 0.3 (benefit from variation per candidate)
- Pool Health: 0.1

### 4.4 Structured Output Enforcement

```python
# Per-provider JSON enforcement:

# Gemini
generation_config = {
    "response_mime_type": "application/json",
    "response_schema": schema_to_gemini_format(PydanticModel),
}

# Anthropic
response = client.messages.create(
    ...,
    tools=[{"name": "output", "input_schema": model.schema()}],
    tool_choice={"type": "tool", "name": "output"},
)
result = PydanticModel(**response.content[0].input)

# OpenAI
response = client.beta.chat.completions.parse(
    ...,
    response_format=PydanticModel,
)
result = response.choices[0].message.parsed
```

### 4.5 Token Budget Management

Each analysis task has a defined token budget to prevent runaway costs:

| Task | Max Input Tokens | Max Output Tokens | Typical Cost (Gemini 1.5 Pro) |
|---|---|---|---|
| JD Audit | 4,000 | 2,000 | $0.012 |
| Ghost Generation | 6,000 | 3,000 | $0.021 |
| Resume Parsing | 8,000 | 2,000 | $0.022 |
| Trajectory Analysis | 10,000 | 1,500 | $0.025 |
| Behaviour Analysis | 10,000 | 1,500 | $0.025 |
| Credibility Audit | 10,000 | 1,500 | $0.025 |
| Insider Signal | 12,000 | 2,000 | $0.032 |
| Interrogation Gen | 10,000 | 1,500 | $0.025 |
| **Total per candidate** | — | — | **~$0.09–$0.15** |

Cost shown in UI before run. Users control their spend.

### 4.6 Retry Logic

```python
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=30),
    retry=retry_if_exception_type((RateLimitError, APITimeoutError)),
    reraise=True,
)
async def resilient_llm_call(router: LLMRouter, **kwargs):
    return await router.complete(**kwargs)
```

Non-retryable errors (authentication failure, invalid API key): fail immediately, surface to user.

---

## 5. DATA LAYER

### 5.1 Primary Database — Supabase (PostgreSQL)

**Why Supabase:**
- PostgreSQL (not an abstraction — it's real Postgres)
- pgvector extension for future semantic search
- Row-Level Security enforced at DB level
- Auth, Storage, Realtime all native — reduces integration complexity significantly
- Generous free tier → easy migration to paid at scale

### 5.2 Key Tables

```sql
-- Core tables (abbreviated schema)

CREATE TABLE organisations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  plan        TEXT DEFAULT 'free',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE api_keys (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID REFERENCES organisations(id) ON DELETE CASCADE,
  provider        TEXT NOT NULL,  -- 'gemini' | 'claude' | 'openai'
  model           TEXT NOT NULL,
  encrypted_key   TEXT NOT NULL,  -- AES-256-GCM encrypted
  label           TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  is_default      BOOLEAN DEFAULT FALSE,
  last_validated  TIMESTAMPTZ,
  last_used_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE projects (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id              UUID REFERENCES organisations(id),
  title               TEXT NOT NULL,
  role                TEXT,
  department          TEXT,
  seniority           TEXT,
  jd_raw_text         TEXT,
  jd_structured       JSONB,
  ghost_candidate     JSONB,
  status              TEXT DEFAULT 'created',
  created_by          UUID REFERENCES auth.users(id),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE candidates (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id            UUID REFERENCES projects(id),
  org_id                UUID REFERENCES organisations(id),
  name                  TEXT,
  email                 TEXT,
  resume_file_url       TEXT,
  resume_raw_text       TEXT,
  resume_parsed         JSONB,
  trajectory_score      NUMERIC(5,2),
  behaviour_score       NUMERIC(5,2),
  ghost_score           NUMERIC(5,2),
  insider_score         NUMERIC(5,2),
  credibility_score     NUMERIC(5,2),
  final_score           NUMERIC(5,2),
  rank                  INTEGER,
  trajectory_label      TEXT,
  red_flags             JSONB,
  interrogation_qs      JSONB,
  insider_signals       JSONB,
  narrative             TEXT,
  analysis_status       TEXT DEFAULT 'pending',
  analysis_started_at   TIMESTAMPTZ,
  analysis_completed_at TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE analysis_jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id    UUID REFERENCES candidates(id),
  org_id          UUID REFERENCES organisations(id),
  job_type        TEXT,   -- 'parse' | 'trajectory' | 'behaviour' | 'credibility' etc.
  status          TEXT DEFAULT 'queued',
  api_key_id      UUID REFERENCES api_keys(id),
  tokens_input    INTEGER,
  tokens_output   INTEGER,
  cost_usd        NUMERIC(10,6),
  latency_ms      INTEGER,
  error_message   TEXT,
  queued_at       TIMESTAMPTZ DEFAULT NOW(),
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ
);

CREATE TABLE audit_logs (
  id              BIGSERIAL PRIMARY KEY,
  org_id          UUID REFERENCES organisations(id),
  user_id         UUID REFERENCES auth.users(id),
  action          TEXT NOT NULL,
  resource_type   TEXT,
  resource_id     UUID,
  ip_address_hash TEXT,
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 5.3 Row-Level Security Policies

```sql
-- All tables follow this pattern:

-- Enable RLS
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Org isolation policy
CREATE POLICY "org_isolation" ON candidates
  USING (org_id = (
    SELECT org_id FROM org_members
    WHERE user_id = auth.uid()
    LIMIT 1
  ));

-- Admin-only write policy
CREATE POLICY "admin_write" ON api_keys
  FOR INSERT, UPDATE, DELETE
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE user_id = auth.uid()
      AND org_id = api_keys.org_id
      AND role IN ('owner', 'admin')
    )
  );
```

### 5.4 Indexing Strategy

```sql
-- Performance-critical indexes

-- Candidate ranking queries (most frequent)
CREATE INDEX idx_candidates_project_score
  ON candidates(project_id, final_score DESC NULLS LAST)
  WHERE analysis_status = 'complete';

-- Analysis job queue polling
CREATE INDEX idx_analysis_jobs_status
  ON analysis_jobs(status, queued_at ASC)
  WHERE status IN ('queued', 'retrying');

-- Audit log queries by org
CREATE INDEX idx_audit_logs_org_time
  ON audit_logs(org_id, created_at DESC);

-- API key lookup
CREATE INDEX idx_api_keys_org_active
  ON api_keys(org_id, is_active, is_default);
```

### 5.5 pgvector (Phase 2)

```sql
-- Enable when implementing semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Future: store resume embeddings for semantic candidate search
ALTER TABLE candidates ADD COLUMN resume_embedding vector(1536);

CREATE INDEX idx_candidates_embedding
  ON candidates USING ivfflat (resume_embedding vector_cosine_ops)
  WITH (lists = 100);
```

---

## 6. QUEUE & BACKGROUND PROCESSING

### 6.1 Technology Choice

**Celery + Redis (Upstash Redis)**

| Alternative | Rejected Because |
|---|---|
| Celery + RabbitMQ | More complex ops, overkill for initial scale |
| Bull (Node.js) | Would split processing into a separate Node service |
| Temporal | Powerful but heavy — migration path when complexity warrants |
| Redis Queues only | Need Celery's retry logic, priority queues, and monitoring |

Upstash Redis: serverless Redis, scales to 10k+ connections, persistent, globally replicated. Eliminates Redis ops burden.

### 6.2 Worker Architecture

```python
# celery_app.py
from celery import Celery

app = Celery(
    'recruiter_x',
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

app.conf.update(
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
    task_acks_late=True,           # Job only removed from queue on success
    task_reject_on_worker_lost=True,  # Re-queue if worker crashes mid-job
    task_track_started=True,
    result_expires=3600,           # Job results kept 1 hour
    
    # Priority queues
    task_queues={
        'parse':    {'exchange': 'parse',    'routing_key': 'parse'},
        'analyze':  {'exchange': 'analyze',  'routing_key': 'analyze'},
        'report':   {'exchange': 'report',   'routing_key': 'report'},
        'priority': {'exchange': 'priority', 'routing_key': 'priority'},
    },
    task_default_queue='analyze',
    
    # Rate limiting (applies per worker, not globally)
    task_annotations={
        'tasks.analyze_candidate': {'rate_limit': '30/m'},
    },
)
```

### 6.3 Task Definitions

```python
# tasks/analysis.py

@app.task(
    bind=True,
    max_retries=3,
    default_retry_delay=30,
    queue='analyze',
)
def analyze_candidate_task(self, candidate_id: str, org_id: str):
    try:
        # 1. Fetch candidate + project + API key
        candidate = db.get_candidate(candidate_id, org_id)
        api_key = key_manager.get_decrypted_key(candidate.project.api_key_id, org_id)
        
        # 2. Run parallel analysis (using asyncio.gather inside sync task)
        results = asyncio.run(
            asyncio.gather(
                run_trajectory_analysis(candidate, api_key),
                run_behaviour_analysis(candidate, api_key),
                run_credibility_audit(candidate, api_key),
                return_exceptions=True,
            )
        )
        
        # 3. Sequential steps (each depends on previous)
        insider = asyncio.run(run_insider_analysis(candidate, api_key, results))
        ghost_match = asyncio.run(run_ghost_matching(candidate, api_key, results))
        
        # 4. Score fusion
        final_score = calculate_final_score(results, insider, ghost_match)
        
        # 5. Generate interview questions
        questions = asyncio.run(generate_questions(candidate, api_key, results))
        
        # 6. Persist all results
        db.save_analysis_results(candidate_id, final_score, questions, results)
        
        # 7. Trigger pool health recalculation if all candidates done
        check_and_trigger_pool_health(candidate.project_id, org_id)
        
    except (RateLimitError, APITimeoutError) as exc:
        raise self.retry(exc=exc, countdown=60 * (self.request.retries + 1))
    
    except APIAuthError as exc:
        # Don't retry auth errors — notify user immediately
        db.update_candidate_status(candidate_id, 'failed', str(exc))
        notify_org_api_key_failure(org_id, api_key_id)
        raise
```

### 6.4 Scale Target Validation

10,000 analyses/day = ~417/hour = ~7/minute

With parallel analysis (3 LLM calls per candidate running simultaneously), each candidate takes ~45 seconds wall clock time.

**Required workers to sustain 7/min throughput:**
- At 45s per candidate, each worker handles ~1.3 candidates/minute
- 7/minute ÷ 1.3 = **6 workers minimum**
- With headroom for bursts: **10–12 workers at peak**

Railway allows auto-scaling of Celery workers. Worker count configured as an env variable, bumped dynamically.

---

## 7. AUTHENTICATION & AUTHORISATION

### 7.1 Supabase Auth (GoTrue)

```typescript
// Client-side auth setup
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// OAuth: Google
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${origin}/auth/callback` },
})

// Magic link
const { error } = await supabase.auth.signInWithOtp({ email })
```

### 7.2 JWT Validation (Backend)

```python
# middleware/auth.py
from supabase import create_client
from jose import jwt, JWTError

async def validate_jwt(token: str, request: Request) -> dict:
    try:
        payload = jwt.decode(
            token,
            key=settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        request.state.user_id = payload["sub"]
        request.state.org_id = await get_user_org_id(payload["sub"])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### 7.3 Role-Based Access Control

```python
# Decorator-based RBAC
def require_role(*roles: str):
    async def dependency(request: Request):
        member = await get_org_member(request.state.user_id, request.state.org_id)
        if member.role not in roles:
            raise HTTPException(403, "Insufficient permissions")
    return Depends(dependency)

# Usage
@router.post("/api-keys")
async def add_api_key(
    _: None = require_role("owner", "admin"),
    ...
):
```

---

## 8. FILE STORAGE & PROCESSING

### 8.1 Supabase Storage

```
Bucket structure:
  resumes/
    {org_id}/
      {project_id}/
        {candidate_id}/
          original.pdf    (original upload)
          extracted.txt   (extracted text — stored for audit)
```

**Access policy:** Private bucket. Files only accessible via signed URLs (1-hour expiry) generated server-side. No public file access.

**Upload flow:**
1. Client requests presigned upload URL from FastAPI
2. FastAPI validates auth, generates Supabase presigned URL, returns it
3. Client uploads directly to Supabase Storage (bypasses FastAPI — reduces our bandwidth cost)
4. Client notifies FastAPI of upload completion
5. FastAPI queues extraction task

### 8.2 Extraction Pipeline

```python
# services/extraction.py

async def extract_and_store(candidate_id: str, file_url: str) -> str:
    # Download from Supabase Storage (server-side)
    file_bytes = await storage.download(file_url)
    content_type = detect_mime_type(file_bytes)
    
    # Extract text
    if content_type == "application/pdf":
        text = extract_pdf_text(file_bytes)
        if is_likely_scanned(text):
            text = await ocr_pdf(file_bytes)  # pytesseract fallback
    elif content_type == "application/docx":
        text = extract_docx_text(file_bytes)
    else:
        raise ExtractionError(f"Unsupported format: {content_type}")
    
    # Store extracted text alongside original
    await storage.upload(
        path=f"resumes/{org_id}/{project_id}/{candidate_id}/extracted.txt",
        data=text.encode(),
        content_type="text/plain",
    )
    
    return text
```

---

## 9. INFRASTRUCTURE & HOSTING

### 9.1 PoC / Launch Hosting

| Component | Service | Tier | Cost/mo |
|---|---|---|---|
| Frontend | Vercel | Pro | $20 |
| Backend API | Railway | Starter | $20 |
| Celery Workers (×10) | Railway | Starter (10 instances) | $50 |
| Redis Queue | Upstash | Pay-per-use | ~$10–30 |
| Database + Auth + Storage | Supabase | Pro | $25 |
| **Total PoC/Launch** | — | — | **~$125–145/mo** |

This stack handles 1,000 DAU and 10,000 analyses/day comfortably. BYOK means our cost does not scale with LLM usage.

### 9.2 Production Hosting (Scale Phase)

| Component | Service |
|---|---|
| Frontend | Vercel Enterprise or AWS CloudFront + S3 |
| Backend API | AWS ECS Fargate (auto-scaling) |
| Celery Workers | AWS ECS Fargate (auto-scaling, separate service) |
| Redis | AWS ElastiCache for Redis |
| Database | Supabase or AWS RDS PostgreSQL + pgvector |
| File Storage | Supabase Storage or AWS S3 |
| CDN | Cloudflare |
| Secrets | AWS Secrets Manager |

### 9.3 Environment Strategy

```
development  → Local Docker Compose (all services local)
staging      → Railway (mirrors production, separate Supabase project)
production   → Railway / AWS (based on scale reached)
```

**Environment variables required (minimum):**
```
# Backend
SUPABASE_URL
SUPABASE_SERVICE_KEY
SUPABASE_JWT_SECRET
REDIS_URL
MASTER_ENCRYPTION_SECRET   # For BYOK key encryption
ENVIRONMENT

# Frontend
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_API_BASE_URL
```

---

## 10. SCALE ENGINEERING

### 10.1 Rate Limiting Strategy

Three-layer rate limiting:

**Layer 1 — API Gateway (Nginx/Caddy/Railway):**
- 1,000 requests/minute per IP
- Rejects at network level before FastAPI processes

**Layer 2 — FastAPI (slowapi):**
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/analysis/start")
@limiter.limit("20/minute")  # Per org, not per IP
async def start_analysis(request: Request, ...):
```

**Layer 3 — Celery (per-worker task rate limit):**
```python
# 30 LLM calls/minute per worker (prevents single org exhausting all workers)
@app.task(rate_limit='30/m', ...)
```

### 10.2 Caching Strategy

**Redis caching for:**
- JD Audit results: cached for 24 hours by JD hash (same JD → same audit)
- Ghost Candidate: cached indefinitely by JD hash (deterministic at low temperature)
- Organisation plan + API key meta: cached 5 minutes (frequently checked in auth middleware)

**Not cached:**
- Candidate analysis results (each resume is unique)
- Pool Health Report (recalculated when any candidate analysis completes)

### 10.3 Horizontal Scaling Plan

| Threshold | Action |
|---|---|
| > 500 analyses/hour | Add 5 Celery workers |
| > 1,000 analyses/hour | Add dedicated parse worker fleet |
| > 2,000 DAU | Upgrade Supabase to large instance, enable PgBouncer |
| > 5,000 analyses/hour | Migrate to AWS ECS with auto-scaling groups |

---

## 11. REAL-TIME COMMUNICATION

### 11.1 Analysis Progress Updates

**Supabase Realtime (WebSocket):**

```typescript
// Client: subscribe to candidate updates for a project
const channel = supabase
  .channel(`project:${projectId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'candidates',
    filter: `project_id=eq.${projectId}`,
  }, (payload) => {
    queryClient.setQueryData(
      ['candidates', projectId],
      (old) => updateCandidateInList(old, payload.new)
    );
  })
  .subscribe();
```

**Backend: triggers Supabase Realtime via direct DB update:**
When a Celery worker updates `candidates.analysis_status`, Supabase Realtime broadcasts the change to all subscribed clients automatically (via PostgreSQL triggers). No WebSocket server required.

### 11.2 Fallback: Polling

For environments where WebSocket is blocked, React Query polls every 3 seconds while any candidate is in `analyzing` state. Reverts to 30-second refresh when all complete.

---

## 12. SECURITY ENGINEERING

### 12.1 API Key Security Checklist

- [ ] Keys encrypted with AES-256-GCM before storage
- [ ] Org-specific key derivation (compromise of one org's key ≠ all orgs)
- [ ] Keys never appear in application logs (log masking middleware)
- [ ] Keys never returned in API responses (only masked display: `••••3891`)
- [ ] Keys decrypted in memory only for duration of LLM call
- [ ] Key validation uses single test token — minimal exposure
- [ ] Deleted keys immediately revoked (no grace period)
- [ ] Key usage logged per call (api_key_id in AnalysisJob)

### 12.2 Resume Data Security

- [ ] Resumes stored in private Supabase Storage bucket
- [ ] File access via signed URLs (1-hour expiry, no public access)
- [ ] Extracted text stored separately for audit compliance
- [ ] RLS ensures org isolation at storage policy level
- [ ] Resume text never logged in application logs
- [ ] Data deletion: cascade delete on candidate removes file from Storage

### 12.3 General Security

- [ ] All HTTP traffic: TLS 1.3 minimum
- [ ] HTTP Strict Transport Security header (HSTS)
- [ ] Content Security Policy headers on Next.js
- [ ] CORS: strict allowlist (no wildcard)
- [ ] SQL injection: impossible (Supabase parameterised queries, no raw SQL in application)
- [ ] XSS: Next.js default escaping + CSP
- [ ] Dependency scanning: GitHub Dependabot + npm audit in CI
- [ ] Secret scanning: GitHub secret scanning enabled on repo

---

## 13. MONITORING & OBSERVABILITY

### 13.1 Application Monitoring

**Sentry** (errors + performance):
- Frontend: `@sentry/nextjs` — all uncaught errors + Core Web Vitals
- Backend: `sentry-sdk` — all unhandled exceptions + slow route traces
- Celery: Sentry Celery integration — failed tasks surfaced with full context

**Custom metrics (logged to `analysis_jobs` table, queryable):**
- LLM call latency per provider per model
- Token usage per task type
- Error rate per provider
- Queue depth over time

### 13.2 Infrastructure Monitoring

- Railway built-in metrics: CPU, memory, network per service
- Upstash Redis: queue depth, connection count, memory
- Supabase: query performance, connection pool usage, storage used

### 13.3 Alerting

| Alert | Threshold | Channel |
|---|---|---|
| Analysis failure rate | > 5% in 10 minutes | Slack #alerts |
| Queue depth | > 500 jobs | Slack #alerts |
| API error rate (5xx) | > 1% | PagerDuty (production) |
| API key health failures | Any | Email to org admin + Slack |
| Celery worker down | Any worker offline | Slack #alerts |

### 13.4 Business Metrics Dashboard

Metabase connected to Supabase read replica:
- DAU / WAU / MAU
- Analyses run per day (trend)
- Provider distribution (Gemini vs Claude vs OpenAI)
- Average analysis time
- Shortlist quality (candidates from top-5 who reach final interview — requires outcome input)
- API key error rate by provider

---

## 14. DEVOPS & CI/CD

### 14.1 Repository Structure

```
recruiter-x/
  frontend/          — Next.js 14 app
  backend/           — FastAPI application
  workers/           — Celery task definitions (shared with backend)
  infra/             — Docker Compose, Railway configs
  docs/              — PRD, Design System, Tech Stack
  .github/
    workflows/
      frontend.yml   — Test + deploy on push to main
      backend.yml    — Test + deploy on push to main
      security.yml   — Dependency audit weekly
```

### 14.2 CI/CD Pipeline

```yaml
# .github/workflows/backend.yml (abbreviated)
on: [push]
jobs:
  test:
    steps:
      - run: pip install -r requirements.txt
      - run: pytest tests/ --cov=. --cov-report=xml
      - run: mypy . --strict  # Type checking
      - run: ruff check .     # Linting
  
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: railwayapp/cli-action@v1
        with:
          service: backend
          command: railway deploy
```

### 14.3 Local Development

```yaml
# docker-compose.yml
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    env_file: .env.local
    volumes: ["./backend:/app"]
  
  worker:
    build: ./backend
    command: celery -A celery_app worker --loglevel=info -Q parse,analyze
    depends_on: [redis]
  
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
  
  flower:  # Celery monitoring UI
    image: mher/flower
    ports: ["5555:5555"]
    command: celery flower --broker=redis://redis:6379
```

---

## 15. DEPENDENCY MATRIX

### 15.1 Frontend Dependencies

| Package | Version | Purpose |
|---|---|---|
| next | 14.x | Framework |
| react | 18.x | UI |
| @tanstack/react-query | 5.x | Server state |
| zustand | 4.x | Client state |
| @supabase/supabase-js | 2.x | DB + Auth + Storage |
| @supabase/ssr | latest | Server-side Supabase |
| tailwindcss | 3.x | Styling |
| react-hook-form | 7.x | Form management |
| zod | 3.x | Validation |
| react-dropzone | 14.x | File upload |
| recharts | 2.x | Charts |
| lucide-react | latest | Icons |
| sonner | latest | Toasts |

### 15.2 Backend Dependencies

| Package | Version | Purpose |
|---|---|---|
| fastapi | 0.111.x | API framework |
| uvicorn | latest | ASGI server |
| pydantic | 2.x | Validation + serialisation |
| supabase | 2.x | DB + Auth client |
| celery | 5.x | Task queue |
| redis | 5.x | Celery broker |
| google-generativeai | latest | Gemini API |
| anthropic | latest | Claude API |
| openai | latest | OpenAI API |
| pdfplumber | latest | PDF text extraction |
| python-docx | latest | DOCX text extraction |
| pytesseract | latest | OCR fallback |
| cryptography | latest | AES-256 encryption |
| slowapi | latest | Rate limiting |
| sentry-sdk | latest | Error tracking |
| python-jose | latest | JWT validation |
| tenacity | latest | LLM retry logic |

---

## 16. MIGRATION & EVOLUTION PATHS

| Decision | Current | When to Migrate | Migration Path |
|---|---|---|---|
| Hosting | Railway | > 5k DAU or enterprise SLA | AWS ECS + RDS |
| Queue | Celery + Upstash | > 50k analyses/day | Temporal (workflow orchestration) |
| LLM routing | Direct provider SDKs | Fine-tuned model needed | LiteLLM + custom model endpoint |
| Database | Supabase | > 100GB data or SOC2 req | AWS RDS + separate auth service |
| Search | PostgreSQL LIKE | Semantic candidate search needed | pgvector (already in schema) |
| Real-time | Supabase Realtime | > 10k concurrent connections | Ably or Pusher |
| Auth | Supabase Auth | SAML SSO required | Auth0 or Okta |

---

*Document version: 1.0 | Last updated: June 2026 | Owner: Engineering*
*This document governs all technology decisions. No new dependency is added without updating this document.*
