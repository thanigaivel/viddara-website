'use client';

import { useRef, useEffect } from 'react';
import GoldDivider from '@/components/ui/GoldDivider';
import CTAButton from '@/components/ui/CTAButton';

// Feature list — V2 approved (no scoring/psychology terminology)
const FEATURES = [
  'Behavioural Awareness',
  'Decision Reflection',
  'Behavioural Insights',
  'Performance Insights',
];

// ── Abstract visualization constants ────────────────────────────
// Concentric ring visualization — conceptual, no scoring/metrics
const CX = 200, CY = 200;
const RINGS = [
  { r: 160, opacity: 0.06, dash: '6 16' },
  { r: 135, opacity: 0.05, dash: '' },
  { r: 110, opacity: 0.12, dash: '3 9' },
  { r: 85,  opacity: 0.08, dash: '' },
  { r: 60,  opacity: 0.14, dash: '2 7' },
];

// Abstract nodes on the rings — purely decorative
const NODES = [
  { cx: 200, cy: 40,  r: 8 },   // top
  { cx: 338, cy: 130, r: 7 },   // upper-right
  { cx: 340, cy: 270, r: 6 },   // lower-right
  { cx: 200, cy: 360, r: 7 },   // bottom
  { cx: 62,  cy: 270, r: 6 },   // lower-left
  { cx: 60,  cy: 130, r: 7 },   // upper-left
];

// Connecting arcs
const ARCS = [
  `M 200 40 A 160 160 0 0 1 338 130`,
  `M 338 130 A 160 160 0 0 1 340 270`,
  `M 340 270 A 160 160 0 0 1 200 360`,
  `M 200 360 A 160 160 0 0 1 62 270`,
  `M 62 270 A 160 160 0 0 1 60 130`,
  `M 60 130 A 160 160 0 0 1 200 40`,
];

