'use client';

import { useRef, useEffect } from 'react';
import GoldDivider from '@/components/ui/GoldDivider';
import CTAButton from '@/components/ui/CTAButton';

// ── Heading split ───────────────────────────────────────────────
const HEADING_WORDS = ['Exploring', 'the', 'Future', 'of', 'Behavioral', 'Technology'];

// Color shift: cool white → transitional → warm gold across the words
const WORD_GRADIENTS = [
  'linear-gradient(135deg, #ffffff 0%, #d8e4f8 100%)',
  'linear-gradient(135deg, #d8e4f8 0%, #e8e4d8 100%)',
  'linear-gradient(135deg, #e8e4d8 0%, #ede0c0 100%)',
  'linear-gradient(135deg, #ede0c0 0%, #e8dab8 100%)',
  'linear-gradient(135deg, #e8dab8 0%, #dfc87a 100%)',
  'linear-gradient(135deg, #dfc87a 0%, #C8A54A 100%)',
];

// ── Deterministic star field (no Math.random → SSR-safe) ────────
const STARS = Array.from({ length: 36 }, (_, i) => ({
  cx: ((i * 127 + 43) % 94) + 3,   // 3 – 97 % width
  cy: ((i * 89  + 17) % 88) + 6,   // 6 – 94 % height
  r:  0.5 + (i % 4) * 0.3,
  o:  0.07 + (i % 6) * 0.045,
}));

export default function VisionSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (!sectionRef.current) return;

      // ── Initial states ────────────────────────────────────
      gsap.set('.vis-eyebrow',  { opacity: 0, y: 18 });
      gsap.set('.vis-word',     { opacity: 0, y: 34 });
      gsap.set('.vis-divider',  { opacity: 0, scaleX: 0 });
      gsap.set('.vis-para',     { opacity: 0, y: 20 });
      gsap.set('.vis-closing',  { opacity: 0, y: 20 });
      gsap.set('.vis-cta',      { opacity: 0, y: 18 });

      // ── Entry timeline ────────────────────────────────────
      gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 68%', once: true },
        defaults: { ease: 'power3.out' },
      })
        .to('.vis-eyebrow',  { opacity: 1, y: 0, duration: 0.6 })
        .to('.vis-word',     { opacity: 1, y: 0, duration: 0.65, stagger: 0.09 },             '-=0.2')
        .to('.vis-divider',  { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.3')
        .to('.vis-para',     { opacity: 1, y: 0, duration: 0.7, stagger: 0.22 },              '-=0.35')
        .to('.vis-closing',  { opacity: 1, y: 0, duration: 0.8 },                             '-=0.2')
        .to('.vis-cta',      { opacity: 1, y: 0, duration: 0.65 },                            '-=0.3');

      // ── Star twinkle (continuous, starts immediately) ─────
      gsap.utils.toArray<SVGCircleElement>('.vis-star').forEach((el, i) => {
        const base = parseFloat(el.getAttribute('opacity') ?? '0.08');
        gsap.to(el, {
          opacity: Math.min(base * 3.2, 0.6),
          duration: 1.8 + (i % 5) * 0.75,
          repeat: -1, yoyo: true, ease: 'sine.inOut',
          delay: i * 0.09,
        });
      });
    };

    init();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #081F3F 0%, #0a2246 40%, #081F3F 100%)' }}>

      {/* Pulse-ring keyframes injected via style tag */}
      <style>{`
        @keyframes visRingExpand {
          0%   { transform: scale(0.04); opacity: 0.55; }
          100% { transform: scale(1);   opacity: 0; }
        }
        .vis-ring { animation: visRingExpand 7s ease-out infinite; transform-origin: center; }
      `}</style>

      {/* ── Atmosphere ────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        {/* Star field SVG */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" fill="none">
          {STARS.map((s, i) => (
            <circle key={i} className="vis-star"
              cx={`${s.cx}%`} cy={`${s.cy}%`}
              r={s.r} fill="#DFCA8D" opacity={s.o} />
          ))}
        </svg>

        {/* Depth glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1000px]"
          style={{ background: 'radial-gradient(ellipse, rgba(22,55,104,0.36) 0%, rgba(8,31,63,0.55) 40%, transparent 65%)', filter: 'blur(80px)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px]"
          style={{ background: 'radial-gradient(circle, rgba(200,165,74,0.08) 0%, transparent 62%)', filter: 'blur(50px)' }} />

        {/* Expanding pulse rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {[0, 1, 2].map(i => (
            <div key={i} className="vis-ring absolute rounded-full"
              style={{
                width: '1100px', height: '1100px',
                marginLeft: '-550px', marginTop: '-550px',
                border: '1px solid rgba(200,165,74,0.11)',
                animationDelay: `${i * 2.33}s`,
              }} />
          ))}
        </div>

        {/* Footer fade */}
        <div className="absolute bottom-0 left-0 right-0 h-28"
          style={{ background: 'linear-gradient(to top, rgba(2,8,17,0.7), transparent)' }} />
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="vis-eyebrow text-[10px] tracking-[0.36em] uppercase font-semibold text-gold mb-9">
            Looking Ahead
          </p>

          <h2
            className="font-serif leading-tight mb-9"
            style={{ fontSize: 'clamp(2.75rem, 6vw, 4.5rem)' }}
          >
            {HEADING_WORDS.map((word, i) => (
              <span
                key={i}
                className="vis-word inline-block"
                style={{
                  marginRight: '0.28em',
                  background: WORD_GRADIENTS[i],
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {word}
              </span>
            ))}
          </h2>

          <div className="vis-divider flex justify-center mb-10">
            <GoldDivider centered />
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <p className="vis-para text-white/55 text-base sm:text-lg leading-relaxed">
              Viddara is exploring new ways to apply technology to human decision behaviour
              and performance. Our long-term focus is to develop systems that help people
              better understand their actions, improve discipline and make more deliberate decisions.
            </p>
          </div>

          {/* Closing statement */}
          <div className="mt-14">
            <p
              className="vis-closing font-serif italic text-xl sm:text-2xl leading-relaxed"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #e8dfc0 50%, #DFCA8D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              MindTrade is where our journey begins.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="vis-cta flex justify-center">
          <CTAButton href="/about" variant="primary">
            Learn More About Viddara
          </CTAButton>
        </div>

      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/14 to-transparent" />
    </section>
  );
}
