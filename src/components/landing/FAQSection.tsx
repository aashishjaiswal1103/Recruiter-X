'use client';

import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

const QUESTIONS = [
  {
    question: 'How is Recruiter-X different from an ATS?',
    answer: 'An ATS manages your hiring pipeline — it tracks where candidates are in the process. Recruiter-X is the intelligence layer that sits between applications and your decisions. It analyzes depth, detects inflation, benchmarks against ideal, and generates interview questions. We integrate with your ATS, not replace it.',
  },
  {
    question: 'Does Recruiter-X store our resumes?',
    answer: 'Resumes are processed and stored encrypted (AES-256) in your organisation\'s isolated partition on Supabase. Row-Level Security ensures no cross-org access — enforced at the database level, not just application level. You can delete any candidate\'s data at any time, triggering a full cascade delete across all tables and storage.',
  },
  {
    question: 'Is Recruiter-X GDPR compliant?',
    answer: 'Yes. Under GDPR Article 22, individuals have the right not to be subject to solely automated decisions. Recruiter-X outputs are explicitly recommendations — the system never makes hiring decisions. Every score includes human-readable reasoning. Data Subject Access Requests (DSAR) are supported: candidates can request deletion via the recruiter, who has a one-click delete function.',
  },
  {
    question: 'How does BYOK actually work? What does it cost?',
    answer: 'You bring your own API key from Google (Gemini), Anthropic (Claude), or OpenAI. Your resumes are sent directly to the LLM provider under your account — we never intermediate the data in-flight. Typical cost: ~$0.067 per candidate with Gemini 1.5 Pro. A batch of 50 candidates costs roughly $3.35. You see estimated and actual costs before and after every analysis run.',
  },
  {
    question: 'How long does analysis take?',
    answer: 'JD Audit: under 15 seconds. Ghost Candidate generation: under 20 seconds. Full candidate analysis (all layers): under 45 seconds. A batch of 50 candidates completes in under 15 minutes. Three analysis layers run in parallel per candidate to maximize throughput.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="relative bg-[#020212] py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Large Rounded Container Card (Black with blue text style) */}
        <div className="bg-[#0A0A0A] rounded-[32px] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.6)] p-8 md:p-16 flex flex-col items-center">
          
          {/* Header */}
          <div className="text-center mb-12">
            <span className="font-data text-xs font-bold uppercase tracking-wider text-blue-light mb-3 block">
              SUPPORT
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="font-body text-sm text-blue-pale/60 max-w-xl mx-auto leading-relaxed">
              Everything you need to know about our product. Can&apos;t find what you&apos;re looking for? Reach out to our customer support team.
            </p>
          </div>

          {/* Accordion List */}
          <div className="w-full space-y-4 mb-12">
            {QUESTIONS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen ? 'bg-blue/5 border-blue/40' : 'bg-[#111111] border-white/5 hover:border-white/10'
                  }`}
                >
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left group"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-base font-bold text-blue-light pr-4">
                      {item.question}
                    </span>
                    <span className={`shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-blue-light border-blue-light/40 bg-blue/10' : 'text-white/40 group-hover:text-white'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-350 ease-in-out ${
                      isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 border-t border-white/5 pt-4">
                      <p className="font-body text-[14px] text-blue-pale/80 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Footer */}
          <div className="text-center">
            <p className="font-body text-sm text-blue-pale/40 mb-4">
              Still have questions? Our support team is here to help.
            </p>
            <button className="btn-ghost-dark text-sm !px-6 !h-10 hover:border-blue-light hover:text-blue-light">
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
