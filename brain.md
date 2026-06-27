# Recruiter-X Project Memory & Brain

This document is the single source of truth for the project state. It is designed to save context window tokens and prevent AI agents from scanning the entire codebase. **Update this file at the end of every task or conversation.**

---

## 1. PROJECT METADATA & ARCHITECTURE
- **Project Name:** Recruiter-X
- **Goal:** Production-grade hiring intelligence and resume analyzer. Enforces strict async processing, tenant isolation, and a BYOK (Bring Your Own Key) model for LLM APIs.
- **Scale Target:** 10,000 candidate resume analyses per day.

### High-Level Architecture
- **Frontend:** Next.js 14 (App Router) with React Query v5 (server state) and Zustand v4 (client UI state).
- **Backend:** FastAPI (Python 3.11) with Pydantic v2 validation.
- **Workers:** Celery task workers with Redis (Upstash in production, local Redis in docker-compose).
- **Database:** Supabase PostgreSQL with `pgvector` for candidate semantic search and row-level security (RLS).
- **Storage:** Supabase Storage (private bucket, files accessed via signed URLs).

---

## 2. DIRECTORY STRUCTURE MAP
```
recruiter-x/
├── backend/                  # FastAPI Application
│   ├── .venv/                # Isolated Python virtual environment
│   ├── celery_app.py         # Celery configuration & priority queues
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment variables template
│   └── services/             # Future module for LLM routers & services
├── frontend/                 # Next.js 14 Web Application
│   ├── src/
│   │   ├── app/              # Next.js App Router (Pages, BFF routes)
│   │   └── components/       # Composable UI elements
│   ├── .env.local.example    # Next.js environment variables template
│   ├── package.json          # Node dependencies
│   └── tailwind.config.ts    # Custom design tokens configuration
├── workers/                  # Celery worker definitions (shared with backend)
├── docs/                     # Specifications & Design documents
│   ├── PRD.md                # General product requirements
│   ├── RECRUITER_X_PRD.md    # Product feature details
│   ├── RECRUITER_X_DESIGN_SYSTEM.md # Brand specs, fonts, styles
│   ├── RECRUITER_X_TECH_STACK.md    # Architecture and dependency matrix
│   └── feature.md            # Features description & output schemas
├── docker-compose.yml        # Development runner (API, Redis, Worker, Flower)
└── brain.md                  # This memory context file
```

---

## 3. PROJECT ROADMAP & PROGRESS
```
[x] Done  [/] In Progress  [ ] Todo
```

### Phase 1: Environment & Setup
- [x] Create project directory structure.
- [x] Relocate core specs to `docs/`.
- [x] Initialize Next.js 14 Frontend.
- [x] Install frontend npm dependencies (`react-query`, `zustand`, `supabase`, `zod`, `sonner`, `recharts`, `lucide`).
- [x] Create isolated Python virtual environment `.venv` for backend.
- [x] Install backend Python packages (`fastapi`, `supabase`, `celery`, `redis`, LLMs, extractors).
- [x] Configure backend and frontend settings templates (`.env.example`, `.env.local.example`, `celery_app.py`, `docker-compose.yml`).
- [x] Establish the root `brain.md` context keeper.

### Phase 2: Database Schema & Migration
- [ ] Initialize Supabase Postgres tables (`organisations`, `api_keys`, `projects`, `candidates`, `analysis_jobs`, `audit_logs`).
- [ ] Configure PostgreSQL Row-Level Security (RLS) policies for tenant isolation.
- [ ] Set up performance indexes.
- [ ] Create private storage bucket for candidate resumes.

### Phase 3: Core Backend Features (FastAPI & Celery)
- [ ] Implement Auth middleware & JWT verification (Supabase).
- [ ] Implement BYOK Key Management (AES-256-GCM encryption/decryption).
- [ ] Create LLM Router for Gemini, Claude, and OpenAI with structured output mapping.
- [ ] Build resume parsing and text extraction pipeline (PDF, Docx, scanned OCR fallbacks).
- [ ] Write Celery analysis tasks (Trajectory, Behaviour, Red Flags, Interrogation).

### Phase 4: Core Frontend Features (Next.js)
- [ ] Implement custom Tailwind design tokens and layout shells.
- [ ] Build organizations and API Key management dashboard.
- [ ] Implement Job Description (JD) audit interface (Must-have/nice-to-have/implied).
- [ ] Build bulk resume upload drag-and-drop.
- [ ] Implement Candidate List and Pool Health dashboard with score distributions.
- [ ] Create Candidate Detail view with narratives, trajectory timeline, and questions.

### Phase 5: Verification & Production Polish
- [ ] Add real-time updates via Supabase Realtime (WebSocket).
- [ ] Conduct end-to-end testing of 10,000/day scale throughput.
- [ ] Implement rate-limiting middleware (slowapi) and Sentry monitoring.
- [ ] Set up GitHub Actions CI/CD pipelines.

---

## 4. DATABASE REFERENCE
*For complete schema script, see [RECRUITER_X_TECH_STACK.md](file:///d:/2026/college pro/hack/docs/RECRUITER_X_TECH_STACK.md#L500-L597).*

Key tables:
1. `organisations` - Tenant boundaries.
2. `api_keys` - Enrypted BYOK credentials for LLMs.
3. `projects` - Hiring projects, JDs, and Ghost Candidate benchmarks.
4. `candidates` - Candidate profiles, parsed resumes, analysis scores, and narrative reports.
5. `analysis_jobs` - Token count, cost logging, and processing states (`queued`, `analyzing`, `complete`, `failed`).

---

## 5. RECENT CHANGES (June 2026)
- Created directory layout (`frontend/`, `backend/`, `workers/`, `infra/`, `docs/`).
- Moved all reference documentation into `docs/`.
- Bootstrapped Next.js 14 frontend and installed libraries.
- Bootstrapped python `.venv` virtual environment in `backend/` and installed libraries.
- Created `docker-compose.yml`, `celery_app.py`, and `.env` template files.
- Configured custom Design System tokens in Tailwind.
