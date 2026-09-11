'use client';

import { useRef, useEffect } from 'react';
import GoldDivider from '@/components/ui/GoldDivider';

const INSIGHTS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 3a9 9 0 0 1 0 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" />
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.7" />
      </svg>
    ),
    text: 'Many technologies measure what happened. Viddara is interested in understanding the behavioural patterns surrounding how decisions are made.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path d="M2.5 18L7 11l5 3.5L17.5 6l4.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="22" cy="9.5" r="1.5" fill="currentColor" />
        <line x1="2.5" y1="21" x2="21.5" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    text: 'We explore the intersection of behavioural understanding, data and software to create practical decision-support systems.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <polygon points="12 2 20 8.5 18 19.5 6 19.5 4 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="12" cy="11" r="2" fill="currentColor" opacity="0.8" />
      </svg>
    ),
    text: 'Our work begins with environments where uncertainty, pressure and decisions directly influence performance.',
  },
];

export default function DifferentLensSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (!sectionRef.current) return;

      gsap.set('.lens-eyebrow', { opacity: 0, y: 18 });
      gsap.set('.lens-heading', { opacity: 0, y: 36 });
      gsap.set('.lens-div',     { opacity: 0, scaleX: 0 });
      gsap.set('.lens-card',    { opacity: 0, y: 28 });

      gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
        defaults: { ease: 'power3.out' },
      })
        .to('.lens-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.lens-heading', { opacity: 1, y: 0, duration: 0.9 }, '-=0.3')
        .to('.lens-div',     { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.5')
        .to('.lens-card',    { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 }, '-=0.3');
    };
    init();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #081F3F 0%, #0a2246 50%, #081F3F 100%)' }}
    >
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px]"
          style={{ background: 'radial-gradient(ellipse, rgba(22,55,104,0.36) 0%, rgba(8,31,63,0.55) 45%, transparent 68%)', filter: 'blur(70px)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[400px]"
          style={{ background: 'radial-gradient(circle, rgba(200,165,74,0.07) 0%, transparent 65%)', filter: 'blur(60px)' }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: 'radial-gradient(rgba(200,165,74,0.9) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="lens-eyebrow text-[10px] tracking-[0.32em] uppercase font-semibold text-gold mb-6">
            Our Perspective
          </p>
          <h2
            className="lens-heading font-serif text-4xl sm:text-5xl lg:text-[3.25rem] leading-tight mb-7"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #d4cbb5 40%, #C8A54A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            A Different Lens
            <br className="hidden sm:block" />
            on Performance
          </h2>
          <div className="lens-div flex justify-center">
            <GoldDivider centered />
          </div>
        </div>

        {/* Insight cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INSIGHTS.map((item, i) => (
            <div
              key={i}
              className="lens-card group relative rounded-2xl p-8 overflow-hidden cursor-default"
              style={{
                background: 'linear-gradient(160deg, rgba(22,55,104,0.18) 0%, rgba(8,31,63,0.65) 100%)',
                border: '1px solid rgba(200,165,74,0.1)',
                boxShadow: '0 8px 40px -12px rgba(0,0,0,0.6)',
                transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(200,165,74,0.28)';
                el.style.boxShadow = '0 14px 50px -10px rgba(200,165,74,0.1), 0 0 0 1px rgba(200,165,74,0.1)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(200,165,74,0.1)';
                el.style.boxShadow = '0 8px 40px -12px rgba(0,0,0,0.6)';
              }}
            >
              {/* Top shimmer */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />

              {/* Watermark */}
              <span
                className="absolute -top-5 -right-1 font-serif font-bold text-white select-none pointer-events-none leading-none"
                style={{ fontSize: '7rem', opacity: 0.03 }}
              >
                0{i + 1}
              </span>

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-7"
                  style={{
                    background: 'linear-gradient(135deg, rgba(200,165,74,0.15) 0%, rgba(200,165,74,0.04) 100%)',
                    border: '1px solid rgba(200,165,74,0.22)',
                    color: '#C8A54A',
                  }}
                >
                  {item.icon}
                </div>

                <div className="w-6 h-px bg-gold mb-5" style={{ opacity: 0.45 }} />
                <p className="text-white/55 text-sm leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent" />
    </section>
  );
}
