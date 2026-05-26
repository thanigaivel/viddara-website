'use client';

import { useRef, useEffect } from 'react';
import GoldDivider from '@/components/ui/GoldDivider';
import CTAButton from '@/components/ui/CTAButton';

// ── Ring gauge constants ────────────────────────────────────────
const CX = 220, CY = 215, R = 115;
const CIRC = parseFloat((2 * Math.PI * R).toFixed(2));   // 722.57
const SCORE = 87;
const SCORE_OFFSET = parseFloat((CIRC * (1 - SCORE / 100)).toFixed(2)); // ~93.93

const p = (n: number) => Math.round(n * 1e4) / 1e4;

// Tick marks: 24 ticks every 15°, starting from top (−90°)
const TICKS = Array.from({ length: 24 }, (_, i) => {
  const a = (i * 15 - 90) * (Math.PI / 180);
  const major = i % 6 === 0;
  const r1 = R + 3, r2 = R - (major ? 9 : 5);
  return {
    x1: p(CX + r1 * Math.cos(a)), y1: p(CY + r1 * Math.sin(a)),
    x2: p(CX + r2 * Math.cos(a)), y2: p(CY + r2 * Math.sin(a)),
    major,
  };
});

// Metric chips: x, y, w, h define the rect; cx/cy = chip visual center for connector
const CHIPS = [
  { x: 6,   y: 98,  w: 106, h: 52, value: '12',  label: 'PATTERNS',  cx: 59,  cy: 124 },
  { x: 6,   y: 292, w: 106, h: 52, value: '28',  label: 'SESSIONS',  cx: 59,  cy: 318 },
  { x: 328, y: 98,  w: 106, h: 52, value: '87',  label: 'SCORE',     cx: 381, cy: 124 },
  { x: 328, y: 292, w: 106, h: 52, value: 'LOW', label: 'RISK',      cx: 381, cy: 318 },
];

// Ring-edge endpoints for connector lines
const CONNECTORS = CHIPS.map(c => {
  const dx = c.cx - CX, dy = c.cy - CY, d = Math.sqrt(dx * dx + dy * dy);
  return { x1: c.cx, y1: c.cy, x2: CX + (dx / d) * R, y2: CY + (dy / d) * R };
});

// Mini bar chart
const BAR_DATA  = [22, 32, 40, 25, 45];
const BAR_W     = 24, BAR_GAP = 16;
const BARS_W    = BAR_DATA.length * BAR_W + (BAR_DATA.length - 1) * BAR_GAP; // 184
const BX0       = CX - BARS_W / 2;   // 128
const BAR_BTM   = 450;

// Feature list
const FEATURES = [
  'Behavioral Pattern Recognition',
  'Decision Discipline Scoring',
  'Real-time Psychology Insights',
  'Performance Trend Analysis',
];

