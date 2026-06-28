'use client';

import React, { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function CTABand() {
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768 || !blobRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * -8;
      const y = (e.clientY / window.innerHeight - 0.5) * -8;
      blobRef.current.style.translate = `${x}px ${y}px`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="cta" className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      {/* Ambient Blobs */}
      <div
        ref={blobRef}
        className="ambient-blob absolute w-[500px] h-[500px] rounded-full bg-blue-light/15 top-[-20%] right-[-10%]"
      />
      <div
        className="ambient-blob absolute w-[400px] h-[400px] rounded-full bg-blue/20 bottom-[-20%] left-[-10%]"
        style={{ animationDelay: '-10s' }}
      />

      <div className="relative z-10 max-w-content mx-auto px-6 py-24 md:py-32 text-center">
        <h2 className="font-display text-[clamp(28px,4vw,48px)] font-bold leading-[1.1] text-white tracking-tight max-w-3xl mx-auto mb-6">
          The best candidate in your current pile is probably not at the top of it.
        </h2>
        <p className="font-body text-lg text-white/60 max-w-xl mx-auto mb-10">
          Upload your JD, drop in the resumes, and get a ranked shortlist with interview questions in under 15 minutes. Your API key. Your data. Your decision.
        </p>
        <a href="#" className="btn-on-dark text-base px-12 inline-flex">
          Start Your First Analysis
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
