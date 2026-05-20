'use client';

import { useRef, useEffect } from 'react';
import GoldDivider from '@/components/ui/GoldDivider';

// ── Orbit geometry ─────────────────────────────────────────────
const CX = 240, CY = 220, R = 150, HUB_R = 50;
const rad = (d: number) => (d * Math.PI) / 180;

const N1 = { x: Math.round(CX + R * Math.cos(rad(270))), y: Math.round(CY + R * Math.sin(rad(270))) }; // top    240, 70
const N2 = { x: Math.round(CX + R * Math.cos(rad(30))),  y: Math.round(CY + R * Math.sin(rad(30)))  }; // right  370, 295
const N3 = { x: Math.round(CX + R * Math.cos(rad(150))), y: Math.round(CY + R * Math.sin(rad(150))) }; // left   110, 295

const NODES = [N1, N2, N3];

const spokeCoords = (n: { x: number; y: number }) => {
  const dx = n.x - CX, dy = n.y - CY, d = Math.sqrt(dx * dx + dy * dy);
  const rnd = (v: number) => Math.round(v * 1e4) / 1e4;
  return { x1: rnd(CX + (dx / d) * HUB_R), y1: rnd(CY + (dy / d) * HUB_R), x2: n.x, y2: n.y };
};

const ARC_LEN = 315; // ≈ 2π·150 / 3
const ARCS = [
  `M ${N1.x} ${N1.y} A ${R} ${R} 0 0 1 ${N2.x} ${N2.y}`,
  `M ${N2.x} ${N2.y} A ${R} ${R} 0 0 1 ${N3.x} ${N3.y}`,
  `M ${N3.x} ${N3.y} A ${R} ${R} 0 0 1 ${N1.x} ${N1.y}`,
];

const NODE_LABELS = [
  { x: N1.x,      y: N1.y - 24, anchor: 'middle' as const, text: 'OBSERVE'  },
  { x: N2.x + 22, y: N2.y +  5, anchor: 'start'  as const, text: 'ANALYZE'  },
  { x: N3.x - 22, y: N3.y +  5, anchor: 'end'    as const, text: 'IMPROVE'  },
];

// ── Pillars ────────────────────────────────────────────────────
const PILLARS = [
  {
    num: '01', label: 'OBSERVE',
    title: 'Behavior Awareness',
    desc: 'Identify recurring decision patterns and behavioral tendencies that surface under pressure — the first step toward disciplined, consistent performance.',
  },
  {
    num: '02', label: 'ANALYZE',
    title: 'Performance Discipline',
    desc: 'Build consistency in high-stakes environments through structured behavioral feedback that reinforces optimal decision-making pathways over time.',
  },
  {
    num: '03', label: 'IMPROVE',
    title: 'Structured Insights',
    desc: 'Translate behavioral data into clear, actionable intelligence — illuminating the patterns that drive measurable, sustained improvement.',
  },
];

