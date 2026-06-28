'use client';

import React from 'react';
import { Shield, Scale, Clock } from 'lucide-react';

const PRODUCT_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Sandbox', href: '#' },
];

const COMPANY_LINKS = [
  { label: 'About', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Contact', href: '#' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'GDPR Article 22 Compliance', href: '#' },
  { label: 'EU AI Act Classification', href: '#' },
];

const BADGES = [
  { icon: Shield, label: 'GDPR Compliant' },
  { icon: Scale, label: 'EU AI Act' },
  { icon: Clock, label: 'SOC 2 Pending' },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-black)] text-white">
      <div className="max-w-content mx-auto px-6 py-16 md:py-20">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-16">
          {/* Logo + Tagline */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1 mb-4">
              <span className="font-display font-bold text-lg tracking-tight text-white">
                RECRUITER
              </span>
              <span className="font-display font-bold text-lg tracking-tight gradient-text">
                -X
              </span>
            </div>
            <p className="font-body text-sm text-white/40 leading-relaxed max-w-[240px]">
              The AI intelligence layer that sits between candidate applications and recruiter decisions.
            </p>
          </div>

          {/* Product */}
          <div>
            <div className="font-data text-[11px] font-bold uppercase tracking-[0.08em] text-white/30 mb-4">
              Product
            </div>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-white/50 hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="font-data text-[11px] font-bold uppercase tracking-[0.08em] text-white/30 mb-4">
              Company
            </div>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-white/50 hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="font-data text-[11px] font-bold uppercase tracking-[0.08em] text-white/30 mb-4">
              Legal & Compliance
            </div>
            <ul className="space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-white/50 hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-body text-xs text-white/30">
            © {new Date().getFullYear()} Recruiter-X. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            {BADGES.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div key={i} className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-white/25" />
                  <span className="font-data text-[10px] text-white/25 uppercase tracking-wider">
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