export default function ProductSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (!sectionRef.current) return;

      // ── Initial states ──────────────────────────────────────
      gsap.set('.prod-eyebrow',    { opacity: 0, y: 18 });
      gsap.set(headingRef.current, { opacity: 0, y: 40 });
      gsap.set('.prod-divider',    { opacity: 0, scaleX: 0 });
      gsap.set('.prod-sub',        { opacity: 0, y: 22 });
      gsap.set('.prod-desc',       { opacity: 0, y: 20 });
      gsap.set('.prod-feat',       { opacity: 0, x: -20 });
      gsap.set('.prod-cta',        { opacity: 0, y: 18 });
      gsap.set('.prod-visual',     { opacity: 0, x: 40 });
      gsap.set('.prod-ring',       { opacity: 0, scale: 0.8, transformOrigin: `${CX}px ${CY}px` });
      gsap.set('.prod-node-g',     { scale: 0 });
      gsap.set('.prod-arc',        { strokeDashoffset: 260 });

      // ── Entry timeline ──────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 68%', once: true },
        defaults: { ease: 'power3.out' },
      });

      tl
        .to('.prod-eyebrow',    { opacity: 1, y: 0, duration: 0.6 })
        .to(headingRef.current, { opacity: 1, y: 0, duration: 0.95 },          '-=0.3')
        .to('.prod-divider',    { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'left' }, '-=0.55')
        .to('.prod-sub',        { opacity: 1, y: 0, duration: 0.7 },           '-=0.4')
        .to('.prod-desc',       { opacity: 1, y: 0, duration: 0.7 },           '-=0.4')
        .to('.prod-feat',       { opacity: 1, x: 0, duration: 0.5, stagger: 0.11 }, '-=0.35')
        .to('.prod-cta',        { opacity: 1, y: 0, duration: 0.6 },           '-=0.2')
        .to('.prod-visual',     { opacity: 1, x: 0, duration: 1.0, ease: 'power2.out' }, '<-1.4')
        .to('.prod-ring',       { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.2)' }, '-=0.8')
        .to('.prod-arc',        { strokeDashoffset: 0, duration: 1.2, stagger: 0.12, ease: 'power2.inOut' }, '-=0.7')
        .to('.prod-node-g',     { scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' }, '-=1.0');

      // Continuous hub glow
      tl.call(() => {
        gsap.to('.prod-hub-glow', {
          opacity: 0.22, scale: 1.45, duration: 2.8,
          repeat: -1, yoyo: true, ease: 'sine.inOut',
          transformOrigin: `${CX}px ${CY}px`,
        });
      });
    };

    init();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #081F3F 0%, #071b38 50%, #081F3F 100%)' }}>

      {/* ── Background ──────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[700px] h-[700px]"
          style={{ background: 'radial-gradient(circle, rgba(22,55,104,0.35) 0%, rgba(8,31,63,0.6) 45%, transparent 68%)', filter: 'blur(65px)' }} />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[650px]"
          style={{ background: 'radial-gradient(circle, rgba(200,165,74,0.09) 0%, transparent 58%)', filter: 'blur(75px)' }} />
        <div className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: 'linear-gradient(rgba(200,165,74,1) 1px, transparent 1px)',
            backgroundSize: '100% 52px',
          }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── Left: Content ──────────────────────────────── */}
          <div>
            <p className="prod-eyebrow text-[10px] tracking-[0.32em] uppercase font-semibold text-gold mb-6">
              Our First Product
            </p>

            <h2
              ref={headingRef}
              className="font-serif leading-none mb-4"
              style={{
                fontSize: 'clamp(3.5rem, 8vw, 5.5rem)',
                background: 'linear-gradient(135deg, #ffffff 10%, #e8dfc0 45%, #C8A54A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              MindTrade
            </h2>

            <div className="prod-divider mb-7">
              <GoldDivider />
            </div>

            <p className="prod-sub font-serif text-lg italic mb-7 leading-snug"
              style={{ color: 'rgba(223,202,141,0.65)' }}>
              Behavioural discipline for traders
            </p>

            <div className="prod-desc text-white/55 text-base leading-relaxed mb-9">
              <p>
                MindTrade is the first product from Viddara Technologies. It helps traders
                develop greater awareness of their decision behaviour and build stronger
                trading discipline through structured behavioural insights.
              </p>
            </div>

            {/* Feature list */}
            <ul className="space-y-3.5 mb-11">
              {FEATURES.map((f, i) => (
                <li key={i} className="prod-feat flex items-center gap-3.5">
                  <span className="w-5 h-px bg-gradient-to-r from-gold to-gold-light flex-shrink-0" />
                  <span className="text-white/62 text-sm tracking-wide">{f}</span>
                </li>
              ))}
            </ul>

            <div className="prod-cta">
              <CTAButton href="https://mindtrade.in/" external variant="primary">
                Visit MindTrade →
              </CTAButton>
            </div>
          </div>

          {/* ── Right: Abstract conceptual visualization ───── */}
          <div className="prod-visual flex items-center justify-center lg:justify-end">
            <svg
              viewBox="0 0 400 400"
              className="w-full max-w-sm"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* CSS: rotating outer ring */}
              <style>{`
                .prod-orbit-spin {
                  animation: prodOrbitSpin 22s linear infinite;
                  transform-origin: ${CX}px ${CY}px;
                }
                @keyframes prodOrbitSpin {
                  from { transform: rotate(0deg); }
                  to   { transform: rotate(360deg); }
                }
              `}</style>

              <defs>
                <radialGradient id="prodHubFill" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#163768" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#081F3F" stopOpacity="1" />
                </radialGradient>
                <filter id="prodGlow">
                  <feGaussianBlur stdDeviation="5" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="prodHubGlowF">
                  <feGaussianBlur stdDeviation="14" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Rotating outer dashed ring */}
              <circle className="prod-orbit-spin"
                cx={CX} cy={CY} r="180"
                stroke="#C8A54A" strokeWidth="0.6" strokeOpacity="0.08"
                strokeDasharray="6 16" />

              {/* Concentric rings */}
              {RINGS.map((ring, i) => (
                <circle key={i} className="prod-ring"
                  cx={CX} cy={CY} r={ring.r}
                  stroke="#C8A54A" strokeWidth="0.6" strokeOpacity={ring.opacity}
                  strokeDasharray={ring.dash || 'none'}
                  style={{ transformOrigin: `${CX}px ${CY}px` }}
                />
              ))}

              {/* Connecting arcs */}
              {ARCS.map((d, i) => (
                <path key={i} className="prod-arc"
                  d={d}
                  stroke="#C8A54A" strokeWidth="1.2" strokeOpacity="0.35"
                  strokeLinecap="round"
                  strokeDasharray="260"
                  fill="none"
                />
              ))}

              {/* Hub glow (GSAP pulses this) */}
              <circle className="prod-hub-glow"
                cx={CX} cy={CY} r="45"
                fill="#C8A54A" opacity="0.08"
                filter="url(#prodHubGlowF)" />

              {/* Hub body */}
              <circle cx={CX} cy={CY} r="42"
                fill="url(#prodHubFill)"
                stroke="#C8A54A" strokeWidth="1" strokeOpacity="0.22" />
              <circle cx={CX} cy={CY} r="32"
                fill="none" stroke="#C8A54A" strokeWidth="0.4" strokeOpacity="0.12" strokeDasharray="2 7" />

              {/* Hub labels */}
              <text x={CX} y={CY - 8}
                textAnchor="middle"
                fill="#C8A54A" fillOpacity="0.48"
                fontSize="7.5" fontFamily="Inter,sans-serif" letterSpacing="2">
                MIND
              </text>
              <text x={CX} y={CY + 8}
                textAnchor="middle"
                fill="#C8A54A" fillOpacity="0.48"
                fontSize="7.5" fontFamily="Inter,sans-serif" letterSpacing="2">
                TRADE
              </text>

              {/* Outer nodes */}
              {NODES.map((n, i) => (
                <g key={i} className="prod-node-g" style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}>
                  {/* Spoke line */}
                  <line x1={CX} y1={CY} x2={n.cx} y2={n.cy}
                    stroke="#C8A54A" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="3 6" />
                  {/* Node ring */}
                  <circle cx={n.cx} cy={n.cy} r={n.r + 4}
                    fill="none" stroke="#C8A54A" strokeWidth="0.5" strokeOpacity="0.12" />
                  <circle cx={n.cx} cy={n.cy} r={n.r}
                    fill="rgba(4,16,33,0.96)" stroke="#C8A54A" strokeWidth="1" strokeOpacity="0.4" />
                  {/* Node center */}
                  <circle cx={n.cx} cy={n.cy} r={n.r * 0.4}
                    fill="#C8A54A" opacity="0.72" filter="url(#prodGlow)" />
                  <circle cx={n.cx} cy={n.cy} r={n.r * 0.2}
                    fill="#DFCA8D" opacity="0.95" />
                </g>
              ))}

              {/* Center dot */}
              <circle cx={CX} cy={CY} r="6" fill="#C8A54A" opacity="0.7" filter="url(#prodGlow)" />
              <circle cx={CX} cy={CY} r="3" fill="#DFCA8D" opacity="0.95" />
            </svg>
          </div>

        </div>
      </div>
    </section>
  );
}