export default function ApproachSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const diagramRef  = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (!sectionRef.current) return;

      // ── Initial hidden states ──────────────────────────────
      gsap.set('.appr-eyebrow',      { opacity: 0, y: 18 });
      gsap.set(headingRef.current,   { opacity: 0, y: 36 });
      gsap.set('.appr-divider',      { opacity: 0, scaleX: 0 });
      gsap.set(subtitleRef.current,  { opacity: 0, y: 24 });
      gsap.set(diagramRef.current,   { opacity: 0, scale: 0.9 });
      gsap.set('.orbit-arc',         { strokeDashoffset: ARC_LEN });
      gsap.set('.orbit-spoke',       { opacity: 0 });
      gsap.set('.orbit-node',        { scale: 0 });
      gsap.set('.orbit-hub-g',       { scale: 0, transformOrigin: `${CX}px ${CY}px` });
      gsap.set('.orbit-lbl',         { opacity: 0 });
      gsap.set('.appr-card',         { opacity: 0, y: 32 });

      // ── Entry timeline ─────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
        defaults: { ease: 'power3.out' },
        onComplete() {
          // continuous node pulse after entry
          gsap.utils.toArray<Element>('.orbit-pulse').forEach((el, i) => {
            gsap.to(el, {
              scale: 2.8, opacity: 0, duration: 2.6,
              repeat: -1, delay: i * 0.9, ease: 'power1.out',
              transformOrigin: 'center',
            });
          });
        },
      });

      tl
        .to('.appr-eyebrow',     { opacity: 1, y: 0, duration: 0.6 })
        .to(headingRef.current,  { opacity: 1, y: 0, duration: 0.9 },  '-=0.3')
        .to('.appr-divider',     { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.5')
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.7 },  '-=0.4')
        .to(diagramRef.current,  { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)' }, '-=0.3')
        .to('.orbit-hub-g',      { scale: 1, duration: 0.65, ease: 'back.out(1.7)' }, '-=0.4')
        .to('.orbit-spoke',      { opacity: 1, duration: 0.5, stagger: 0.15 }, '-=0.3')
        .to('.orbit-arc',        { strokeDashoffset: 0, duration: 1.1, stagger: 0.22, ease: 'power2.inOut' }, '-=0.5')
        .to('.orbit-node',       { scale: 1, duration: 0.45, stagger: 0.18, ease: 'back.out(2.2)', transformOrigin: 'center' }, '-=1.0')
        .to('.orbit-lbl',        { opacity: 1, duration: 0.4, stagger: 0.12 }, '-=0.5')
        .to('.appr-card',        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 }, '-=0.4');
    };

    init();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #081F3F 0%, #0a2246 45%, #081F3F 100%)' }}>

      {/* ── Background atmosphere ─────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Center depth glow */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(22,55,104,0.4) 0%, rgba(8,31,63,0.55) 45%, transparent 68%)' }} />
        {/* Gold top-right accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[400px]"
          style={{ background: 'radial-gradient(circle, rgba(200,165,74,0.07) 0%, transparent 65%)', filter: 'blur(75px)' }} />
        {/* Navy edge left */}
        <div className="absolute bottom-0 left-0 w-[450px] h-[350px]"
          style={{ background: 'radial-gradient(ellipse, rgba(8,31,63,0.8) 0%, transparent 70%)', filter: 'blur(55px)' }} />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.028]"
          style={{
            backgroundImage: 'radial-gradient(rgba(200,165,74,0.9) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── Header ────────────────────────────────────────── */}
        <div className="text-center mb-14">
          <p className="appr-eyebrow text-[10px] tracking-[0.32em] uppercase font-semibold text-gold mb-6">
            Our Methodology
          </p>
          <h2
            ref={headingRef}
            className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] leading-tight mb-7"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #d4cbb5 40%, #C8A54A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            A Behavioral Approach
            <br className="hidden sm:block" />
            to Decision-Making
          </h2>
          <div className="appr-divider flex justify-center mb-8">
            <GoldDivider centered />
          </div>
          <div ref={subtitleRef} className="max-w-2xl mx-auto space-y-3 text-white/50 text-base leading-relaxed">
            <p>Viddara focuses on understanding how decisions are made under pressure.</p>
            <p>
              Our work explores the behavioral patterns that influence performance, helping
              individuals gain deeper awareness and improve decision discipline over time.
            </p>
          </div>
        </div>

        {/* ── Orbit diagram ─────────────────────────────────── */}
        <div className="flex justify-center mb-16">
          <svg
            ref={diagramRef}
            viewBox="0 0 480 420"
            className="w-full max-w-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* CSS spin for orbiting particle */}
            <style>{`
              .orbit-spin-group {
                animation: apprOrbit 8s linear infinite;
                transform-origin: ${CX}px ${CY}px;
              }
              @keyframes apprOrbit {
                from { transform: rotate(0deg); }
                to   { transform: rotate(360deg); }
              }
            `}</style>

            <defs>
              <filter id="apprNodeGlow">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="apprHubGlow">
                <feGaussianBlur stdDeviation="12" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <radialGradient id="apprHubFill" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#163768" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#081F3F" stopOpacity="1" />
              </radialGradient>
            </defs>

            {/* Decorative outer rings */}
            <circle cx={CX} cy={CY} r="188" stroke="#C8A54A" strokeWidth="0.5" strokeOpacity="0.05" />
            <circle cx={CX} cy={CY} r="174" stroke="#C8A54A" strokeWidth="0.3" strokeOpacity="0.035" strokeDasharray="3 10" />

            {/* Faint full orbit guide circle */}
            <circle cx={CX} cy={CY} r={R} stroke="#C8A54A" strokeWidth="0.8" strokeOpacity="0.07" />

            {/* Spokes */}
            {NODES.map((n, i) => {
              const s = spokeCoords(n);
              return (
                <line key={i} className="orbit-spoke"
                  x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                  stroke="#C8A54A" strokeWidth="0.7" strokeOpacity="0.18" strokeDasharray="3 6" />
              );
            })}

            {/* Arcs (revealed by GSAP strokeDashoffset) */}
            {ARCS.map((d, i) => (
              <path key={i} className="orbit-arc"
                d={d}
                stroke="#C8A54A"
                strokeWidth={i === 1 ? '2' : '1.6'}
                strokeOpacity={i === 1 ? '0.65' : '0.48'}
                strokeLinecap="round"
                strokeDasharray={ARC_LEN}
              />
            ))}

            {/* Orbiting particle (CSS rotation) */}
            <g className="orbit-spin-group">
              <circle cx={CX} cy={CY - R} r="4" fill="#C8A54A" opacity="0.9" filter="url(#apprNodeGlow)" />
              <circle cx={CX} cy={CY - R} r="2" fill="#DFCA8D" opacity="1" />
            </g>

            {/* Hub */}
            <g className="orbit-hub-g">
              <circle cx={CX} cy={CY} r={HUB_R + 8}
                fill="none" stroke="#C8A54A" strokeWidth="0.5" strokeOpacity="0.12" strokeDasharray="3 7" />
              <circle cx={CX} cy={CY} r={HUB_R}
                fill="url(#apprHubFill)" stroke="#C8A54A" strokeWidth="1" strokeOpacity="0.28"
                filter="url(#apprHubGlow)" />
              <circle cx={CX} cy={CY} r="7" fill="#C8A54A" opacity="0.7" filter="url(#apprNodeGlow)" />
              <circle cx={CX} cy={CY} r="3.5" fill="#DFCA8D" opacity="0.95" />
              <text x={CX} y={CY - 13} textAnchor="middle"
                fill="#C8A54A" fillOpacity="0.5" fontSize="7.5"
                fontFamily="Inter,sans-serif" letterSpacing="2" fontWeight="500">
                BEHAVIORAL
              </text>
              <text x={CX} y={CY + 7} textAnchor="middle"
                fill="#C8A54A" fillOpacity="0.5" fontSize="7.5"
                fontFamily="Inter,sans-serif" letterSpacing="2" fontWeight="500">
                INTELLIGENCE
              </text>
            </g>

            {/* Nodes (scale-in via GSAP) */}
            {NODES.map((n, i) => (
              <g key={i} className="orbit-node" style={{ transformOrigin: `${n.x}px ${n.y}px` }}>
                {/* Pulse ring (GSAP continuous scale+fade after entry) */}
                <circle className="orbit-pulse" cx={n.x} cy={n.y} r="14"
                  fill="none" stroke="#C8A54A" strokeWidth="1" strokeOpacity="0.45"
                  style={{ transformOrigin: `${n.x}px ${n.y}px` }} />
                {/* Static node ring */}
                <circle cx={n.x} cy={n.y} r="14"
                  fill="rgba(4,16,33,0.96)" stroke="#C8A54A" strokeWidth="1.3" strokeOpacity="0.5" />
                {/* Node center dot */}
                <circle cx={n.x} cy={n.y} r="5"
                  fill="#C8A54A" opacity="0.82" filter="url(#apprNodeGlow)" />
                <circle cx={n.x} cy={n.y} r="2.5"
                  fill="#DFCA8D" opacity="0.95" />
              </g>
            ))}

            {/* Node labels */}
            {NODE_LABELS.map((l, i) => (
              <text key={i} className="orbit-lbl"
                x={l.x} y={l.y} textAnchor={l.anchor}
                fill="#C8A54A" fillOpacity="0.52" fontSize="8"
                fontFamily="Inter,sans-serif" letterSpacing="2">
                {l.text}
              </text>
            ))}
          </svg>
        </div>

        {/* ── Pillar cards ────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <div
              key={i}
              className="appr-card group relative rounded-2xl p-8 overflow-hidden cursor-default"
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
              {/* Top shimmer line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
              {/* Watermark number */}
              <span
                className="absolute -top-5 -right-1 font-serif font-bold text-white select-none pointer-events-none leading-none"
                style={{ fontSize: '7rem', opacity: 0.03 }}
              >
                {p.num}
              </span>

              <div className="relative z-10">
                <p className="text-[9px] tracking-[0.28em] uppercase text-gold/55 mb-5 font-medium">
                  {p.label}
                </p>
                <div className="w-6 h-px bg-gold mb-5" style={{ opacity: 0.45 }} />
                <h3 className="font-serif text-xl text-white/90 mb-4 leading-snug">
                  {p.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
