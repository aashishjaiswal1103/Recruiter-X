'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, AlertTriangle, CheckCircle, Info, ChevronRight, HelpCircle } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  statedRole: string;
  trajectory: 'ACCELERATING' | 'STEADY' | 'PLATEAUED' | 'DECLINING';
  baseTrajectoryScore: number;
  baseBehaviourScore: number;
  baseDepthScore: number;
  redFlags: Array<{ type: string; severity: 'high' | 'medium' | 'low'; text: string }>;
  insiderSignals: { present: string[]; absent: string[]; score: number };
  narrative: string;
  questions: string[];
}

const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Alex Mercer',
    statedRole: 'Senior ML Engineer (Applying for Staff)',
    trajectory: 'ACCELERATING',
    baseTrajectoryScore: 96,
    baseBehaviourScore: 92,
    baseDepthScore: 94,
    redFlags: [],
    insiderSignals: {
      present: ['NCCL ring collective communication design', 'CUDA custom kernel implementations', 'Tuning attention layers'],
      absent: ['Standard Scikit-learn API usage only'],
      score: 92
    },
    narrative: 'Trajectory shows rapid title progression and increasing system complexity. Behaviour signals reflect high ownership and focus on production scale. Highly technical answers regarding GPU clusters correlate with a Staff-level mindset.',
    questions: [
      'You worked on multi-node GPU training. What specific optimization did you apply to NCCL collective communication to reduce gradient sync overhead?',
      'How did you avoid shared memory bank conflicts in your custom CUDA kernel for attention scaling?',
      'What was the exact hardware failure mode in your 512-GPU ring topology, and how did your orchestration layer recover?'
    ]
  },
  {
    id: '2',
    name: 'Jordan Vance',
    statedRole: 'Lead React Developer (Applying for Lead)',
    trajectory: 'PLATEAUED',
    baseTrajectoryScore: 48,
    baseBehaviourScore: 56,
    baseDepthScore: 32,
    redFlags: [
      { type: 'Title Inflation', severity: 'high', text: 'Claims lead responsibility but achievements represent routine component creation.' },
      { type: 'Job Hopper', severity: 'medium', text: '3 moves within 24 months with flat scope.' }
    ],
    insiderSignals: {
      present: ['Basic REST consumption', 'Component styling'],
      absent: ['Shader performance optimization', 'Webpack custom compilation overrides', 'Rendering loops'],
      score: 34
    },
    narrative: 'Candidate claims Lead title but work history reflects routine task execution. High pride index on basic git configurations. Significant gap in expected insider knowledge for high-scale frontend systems.',
    questions: [
      'You mentioned configuring Webpack from scratch on Next.js. Next.js uses Turbopack/SWC compiler natively. What specific config did you override and why?',
      'Can you detail the rendering lifecycle of a React Server Component versus a Client Component under Next.js 14 App Router?',
      'How did you optimize paint times and reduce layout shifts in your 3D canvas implementation?'
    ]
  }
];

