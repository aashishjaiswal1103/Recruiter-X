'use client';

import React from 'react';
import { Play, FileText, CheckCircle2, AlertOctagon, Activity, Key } from 'lucide-react';

interface HeroProjectProps {
  lastProject: any | null;
  globalStats: {
    totalCandidates: number;
    avgQualificationRate: number;
    activeProjectsCount: number;
    apiKeyStatus: 'Active' | 'Missing';
  };
  onSelectProject: (project: any) => void;
}

export default function HeroProject({ lastProject, globalStats, onSelectProject }: HeroProjectProps) {
  
  // Helper to render status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 uppercase bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
            <FileText className="w-3 h-3" />
            <span>Draft</span>
          </span>
        );
      case 'auditing':
      case 'active':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-[#0000FF] uppercase bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>Analyzing</span>
          </span>
        );
      case 'complete':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3" />
            <span>Complete</span>
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-700 uppercase bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
            <AlertOctagon className="w-3 h-3" />
            <span>Failed</span>
          </span>
        );
      default:
        return null;
    }
  };

  // Helper to parse completion counts
  const getProgressDetails = (proj: any) => {
    if (!proj.candidates) return { count: 0, completed: 0 };
    const candidates = proj.candidates;
    const completed = candidates.filter((c: any) => c.analysis_status === 'complete').length;
    return {
      count: candidates.length,
      completed
    };
  };

  return (
    <div className="w-full space-y-8 font-sans">
      {/* Hero Card (Last Active Project) */}
      {lastProject ? (
        <div className="w-full bg-white border border-[#0000FF]/30 rounded-[32px] p-8 md:p-10 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Left half */}
          <div className="space-y-4 max-w-xl">
            <span className="text-[11px] font-bold text-[#0000FF] uppercase tracking-widest block">
              Pick up where you left off
            </span>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight leading-none">
                  {lastProject.title}
                </h1>
                {getStatusBadge(lastProject.status)}
              </div>
              <p className="text-neutral-500 text-sm">
                Target Role: <span className="font-medium text-neutral-800">{lastProject.role}</span>
                {lastProject.department && ` • ${lastProject.department}`}
              </p>
            </div>

            {/* Metrics display depending on status */}
            <div className="pt-2">
              {lastProject.status === 'draft' && (
                <p className="text-xs text-neutral-500">
                  Ready to start evaluation. Upload a Job Description to begin.
                </p>
              )}

              {(lastProject.status === 'active' || lastProject.status === 'auditing') && (() => {
                const { count, completed } = getProgressDetails(lastProject);
                return (
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0000FF] animate-ping" />
                    <span className="text-xs font-semibold text-[#0000FF]">
                      Live: {completed} of {count} candidates analyzed
                    </span>
                  </div>
                );
              })()}

              {lastProject.status === 'complete' && (() => {
                const candidates = lastProject.candidates || [];
                const complete = candidates.filter((c: any) => c.analysis_status === 'complete');
                const qualified = complete.filter((c: any) => c.final_score > 65).length;
                const rate = complete.length > 0 ? Math.round((qualified / complete.length) * 100) : 0;
                
                // Find top candidate
                let topCandidateName = 'None';
                let topCandidateScore = 0;
                if (complete.length > 0) {
                  const sorted = [...complete].sort((a, b) => (b.final_score || 0) - (a.final_score || 0));
                  topCandidateName = sorted[0].name;
                  topCandidateScore = sorted[0].final_score || 0;
                }

                return (
                  <div className="flex items-baseline gap-6">
                    <div>
                      <span className="text-3xl font-medium tracking-tight text-[#0000FF]">
                        {rate}%
                      </span>
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mt-1">
                        Qualification Rate
                      </span>
                    </div>
                    {topCandidateScore > 0 && (
                      <div className="h-8 w-px bg-neutral-200 self-center" />
                    )}
                    {topCandidateScore > 0 && (
                      <div>
                        <span className="text-sm font-semibold text-neutral-800">
                          {topCandidateName} ({topCandidateScore}/100)
                        </span>
                        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mt-1">
                          Top Candidate
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {lastProject.status === 'failed' && (
                <div className="text-rose-700 text-xs flex items-center gap-1.5 font-medium">
                  <span>Failed during analysis: {lastProject.jd_structured?.error || 'Unknown server error'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right half: CTA Button */}
          <div className="shrink-0 flex items-center">
            <button
              onClick={() => onSelectProject(lastProject)}
              className="w-full md:w-auto bg-[#0000FF] hover:bg-[#0000CC] text-white text-xs font-semibold rounded-full px-6 py-3.5 transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-md shadow-blue-500/10"
            >
              <span>{lastProject.status === 'draft' ? 'Continue Setup' : 'View Details'}</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty Hero state */
        <div className="w-full bg-white border border-neutral-100 rounded-[32px] p-8 text-center text-neutral-400 text-xs">
          No projects started yet.
        </div>
      )}

      {/* Global Stats Strip */}
      <div className="w-full flex justify-between items-center py-5 border-y border-neutral-100 px-2 flex-wrap gap-y-4">
        {/* Stat 1: Total Candidates */}
        <div className="flex-1 min-w-[120px] text-center md:text-left">
          <span className="text-2xl font-semibold text-neutral-900 leading-none">
            {globalStats.totalCandidates}
          </span>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mt-1">
            Total Candidates
          </span>
        </div>

        <div className="hidden md:block h-6 w-px bg-neutral-200" />

        {/* Stat 2: Avg Qualification Rate */}
        <div className="flex-1 min-w-[120px] text-center md:text-left md:pl-6">
          <span className="text-2xl font-semibold text-neutral-900 leading-none">
            {globalStats.avgQualificationRate}%
          </span>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mt-1">
            Avg Qualification
          </span>
        </div>

        <div className="hidden md:block h-6 w-px bg-neutral-200" />

        {/* Stat 3: Active Projects */}
        <div className="flex-1 min-w-[120px] text-center md:text-left md:pl-6">
          <span className="text-2xl font-semibold text-neutral-900 leading-none">
            {globalStats.activeProjectsCount}
          </span>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mt-1">
            Active Runs
          </span>
        </div>

        <div className="hidden md:block h-6 w-px bg-neutral-200" />

        {/* Stat 4: API Key Status */}
        <div className="flex-1 min-w-[120px] text-center md:text-left md:pl-6">
          <span className={`text-sm font-bold flex items-center justify-center md:justify-start gap-1 leading-none ${globalStats.apiKeyStatus === 'Active' ? 'text-emerald-600' : 'text-amber-500'}`}>
            <Key className="w-3.5 h-3.5" />
            <span>{globalStats.apiKeyStatus}</span>
          </span>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mt-1 font-sans">
            AI API Key Status
          </span>
        </div>
      </div>
    </div>
  );
}
