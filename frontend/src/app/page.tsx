'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Cpu, 
  Binary, 
  Fingerprint, 
  Terminal as TerminalIcon, 
  ArrowRight, 
  Layers, 
  Lock, 
  Settings, 
  Mail,
  Key,
  Check,
  AlertTriangle
} from 'lucide-react';
import LandingSandbox from '../components/LandingSandbox';
import DashboardDemo from '../components/DashboardDemo';

export default function Home() {
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
      setApiKey('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0A0A0A] font-mono selection:bg-[#F0F4FF] selection:text-[#0000FF]">
      
      {/* 1. Navigation Header (Navy Accent Band - Hero fold) */}
      <header className="sticky top-0 z-50 w-full border-b border-[#00003A] bg-[#000022] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base tracking-wider uppercase">
              RECRUITER<span className="text-[#0000FF] font-bold">-X</span>
            </span>
            <span className="text-[9px] font-bold font-data bg-[#0000FF]/15 text-[#0000FF] border border-[#0000FF]/30 px-1 py-0.5 rounded uppercase leading-none">
              BYOK_V2
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-neutral-300 uppercase tracking-wider">
            <a href="#system" className="hover:text-[#0000FF] transition-colors">THE_SYSTEM</a>
            <a href="#demo" className="hover:text-[#0000FF] transition-colors">DEMO_WORKSPACE</a>
            <a href="#byok" className="hover:text-[#0000FF] transition-colors">BYOK_BLUEPRINT</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#0000FF] transition-colors">DOCS</a>
          </nav>

          <div className="flex items-center gap-3">
            <a 
              href="#cta"
              className="bg-[#0000FF] hover:bg-[#0000CC] text-white text-xs font-bold px-4 py-2 rounded transition-all tracking-wider uppercase select-none border border-[#0000FF] hover:border-[#0000CC]"
            >
              LAUNCH PORTAL
            </a>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (White Gravity) */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center space-y-12">
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 border border-[#0000FF]/25 bg-[#F0F4FF] px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider text-[#0000FF] mx-auto select-none">
            <Cpu className="w-3.5 h-3.5 text-[#0000FF]" />
            <span>ELECTRIC INTELLIGENCE SYSTEM</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-wider text-[#0A0A0A] leading-[1.1] text-balance">
            SURFACE THE TRUTH. <br className="hidden sm:inline"/>SILENCE THE NOISE.
          </h1>

          {/* Subhead */}
          <p className="text-sm md:text-base text-[#4A4A4A] leading-relaxed max-w-2xl mx-auto font-mono text-balance">
            Recruiter-X is the AI intelligence layer that sits between candidate applications and hiring decisions. We audit JDs, build synthetic ideal candidate benchmarks, and rank applicants by evidence of depth—not resume-writing tricks.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <a
              href="#cta"
              className="w-full sm:w-auto bg-[#0000FF] hover:bg-[#0000CC] text-white font-bold text-xs px-6 py-3 rounded transition-all tracking-wider uppercase flex items-center justify-center gap-2 border border-[#0000FF]"
            >
              <span>GET STARTED FREE (BYOK)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#demo"
              className="w-full sm:w-auto border border-[#0000FF] bg-[#F0F4FF] hover:bg-[#F0F4FF]/70 text-[#0000FF] font-bold text-xs px-6 py-3 rounded transition-all tracking-wider uppercase"
            >
              EXPLORE DEMO WORKSPACE
            </a>
          </div>
        </div>

        {/* Live Terminal Sandbox Component */}
        <div className="pt-4">
          <LandingSandbox />
        </div>
      </section>

      {/* 3. Core Engines Bento Grid (Cream alternate background texture for visual rest) */}
      <section id="system" className="py-20 border-t border-[#E5E5E5] bg-[#FFF5EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-block text-[11px] font-bold font-data text-[#0000FF] uppercase bg-[#F0F4FF] border border-[#0000FF]/30 px-2 py-0.5 rounded tracking-widest">
              SYSTEM COMPONENTS
            </div>
            <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-[#0A0A0A]">
              THE FOUR INTELLIGENCE ENGINES
            </h2>
            <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed max-w-xl mx-auto">
              Recruiter-X runs 10,000 parallel calculations on every role context, leveraging data density to isolate the top 5% of candidate depth.
            </p>
          </div>

          {/* Bento Grid (Cards are white) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            
            {/* Card 1: JD Audit Engine (col-span-7) */}
            <div className="lg:col-span-7 rounded-md border border-[#E5E5E5] bg-white p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded bg-[#F0F4FF] text-[#0000FF] flex items-center justify-center border border-[#0000FF]/25">
                    <TerminalIcon className="w-4 h-4" />
                  </span>
                  <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#0A0A0A]">
                    01 // JD AUDIT ENGINE
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed font-mono">
                  Transforms job descriptions into structured hiring benchmarks. Separates nice-to-haves from must-haves, infers true seniority targets, and detects vague languages or impossible requirements.
                </p>
              </div>

              {/* Mini UI mockup */}
              <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-4 rounded text-xs space-y-2.5 select-none font-mono">
                <div className="flex justify-between items-center text-[10px] text-[#8C8C8C] border-b border-[#E5E5E5] pb-2">
                  <span>AUDIT_OUTPUT_CONSOLE</span>
                  <span className="text-[#D32F2F] font-bold">1 WARN</span>
                </div>
                <div className="space-y-1.5">
                  <div className="text-[#4A4A4A] leading-relaxed">
                    <span className="text-[#0000FF] font-bold">→ MUST_HAVE:</span> Python, PyTorch, CUDA
                  </div>
                  <div className="text-[#4A4A4A] leading-relaxed">
                    <span className="text-[#0000FF] font-bold">→ SeniorityTarget:</span> Staff level (Stated: Senior)
                  </div>
                  <div className="bg-[#FFF5F5] border border-[#D4382C]/20 p-2 rounded text-[11px] text-[#D4382C] leading-tight">
                    <span className="font-bold uppercase">[QUALITY_WARN]:</span> &quot;10+ years with Transformers&quot; is structurally impossible. Attention architectures were introduced in 2017.
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Ghost Candidate Benchmark (col-span-5) */}
            <div className="lg:col-span-5 rounded-md border border-[#0000FF] bg-white p-6 md:p-8 flex flex-col justify-between text-[#0A0A0A] space-y-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded bg-[#F0F4FF] text-[#0000FF] flex items-center justify-center border border-[#0000FF]/25">
                    <Fingerprint className="w-4 h-4" />
                  </span>
                  <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#0A0A0A]">
                    02 // GHOST CANDIDATE BENCHMARK
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed font-mono">
                  Constructs a synthetic ideal candidate profile entirely from the JD. This &quot;ghost&quot; candidate serves as a fixed control benchmark to measure real resumes against. Includes negative space signals: what real experts would never brag about.
                </p>
              </div>

              {/* Mini UI mockup */}
              <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-4 rounded text-xs space-y-2 select-none font-mono">
                <div className="text-[10px] text-[#8C8C8C] border-b border-[#E5E5E5] pb-2">
                  GHOST_IDEAL_BENCHMARK
                </div>
                <div className="space-y-1 text-[#4A4A4A]">
                  <div className="flex justify-between"><span>Ideal_Arc:</span> <span className="text-[#0000FF] font-bold">FAANG / AI Startup</span></div>
                  <div className="flex justify-between"><span>Expected_Absence:</span> <span className="text-[#C47D10] font-bold">Scikit-learn focus</span></div>
                  <div className="flex justify-between"><span>Minimum_Duration:</span> <span className="font-data font-bold text-[#0000FF]">36 months in scale</span></div>
                </div>
              </div>
            </div>

            {/* Card 3: Trajectory & Behaviour Analyzer (col-span-6) */}
            <div className="lg:col-span-6 rounded-md border border-[#E5E5E5] bg-white p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded bg-[#F0F4FF] text-[#0000FF] flex items-center justify-center border border-[#0000FF]/25">
                    <Binary className="w-4 h-4" />
                  </span>
                  <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#0A0A0A]">
                    03 // TRAJECTORY & BEHAVIOUR ENGINE
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed font-mono">
                  Measures velocity, not static positions. Recruiter-X parses title weight progression normalized by career age. Computes working style by examining action-verb density and ownership signals (&quot;I built&quot; vs &quot;The team implemented&quot;).
                </p>
              </div>

              {/* Mini UI mockup */}
              <div className="border border-[#E5E5E5] bg-[#FAFAFA] p-4 rounded text-xs space-y-2 select-none font-mono">
                <div className="flex justify-between items-center text-[10px] text-[#8C8C8C]">
                  <span>BEHAVIOURAL_METRIC</span>
                  <span className="text-[#0000FF] font-bold">HIGH OWNERSHIP</span>
                </div>
                <div className="h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0000FF]" style={{ width: '84%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-[#8C8C8C]">
                  <span>Pronoun Ownership (84%)</span>
                  <span>Verbs-to-Outcomes (78%)</span>
                </div>
              </div>
            </div>

            {/* Card 4: Insider Signal & Red Flag (col-span-6) */}
            <div className="lg:col-span-6 rounded-md border border-[#E5E5E5] bg-white p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded bg-[#F0F4FF] text-[#0000FF] flex items-center justify-center border border-[#0000FF]/25">
                    <Shield className="w-4 h-4" />
                  </span>
                  <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#0A0A0A]">
                    04 // INSIDER SIGNAL & RED FLAG DETECTOR
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed font-mono">
                  Exploits information asymmetry. Real experts write about complex challenges differently. Recruiter-X checks for structural insider indicators while flag-tagging pride signals on routine developer tasks.
                </p>
              </div>

              {/* Mini UI mockup */}
              <div className="border border-[#E5E5E5] bg-[#FAFAFA] p-4 rounded text-xs space-y-2 select-none font-mono">
                <div className="text-[10px] text-[#C47D10] font-bold uppercase flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#C47D10]" />
                  <span>RISK WARNING</span>
                </div>
                <div className="text-[#4A4A4A] text-[11px] leading-tight">
                  <span className="font-bold text-[#C47D10]">[Title Inflation]:</span> Candidate claims Lead title, but technical details indicate routine CRUD development with zero architectural scope.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Interactive Ranked Candidate Dashboard (White Gravity) */}
      <section id="demo" className="py-20 bg-white border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-block text-[11px] font-bold font-data text-[#0000FF] uppercase bg-[#F0F4FF] border border-[#0000FF]/30 px-2 py-0.5 rounded tracking-widest">
              PRODUCT SIMULATION
            </div>
            <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-[#0A0A0A]">
              THE CANDIDATE CONTROL ROOM
            </h2>
            <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed max-w-xl mx-auto">
              Test the ranked candidate dashboard. Tweak weight sliders in the control panel to see scores update and re-rank candidates in real-time. Click to inspect computed deep audits.
            </p>
          </div>

          {/* Render DashboardDemo */}
          <DashboardDemo />
          
        </div>
      </section>

      {/* 5. BYOK Architecture & Privacy Blueprint Section (White Canvas with Clean light graphic) */}
      <section id="byok" className="py-20 bg-[#FAFAFA] text-[#0A0A0A] border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Blueprint Text Info (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-block text-[11px] font-bold font-data text-[#0000FF] uppercase bg-[#F0F4FF] border border-[#0000FF]/30 px-2 py-0.5 rounded tracking-widest">
              BYOK ARCHITECTURE
            </div>
            <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-[#0A0A0A] leading-tight">
              DATA PRIVACY & <br/>ZERO-MARKUP SAAS
            </h2>
            
            <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed font-mono">
              Recruiter-X operates on a Bring-Your-Own-Key model. We do not store your candidate records or invoice you for LLM processing.
            </p>

            <div className="space-y-4 font-mono text-xs">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded bg-[#F0F4FF] text-[#0000FF] flex items-center justify-center shrink-0 border border-[#0000FF]/25">
                  <Lock className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h4 className="font-bold text-[#0A0A0A] mb-1">Data Sovereignty</h4>
                  <p className="text-[#4A4A4A] leading-normal text-[11px]">Resumes are routed directly to your personal API key (Gemini/Claude). Recruiter-X never retains resume texts.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded bg-[#F0F4FF] text-[#0000FF] flex items-center justify-center shrink-0 border border-[#0000FF]/25">
                  <Shield className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h4 className="font-bold text-[#0A0A0A] mb-1">GDPR Compliance</h4>
                  <p className="text-[#4A4A4A] leading-normal text-[11px]">Every evaluation exposes its full audit trail. Prompt configurations are completely transparent, avoiding black-box decision blocks.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded bg-[#F0F4FF] text-[#0000FF] flex items-center justify-center shrink-0 border border-[#0000FF]/25">
                  <Settings className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h4 className="font-bold text-[#0A0A0A] mb-1">Zero Markup Pricing</h4>
                  <p className="text-[#4A4A4A] leading-normal text-[11px]">Pay raw token prices directly to your provider (average cost is $0.02 - $0.20 per analysis), not 10x SaaS markups.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Blueprint Diagram (col-span-7) */}
          <div className="lg:col-span-7 rounded-md border border-[#E5E5E5] bg-white p-6 relative overflow-hidden flex flex-col justify-between h-96 shadow-sm">
            <div className="flex justify-between items-center text-[10px] text-[#8C8C8C] border-b border-[#E5E5E5] pb-3 font-mono">
              <span>BYOK_PIPELINE_ARCHITECTURE.CFG</span>
              <span className="text-[#0000FF] uppercase flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0000FF] animate-pulse" />
                SECURE_DIRECT_BYOK
              </span>
            </div>

            {/* Architecture Node Diagram */}
            <div className="flex-1 flex flex-col justify-center items-center py-6">
              <div className="w-full max-w-md space-y-6">
                
                {/* Client Side Node */}
                <div className="flex items-center justify-between bg-[#FAFAFA] border border-[#E5E5E5] rounded p-3 relative">
                  <div className="flex items-center gap-2">
                    <TerminalIcon className="w-4 h-4 text-[#0000FF]" />
                    <span className="text-xs font-bold text-[#0A0A0A]">RECRUITER-X CLIENT</span>
                  </div>
                  <span className="text-[10px] text-[#8C8C8C] font-mono">browser / uploads</span>
                </div>

                {/* Pipeline Arrow */}
                <div className="flex justify-center relative">
                  <div className="h-8 w-0.5 bg-dashed border-l border-[#0000FF]/30" />
                  <span className="absolute -top-1 font-data text-[9px] text-[#0000FF] bg-white px-1 border border-[#0000FF]/20 rounded">
                    ENCRYPTED_API_KEY
                  </span>
                </div>

                {/* Proxy Node */}
                <div className="flex items-center justify-between bg-[#FAFAFA] border border-[#E5E5E5] rounded p-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#0000FF]" />
                    <span className="text-xs font-bold text-[#0A0A0A]">ROUTING ENDPOINT</span>
                  </div>
                  <span className="text-[10px] text-[#C47D10] font-mono">in-memory parse</span>
                </div>

                {/* Direct Arrow to LLM */}
                <div className="flex justify-center relative">
                  <div className="h-8 w-0.5 bg-dashed border-l border-[#0000FF]/30" />
                  <span className="absolute -top-1 font-data text-[9px] text-[#0000FF] bg-white px-1 border border-[#0000FF]/20 rounded">
                    DIRECT PASS-THROUGH
                  </span>
                </div>

                {/* LLM Provider Node */}
                <div className="flex items-center justify-between bg-[#F0F4FF] border border-[#0000FF]/30 rounded p-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#0000FF]" />
                    <span className="text-xs font-bold text-[#0000FF]">PROVIDER (Gemini / Claude)</span>
                  </div>
                  <span className="text-[10px] text-[#0000FF] font-mono font-data font-bold">USER_ACCOUNT</span>
                </div>

              </div>
            </div>

            {/* Scan lines / Grid effect */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px]" />
          </div>

        </div>
      </section>

      {/* 6. Conversion CTA Zone */}
      <section id="cta" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-center">
        <div className="rounded-md border border-[#E5E5E5] bg-[#FAFAFA] p-8 md:p-12 space-y-8 relative overflow-hidden shadow-sm">
          
          <div className="space-y-4 max-w-lg mx-auto">
            <h2 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-wider text-[#0A0A0A]">
              LAUNCH YOUR FIRST AUDIT
            </h2>
            <p className="text-xs text-[#4A4A4A] leading-relaxed font-mono text-balance">
              Create an account instantly. Input your job description, configure your personal LLM keys, and upload candidate resumes to surface the truth.
            </p>
          </div>

          {/* Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              {/* Email */}
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[#8C8C8C] absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 border border-[#E5E5E5] rounded bg-white font-mono text-xs text-[#0A0A0A] placeholder-[#8C8C8C] focus:outline-none focus:border-[#0000FF] focus:ring-2 focus:ring-[#0000FF]/10"
                />
              </div>

              {/* API Key placeholder */}
              <div className="relative flex items-center">
                <Key className="w-4 h-4 text-[#8C8C8C] absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="gemini or claude api key (optional)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 border border-[#E5E5E5] rounded bg-white text-xs text-[#0A0A0A] placeholder-[#8C8C8C] focus:outline-none focus:border-[#0000FF] focus:ring-2 focus:ring-[#0000FF]/10 font-data tracking-widest"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#0000FF] hover:bg-[#0000CC] text-white font-bold text-xs rounded transition-all tracking-wider uppercase flex items-center justify-center gap-2 select-none border border-[#0000FF]"
              >
                <span>CREATE ACCOUNT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="bg-[#F0FDF4] border border-[#2D8A4E]/20 p-6 rounded max-w-md mx-auto space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#2D8A4E]/10 text-[#2D8A4E] flex items-center justify-center mx-auto border border-[#2D8A4E]/25">
                <Check className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#2D8A4E]">
                REGISTRATION SUBMITTED
              </h4>
              <p className="text-[11px] text-[#2D8A4E] leading-relaxed">
                Check your inbox for the magic sign-in link. You will be redirected to the secure sandbox workspace setup.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-[10px] text-[#0000FF] hover:underline uppercase block mx-auto font-bold"
              >
                Register another email
              </button>
            </div>
          )}

          <p className="text-[10px] text-[#8C8C8C] font-mono max-w-xs mx-auto leading-normal">
            By registering, you agree to our Terms of Use and confirm you hold legal processing rights over the resumes analyzed.
          </p>

        </div>
      </section>

      {/* 7. Footer (Navy Accent Band - Bottom fold) */}
      <footer className="mt-auto border-t border-[#00003A] bg-[#000022] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-display font-bold text-xs tracking-wider uppercase">
              RECRUITER<span className="text-[#0000FF] font-bold">-X</span>
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">
              © 2026 Recruiter-X Inc. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
            <a href="#system" className="hover:text-[#0000FF] transition-colors">THE_SYSTEM</a>
            <a href="#demo" className="hover:text-[#0000FF] transition-colors">DEMO</a>
            <a href="#byok" className="hover:text-[#0000FF] transition-colors">BYOK</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#0000FF] transition-colors">SECURITY_AUDIT</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
