# 02. Supabase Database Schema & RLS

This document defines the PostgreSQL database schema, indexes, and Row Level Security (RLS) policies for Recruiter-X. Use this reference to create tables and secure data in the Supabase console.

---

## 1. Table Definitions (DDL)

Run these SQL scripts in the Supabase SQL Editor. Tables must be created in this exact sequence to resolve foreign key constraints correctly.

### 1. `organisations`
Stores account and billing metadata.
```sql
CREATE TABLE organisations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### 2. `org_members`
Maps users to organizations and defines roles.
```sql
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'recruiter', 'viewer');

CREATE TABLE org_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organisations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID NOT NULL, -- References auth.users(id) in Supabase Auth
    role user_role DEFAULT 'recruiter' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(org_id, user_id)
);
```

### 3. `api_keys`
Stores encrypted LLM API keys provided by customers (BYOK).
```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organisations(id) ON DELETE CASCADE NOT NULL,
    provider VARCHAR(50) NOT NULL, -- e.g., 'gemini', 'anthropic', 'openai'
    model VARCHAR(100) NOT NULL, -- Default model for this key
    encrypted_key TEXT NOT NULL, -- AES-256-GCM encrypted key
    label VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_default BOOLEAN DEFAULT FALSE NOT NULL,
    last_validated TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### 4. `projects`
Contains hiring projects created by recruiters.
```sql
CREATE TYPE project_status AS ENUM ('draft', 'auditing', 'active', 'failed', 'complete');

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organisations(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    seniority VARCHAR(50),
    jd_raw_text TEXT,
    jd_structured JSONB, -- Parsed and audited JD fields
    ghost_candidate JSONB, -- Synthesized ideal candidate benchmark
    status project_status DEFAULT 'draft' NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### 5. `candidates`
Stores candidate records and full AI analysis metrics.
```sql
CREATE TYPE candidate_analysis_status AS ENUM ('pending', 'parsing', 'parsed', 'analyzing', 'complete', 'failed');

CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    org_id UUID REFERENCES organisations(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    resume_file_url TEXT NOT NULL,
    resume_raw_text TEXT,
    resume_parsed JSONB,
    
    -- Analysis Scores (0 to 100)
    trajectory_score INT,
    behaviour_score INT,
    ghost_score INT,
    insider_score INT,
    credibility_score INT,
    final_score INT,
    
    rank INT,
    trajectory_label VARCHAR(50),
    red_flags JSONB DEFAULT '[]'::jsonb,
    interrogation_qs JSONB DEFAULT '[]'::jsonb,
    insider_signals JSONB DEFAULT '[]'::jsonb,
    narrative TEXT,
    
    analysis_status candidate_analysis_status DEFAULT 'pending' NOT NULL,
    analysis_started_at TIMESTAMP WITH TIME ZONE,
    analysis_completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### 6. `analysis_jobs`
Tracks celery execution, API token consumption, latency, and costs.
```sql
CREATE TYPE job_status AS ENUM ('queued', 'running', 'completed', 'failed');

CREATE TABLE analysis_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
    org_id UUID REFERENCES organisations(id) ON DELETE CASCADE NOT NULL,
    job_type VARCHAR(50) NOT NULL, -- e.g., 'parse', 'analyze', 'report'
    status job_status DEFAULT 'queued' NOT NULL,
    api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
    tokens_input INT DEFAULT 0,
    tokens_output INT DEFAULT 0,
    cost_usd NUMERIC(10, 6) DEFAULT 0.000000,
    latency_ms INT DEFAULT 0,
    error_message TEXT,
    queued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);
```

### 7. `audit_logs`
Chronicles security-relevant events for administrative auditing.
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organisations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID, -- NULL if system-initiated
    action VARCHAR(100) NOT NULL, -- e.g., 'key_added', 'analysis_started'
    resource_type VARCHAR(50) NOT NULL, -- e.g., 'api_keys', 'projects'
    resource_id UUID NOT NULL,
    ip_address_hash VARCHAR(64),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

---

## 2. Indexes

Run this SQL block to ensure high performance under load.

```sql
-- Fast fetching of complete candidate rankings inside a project
CREATE INDEX idx_candidates_ranking 
ON candidates (project_id, final_score DESC) 
WHERE analysis_status = 'complete';

-- Queue processing optimization for pending jobs
CREATE INDEX idx_analysis_jobs_queue 
ON analysis_jobs (status, queued_at ASC) 
WHERE status IN ('queued');

-- Fast audit trail querying ordered by date
CREATE INDEX idx_audit_logs_org_time 
ON audit_logs (org_id, created_at DESC);

-- Fast key resolution for active/default keys within an org
CREATE INDEX idx_api_keys_org_active_default 
ON api_keys (org_id, is_active, is_default);
```

---

## 3. Row Level Security (RLS) & Policies

Enable RLS on all tables to prevent cross-tenant data leaks. 

```sql
-- Enable RLS on every table
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
```

### Security Rule: Multi-Tenant Org Isolation Policy
All operations (SELECT, INSERT, UPDATE, DELETE) on client tables must ensure the user belongs to the target organization.

```sql
-- Helper function to check org membership
CREATE OR REPLACE FUNCTION auth.is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.org_members
        WHERE org_members.org_id = $1 
          AND org_members.user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Org Isolation Policies
Apply this policy structure to tables that contain user/tenant data:

```sql
-- Projects
CREATE POLICY org_isolation_projects ON projects
    FOR ALL
    USING (auth.is_org_member(org_id));

-- Candidates
CREATE POLICY org_isolation_candidates ON candidates
    FOR ALL
    USING (auth.is_org_member(org_id));

-- Analysis Jobs
CREATE POLICY org_isolation_analysis_jobs ON analysis_jobs
    FOR ALL
    USING (auth.is_org_member(org_id));

-- Audit Logs
CREATE POLICY org_isolation_audit_logs ON audit_logs
    FOR ALL
    USING (auth.is_org_member(org_id));
```

### RBAC Policies on API Keys
API keys are highly sensitive. Only roles `owner` and `admin` are permitted to perform write operations (INSERT, UPDATE, DELETE) on keys.

```sql
-- Helper function to check role permission
CREATE OR REPLACE FUNCTION auth.has_write_permission(org_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_role public.user_role;
BEGIN
    SELECT role INTO user_role 
    FROM public.org_members 
    WHERE org_members.org_id = $1 
      AND org_members.user_id = auth.uid();
      
    RETURN user_role IN ('owner', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- API Keys Read Policy (All Org Members)
CREATE POLICY api_keys_read_policy ON api_keys
    FOR SELECT
    USING (auth.is_org_member(org_id));

-- API Keys Write Policy (Owners and Admins Only)
CREATE POLICY api_keys_write_policy ON api_keys
    FOR ALL
    USING (auth.is_org_member(org_id) AND auth.has_write_permission(org_id));
```

> [!WARNING]
> The Python backend core service will connect to Supabase using a service key to execute celery tasks and bypass RLS policies. The service key must never be shared or exposed to the client app.
