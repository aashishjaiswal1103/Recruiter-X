'use client';

import React from 'react';
import { 
  Ghost, 
  MessageSquareWarning, 
  Activity, 
  FileSearch, 
  TrendingUp, 
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';

export default function FeaturesGrid() {
  return (
    <section id="features" className="relative bg-[#FAFAFA] py-24 md:py-32 border-t border-gray-150">
      <div className="max-w-content mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="font-data text-xs font-bold uppercase tracking-wider text-blue mb-3 block">
            CORE CAPABILITIES
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-black tracking-tight max-w-xl mx-auto">
            Seven layers of candidate analysis.
          </h2>
        </div>

        {/* Asymmetrical Bento Grid (Layout: Image 2, Style: Image 3, Colors: Strict Black, Blue, and White) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[250px]">
          
          {/* Card 1: Ghost Candidate Benchmark (Wide top-left, md:col-span-2)
              Color: Deep Black with white text */}
          <div className="md:col-span-2 bg-[#0A0A0A] text-white rounded-3xl p-8 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Ghost className="w-5 h-5 text-blue-light" />
                <span className="font-data text-[10px] font-bold uppercase tracking-wider text-white/50">BENCHMARK</span>
              </div>
              <h3 className="font-display text-2xl font-extrabold text-white mb-2 tracking-tight uppercase">
                Ghost Candidate Benchmark
              </h3>
              <p className="font-body text-sm text-white/60 max-w-xl leading-relaxed">
                A synthetic ideal candidate profile is constructed from your job description first. Every real resume is compared to this fixed reference point, bypassing the usual candidate-to-candidate bias.
              </p>
            </div>
            
            {/* Chroma style diagram */}
            <div className="mt-4 border-t border-white/10 pt-4 flex items-center justify-between text-xs font-data text-white/80">
              <div className="flex gap-4">
                <span>[Raw JD]</span>
                <span className="opacity-30">→</span>
                <span className="font-bold text-blue-light">[Ghost candidate archetype]</span>
                <span className="opacity-30">→</span>
                <span>[Shortlist Output]</span>
              </div>
              <span className="font-bold flex items-center gap-1 text-blue-light">
                94% Match <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Pool Health Report (Top right, md:col-span-1)
              Color: Vibrant Blue with white text */}
          <div className="bg-[#0000FF] text-white rounded-3xl p-8 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-white" />
                <span className="font-data text-[10px] font-bold uppercase tracking-wider text-white/60">ANALYTICS</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2 uppercase tracking-tight">
                Pool Health
              </h3>
              <p className="font-body text-xs text-white/80 leading-relaxed">
                Meta-analysis of applicant pool qualification vs resume inflation.
              </p>
            </div>
            
            {/* Outline Stat Block */}
            <div className="space-y-1.5 mt-4 font-data text-xs">
              <div className="flex justify-between border-b border-white/20 pb-1">
                <span className="text-white/50">Qualified Fit</span>
                <span className="font-bold text-white">7.4%</span>
              </div>
              <div className="flex justify-between border-b border-white/20 pb-1">
                <span className="text-white/50">Inflation Rate</span>
                <span className="font-bold text-white">41%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Gems Found</span>
                <span className="font-bold text-white">3</span>
              </div>
            </div>
          </div>

          {/* Card 3: Interrogation Engine (Middle Left, md:col-span-1)
              Color: Deep Black with white text */}
          <div className="bg-[#0A0A0A] text-white rounded-3xl p-8 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquareWarning className="w-5 h-5 text-blue-light" />
                <span className="font-data text-[10px] font-bold uppercase tracking-wider text-white/50">PROBE ENGINE</span>
              </div>
              <h3 className="font-display text-xl font-extrabold text-white mb-2 uppercase tracking-tight">
                Interrogation
              </h3>
              <p className="font-body text-xs text-white/60 leading-relaxed">
                Custom interview questions designed to probe specific gaps.
              </p>
            </div>
            
            {/* White card inset like Wope */}
            <div className="mt-4 bg-white text-black border border-gray-200 rounded-xl p-4 shadow-sm">
              <span className="font-data text-[9px] text-[#0000FF] uppercase font-bold block mb-1">PROBE #1</span>
              <p className="font-data text-[10px] leading-snug font-bold">
                &quot;What broke first when you crossed 10K QPS on the sharding migration?&quot;
              </p>
            </div>
          </div>

          {/* Card 4: JD Quality Audit (Middle Center, md:col-span-1)
              Color: Pure White with distinct gray border */}
          <div className="bg-white border-2 border-gray-200/80 text-black rounded-3xl p-8 flex flex-col justify-between hover:border-gray-300 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileSearch className="w-5 h-5 text-blue" />
                <span className="font-data text-[10px] font-bold uppercase tracking-wider text-black/40">SANITATION</span>
              </div>
              <h3 className="font-display text-xl font-bold text-black mb-2 uppercase tracking-tight">
                JD Audit
              </h3>
              <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed">
                Flags vague criteria and impossible requirements.
              </p>
            </div>
            
            <div className="mt-4 bg-gray-50 rounded-xl p-3 border border-gray-200 font-data text-[10px] text-black/70">
              <div className="font-bold text-red-600">⚠ Chronological Mismatch</div>
              <div className="mt-1 opacity-80">&quot;10+ Yr Experience: Transformers&quot; (Created 2017)</div>
            </div>
          </div>

          {/* Card 6: Hybrid Ranker (Middle & Bottom Right, Tall, md:col-span-1, md:row-span-2)
              Color: Pure White with distinct gray border */}
          <div className="md:row-span-2 bg-white border-2 border-gray-200/80 text-black rounded-3xl p-8 flex flex-col justify-between hover:border-gray-300 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-5 h-5 text-blue" />
                <span className="font-data text-[10px] font-bold uppercase tracking-wider text-black/40">WEIGHTS</span>
              </div>
              <h3 className="font-display text-2xl font-extrabold text-black mb-3 uppercase tracking-tight">
                Hybrid Ranker
              </h3>
              <p className="font-body text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                Adjust the weights of each dimension. Recalculate and rerank your shortlist in real-time as your hiring priorities shift.
              </p>
            </div>

            {/* Slider inputs inside (Chroma style) */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between font-data text-[10px] text-gray-400">
                  <span>Trajectory</span>
                  <span className="text-black font-bold">45%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between font-data text-[10px] text-gray-400">
                  <span>Insider Signals</span>
                  <span className="text-black font-bold">35%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-data text-[10px] text-gray-400">
                  <span>Behavioral Fit</span>
                  <span className="text-black font-bold">20%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
            </div>

            <div className="font-data text-[10px] text-gray-400 border-t border-gray-100 pt-4 mt-6">
              Sliders adapt candidate order dynamically
            </div>
          </div>

          {/* Card 5: Trajectory Analyzer (Bottom wide, md:col-span-2)
              Color: Vibrant Blue with white text */}
          <div className="md:col-span-2 bg-[#0000FF] text-white rounded-3xl p-8 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-white" />
                <span className="font-data text-[10px] font-bold uppercase tracking-wider text-white/50">GROWTH PATH</span>
              </div>
              <h3 className="font-display text-2xl font-extrabold text-white mb-2 tracking-tight uppercase">
                Trajectory Analyzer
              </h3>
              <p className="font-body text-sm text-white/80 max-w-xl leading-relaxed">
                Tracks company tier transitions, role promotion velocity, and responsibility scope increases. Separates structural builders from resting operators.
              </p>
            </div>
            
            {/* Vector graph and badge */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="h-8 flex-1 max-w-xs relative flex items-end">
                <svg className="w-full h-full text-white" viewBox="0 0 100 40" fill="none" preserveAspectRatio="none">
                  <path d="M0 35 Q30 30 50 15 T100 2" stroke="currentColor" strokeWidth="2" />
                  <circle cx="50" cy="15" r="3" fill="currentColor" />
                  <circle cx="100" cy="2" r="3" fill="currentColor" />
                </svg>
              </div>
              <span className="font-data text-xs text-white font-bold bg-white/15 px-2.5 py-0.5 rounded-full">
                Accelerating Trajectory
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
