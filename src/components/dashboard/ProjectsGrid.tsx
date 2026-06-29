'use client';

import React, { useState, useMemo } from 'react';
import { Search, FolderOpen, AlertOctagon, CheckCircle2, Activity, RotateCcw, Archive, Plus } from 'lucide-react';

interface ProjectsGridProps {
  projects: any[];
  onSelectProject: (project: any) => void;
  onOpenCreateModal: () => void;
  onRetryProject: (projectId: string, e: React.MouseEvent) => void;
  onRestoreProject: (projectId: string, e: React.MouseEvent) => void;
}

type FilterTab = 'all' | 'analyzing' | 'complete' | 'archived';
type SortOption = 'recent' | 'score' | 'candidates' | 'alphabetical';

export default function ProjectsGrid({
  projects,
  onSelectProject,
  onOpenCreateModal,
  onRetryProject,
  onRestoreProject
}: ProjectsGridProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Compute counts for each tab
  const counts = useMemo(() => {
    return {
      all: projects.filter(p => p.status !== 'archived').length,
      analyzing: projects.filter(p => (p.status === 'active' || p.status === 'auditing') && p.status !== 'archived').length,
      complete: projects.filter(p => p.status === 'complete' && p.status !== 'archived').length,
      archived: projects.filter(p => p.status === 'archived').length
    };
  }, [projects]);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    // 1. Tab filter
    if (activeTab === 'archived') {
      result = result.filter(p => p.status === 'archived');
    } else {
      // Don't show archived projects in other tabs
      result = result.filter(p => p.status !== 'archived');
      
      if (activeTab === 'analyzing') {
        result = result.filter(p => p.status === 'active' || p.status === 'auditing');
      } else if (activeTab === 'complete') {
        result = result.filter(p => p.status === 'complete');
      }
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        p => p.title.toLowerCase().includes(query) || p.role.toLowerCase().includes(query)
      );
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
      if (sortBy === 'score') {
        // Calculate qualification rate
        const getRate = (p: any) => {
          if (!p.candidates || p.candidates.length === 0) return 0;
          const complete = p.candidates.filter((c: any) => c.analysis_status === 'complete');
          const qualified = complete.filter((c: any) => c.final_score > 65).length;
          return complete.length > 0 ? (qualified / complete.length) * 100 : 0;
        };
        return getRate(b) - getRate(a);
      }
      if (sortBy === 'candidates') {
        return (b.candidates?.length || 0) - (a.candidates?.length || 0);
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [projects, activeTab, searchQuery, sortBy]);

  // Helper to format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full space-y-6 font-sans">
      
      {/* Controls Row */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white py-2">
        {/* Left: Filter Tabs */}
        <div className="flex bg-neutral-50 p-1.5 rounded-full border border-neutral-100 items-center overflow-x-auto w-full md:w-auto">
          {(['all', 'analyzing', 'complete', 'archived'] as FilterTab[]).map((tab) => {
            const isActive = activeTab === tab;
            const count = counts[tab];
            
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-semibold rounded-full px-4 py-2 transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-[0.98] ${
                  isActive
                    ? 'bg-[#0000FF] text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800 bg-transparent'
                }`}
              >
                <span className="capitalize">{tab}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Search & Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:flex-initial">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search project or role..."
              className="w-full md:w-[220px] bg-white border border-neutral-200 rounded-full py-2 pl-9 pr-4 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0000FF] transition-all text-xs"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-white border border-neutral-200 rounded-full py-2 px-3 text-neutral-600 focus:outline-none focus:border-[#0000FF] transition-all text-xs font-medium cursor-pointer"
          >
            <option value="recent">Most Recent</option>
            <option value="score">Highest Pool Score</option>
            <option value="candidates">Most Candidates</option>
            <option value="alphabetical">Role A–Z</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      {filteredAndSortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProjects.map((p) => {
            
            // Render specific card templates
            
            // DRAFT CARD
            if (p.status === 'draft') {
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className="rounded-[24px] border-2 border-dashed border-neutral-200 hover:border-[#0000FF]/50 p-6 flex flex-col justify-between min-h-[180px] bg-white transition-all cursor-pointer group shadow-sm active:scale-[0.99] select-none"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-neutral-900 text-sm leading-snug group-hover:text-[#0000FF] transition-colors">
                        {p.title}
                      </h3>
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block bg-neutral-100 px-1.5 py-0.5 rounded">
                        Draft
                      </span>
                    </div>
                    <p className="text-neutral-500 text-xs">{p.role}</p>
                    <p className="text-neutral-400 text-[10px] mt-1">Created: {formatDate(p.created_at)}</p>
                  </div>
                  
                  <div className="mt-4">
                    <span className="text-xs text-[#0000FF] font-semibold flex items-center gap-1">
                      <span>Add JD to start &rarr;</span>
                    </span>
                  </div>
                </div>
              );
            }

            // ANALYZING CARD
            if (p.status === 'active' || p.status === 'auditing') {
              const candidates = p.candidates || [];
              const completed = candidates.filter((c: any) => c.analysis_status === 'complete').length;
              
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className="rounded-[24px] bg-[#0000FF] text-white p-6 flex flex-col justify-between min-h-[180px] transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.99] select-none"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white text-sm leading-snug">
                        {p.title}
                      </h3>
                      <span className="flex items-center gap-1 text-[9px] font-bold text-white uppercase bg-white/20 px-1.5 py-0.5 rounded tracking-wider leading-none">
                        <Activity className="w-2.5 h-2.5 animate-pulse" />
                        <span>Analyzing</span>
                      </span>
                    </div>
                    <p className="text-white/70 text-xs">{p.role}</p>
                    <p className="text-white/40 text-[10px] mt-1">Candidate pool size: {candidates.length}</p>
                  </div>

                  <div className="mt-4 space-y-2">
                    {/* Live Progress Bar */}
                    <div className="h-1 bg-white/25 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-500" 
                        style={{ width: `${candidates.length > 0 ? (completed / candidates.length) * 100 : 0}%` }}
                      />
                    </div>
                    
                    <span className="text-xs font-semibold text-white/90 flex items-center justify-between">
                      <span>{completed} / {candidates.length} analyzed</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white/50">Live</span>
                    </span>
                  </div>
                </div>
              );
            }

            // FAILED CARD
            if (p.status === 'failed') {
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className="rounded-[24px] bg-rose-50/50 border border-rose-200 text-neutral-900 p-6 flex flex-col justify-between min-h-[180px] transition-all cursor-pointer hover:shadow-sm active:scale-[0.99] select-none"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-neutral-900 text-sm leading-snug">
                        {p.title}
                      </h3>
                      <span className="flex items-center gap-1 text-[9px] font-bold text-rose-700 uppercase bg-rose-100 border border-rose-200 px-1.5 py-0.5 rounded">
                        <AlertOctagon className="w-2.5 h-2.5" />
                        <span>Failed</span>
                      </span>
                    </div>
                    <p className="text-neutral-500 text-xs mb-2">{p.role}</p>
                    <p className="text-rose-600 text-xs line-clamp-2 leading-relaxed bg-rose-100/30 border border-rose-100 p-2 rounded">
                      {p.jd_structured?.error || 'Analysis process encountered an error.'}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-[10px] text-neutral-400">Created: {formatDate(p.created_at)}</span>
                    <button
                      onClick={(e) => onRetryProject(p.id, e)}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-full px-3.5 py-1.5 transition-all flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retry</span>
                    </button>
                  </div>
                </div>
              );
            }

            // ARCHIVED CARD
            if (p.status === 'archived') {
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className="rounded-[24px] bg-[#0000FF]/5 text-blue-900/60 border border-[#0000FF]/10 p-6 flex flex-col justify-between min-h-[180px] transition-all cursor-pointer hover:bg-[#0000FF]/10 active:scale-[0.99] select-none"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-neutral-800/80 text-sm leading-snug">
                        {p.title}
                      </h3>
                      <span className="flex items-center gap-1 text-[9px] font-bold text-neutral-500 uppercase bg-neutral-200/50 px-1.5 py-0.5 rounded">
                        <Archive className="w-2.5 h-2.5" />
                        <span>Archived</span>
                      </span>
                    </div>
                    <p className="text-neutral-500/80 text-xs">{p.role}</p>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-[10px] text-neutral-400">Archived: {formatDate(p.updated_at)}</span>
                    <button
                      onClick={(e) => onRestoreProject(p.id, e)}
                      className="bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 text-[10px] font-bold uppercase tracking-wider rounded-full px-3.5 py-1.5 transition-all flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </button>
                  </div>
                </div>
              );
            }

            // COMPLETE CARD
            const candidates = p.candidates || [];
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

            const hiddenGems = complete.filter((c: any) => (c.final_score || 0) < 55 && (c.insider_score || 0) > 75).length;

            return (
              <div
                key={p.id}
                onClick={() => onSelectProject(p)}
                className="rounded-[24px] bg-[#0000FF] text-white p-6 flex flex-col justify-between min-h-[180px] transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.99] select-none"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white text-sm leading-snug">
                      {p.title}
                    </h3>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-300 uppercase bg-white/20 px-1.5 py-0.5 rounded tracking-wider leading-none">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Complete</span>
                    </span>
                  </div>
                  <p className="text-white/70 text-xs">{p.role}</p>
                </div>

                <div className="mt-4">
                  {/* Hero Metric */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold leading-none">{rate}%</span>
                    <span className="text-[9px] text-white/50 font-bold uppercase tracking-wider">Qualification Rate</span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-1 gap-x-2 border-t border-white/10 pt-2.5 mt-2.5 text-[10px] text-white/60">
                    <div>Pool size: <span className="text-white font-medium">{candidates.length}</span></div>
                    {hiddenGems > 0 && (
                      <div>Hidden gems: <span className="text-emerald-300 font-bold">{hiddenGems}</span></div>
                    )}
                    {topCandidateScore > 0 && (
                      <div className="col-span-2 truncate">
                        Top: <span className="text-white font-medium">{topCandidateName} ({topCandidateScore})</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="w-full bg-white border border-neutral-100 rounded-[32px] py-16 px-6 flex flex-col items-center justify-center text-center font-sans space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 bg-blue-50 text-[#0000FF] rounded-full flex items-center justify-center">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-semibold text-base text-neutral-900">
              No projects yet — start your first analysis
            </h3>
            <p className="text-neutral-500 text-xs max-w-sm leading-relaxed">
              Create a project workspace, define standard roles, and upload candidate resumes to trigger our AI evaluation engine.
            </p>
          </div>
          <button
            onClick={onOpenCreateModal}
            className="bg-[#0000FF] hover:bg-[#0000CC] text-white text-xs font-semibold rounded-full px-6 py-2.5 transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Create Workspace</span>
          </button>
        </div>
      )}
    </div>
  );
}
