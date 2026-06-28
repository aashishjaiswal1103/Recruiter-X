'use client';

import React from 'react';
import LandingSandbox from '../LandingSandbox';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-[#020212] pt-32 pb-24 md:pt-36">
      
      {/* Ambient Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Poster Headline - using Bitcount Single font */}
        <h1 
          className="text-[clamp(36px,5.5vw,68px)] font-bold leading-[1.05] text-white mb-6 tracking-wide text-balance uppercase"
          style={{ fontFamily: "'Bitcount Single', var(--font-data), monospace" }}
        >
          New Era of Candidate Intelligence
        </h1>

        {/* Subtext */}
        <p className="font-body text-base md:text-lg text-white/50 max-w-xl mx-auto mb-8 leading-relaxed text-balance">
          Find out who actually built the system and who just wrote the resume.
          Like a staff architect auditing every applicant in parallel.
        </p>

        {/* Pill Badge (Replacing search bar per image spec) */}
        <div className="inline-flex items-center justify-center bg-white/5 border border-white/10 rounded-full px-8 py-2.5 mb-16 hover:bg-white/10 transition-colors cursor-default">
          <span className="font-data text-xs text-white/70 tracking-wider">
            Unlimited trial for 14 days
          </span>
        </div>

        {/* Dashboard Mockup Section (Sandbox) */}
        <div className="w-full max-w-4xl relative">
          
          {/* Exact blue/purple gradient glow radiating upwards from the sandbox */}
          <div className="absolute bottom-[80%] left-1/2 -translate-x-1/2 w-[90%] h-[320px] bg-gradient-to-t from-blue/50 via-blue-mid/15 to-transparent blur-[60px] rounded-t-full pointer-events-none opacity-90" />
          <div className="absolute -top-12 inset-x-0 bottom-12 bg-blue/10 blur-[80px] rounded-3xl pointer-events-none" />
          
          <div className="relative border border-white/10 rounded-2xl bg-[#080816]/85 backdrop-blur-xl p-1 shadow-[0_24px_80px_rgba(0,0,255,0.22)]">
            <LandingSandbox />
          </div>
        </div>
      </div>
    </section>
  );
}
