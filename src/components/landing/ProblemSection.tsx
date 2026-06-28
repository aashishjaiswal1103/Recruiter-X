'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Search, TrendingDown, Clock } from 'lucide-react';

const PROBLEM_CARDS = [
  {
    icon: Search,
    title: 'Keyword Matching Theater',
    description: 'ATS tools filter by keywords, not competence. Candidates who know the right buzzwords pass. Candidates who do the actual work often don\'t.',
    stat: '60–70%',
    statLabel: 'of applicants pass ATS despite not meeting baseline requirements',
  },
  {
    icon: TrendingDown,
    title: 'Inflation Goes Undetected',
    description: 'No tool checks whether "Led a team of 12" matches a job title that says "Junior Developer." The resume says one thing. The career says another.',
    stat: '40–50%',
    statLabel: 'of resumes contain at least one materially inflated claim',
  },
  {
    icon: Clock,
    title: 'Ranking by Arrival, Not Fit',
    description: 'Resumes are reviewed in the order they arrive. The best candidate in the pile is just as likely to be #147 as #1. Nobody has time for #147.',
    stat: '6–8s',
    statLabel: 'average time a recruiter spends on initial resume scan',
  },
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-white py-24 md:py-32">
      <div className="max-w-content mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-start">
          {/* Left — Editorial */}
          <div className={`space-y-6 ${isVisible ? 'reveal' : 'opacity-0'}`}>
            <div className="font-data text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-blue)]">
              THE PROBLEM
            </div>
            <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.1] text-[var(--text-primary)] tracking-tight">
              The hiring system rewards resume writers, not capable candidates.
            </h2>
            <div className="space-y-5 font-body text-base text-[var(--text-secondary)] leading-relaxed">
              <p>
                A typical senior role attracts 150–400 applications. Your ATS filters by keyword. Your recruiters spend 6 seconds per resume. The system is a lottery dressed as a process.
              </p>
              <p>
                The candidates who surface aren&apos;t the most qualified — they&apos;re the most optimised. They know the keywords. They inflate the titles. They write resumes designed to pass filters, not prove competence.
              </p>
              <p>
                Meanwhile, the engineer who actually built the thing — but wrote a terse, honest resume — sits at position #147 in the pile. Nobody gets to #147.
              </p>
            </div>
          </div>

          {/* Right — Problem Cards */}
          <div className="space-y-5">
            {PROBLEM_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className={`bg-[var(--color-black-soft)] rounded-2xl p-6 text-white transition-all duration-500 ${
                    isVisible ? 'reveal' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${(i + 1) * 120}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-blue-light" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-lg text-white mb-2">
                        {card.title}
                      </h3>
                      <p className="font-body text-sm text-white/60 leading-relaxed mb-4">
                        {card.description}
                      </p>
                      <div className="flex items-baseline gap-2 pt-3 border-t border-white/10">
                        <span className="font-data text-2xl font-bold gradient-text">
                          {card.stat}
                        </span>
                        <span className="font-body text-xs text-white/40">
                          {card.statLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