export default function DashboardDemo() {
  const [trajWeight, setTrajWeight] = useState(40);
  const [behWeight, setBehWeight] = useState(30);
  const [depthWeight, setDepthWeight] = useState(30);
  const [activeCandidateId, setActiveCandidateId] = useState<string>('1');

  const [candidates, setCandidates] = useState<Array<Candidate & { calculatedScore: number }>>([]);

  // Recalculate scores when weights change
  useEffect(() => {
    const total = trajWeight + behWeight + depthWeight;
    const wTraj = trajWeight / total;
    const wBeh = behWeight / total;
    const wDepth = depthWeight / total;

    const updated = mockCandidates.map(c => {
      const score = Math.round(
        c.baseTrajectoryScore * wTraj +
        c.baseBehaviourScore * wBeh +
        c.baseDepthScore * wDepth
      );
      return {
        ...c,
        calculatedScore: score
      };
    });

    updated.sort((a, b) => b.calculatedScore - a.calculatedScore);
    setCandidates(updated);
  }, [trajWeight, behWeight, depthWeight]);

  const activeCandidate = candidates.find(c => c.id === activeCandidateId) || candidates[0];

  const getTrajectoryBadgeStyles = (trajectory: string) => {
    switch (trajectory) {
      case 'ACCELERATING':
        return 'bg-[#F0F4FF] text-[#0000FF] border-[#0000FF]/20';
      case 'STEADY':
        return 'bg-[#FAFAFA] text-[#4A4A4A] border-[#E5E5E5]';
      case 'PLATEAUED':
        return 'bg-[#FFFBF0] text-[#C47D10] border-[#C47D10]/20';
      case 'DECLINING':
        return 'bg-[#FFF5F5] text-[#D4382C] border-[#D4382C]/20';
      default:
        return 'bg-[#FAFAFA] text-[#4A4A4A] border-[#E5E5E5]';
    }
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 70) return 'text-[#0000FF]';
    if (score >= 40) return 'text-[#C47D10]';
    return 'text-[#D4382C]';
  };

  const getScoreBgClass = (score: number) => {
    if (score >= 70) return 'bg-[#0000FF]';
    if (score >= 40) return 'bg-[#C47D10]';
    return 'bg-[#D4382C]';
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 text-[#0A0A0A] font-mono text-sm max-w-6xl mx-auto">
      
      {/* Sidebar / Controls Panel (col-span-4) */}
      <div className="lg:col-span-4 rounded-md border border-[#0000FF] bg-[#FAFAFA] p-6 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-4 border-b border-[#E5E5E5] pb-3">
            <Sliders className="w-4 h-4 text-[#0000FF]" />
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#0A0A0A]">
              DECISION_WEIGHTS
            </h3>
          </div>
          
          <p className="text-xs text-[#4A4A4A] leading-relaxed mb-6 font-mono">
            Adjust weighting dimensions. Recruiter-X dynamically calculates match scores and re-ranks the pool in real-time.
          </p>

          <div className="space-y-6">
            {/* Trajectory Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#4A4A4A]">
                <span>TRAJECTORY_PROGRESSION</span>
                <span className="text-[#0000FF] font-data">{trajWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={trajWeight}
                onChange={(e) => setTrajWeight(Number(e.target.value))}
                className="w-full accent-[#0000FF]"
              />
              <span className="text-[10px] text-[#8C8C8C] block leading-tight">
                Seniority acceleration speed vs career age.
              </span>
            </div>

            {/* Behaviour Signal Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#4A4A4A]">
                <span>BEHAVIOUR_SIGNALS</span>
                <span className="text-[#0000FF] font-data">{behWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={behWeight}
                onChange={(e) => setBehWeight(Number(e.target.value))}
                className="w-full accent-[#0000FF]"
              />
              <span className="text-[10px] text-[#8C8C8C] block leading-tight">
                Ownership pronouns vs task-driven outputs.
              </span>
            </div>

            {/* Technical Depth Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#4A4A4A]">
                <span>TECHNICAL_DEPTH</span>
                <span className="text-[#0000FF] font-data">{depthWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={depthWeight}
                onChange={(e) => setDepthWeight(Number(e.target.value))}
                className="w-full accent-[#0000FF]"
              />
              <span className="text-[10px] text-[#8C8C8C] block leading-tight">
                Insider jargon checklist vs pride-mismatches.
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Rank List */}
        <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#4A4A4A] mb-3">
            RANKED_SHORTLIST
          </h4>
          <div className="space-y-2">
            {candidates.map((c, index) => (
              <div
                key={c.id}
                onClick={() => setActiveCandidateId(c.id)}
                className={`p-3 rounded border cursor-pointer transition-all flex items-center justify-between ${
                  activeCandidateId === c.id
                    ? 'border-[#0000FF] bg-[#F0F4FF] font-bold'
                    : 'border-[#E5E5E5] bg-white hover:border-[#0000FF]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-data text-[#8C8C8C]">#{index + 1}</span>
                  <span className="text-xs truncate max-w-[120px] md:max-w-none">{c.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-data text-xs font-bold ${getScoreColorClass(c.calculatedScore)}`}>
                    {c.calculatedScore}/100
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 ${activeCandidateId === c.id ? 'text-[#0000FF]' : 'text-[#8C8C8C]'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace Demo (col-span-8) */}
      <div className="lg:col-span-8 space-y-6">
        {activeCandidate && (
          <div className="rounded-md border border-[#E5E5E5] bg-white p-6 shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E5E5] pb-4 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-display font-bold text-lg text-[#0A0A0A]">
                    {activeCandidate.name}
                  </h3>
                  <span className={`border text-[10px] font-bold px-2 py-0.5 rounded tracking-wide ${getTrajectoryBadgeStyles(activeCandidate.trajectory)}`}>
                    {activeCandidate.trajectory}
                  </span>
                </div>
                <p className="text-xs text-[#4A4A4A] font-mono">
                  {activeCandidate.statedRole}
                </p>
              </div>

              <div className="text-left sm:text-right flex items-baseline sm:flex-col justify-between sm:justify-center">
                <span className="text-xs text-[#8C8C8C] font-mono block">MATCH_SCORE</span>
                <span className="font-data text-3xl font-medium tracking-tight flex items-baseline">
                  <span className={getScoreColorClass(activeCandidate.calculatedScore)}>
                    {activeCandidate.calculatedScore}
                  </span>
                  <span className="text-neutral-300 text-base">/100</span>
                </span>
              </div>
            </div>

            {/* Red Flags if any */}
            {activeCandidate.redFlags.length > 0 && (
              <div className="bg-[#FFF5F5] border border-[#D4382C]/20 rounded p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#D4382C] text-xs font-bold uppercase">
                  <AlertTriangle className="w-4 h-4 text-[#D4382C]" />
                  <span>RED_FLAGS_DETECTED ({activeCandidate.redFlags.length})</span>
                </div>
                <div className="space-y-1 pl-6">
                  {activeCandidate.redFlags.map((flag, idx) => (
                    <div key={idx} className="text-xs text-[#0A0A0A]">
                      <span className="font-bold text-[#D4382C] mr-1">[{flag.type} - {flag.severity.toUpperCase()}]:</span>
                      {flag.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Score Breakdown metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider block">TRAJECTORY_PROGRESSION</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 bg-neutral-100 rounded-full flex-1 overflow-hidden">
                    <div 
                      className={`h-full ${getScoreBgClass(activeCandidate.baseTrajectoryScore)}`} 
                      style={{ width: `${activeCandidate.baseTrajectoryScore}%` }}
                    />
                  </div>
                  <span className="text-xs font-data font-bold text-[#0A0A0A] min-w-[24px]">
                    {activeCandidate.baseTrajectoryScore}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider block">BEHAVIOUR_SIGNALS</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 bg-neutral-100 rounded-full flex-1 overflow-hidden">
                    <div 
                      className={`h-full ${getScoreBgClass(activeCandidate.baseBehaviourScore)}`} 
                      style={{ width: `${activeCandidate.baseBehaviourScore}%` }}
                    />
                  </div>
                  <span className="text-xs font-data font-bold text-[#0A0A0A] min-w-[24px]">
                    {activeCandidate.baseBehaviourScore}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider block">TECHNICAL_DEPTH</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 bg-neutral-100 rounded-full flex-1 overflow-hidden">
                    <div 
                      className={`h-full ${getScoreBgClass(activeCandidate.baseDepthScore)}`} 
                      style={{ width: `${activeCandidate.baseDepthScore}%` }}
                    />
                  </div>
                  <span className="text-xs font-data font-bold text-[#0A0A0A] min-w-[24px]">
                    {activeCandidate.baseDepthScore}
                  </span>
                </div>
              </div>
            </div>

            {/* Brief Narrative */}
            <div className="space-y-1.5 border-t border-[#E5E5E5] pt-4">
              <span className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider block">AI_NARRATIVE_AUDIT</span>
              <p className="text-xs text-[#0A0A0A] leading-relaxed font-mono bg-[#FAFAFA] border border-[#E5E5E5] p-3 rounded">
                {activeCandidate.narrative}
              </p>
            </div>

            {/* Insider signals */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider block">
                INSIDER_SIGNALS (Checked: {activeCandidate.insiderSignals.score}%)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Present */}
                <div className="border border-green-200/50 bg-[#F0FDF4] p-3 rounded space-y-1.5">
                  <div className="font-bold text-[#166534] flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>VERIFIED_SIGNALS</span>
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-neutral-600 text-[11px] leading-tight">
                    {activeCandidate.insiderSignals.present.map((sig, i) => (
                      <li key={i}>{sig}</li>
                    ))}
                  </ul>
                </div>

                {/* Absent */}
                <div className="border border-yellow-200/50 bg-[#FFFBF0] p-3 rounded space-y-1.5">
                  <div className="font-bold text-[#C47D10] flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    <span>CONSPICUOUS_ABSENCE</span>
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-neutral-600 text-[11px] leading-tight">
                    {activeCandidate.insiderSignals.absent.map((sig, i) => (
                      <li key={i}>{sig}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Custom generated Interrogation Questions */}
            <div className="space-y-3 border-t border-[#E5E5E5] pt-4">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#0000FF]">
                <HelpCircle className="w-4 h-4" />
                <span>INTERROGATION_QUESTIONS</span>
              </div>
              <p className="text-xs text-[#4A4A4A] leading-relaxed font-mono">
                The candidate claims high competence in these areas. Standard interviews won&apos;t detect inflation; these targeted technical probes are generated specifically to verify actual depth:
              </p>
              <div className="space-y-2">
                {activeCandidate.questions.map((q, idx) => (
                  <div key={idx} className="bg-[#F0F4FF] border border-[#0000FF]/20 p-3 rounded text-xs flex items-start gap-2.5 font-mono">
                    <span className="font-data font-bold text-[#0000FF] bg-[#0000FF]/15 text-[11px] px-1.5 py-0.5 rounded leading-none mt-0.5 border border-[#0000FF]/25">
                      Q{idx + 1}
                    </span>
                    <span className="text-[#0A0A0A] leading-relaxed">
                      {q}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
