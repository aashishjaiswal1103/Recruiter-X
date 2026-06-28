'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileSearch,
  Ghost,
  Brain,
  ShieldCheck,
  Target,
  SlidersHorizontal,
  MessageSquareWarning,
} from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: FileSearch,
    title: 'JD Audit',
    description: 'Your job description is parsed, structured, and scored. Must-haves are separated from nice-to-haves. Vague language is flagged. Hidden expectations are surfaced.',
    mockup: {
      type: 'jd-audit',
      title: 'JD Audit Report',
      score: 72,
      items: [
        { label: 'Must-Have Skills', values: ['Distributed Systems', 'Go/Rust', 'Kubernetes'] },
        { label: 'Nice-to-Have', values: ['ML Pipeline Exp', 'Team Lead'] },
        { label: 'Hidden Expectations', values: ['Production incident handling', 'On-call rotation'] },
      ],
      warnings: ['Vague: "fast-paced environment"', 'Contradicts: "junior" + "10yr exp"'],
    },
  },
  {
    num: '02',
    icon: Ghost,
    title: 'Ghost Candidate',
    description: 'A synthetic ideal candidate is constructed from the JD — not from who applied. This becomes the fixed benchmark every real candidate is measured against.',
    mockup: {
      type: 'ghost',
      title: 'Ghost Candidate Profile',
      career: '8yr trajectory: Backend → Platform → Staff Eng',
      signals: ['Production systems at scale', 'Cross-team coordination', 'Post-mortem culture'],
      absences: ['Would never highlight CI/CD setup', 'Wouldn\'t lead with Docker'],
    },
  },
  {
    num: '03',
    icon: Brain,
    title: 'Candidate Deep Analysis',
    description: 'Three layers run in parallel: career trajectory analysis, behavioral signal detection, and credibility auditing with red flag identification.',
    mockup: {
      type: 'analysis',
      title: 'Deep Analysis — Sarah Chen',
      trajectory: { label: 'ACCELERATING', score: 92, color: 'text-green-400' },
      behaviour: { label: 'IMPACT-ORIENTED', score: 85, color: 'text-blue-light' },
      flags: [
        { text: 'Responsibility inflation detected', severity: 'HIGH' },
        { text: 'Achievement echo verified', severity: 'OK' },
      ],
    },
  },
  {
    num: '04',
    icon: ShieldCheck,
    title: 'Insider Signal Test',
    description: 'Every real expert knows things so deeply they\'d never mention them. This detector checks for presence of insider signals and flags suspicious pride markers.',
    mockup: {
      type: 'insider',
      title: 'Insider Signal Report',
      present: 7,
      total: 10,
      absent: ['Production incident handling', 'Cross-team dependency resolution', 'System failure post-mortems'],
      pride: ['Set up CI/CD pipeline as Senior Engineer', '"First to implement Docker in the team" (2024)'],
    },
  },
  {
    num: '05',
    icon: Target,
    title: 'Ghost Match Score',
    description: 'Every candidate is scored 0–100 against the Ghost benchmark. Gap reports show exactly where they fall short and where they exceed expectations.',
    mockup: {
      type: 'score',
      title: 'Ghost Match Score',
      score: 87,
      gaps: [
        { dim: 'Trajectory', score: 92, max: 100 },
        { dim: 'Behaviour', score: 85, max: 100 },
        { dim: 'Insider', score: 78, max: 100 },
        { dim: 'Credibility', score: 91, max: 100 },
      ],
    },
  },
  {
    num: '06',
    icon: SlidersHorizontal,
    title: 'Hybrid Ranker',
    description: 'All dimensions fuse into a single ranked shortlist. Weight sliders let you prioritise what matters most — trajectory vs. credibility vs. insider signals.',
    mockup: {
      type: 'ranker',
      title: 'Ranked Shortlist',
      candidates: [
        { rank: 1, name: 'Sarah Chen', score: 94, label: 'Strong Match' },
        { rank: 2, name: 'James Park', score: 88, label: 'Good Match' },
        { rank: 3, name: 'Priya Sharma', score: 85, label: 'Good Match' },
        { rank: 4, name: 'Alex Rivera', score: 71, label: 'Fair Match' },
      ],
      weights: [
        { label: 'Trajectory', pct: 25 },
        { label: 'Behaviour', pct: 25 },
        { label: 'Ghost Match', pct: 25 },
        { label: 'Insider', pct: 15 },
        { label: 'Credibility', pct: 10 },
      ],
    },
  },
  {
    num: '07',
    icon: MessageSquareWarning,
    title: 'Interrogation Engine',
    description: 'Three surgical interview questions per candidate, calibrated to their specific suspicious gaps. A real practitioner answers instantly. An inflator cannot.',
    mockup: {
      type: 'interrogation',
      title: 'Interrogation Questions — Sarah Chen',
      questions: [
        { q: 'Walk me through the specific tradeoffs you made when designing the sharding strategy at Coinbase. What broke first?', claim: 'Led distributed system migration' },
        { q: 'Your resume says "reduced inference latency 40%". What was the baseline measurement methodology, and what were the three biggest bottlenecks?', claim: 'ML pipeline optimization' },
        { q: 'Describe the last production incident you owned at Stripe. What was your specific role in the fix — not the team\'s, yours?', claim: 'Senior Engineering role' },
      ],
    },
  },
];

