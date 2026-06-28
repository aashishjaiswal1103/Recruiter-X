'use client';

import React, { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: 147, suffix: '', label: 'Candidates analyzed per typical session' },
  { value: 41, suffix: '%', label: 'Average resume inflation detected' },
  { value: 7.4, suffix: '%', label: 'Actual qualification rate in a real pool', isDecimal: true },
  { value: 3, suffix: '×', label: 'Faster time-to-shortlist vs manual review' },
];

function countUp(
  el: HTMLElement,
  target: number,
  isDecimal: boolean,
  duration = 1200
) {
  const start = performance.now();
  function tick(now: number) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = eased * target;
    el.textContent = isDecimal
      ? current.toFixed(1)
      : Math.round(current).toString();
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

export default function SocialProofBand() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const els = containerRef.current?.querySelectorAll('[data-count]');
            els?.forEach((el) => {
              const target = parseFloat(el.getAttribute('data-count') || '0');
              const isDecimal = el.getAttribute('data-decimal') === 'true';
              countUp(el as HTMLElement, target, isDecimal);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section className="relative bg-[var(--bg-subtle)] border-y border-gray-100">
      <div
        ref={containerRef}
        className="max-w-content mx-auto px-6 py-16 md:py-20"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="flex items-baseline justify-center gap-1">
                <span
                  data-count={stat.value}
                  data-decimal={stat.isDecimal ? 'true' : 'false'}
                  className="font-data text-[clamp(36px,5vw,48px)] font-bold gradient-text leading-none"
                >
                  0
                </span>
                {stat.suffix && (
                  <span className="font-data text-[clamp(20px,3vw,32px)] font-bold gradient-text leading-none">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <p className="font-body text-sm text-[var(--text-tertiary)] mt-3 max-w-[200px] mx-auto leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
