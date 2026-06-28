-- ==========================================
-- RECRUITER-X SUPABASE POSTGRESQL SCHEMA
-- ==========================================

-- Clean up existing database objects if necessary (safe rerun)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS analysis_jobs CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS api_keys CASCADE;
DROP TABLE IF EXISTS org_members CASCADE;
DROP TABLE IF EXISTS organisations CASCADE;

DROP TYPE IF EXISTS job_status CASCADE;
DROP TYPE IF EXISTS candidate_analysis_status CASCADE;
DROP TYPE IF EXISTS project_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. CUSTOM ENUM TYPES
-- ==========================================

CREATE TYPE user_role AS ENUM ('owner', 'admin', 'recruiter', 'viewer');
CREATE TYPE project_status AS ENUM ('draft', 'auditing', 'active', 'failed', 'complete');
CREATE TYPE candidate_analysis_status AS ENUM ('pending', 'parsing', 'parsed', 'analyzing', 'complete', 'failed');
CREATE TYPE job_status AS ENUM ('queued', 'running', 'completed', 'failed');

-- ==========================================
-- 2. TABLE DEFINITIONS
-- ==========================================

-- Organisations Table
CREATE TABLE organisations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Org Members Table
CREATE TABLE org_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organisations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID NOT NULL, -- Links to auth.users in Supabase
    role user_role DEFAULT 'recruiter' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(org_id, user_id)
);

-- API Keys Table (BYOK Encryption)
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organisations(id) ON DELETE CASCADE NOT NULL,
    provider VARCHAR(50) NOT NULL, -- 'gemini', 'anthropic', 'openai'
    model VARCHAR(100) NOT NULL, -- Default model name
    encrypted_key TEXT NOT NULL, -- AES-256-GCM encrypted base64 payload
    label VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_default BOOLEAN DEFAULT FALSE NOT NULL,
    last_validated TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organisations(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    seniority VARCHAR(50),
    jd_raw_text TEXT,
    jd_structured JSONB DEFAULT '{}'::jsonb,
    ghost_candidate JSONB DEFAULT '{}'::jsonb,
    status project_status DEFAULT 'draft' NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Candidates Table (AI Scoring Data)
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    org_id UUID REFERENCES organisations(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    resume_file_url TEXT NOT NULL,
    resume_raw_text TEXT,
    resume_parsed JSONB DEFAULT '{}'::jsonb,
    
    -- AI Metric Scores (0-100)
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

-- Analysis Jobs Table (Celery Tracking)
CREATE TABLE analysis_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
    org_id UUID REFERENCES organisations(id) ON DELETE CASCADE NOT NULL,
    job_type VARCHAR(50) NOT NULL, -- 'parse', 'analyze', 'report'
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

-- Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organisations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID, -- NULL if system task
    action VARCHAR(100) NOT NULL, -- e.g., 'key_added', 'analysis_started'
    resource_type VARCHAR(50) NOT NULL, -- e.g., 'api_keys', 'projects'
    resource_id UUID NOT NULL,
    ip_address_hash VARCHAR(64),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ==========================================
-- 3. INDEXES FOR HIGHER PERFORMANCE
-- ==========================================

-- Quick retrieval of completed candidate rankings sorted by final_score
CREATE INDEX idx_candidates_ranking 
ON candidates (project_id, final_score DESC) 
WHERE analysis_status = 'complete';

-- Queue scheduling lookup optimization
CREATE INDEX idx_analysis_jobs_queue 
ON analysis_jobs (status, queued_at ASC) 
WHERE status = 'queued';

-- Chronological audit logging querying bound to organizations
CREATE INDEX idx_audit_logs_org_time 
ON audit_logs (org_id, created_at DESC);

-- Fast resolution of default keys inside an organization
CREATE INDEX idx_api_keys_org_active_default 
ON api_keys (org_id, is_active, is_default);

-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable Row Level Security on all tables
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper security function to verify organization membership
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

-- Helper security function to check owner/admin write permissions
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

-- ------------------------------------------
-- Policy Bindings
-- ------------------------------------------

-- Organisations: Read organization if a member
CREATE POLICY org_read_policy ON organisations
    FOR SELECT
    USING (auth.is_org_member(id));

-- Org Members: Read if user belongs to the same org
CREATE POLICY org_members_policy ON org_members
    FOR ALL
    USING (auth.is_org_member(org_id));

-- API Keys: Read access for all org members
CREATE POLICY api_keys_read_policy ON api_keys
    FOR SELECT
    USING (auth.is_org_member(org_id));

-- API Keys: Write access for Owners & Admins only
CREATE POLICY api_keys_write_policy ON api_keys
    FOR ALL
    USING (auth.is_org_member(org_id) AND auth.has_write_permission(org_id));

-- Projects: All-operations tenant isolation
CREATE POLICY projects_policy ON projects
    FOR ALL
    USING (auth.is_org_member(org_id));

-- Candidates: All-operations tenant isolation
CREATE POLICY candidates_policy ON candidates
    FOR ALL
    USING (auth.is_org_member(org_id));

-- Analysis Jobs: All-operations tenant isolation
CREATE POLICY analysis_jobs_policy ON analysis_jobs
    FOR ALL
    USING (auth.is_org_member(org_id));

-- Audit Logs: All-operations tenant isolation
CREATE POLICY audit_logs_policy ON audit_logs
    FOR ALL
    USING (auth.is_org_member(org_id));
