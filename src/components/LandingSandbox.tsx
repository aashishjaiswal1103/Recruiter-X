'use client';

import React, { useState, useEffect, useRef } from 'react';

interface SampleJD {
  title: string;
  rawText: string;
  logs: string[];
  jsonOutput: any;
}

const samples: Record<string, SampleJD> = {
  ml: {
    title: 'Staff ML Engineer',
    rawText: `Role: Senior Machine Learning Engineer
Requirements:
- 10+ years of experience with Transformer models (BERT, GPT, Attention mechanisms).
- Solid experience in training LLMs from scratch on multi-node GPU clusters.
- Perfect knowledge of Python, PyTorch, Docker, Scikit-Learn.
- Must have built custom CUDA kernels for hardware optimization.
- Ability to manage a team of 4 junior developers and report directly to CTO.`,
    logs: [
      '[SYSTEM] Initializing JD Audit Engine v2.0...',
      '[SYSTEM] Provider context: BYOK - Gemini 1.5 Pro Pipeline established.',
      '[AUDIT] Normalizing job details and extracting core requirements...',
      '[AUDIT] INFERRED SENIORITY: Staff / Principal (Stated: Senior - Seniority Mismatch: YES)',
      '[AUDIT] Flagged JD Quality Mismatch (High): "10+ years experience with Transformers" is impossible. (Attention Is All You Need was published in June 2017).',
      '[AUDIT] Flagged Hidden Expectation: Multi-node GPU orchestration requires deep NCCL / InfiniBand configuration knowledge, unstated in JD.',
      '[GHOST] Constructing Ghost Candidate synthetic benchmark...',
      '[GHOST] Generating ideal career trajectory for Staff ML: 8+ years total, transition from distributed systems backend to custom neural architecture work.',
      '[GHOST] Generating Pride Mismatch Flag: Ideal candidate would never lead with "Scikit-Learn" at Staff level — indicating JD requires a builder, not an operator.',
      '[SYSTEM] Ingestion Pipeline ready. JD Quality Score: 68/100.',
      '[SYSTEM] Status: JD_ANALYZED. Ready for resume batch upload.'
    ],
    jsonOutput: {
      "jd_audit": {
        "must_have_skills": ["Python", "PyTorch", "Multi-node GPU training", "CUDA"],
        "nice_to_have_skills": ["Docker", "Scikit-Learn"],
        "inferred_seniority": "staff",
        "stated_seniority": "Senior",
        "seniority_mismatch": true,
        "working_style": {
          "pace": "fast",
          "collaboration": "hybrid",
          "mode": "builder"
        },
        "jd_quality_score": 68,
        "jd_quality_flags": [
          {
            "flag_type": "impossible_requirement",
            "location": "Requirements -> 10+ years Transformers",
            "recommendation": "Adjust requirement to 6+ years (since 2017) or general deep learning experience."
          }
        ]
      },
      "ghost_candidate": {
        "expected_companies_by_type": ["FAANG", "AI Research Lab", "GPU Infrastructure Startup"],
        "expected_problems_solved": [
          "Custom collective communication optimizations",
          "Tuning attention layers for custom hardware targets"
        ],
        "expected_absence_signals": [
          {
            "signal": "Highlighting basic scikit-learn API usage",
            "reason_absent": "Indicates lack of deep systems/cuda level focus"
          }
        ]
      }
    }
  },
  frontend: {
    title: 'Senior Frontend Dev',
    rawText: `Position: Lead React Developer
Requirements:
- 5+ years of experience with React, Next.js, and TypeScript.
- Complete mastery of Tailwind CSS, CSS-in-JS, and Figma layouts.
- Experience building complex WebGL animations and 3D graphics in the browser.
- Must have configured complete Webpack bundles from scratch.
- Experience with state management (Zustand, Redux, Context).`,
    logs: [
      '[SYSTEM] Initializing JD Audit Engine v2.0...',
      '[SYSTEM] Provider context: BYOK - Claude 3.5 Sonnet Pipeline established.',
      '[AUDIT] Parsing frontend requirement stack...',
      '[AUDIT] INFERRED SENIORITY: Senior Developer (Stated: Lead - Seniority Mismatch: NO)',
      '[AUDIT] Flagged JD Quality Mismatch (Medium): "Must configure Webpack from scratch" while using "Next.js" is contradictory. Next.js uses Turbopack/preconfigured compiler.',
      '[AUDIT] Flagged Implied Requirement: WebGL 3D graphics requires custom shader programming (GLSL), not specified in JD.',
      '[GHOST] Constructing Ghost Candidate synthetic benchmark...',
      '[GHOST] Trajectory Benchmark: 6+ years web development, transitioning from CSS-heavy developer to interactive-system architect.',
      '[SYSTEM] Ingestion Pipeline ready. JD Quality Score: 82/100.',
      '[SYSTEM] Status: JD_ANALYZED. Ready for resume batch upload.'
    ],
    jsonOutput: {
      "jd_audit": {
        "must_have_skills": ["React", "Next.js", "TypeScript", "WebGL"],
        "nice_to_have_skills": ["Tailwind CSS", "Zustand", "Webpack"],
        "inferred_seniority": "senior",
        "stated_seniority": "Lead",
        "seniority_mismatch": false,
        "working_style": {
          "pace": "fast",
          "collaboration": "independent",
          "mode": "builder"
        },
        "jd_quality_score": 82,
        "jd_quality_flags": [
          {
            "flag_type": "contradiction",
            "location": "Webpack requirement in Next.js project",
            "recommendation": "Remove Webpack requirement; highlight Turbopack or bundler performance tuning."
          }
        ]
      },
      "ghost_candidate": {
        "expected_companies_by_type": ["Creative Agency", "Interactive SaaS", "Vercel Ecosystem Partners"],
        "expected_problems_solved": [
          "Optimizing bundle size and First Contentful Paint (FCP)",
          "Writing custom three.js shaders for smooth canvas rendering"
        ],
        "expected_absence_signals": [
          {
            "signal": "Lengthy descriptions of basic CRUD API integrations",
            "reason_absent": "Senior candidates emphasize rendering loops, state lifecycle, and interactivity over basic fetches."
          }
        ]
      }
    }
  }
};

