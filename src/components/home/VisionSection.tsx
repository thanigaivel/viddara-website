'use client';

import { useRef, useEffect } from 'react';
import GoldDivider from '@/components/ui/GoldDivider';
import CTAButton from '@/components/ui/CTAButton';

// ── Heading split ───────────────────────────────────────────────
const HEADING_WORDS = ['Shaping', 'the', 'Future', 'of', 'Human', 'Performance'];

// Color shift: cool white → transitional → warm gold across the words
const WORD_GRADIENTS = [
  'linear-gradient(135deg, #ffffff 0%, #d8e4f8 100%)',
  'linear-gradient(135deg, #d8e4f8 0%, #e8e4d8 100%)',
  'linear-gradient(135deg, #e8e4d8 0%, #ede0c0 100%)',
  'linear-gradient(135deg, #ede0c0 0%, #e8dab8 100%)',
  'linear-gradient(135deg, #e8dab8 0%, #dfc87a 100%)',
  'linear-gradient(135deg, #dfc87a 0%, #C8A54A 100%)',
];

// ── Vision markers ──────────────────────────────────────────────
const MARKERS = [
  {
    title: 'Behavioral Intelligence',
    desc: 'Deepening the science of how humans make decisions under pressure — across markets, institutions, and high-stakes domains.',
  },
  {
    title: 'Adaptive Technology',
    desc: 'Building systems that learn from individual behavioral patterns and evolve with each practitioner over time.',
  },
  {
    title: 'Universal Impact',
    desc: 'Expanding behavioral performance technology from trading into every arena where discipline defines outcomes.',
  },
];

// ── Deterministic star field (no Math.random → SSR-safe) ────────
const STARS = Array.from({ length: 36 }, (_, i) => ({
  cx: ((i * 127 + 43) % 94) + 3,   // 3 – 97 % width
  cy: ((i * 89  + 17) % 88) + 6,   // 6 – 94 % height
  r:  0.5 + (i % 4) * 0.3,
  o:  0.07 + (i % 6) * 0.045,
}));

// ── Timeline SVG geometry ───────────────────────────────────────
const TL_W = 860, TL_H = 72, TL_Y = 33;
const NX   = [143, 430, 717] as const;      // node x positions
const LINE_LEN = NX[2] - NX[0];             // 574

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
      gsap.set('.vis-tl-line',  { strokeDashoffset: LINE_LEN });
      gsap.set('.vis-node',     { scale: 0, transformOrigin: 'center' });
      gsap.set('.vis-node-lbl', { opacity: 0 });
      gsap.set('.vis-marker',   { opacity: 0, y: 26 });
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
        .to('.vis-tl-line',  { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' },    '-=0.3')
        .to('.vis-node',     { scale: 1, duration: 0.42, stagger: 0.2, ease: 'back.out(2)' }, '-=1.0')
        .to('.vis-node-lbl', { opacity: 1, duration: 0.35, stagger: 0.15 },                   '-=0.5')
        .to('.vis-marker',   { opacity: 1, y: 0, duration: 0.65, stagger: 0.15 },             '-=0.5')
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

        {/* Expanding pulse rings (3, staggered 2.33 s apart → continuous 7 s cycle) */}
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
        <div className="text-center mb-18">
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
            <p className="vis-para text-white/50 text-base sm:text-lg leading-relaxed">
              As technology continues to evolve, the ability to understand human
              behavior will become increasingly important.
            </p>
            <p className="vis-para text-white/50 text-base sm:text-lg leading-relaxed">
              Viddara aims to contribute to this direction by developing systems
              that support better awareness, discipline, and decision-making.
            </p>
          </div>
        </div>

        {/* Vision timeline */}
        <div className="mb-16">
          <svg
            viewBox={`0 0 ${TL_W} ${TL_H}`}
            className="w-full max-w-3xl mx-auto block"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="visLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#C8A54A" stopOpacity="0.18" />
                <stop offset="50%"  stopColor="#C8A54A" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#C8A54A" stopOpacity="0.18" />
              </linearGradient>
              <filter id="visNodeGlow">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Connecting line (draws itself via GSAP strokeDashoffset) */}
            <line
              className="vis-tl-line"
              x1={NX[0]} y1={TL_Y} x2={NX[2]} y2={TL_Y}
              stroke="url(#visLineGrad)"
              strokeWidth="1"
              strokeDasharray={LINE_LEN}
            />

            {/* Nodes */}
            {NX.map((nx, i) => (
              <g key={i} className="vis-node" style={{ transformOrigin: `${nx}px ${TL_Y}px` }}>
                {/* Outer pulse ring */}
                <circle cx={nx} cy={TL_Y} r="22"
                  fill="none" stroke="#C8A54A" strokeWidth="0.5" strokeOpacity="0.1" />
                {/* Node body */}
                <circle cx={nx} cy={TL_Y} r="14"
                  fill="rgba(2,8,17,0.97)"
                  stroke="#C8A54A" strokeWidth="1.2" strokeOpacity="0.45"
                  filter="url(#visNodeGlow)" />
                {/* Index */}
                <text x={nx} y={TL_Y + 5}
                  textAnchor="middle"
                  fill="#C8A54A" fillOpacity="0.78"
                  fontSize="9" fontFamily="Inter,sans-serif" letterSpacing="1">
                  0{i + 1}
                </text>
              </g>
            ))}

            {/* Node phase labels */}
            {(['FOUNDATION', 'EVOLUTION', 'IMPACT'] as const).map((lbl, i) => (
              <text key={i} className="vis-node-lbl"
                x={NX[i]} y={TL_H - 1}
                textAnchor="middle"
                fill="#C8A54A" fillOpacity="0.32"
                fontSize="7.5" fontFamily="Inter,sans-serif" letterSpacing="2">
                {lbl}
              </text>
            ))}
          </svg>

          {/* Marker text blocks (aligned under each node) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 max-w-3xl mx-auto">
            {MARKERS.map((m, i) => (
              <div key={i} className="vis-marker text-center">
                {/* Thin gold top accent */}
                <div className="w-6 h-px bg-gold mx-auto mb-5" style={{ opacity: 0.4 }} />
                <h3 className="font-serif text-lg text-white/85 mb-3 leading-snug">
                  {m.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="vis-cta flex justify-center">
          <CTAButton href="/about" variant="primary">
            Explore Our Vision
          </CTAButton>
        </div>

      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/14 to-transparent" />
    </section>
  );
}