export default function ProductSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const scoreRef   = useRef<SVGTextElement>(null);
  const arcRef     = useRef<SVGCircleElement>(null);

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
      gsap.set(arcRef.current,     { strokeDashoffset: CIRC });
      gsap.set('.prod-chip',       { opacity: 0, scale: 0.85, transformOrigin: 'center' });
      gsap.set('.prod-conn',       { opacity: 0 });

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
        // Visual enters from right (overlaps with text animations)
        .to('.prod-visual',     { opacity: 1, x: 0, duration: 1.0, ease: 'power2.out' }, '<-1.4')
        // Arc draws itself
        .to(arcRef.current,     { strokeDashoffset: SCORE_OFFSET, duration: 1.8, ease: 'power2.inOut' }, '-=0.7')
        // Score counter via call (fires at arc start)
        .call(() => {
          const counter = { val: 0 };
          gsap.to(counter, {
            val: SCORE, duration: 1.8, ease: 'power2.inOut',
            onUpdate() {
              if (scoreRef.current) scoreRef.current.textContent = String(Math.round(counter.val));
            },
            onComplete() {
              if (scoreRef.current) scoreRef.current.textContent = String(SCORE);
            },
          });
        }, undefined, '<')
        // Connector lines
        .to('.prod-conn',       { opacity: 1, duration: 0.5, stagger: 0.1 },   '-=0.8')
        // Chips spring in
        .to('.prod-chip',       { opacity: 1, scale: 1, duration: 0.42, stagger: 0.1, ease: 'back.out(1.7)' }, '-=0.55')
        // Bars grow from baseline
        .from('.prod-bar',      { attr: { height: 0, y: BAR_BTM }, duration: 0.55, stagger: 0.09, ease: 'power2.out' }, '-=0.35');

      // Continuous hub glow pulse (starts after entry)
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
        {/* Left navy depth */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[700px] h-[700px]"
          style={{ background: 'radial-gradient(circle, rgba(22,55,104,0.35) 0%, rgba(8,31,63,0.6) 45%, transparent 68%)', filter: 'blur(65px)' }} />
        {/* Right gold warmth */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[650px]"
          style={{ background: 'radial-gradient(circle, rgba(200,165,74,0.09) 0%, transparent 58%)', filter: 'blur(75px)' }} />
        {/* Horizontal scan lines (tech feel) */}
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
              Behavioral discipline for traders
            </p>

            <div className="prod-desc text-white/52 text-base leading-relaxed mb-9">
              <p>
                MindTrade is a behavioral discipline platform designed for traders.
                It helps individuals understand how their decisions are influenced
                by behavior and provides structured insights to improve discipline
                during trading.
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
              <CTAButton href="https://mindtradein.netlify.app/" external variant="primary">
                Visit MindTrade →
              </CTAButton>
            </div>
          </div>

          {/* ── Right: Gauge visualization ─────────────────── */}
          <div className="prod-visual flex items-center justify-center lg:justify-end">
            <svg
              viewBox="0 0 440 480"
              className="w-full max-w-sm"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* CSS: rotating outer orbit ring */}
              <style>{`
                .prod-orbit {
                  animation: prodRingOrbit 22s linear infinite;
                  transform-origin: ${CX}px ${CY}px;
                }
                @keyframes prodRingOrbit {
                  from { transform: rotate(0deg); }
                  to   { transform: rotate(360deg); }
                }
              `}</style>

              <defs>
                <radialGradient id="prodHubFill" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#163768" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#081F3F" stopOpacity="1" />
                </radialGradient>
                <linearGradient id="prodBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stopColor="#DFCA8D" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#C8A54A" stopOpacity="0.5" />
                </linearGradient>
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
              <circle className="prod-orbit"
                cx={CX} cy={CY} r="160"
                stroke="#C8A54A" strokeWidth="0.6" strokeOpacity="0.1"
                strokeDasharray="6 16" />

              {/* Static guide rings */}
              <circle cx={CX} cy={CY} r="147" stroke="#C8A54A" strokeWidth="0.4" strokeOpacity="0.05" />
              <circle cx={CX} cy={CY} r="134" stroke="#C8A54A" strokeWidth="0.3" strokeOpacity="0.04" strokeDasharray="2 8" />

              {/* Score track — full faint circle */}
              <circle cx={CX} cy={CY} r={R}
                stroke="#ffffff" strokeWidth="7" strokeOpacity="0.04" />

              {/* Score arc (GSAP animates strokeDashoffset) */}
              <circle
                ref={arcRef}
                cx={CX} cy={CY} r={R}
                className="prod-arc"
                stroke="#C8A54A"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                transform={`rotate(-90 ${CX} ${CY})`}
                filter="url(#prodGlow)"
              />

              {/* Tick marks */}
              {TICKS.map((t, i) => (
                <line key={i}
                  x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                  stroke="#C8A54A"
                  strokeWidth={t.major ? 1.4 : 0.6}
                  strokeOpacity={t.major ? 0.5 : 0.18} />
              ))}

              {/* Inner decorative rings */}
              <circle cx={CX} cy={CY} r="93"  stroke="#C8A54A" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="3 9" />
              <circle cx={CX} cy={CY} r="73"  stroke="#C8A54A" strokeWidth="0.4" strokeOpacity="0.07" />

              {/* Hub glow (GSAP pulses this) */}
              <circle className="prod-hub-glow"
                cx={CX} cy={CY} r="56"
                fill="#C8A54A" opacity="0.08"
                filter="url(#prodHubGlowF)" />

              {/* Hub body */}
              <circle cx={CX} cy={CY} r="55"
                fill="url(#prodHubFill)"
                stroke="#C8A54A" strokeWidth="1" strokeOpacity="0.22" />
              <circle cx={CX} cy={CY} r="43"
                fill="none" stroke="#C8A54A" strokeWidth="0.4" strokeOpacity="0.12" strokeDasharray="2 7" />

              {/* Score label top */}
              <text x={CX} y={CY - 15}
                textAnchor="middle"
                fill="#C8A54A" fillOpacity="0.48"
                fontSize="7.5" fontFamily="Inter,sans-serif" letterSpacing="2">
                DISCIPLINE
              </text>

              {/* Score number (counter updates textContent) */}
              <text ref={scoreRef}
                x={CX} y={CY + 14}
                textAnchor="middle"
                fill="#DFCA8D"
                fontSize="40" fontFamily="Georgia,serif">
                0
              </text>

              {/* Score label bottom */}
              <text x={CX} y={CY + 28}
                textAnchor="middle"
                fill="#C8A54A" fillOpacity="0.48"
                fontSize="7.5" fontFamily="Inter,sans-serif" letterSpacing="2">
                SCORE
              </text>

              {/* Connector lines */}
              {CONNECTORS.map((c, i) => (
                <line key={i} className="prod-conn"
                  x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
                  stroke="#C8A54A" strokeWidth="0.7" strokeOpacity="0.22"
                  strokeDasharray="3 5" />
              ))}

              {/* Metric chips */}
              {CHIPS.map((chip, i) => (
                <g key={i} className="prod-chip"
                  style={{ transformOrigin: `${chip.x + chip.w / 2}px ${chip.y + chip.h / 2}px` }}>
                  {/* Card body */}
                  <rect x={chip.x} y={chip.y} width={chip.w} height={chip.h} rx="8"
                    fill="rgba(5,16,32,0.94)"
                    stroke="#C8A54A" strokeWidth="0.8" strokeOpacity="0.22" />
                  {/* Top shimmer line */}
                  <rect x={chip.x} y={chip.y} width={chip.w} height="1" rx="0"
                    fill="#C8A54A" opacity="0.38" />
                  {/* Label */}
                  <text x={chip.x + chip.w / 2} y={chip.y + 17}
                    textAnchor="middle"
                    fill="#C8A54A" fillOpacity="0.45"
                    fontSize="7" fontFamily="Inter,sans-serif" letterSpacing="1.8">
                    {chip.label}
                  </text>
                  {/* Value */}
                  <text x={chip.x + chip.w / 2} y={chip.y + 38}
                    textAnchor="middle"
                    fill="#DFCA8D" fillOpacity="0.92"
                    fontSize="16" fontFamily="Georgia,serif">
                    {chip.value}
                  </text>
                </g>
              ))}

              {/* ── Mini bar chart ──────────────────────────── */}
              {/* Bar baseline */}
              <line
                x1={BX0 - 6} y1={BAR_BTM}
                x2={BX0 + BARS_W + 6} y2={BAR_BTM}
                stroke="#C8A54A" strokeWidth="0.6" strokeOpacity="0.2" />

              {/* Bars */}
              {BAR_DATA.map((h, i) => {
                const bx = BX0 + i * (BAR_W + BAR_GAP);
                const isPeak = i === BAR_DATA.length - 1;
                return (
                  <rect key={i} className="prod-bar"
                    x={bx} y={BAR_BTM - h}
                    width={BAR_W} height={h} rx="3"
                    fill={isPeak ? 'url(#prodBarGrad)' : 'rgba(200,165,74,0.32)'}
                    stroke="#C8A54A"
                    strokeWidth={isPeak ? 0.9 : 0.5}
                    strokeOpacity={isPeak ? 0.6 : 0.28} />
                );
              })}

              {/* Chart label */}
              <text x={CX} y="470"
                textAnchor="middle"
                fill="#C8A54A" fillOpacity="0.28"
                fontSize="7" fontFamily="Inter,sans-serif" letterSpacing="2">
                TRADING PERFORMANCE
              </text>
            </svg>
          </div>

        </div>
      </div>
    </section>
  );
}