export default function LandingSandbox() {
  const [activeTab, setActiveTab] = useState<'input' | 'log' | 'json'>('input');
  const [activeSample, setActiveSample] = useState<'ml' | 'frontend'>('ml');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [streamedLogs, setStreamedLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const sample = samples[activeSample];

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [streamedLogs]);

  const runAuditSimulation = () => {
    setIsAnalyzing(true);
    setActiveTab('log');
    setStreamedLogs([]);
    
    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < sample.logs.length) {
        const nextLog = sample.logs[currentLogIndex];
        if (nextLog) {
          setStreamedLogs(prev => [...prev, nextLog]);
        }
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsAnalyzing(false);
      }
    }, 350);
  };

  // Reset if active sample changes
  useEffect(() => {
    setStreamedLogs([]);
    setIsAnalyzing(false);
    setActiveTab('input');
  }, [activeSample]);

  return (
    <div className="w-full rounded-2xl bg-[#090916] text-white shadow-2xl overflow-hidden font-data text-sm max-w-4xl mx-auto border border-white/5">
      {/* OS Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#121226]">
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <div className="text-white/40 text-xs font-data select-none tracking-wider uppercase">
          JD Audit Console
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => !isAnalyzing && setActiveSample('ml')}
            disabled={isAnalyzing}
            className={`px-2.5 py-0.5 text-xs rounded-full border transition-all font-bold ${activeSample === 'ml' ? 'border-blue-light/50 bg-blue/20 text-blue-light' : 'border-white/5 text-white/50 hover:text-white'} ${isAnalyzing ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            ml_eng.jd
          </button>
          <button 
            onClick={() => !isAnalyzing && setActiveSample('frontend')}
            disabled={isAnalyzing}
            className={`px-2.5 py-0.5 text-xs rounded-full border transition-all font-bold ${activeSample === 'frontend' ? 'border-blue-light/50 bg-blue/20 text-blue-light' : 'border-white/5 text-white/50 hover:text-white'} ${isAnalyzing ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            frontend.jd
          </button>
        </div>
      </div>

      {/* Code Tabs */}
      <div className="flex border-b border-white/10 bg-[#0B0B1E] text-xs">
        <button
          onClick={() => !isAnalyzing && setActiveTab('input')}
          disabled={isAnalyzing}
          className={`px-5 py-3 border-r border-white/10 flex items-center gap-1.5 transition-all font-bold ${
            activeTab === 'input' 
              ? 'bg-[#121226] text-blue-light border-b-2 border-b-blue-light' 
              : 'text-white/40 hover:bg-white/5'
          } ${isAnalyzing ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <span>INPUT_JD</span>
        </button>
        <button
          onClick={() => setActiveTab('log')}
          className={`px-5 py-3 border-r border-white/10 flex items-center gap-1.5 transition-all font-bold ${
            activeTab === 'log' 
              ? 'bg-[#121226] text-blue-light border-b-2 border-b-blue-light' 
              : 'text-white/40 hover:bg-white/5'
          }`}
        >
          <span>AUDIT_LOG</span>
          {isAnalyzing && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-light animate-ping" />
          )}
        </button>
        <button
          onClick={() => !isAnalyzing && setActiveTab('json')}
          disabled={isAnalyzing}
          className={`px-5 py-3 border-r border-white/10 flex items-center gap-1.5 transition-all font-bold ${
            activeTab === 'json' 
              ? 'bg-[#121226] text-blue-light border-b-2 border-b-blue-light' 
              : 'text-white/40 hover:bg-white/5'
          } ${isAnalyzing ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <span>OUTPUT_JSON</span>
        </button>
      </div>

      {/* Main Terminal Body */}
      <div className="relative h-96 p-5 overflow-hidden bg-[#070716] flex flex-col justify-between">
        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'input' && (
            <div className="h-full flex flex-col justify-between">
              <textarea
                value={sample.rawText}
                readOnly
                className="w-full flex-1 bg-transparent border-0 text-white/70 resize-none font-mono text-sm leading-relaxed focus:outline-none"
              />
              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-white/30">
                <span>UTF-8 • SPACE_MONO</span>
                <button
                  onClick={runAuditSimulation}
                  disabled={isAnalyzing}
                  className="btn-cta !h-9 !text-xs !px-5 select-none"
                >
                  <span>Run JD Audit</span>
                  <span className="text-[9px] bg-white/20 px-1 py-0.5 rounded-md ml-1.5">⌘Enter</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'log' && (
            <div ref={logContainerRef} className="h-full overflow-y-auto space-y-2 select-text pr-2 font-mono">
              {streamedLogs.map((log, idx) => {
                if (!log) return null;
                let colorClass = 'text-white/75';
                if (log.startsWith('[SYSTEM]')) colorClass = 'text-white/30';
                if (log.startsWith('[AUDIT]')) {
                  if (log.includes('Mismatch') || log.includes('Flagged')) {
                    colorClass = 'text-amber-400';
                  } else {
                    colorClass = 'text-blue-light';
                  }
                }
                if (log.startsWith('[GHOST]')) colorClass = 'text-blue-light font-bold';
                
                return (
                  <div key={idx} className={`leading-relaxed text-xs md:text-sm ${colorClass}`}>
                    {log}
                  </div>
                );
              })}
              
              {isAnalyzing && (
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <span className="w-1.5 h-4 bg-blue-light animate-pulse" />
                  <span>Processing layers in parallel...</span>
                </div>
              )}

              {!isAnalyzing && streamedLogs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-3 py-16">
                  <div className="text-center font-data text-xs uppercase tracking-wider">Console Idle</div>
                  <button 
                    onClick={runAuditSimulation}
                    className="btn-cta !h-9 !text-xs !px-5"
                  >
                    Run Analysis Simulation
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'json' && (
            <div className="h-full overflow-y-auto text-xs text-blue-light select-text pr-2 font-mono">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(sample.jsonOutput, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(0,0,255,0)_50%,rgba(0,0,255,0.05)_50%)] bg-[length:100%_4px]" />
      </div>
    </div>
  );
}