/* ── Step Mockup Renderer ──────────────────── */

function StepMockup({ data }: { data: (typeof STEPS)[number]['mockup'] }) {
  if (data.type === 'jd-audit') {
    const d = data as typeof STEPS[0]['mockup'] & { score: number; items: { label: string; values: string[] }[]; warnings: string[] };
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-display font-semibold text-white text-sm">{d.title}</span>
          <div className="flex items-center gap-2">
            <span className="font-data text-xs text-white/40">Quality</span>
            <span className="font-data text-lg font-bold gradient-text">{d.score}</span>
          </div>
        </div>
        {d.items.map((item, i) => (
          <div key={i}>
            <div className="font-data text-[10px] uppercase tracking-wider text-white/40 mb-1.5">{item.label}</div>
            <div className="flex flex-wrap gap-1.5">
              {item.values.map((v, j) => (
                <span key={j} className="px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-xs font-body">{v}</span>
              ))}
            </div>
          </div>
        ))}
        <div className="pt-3 border-t border-white/10">
          <div className="font-data text-[10px] uppercase tracking-wider text-amber-400/70 mb-1.5">Warnings</div>
          {d.warnings.map((w, i) => (
            <div key={i} className="text-xs text-amber-300/80 font-body mb-1">⚠ {w}</div>
          ))}
        </div>
      </div>
    );
  }

  if (data.type === 'ghost') {
    const d = data as typeof STEPS[1]['mockup'] & { career: string; signals: string[]; absences: string[] };
    return (
      <div className="space-y-4">
        <div className="font-display font-semibold text-white text-sm">{d.title}</div>
        <div className="glass-card !bg-white/5 p-4 rounded-xl">
          <div className="font-data text-[10px] uppercase tracking-wider text-white/40 mb-1">Ideal Career Arc</div>
          <div className="font-body text-sm text-white/80">{d.career}</div>
        </div>
        <div>
          <div className="font-data text-[10px] uppercase tracking-wider text-green-400/70 mb-1.5">Expected Signals</div>
          {d.signals.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-white/70 font-body mb-1">
              <span className="text-green-400">✓</span> {s}
            </div>
          ))}
        </div>
        <div>
          <div className="font-data text-[10px] uppercase tracking-wider text-red-400/70 mb-1.5">Would Never Highlight</div>
          {d.absences.map((a, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-white/50 font-body mb-1">
              <span className="text-red-400">✕</span> {a}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.type === 'analysis') {
    const d = data as typeof STEPS[2]['mockup'] & { trajectory: { label: string; score: number; color: string }; behaviour: { label: string; score: number; color: string }; flags: { text: string; severity: string }[] };
    return (
      <div className="space-y-4">
        <div className="font-display font-semibold text-white text-sm">{d.title}</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card !bg-white/5 p-4 rounded-xl text-center">
            <div className="font-data text-[10px] uppercase tracking-wider text-white/40 mb-1">Trajectory</div>
            <div className={`font-data text-2xl font-bold ${d.trajectory.color}`}>{d.trajectory.score}</div>
            <div className="font-data text-[10px] text-green-400 mt-1">{d.trajectory.label}</div>
          </div>
          <div className="glass-card !bg-white/5 p-4 rounded-xl text-center">
            <div className="font-data text-[10px] uppercase tracking-wider text-white/40 mb-1">Behaviour</div>
            <div className={`font-data text-2xl font-bold ${d.behaviour.color}`}>{d.behaviour.score}</div>
            <div className="font-data text-[10px] text-blue-light mt-1">{d.behaviour.label}</div>
          </div>
        </div>
        <div>
          <div className="font-data text-[10px] uppercase tracking-wider text-white/40 mb-2">Red Flags</div>
          {d.flags.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-body mb-1.5">
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-data font-bold ${f.severity === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {f.severity}
              </span>
              <span className="text-white/70">{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.type === 'insider') {
    const d = data as typeof STEPS[3]['mockup'] & { present: number; total: number; absent: string[]; pride: string[] };
    return (
      <div className="space-y-4">
        <div className="font-display font-semibold text-white text-sm">{d.title}</div>
        <div className="glass-card !bg-white/5 p-4 rounded-xl">
          <div className="flex items-baseline gap-1">
            <span className="font-data text-3xl font-bold gradient-text">{d.present}</span>
            <span className="font-data text-lg text-white/30">/{d.total}</span>
          </div>
          <div className="font-body text-xs text-white/50 mt-1">Insider Signals Present</div>
        </div>
        <div>
          <div className="font-data text-[10px] uppercase tracking-wider text-amber-400/70 mb-1.5">Signals Absent</div>
          {d.absent.map((a, i) => (
            <div key={i} className="text-xs text-white/60 font-body mb-1">— {a}</div>
          ))}
        </div>
        <div>
          <div className="font-data text-[10px] uppercase tracking-wider text-red-400/70 mb-1.5">Pride Flags Raised</div>
          {d.pride.map((p, i) => (
            <div key={i} className="text-xs text-red-300/70 font-body mb-1">🚩 {p}</div>
          ))}
        </div>
      </div>
    );
  }

  if (data.type === 'score') {
    const d = data as typeof STEPS[4]['mockup'] & { score: number; gaps: { dim: string; score: number; max: number }[] };
    return (
      <div className="space-y-4">
        <div className="font-display font-semibold text-white text-sm">{d.title}</div>
        <div className="text-center py-4">
          <div className="font-display text-6xl font-bold gradient-text">{d.score}</div>
          <div className="font-body text-sm text-white/50 mt-2">out of 100</div>
        </div>
        <div className="space-y-3">
          {d.gaps.map((g, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <span className="font-data text-[11px] text-white/50">{g.dim}</span>
                <span className="font-data text-[11px] text-white/70">{g.score}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue to-blue-light rounded-full transition-all duration-700"
                  style={{ width: `${g.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.type === 'ranker') {
    const d = data as typeof STEPS[5]['mockup'] & { candidates: { rank: number; name: string; score: number; label: string }[]; weights: { label: string; pct: number }[] };
    return (
      <div className="space-y-4">
        <div className="font-display font-semibold text-white text-sm">{d.title}</div>
        <div className="space-y-2">
          {d.candidates.map((c, i) => (
            <div key={i} className="flex items-center gap-3 glass-card !bg-white/5 p-3 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue to-blue-mid flex items-center justify-center text-white font-data text-xs font-bold">
                {c.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-sm font-medium text-white">{c.name}</div>
                <div className="font-body text-[11px] text-white/40">{c.label}</div>
              </div>
              <div className="font-data text-sm font-bold gradient-text">{c.score}</div>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t border-white/10">
          <div className="font-data text-[10px] uppercase tracking-wider text-white/40 mb-2">Weight Sliders</div>
          {d.weights.map((w, i) => (
            <div key={i} className="flex items-center gap-2 mb-1.5">
              <span className="font-data text-[10px] text-white/50 w-20">{w.label}</span>
              <div className="flex-1 h-1 bg-white/10 rounded-full">
                <div className="h-full bg-blue-light/50 rounded-full" style={{ width: `${w.pct * 3}%` }} />
              </div>
              <span className="font-data text-[10px] text-white/40 w-8 text-right">{w.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.type === 'interrogation') {
    const d = data as typeof STEPS[6]['mockup'] & { questions: { q: string; claim: string }[] };
    return (
      <div className="space-y-4">
        <div className="font-display font-semibold text-white text-sm">{d.title}</div>
        <div className="space-y-3">
          {d.questions.map((item, i) => (
            <div key={i} className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-data text-[10px] text-blue-light/60 uppercase tracking-wider">Q{i + 1}</span>
                <span className="font-data text-[9px] text-white/30 uppercase">Probes: {item.claim}</span>
              </div>
              <div className="font-data text-xs text-green-300/80 leading-relaxed">
                <span className="text-green-400/50 mr-1">&gt;</span> {item.q}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

/* ── Main Component ──────────────────────────── */

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = stepsRef.current.map((el, i) => {
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveStep(i);
        },
        { threshold: 0.5, rootMargin: '-20% 0px -40% 0px' }
      );
      observer.observe(el);
      return observer;
    });

    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);

  const ActiveIcon = STEPS[activeStep].icon;

  return (
    <section id="how-it-works" className="relative bg-white py-24 md:py-32">
      <div className="max-w-content mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="font-data text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-blue)] mb-4">
            HOW IT WORKS
          </div>
          <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.1] text-[var(--text-primary)] tracking-tight max-w-2xl mx-auto">
            Seven layers of intelligence. One ranked shortlist.
          </h2>
        </div>

        {/* Two-Panel Layout */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Left: Steps List */}
          <div className="space-y-8 md:space-y-12">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = activeStep === i;
              return (
                <div
                  key={i}
                  ref={(el) => { stepsRef.current[i] = el; }}
                  className={`relative pl-16 transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  {/* Step Number */}
                  <div className={`absolute left-0 top-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-br from-blue to-blue-mid shadow-glow-blue'
                      : 'bg-[var(--bg-muted)]'
                  }`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[var(--text-tertiary)]'}`} />
                  </div>

                  {/* Content */}
                  <div>
                    <div className="font-data text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-1">
                      Step {step.num}
                    </div>
                    <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mb-2">
                      {step.title}
                    </h3>
                    <p className="font-body text-[15px] text-[var(--text-secondary)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Sticky Mockup */}
          <div className="hidden md:block">
            <div className="sticky top-32">
              <div className="bg-[var(--color-black-soft)] rounded-2xl p-6 shadow-float min-h-[480px] transition-all duration-500">
                {/* Mockup Header */}
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
                      <ActiveIcon className="w-3.5 h-3.5 text-blue-light" />
                      <span className="font-data text-[10px] text-white/40">recruiter-x / {STEPS[activeStep].title.toLowerCase().replace(/ /g, '-')}</span>
                    </div>
                  </div>
                </div>

                {/* Mockup Content */}
                <div className="transition-opacity duration-300">
                  <StepMockup data={STEPS[activeStep].mockup} />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Inline Mockups */}
          <div className="md:hidden">
            <div className="bg-[var(--color-black-soft)] rounded-2xl p-6 shadow-float">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="font-data text-[9px] text-white/30">{STEPS[activeStep].title}</span>
              </div>
              <StepMockup data={STEPS[activeStep].mockup} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
