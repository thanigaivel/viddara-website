'use client';

import { useEffect } from 'react';
import CTAButton from '@/components/ui/CTAButton';
import GoldDivider from '@/components/ui/GoldDivider';

// ── SSR-safe stars ─────────────────────────────────────────────
const STARS = Array.from({ length: 50 }, (_, i) => ({
  cx: ((i * 143 + 61) % 94) + 3,
  cy: ((i * 101 + 29) % 88) + 6,
  r:  0.4 + (i % 5) * 0.27,
  o:  0.04 + (i % 7) * 0.038,
}));

// ── Dashboard SVG — all hardcoded integers, SSR safe ──────────
// viewBox="0 0 380 310" — candlestick chart + score bars
// Candles: center x coords, body top/height, wick top/bottom, direction
const DASH_CANDLES = [
  { x:  50, by: 155, bh: 20, wy1: 148, wy2: 180, bull: true  },
  { x:  73, by: 148, bh: 16, wy1: 142, wy2: 170, bull: false },
  { x:  96, by: 138, bh: 20, wy1: 132, wy2: 164, bull: true  },
  { x: 119, by: 130, bh: 18, wy1: 124, wy2: 154, bull: true  },
  { x: 142, by: 132, bh: 14, wy1: 127, wy2: 152, bull: false },
  { x: 165, by: 122, bh: 20, wy1: 116, wy2: 148, bull: true  },
  { x: 188, by: 116, bh: 18, wy1: 110, wy2: 140, bull: true  },
  { x: 211, by: 118, bh: 14, wy1: 113, wy2: 138, bull: false },
  { x: 234, by: 108, bh: 18, wy1: 102, wy2: 132, bull: true  },
  { x: 257, by: 100, bh: 20, wy1:  94, wy2: 126, bull: true  },
  { x: 280, by: 102, bh: 14, wy1:  97, wy2: 122, bull: false },
  { x: 303, by:  92, bh: 18, wy1:  86, wy2: 116, bull: true  },
];
// Score bars — pct determines fill width over 230px track (x 110→340)
const DASH_SCORES = [
  { label: 'Discipline',   pct: 85, fw: 196 },
  { label: 'Patience',     pct: 78, fw: 179 },
  { label: 'Consistency',  pct: 91, fw: 209 },
  { label: 'Focus',        pct: 83, fw: 191 },
];

// ── Data ──────────────────────────────────────────────────────
const FEATURES = [
  { icon: 'chart'    as const, title: 'Behavior Tracking',    desc: 'Capture every behavioral signal during live trading sessions for comprehensive pattern analysis.' },
  { icon: 'score'    as const, title: 'Discipline Scoring',   desc: 'Quantify behavioral consistency with precision scores that evolve with every session logged.' },
  { icon: 'pattern'  as const, title: 'Pattern Recognition',  desc: 'Surface recurring behavioral tendencies that silently influence trade execution and risk decisions.' },
  { icon: 'emotion'  as const, title: 'Emotional Awareness',  desc: 'Understand how emotional states affect decision quality and position management in real time.' },
  { icon: 'analysis' as const, title: 'Session Analytics',    desc: 'Deep post-session behavioral reports that reveal the root cause behind every decision made.' },
  { icon: 'growth'   as const, title: 'Improvement Roadmap',  desc: 'Personalized behavioral improvement paths built from your unique decision and discipline profile.' },
];

const HOW_IT_WORKS = [
  { num: '01', icon: 'log'     as const, title: 'Trade & Log',     desc: 'Execute trades on your platform while MindTrade observes and captures behavioral signals continuously.' },
  { num: '02', icon: 'process' as const, title: 'Analyze',         desc: 'Advanced algorithms process your behavior against a scientific framework to identify key patterns.' },
  { num: '03', icon: 'gauge'   as const, title: 'Get Your Score',  desc: 'Receive a precise discipline score with detailed breakdowns across every behavioral dimension.' },
  { num: '04', icon: 'evolve'  as const, title: 'Evolve',          desc: 'Apply targeted insights to strengthen your weakest behavioral areas and lock in lasting improvement.' },
];

// ── Icon component ─────────────────────────────────────────────
type ProdIcon = 'chart'|'score'|'pattern'|'emotion'|'analysis'|'growth'|'log'|'process'|'gauge'|'evolve';

function Icon({ type, size = 22 }: { type: ProdIcon; size?: number }) {
  const s = { stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const icons: Record<ProdIcon, React.ReactNode> = {
    chart: (<>
      <rect x="3" y="12" width="4" height="9" rx="1" {...s}/>
      <rect x="10" y="7" width="4" height="14" rx="1" {...s}/>
      <rect x="17" y="3" width="4" height="18" rx="1" {...s}/>
      <line x1="2" y1="22" x2="22" y2="22" {...s} strokeOpacity="0.45"/>
    </>),
    score: (<>
      <path d="M3.5 17.5A9 9 0 1 1 20.5 17.5" {...s}/>
      <path d="M12 12 L7.5 8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1.8" fill="currentColor"/>
      <line x1="12" y1="4" x2="12" y2="6" {...s}/>
      <line x1="4.5" y1="8" x2="6" y2="9.3" {...s}/>
      <line x1="19.5" y1="8" x2="18" y2="9.3" {...s}/>
    </>),
    pattern: (<>
      <circle cx="5" cy="5" r="2" {...s}/>
      <circle cx="19" cy="5" r="2" {...s}/>
      <circle cx="5" cy="19" r="2" {...s}/>
      <circle cx="19" cy="19" r="2" {...s}/>
      <circle cx="12" cy="12" r="2.2" fill="currentColor" opacity="0.85"/>
      <line x1="7" y1="5" x2="17" y2="5" {...s} strokeOpacity="0.35"/>
      <line x1="5" y1="7" x2="5" y2="17" {...s} strokeOpacity="0.35"/>
      <line x1="7" y1="19" x2="17" y2="19" {...s} strokeOpacity="0.35"/>
      <line x1="19" y1="7" x2="19" y2="17" {...s} strokeOpacity="0.35"/>
      <line x1="7" y1="7" x2="10" y2="10" {...s} strokeOpacity="0.25"/>
      <line x1="17" y1="7" x2="14" y2="10" {...s} strokeOpacity="0.25"/>
    </>),
    emotion: (<>
      <circle cx="12" cy="12" r="9.5" {...s}/>
      <path d="M8.5 14.5 C9.5 16.5 10.6 17 12 17 C13.4 17 14.5 16.5 15.5 14.5" {...s}/>
      <circle cx="9" cy="10" r="1.3" fill="currentColor"/>
      <circle cx="15" cy="10" r="1.3" fill="currentColor"/>
    </>),
    analysis: (<>
      <rect x="3" y="3" width="18" height="18" rx="2" {...s}/>
      <line x1="3" y1="9" x2="21" y2="9" {...s} strokeOpacity="0.38"/>
      <line x1="9" y1="21" x2="9" y2="9" {...s} strokeOpacity="0.38"/>
      <polyline points="13 13.5 15.5 16 19.5 13.5" {...s}/>
      <line x1="13" y1="17.5" x2="19.5" y2="17.5" {...s} strokeOpacity="0.5"/>
    </>),
    growth: (<>
      <polyline points="3 18.5 8 12 13 15.5 19.5 7 22.5 10" {...s}/>
      <polyline points="19.5 7 22.5 7 22.5 10" {...s}/>
      <line x1="2.5" y1="21.5" x2="22" y2="21.5" {...s} strokeOpacity="0.4"/>
    </>),
    log: (<>
      <rect x="3" y="3" width="18" height="18" rx="2" {...s}/>
      <line x1="3" y1="9" x2="21" y2="9" {...s} strokeOpacity="0.38"/>
      <circle cx="9" cy="6" r="1" fill="currentColor"/>
      <circle cx="12" cy="6" r="1" fill="currentColor"/>
      <circle cx="15" cy="6" r="1" fill="currentColor"/>
      <line x1="7" y1="14" x2="17" y2="14" {...s}/>
      <line x1="7" y1="17.5" x2="14" y2="17.5" {...s} strokeOpacity="0.55"/>
    </>),
    process: (<>
      <path d="M12 3a9 9 0 1 0 9 9" {...s}/>
      <polyline points="21 3 17 7 21 11" {...s}/>
      <circle cx="12" cy="12" r="3" {...s}/>
    </>),
    gauge: (<>
      <path d="M3.5 17.5A9 9 0 1 1 20.5 17.5" {...s}/>
      <line x1="12" y1="12" x2="16.5" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1.8" fill="currentColor"/>
      <line x1="12" y1="4" x2="12" y2="6" {...s}/>
      <line x1="4.5" y1="8" x2="6" y2="9.3" {...s}/>
      <line x1="19.5" y1="8" x2="18" y2="9.3" {...s}/>
    </>),
    evolve: (<>
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" {...s}/>
      <path d="M8.5 13.5 C9.5 10.5 11 9.5 12 9.5 C13 9.5 14.5 10.5 15.5 13.5" {...s}/>
      <line x1="12" y1="9.5" x2="12" y2="6.5" {...s}/>
      <polyline points="10 8 12 6 14 8" {...s}/>
    </>),
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none">{icons[type]}</svg>;
}

// ── Component ─────────────────────────────────────────────────
export default function ProductClient() {
  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // ── Hero ────────────────────────────────────────────────
      gsap.set('.pd-eyebrow',  { opacity: 0, y: 20 });
      gsap.set('.pd-brand',    { opacity: 0, y: 38 });
      gsap.set('.pd-tag',      { opacity: 0, y: 16, scale: 0.9 });
      gsap.set('.pd-div',      { opacity: 0, scaleX: 0 });
      gsap.set('.pd-sub',      { opacity: 0, y: 22 });
      gsap.set('.pd-stat',     { opacity: 0, y: 24 });
      gsap.set('.pd-scroll',   { opacity: 0 });

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to('.pd-eyebrow', { opacity: 1, y: 0, duration: 0.7 })
        .to('.pd-brand',   { opacity: 1, y: 0, duration: 0.9, ease: 'back.out(1.2)' }, '-=0.3')
        .to('.pd-tag',     { opacity: 1, y: 0, scale: 1, duration: 0.6 }, '-=0.4')
        .to('.pd-div',     { opacity: 1, scaleX: 1, duration: 0.55, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.35')
        .to('.pd-sub',     { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
        .to('.pd-stat',    { opacity: 1, y: 0, duration: 0.6, stagger: 0.13 }, '-=0.3')
        .to('.pd-scroll',  { opacity: 1, duration: 0.5 });

      gsap.utils.toArray<SVGCircleElement>('.pd-star').forEach((el, i) => {
        const base = parseFloat(el.getAttribute('opacity') ?? '0.04');
        gsap.to(el, { opacity: Math.min(base * 4, 0.65), duration: 1.8 + (i % 5) * 0.7, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.11 });
      });

      // ── Dashboard / Overview ─────────────────────────────────
      gsap.set('.pd-ov-eyebrow', { opacity: 0, y: 18 });
      gsap.set('.pd-ov-h',       { opacity: 0, y: 28 });
      gsap.set('.pd-ov-div',     { opacity: 0, scaleX: 0 });
      gsap.set('.pd-ov-para',    { opacity: 0, y: 20 });
      gsap.set('.pd-ov-pill',    { opacity: 0, x: -16 });
      gsap.set('.pd-ov-card',    { opacity: 0, scale: 0.93, y: 18 });
      gsap.set('.pd-candle',     { scaleY: 0 });
      gsap.set('.pd-bar-fill',   { scaleX: 0 });

      gsap.timeline({ scrollTrigger: { trigger: '.pd-ov-section', start: 'top 68%', once: true }, defaults: { ease: 'power3.out' } })
        .to('.pd-ov-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.pd-ov-h',       { opacity: 1, y: 0, duration: 0.8 }, '-=0.25')
        .to('.pd-ov-div',     { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'left' }, '-=0.4')
        .to('.pd-ov-para',    { opacity: 1, y: 0, duration: 0.65, stagger: 0.16 }, '-=0.35')
        .to('.pd-ov-pill',    { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 }, '-=0.4')
        .to('.pd-ov-card',    { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: 'back.out(1.15)' }, '-=0.4')
        .to('.pd-candle',     { scaleY: 1, duration: 0.45, stagger: 0.05, ease: 'back.out(1.5)' }, '-=0.55')
        .to('.pd-bar-fill',   { scaleX: 1, duration: 0.7, stagger: 0.13, ease: 'power2.out', transformOrigin: 'left center' }, '-=0.55');

      // ── Features ─────────────────────────────────────────────
      gsap.set('.pd-feat-eyebrow', { opacity: 0, y: 18 });
      gsap.set('.pd-feat-h',       { opacity: 0, y: 28 });
      gsap.set('.pd-feat-div',     { opacity: 0, scaleX: 0 });
      gsap.set('.pd-feat-card',    { opacity: 0, y: 30 });

      gsap.timeline({ scrollTrigger: { trigger: '.pd-feat-section', start: 'top 72%', once: true }, defaults: { ease: 'power3.out' } })
        .to('.pd-feat-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.pd-feat-h',       { opacity: 1, y: 0, duration: 0.8 }, '-=0.25')
        .to('.pd-feat-div',     { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.4')
        .to('.pd-feat-card',    { opacity: 1, y: 0, duration: 0.65, stagger: 0.1 }, '-=0.3');

      // ── How It Works ─────────────────────────────────────────
      gsap.set('.pd-how-eyebrow', { opacity: 0, y: 18 });
      gsap.set('.pd-how-h',       { opacity: 0, y: 28 });
      gsap.set('.pd-how-div',     { opacity: 0, scaleX: 0 });
      gsap.set('.pd-how-track',   { scaleX: 0 });
      gsap.set('.pd-how-node',    { scale: 0 });
      gsap.set('.pd-how-item',    { opacity: 0, y: 24 });

      gsap.timeline({ scrollTrigger: { trigger: '.pd-how-section', start: 'top 72%', once: true }, defaults: { ease: 'power3.out' } })
        .to('.pd-how-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.pd-how-h',       { opacity: 1, y: 0, duration: 0.8 }, '-=0.25')
        .to('.pd-how-div',     { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.4')
        .to('.pd-how-track',   { scaleX: 1, duration: 1.4, ease: 'power2.inOut', transformOrigin: 'left center' }, '-=0.2')
        .to('.pd-how-node',    { scale: 1, duration: 0.42, stagger: 0.18, ease: 'back.out(2.2)' }, '-=1.1')
        .to('.pd-how-item',    { opacity: 1, y: 0, duration: 0.65, stagger: 0.14 }, '-=0.9');

      // ── CTA ──────────────────────────────────────────────────
      gsap.set('.pd-cta-eyebrow', { opacity: 0, y: 18 });
      gsap.set('.pd-cta-h',       { opacity: 0, y: 28 });
      gsap.set('.pd-cta-sub',     { opacity: 0, y: 20 });
      gsap.set('.pd-cta-btns',    { opacity: 0, y: 18 });

      gsap.timeline({ scrollTrigger: { trigger: '.pd-cta-section', start: 'top 75%', once: true }, defaults: { ease: 'power3.out' } })
        .to('.pd-cta-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.pd-cta-h',       { opacity: 1, y: 0, duration: 0.9 }, '-=0.25')
        .to('.pd-cta-sub',     { opacity: 1, y: 0, duration: 0.7 }, '-=0.35')
        .to('.pd-cta-btns',    { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
    };
    init();
  }, []);

  return (
    <div>

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#020811 0%,#051629 38%,#081F3F 100%)' }}>

        <style>{`
          @keyframes pdHeroRing { 0%{transform:scale(0.06);opacity:0.42} 100%{transform:scale(1);opacity:0} }
          .pd-hero-ring { animation: pdHeroRing 9s ease-out infinite; transform-origin: center; }
          @keyframes pdScanLine { 0%{transform:translateY(110%);opacity:0} 8%{opacity:0.3} 92%{opacity:0.3} 100%{transform:translateY(-110%);opacity:0} }
          .pd-scan { animation: pdScanLine 12s linear infinite; }
          @keyframes pdLivePulse { 0%,100%{opacity:0.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.35)} }
          .pd-live-dot { animation: pdLivePulse 2s ease-in-out infinite; }
        `}</style>

        {/* Stars */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" preserveAspectRatio="none">
          {STARS.map((s, i) => (
            <circle key={i} className="pd-star" cx={`${s.cx}%`} cy={`${s.cy}%`} r={s.r} fill="#DFCA8D" opacity={s.o}/>
          ))}
        </svg>

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle,rgba(200,165,74,0.9) 1.5px,transparent 1.5px)', backgroundSize: '44px 44px' }}/>

        {/* Scan line */}
        <div className="pd-scan absolute inset-x-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(to right,transparent,rgba(200,165,74,0.32) 28%,rgba(200,165,74,0.52) 50%,rgba(200,165,74,0.32) 72%,transparent)' }}/>

        {/* Pulse rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[0,1,2].map(i => (
            <div key={i} className="pd-hero-ring absolute rounded-full"
              style={{ width: '1000px', height: '1000px', border: '1px solid rgba(200,165,74,0.09)', animationDelay: `${i * 3}s` }}/>
          ))}
        </div>

        {/* Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px]"
            style={{ background: 'radial-gradient(ellipse,rgba(22,55,104,0.36) 0%,rgba(8,31,63,0.52) 45%,transparent 68%)', filter: 'blur(80px)' }}/>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px]"
            style={{ background: 'radial-gradient(circle,rgba(200,165,74,0.08) 0%,transparent 65%)', filter: 'blur(50px)' }}/>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto w-full">

          {/* Live terminal badge */}
          <div className="pd-eyebrow inline-flex items-center gap-2.5 rounded-full px-5 py-2 mb-10 mx-auto"
            style={{ background: 'linear-gradient(135deg,rgba(22,55,104,0.28) 0%,rgba(8,31,63,0.7) 100%)', border: '1px solid rgba(200,165,74,0.2)' }}>
            <span className="pd-live-dot w-1.5 h-1.5 rounded-full bg-gold inline-block"/>
            <span className="text-[9.5px] tracking-[0.32em] uppercase font-semibold text-gold/70">
              Live on Viddara Technologies
            </span>
          </div>

          {/* Brand name */}
          <h1 className="pd-brand font-serif leading-none mb-6" style={{ fontSize: 'clamp(3.8rem,10vw,8rem)' }}>
            <span style={{ background: 'linear-gradient(135deg,#ffffff 0%,#e8e4d8 60%,#ddd0a8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Mind
            </span>
            <span style={{ background: 'linear-gradient(135deg,#C8A54A 0%,#DFCA8D 50%,#C8A54A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Trade
            </span>
          </h1>

          {/* Product tag */}
          <div className="pd-tag inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-9"
            style={{ background: 'rgba(200,165,74,0.08)', border: '1px solid rgba(200,165,74,0.18)' }}>
            <div className="w-px h-3.5 bg-gold/35"/>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold/60 font-medium">
              Behavioral Discipline Platform for Traders
            </p>
            <div className="w-px h-3.5 bg-gold/35"/>
          </div>

          <div className="pd-div flex justify-center mb-9">
            <GoldDivider centered/>
          </div>

          <p className="pd-sub text-white/52 text-lg leading-relaxed max-w-2xl mx-auto mb-14">
            MindTrade helps traders understand how their decisions are shaped by behavior —
            and provides the intelligence to build lasting discipline.
          </p>

          {/* Stat chips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { label: 'Category',  value: 'Behavioral Finance' },
              { label: 'Platform',  value: 'Web Application'    },
              { label: 'Focus',     value: 'Decision Discipline' },
            ].map((st, i) => (
              <div key={i} className="pd-stat relative rounded-2xl px-6 py-5 text-center overflow-hidden"
                style={{ background: 'linear-gradient(160deg,rgba(22,55,104,0.16) 0%,rgba(8,31,63,0.58) 100%)', border: '1px solid rgba(200,165,74,0.14)' }}>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"/>
                <p className="text-[9.5px] tracking-[0.24em] uppercase text-gold/50 mb-2">{st.label}</p>
                <p className="font-serif text-white/88 text-sm leading-snug">{st.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="pd-scroll absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/28 text-[9px] tracking-[0.22em] uppercase">Scroll</span>
          <div className="relative w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-gold rounded-full" style={{ animation: 'scrollPulse 2s ease-in-out infinite' }}/>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/14 to-transparent"/>
      </section>

      {/* ── 2. PLATFORM OVERVIEW ─────────────────────────────────── */}
      <section className="pd-ov-section relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#081F3F 0%,#0a2246 50%,#081F3F 100%)' }}>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[500px]"
            style={{ background: 'radial-gradient(circle,rgba(22,55,104,0.40) 0%,transparent 65%)', filter: 'blur(65px)' }}/>
          <div className="absolute bottom-0 right-0 w-[500px] h-[420px]"
            style={{ background: 'radial-gradient(circle,rgba(200,165,74,0.07) 0%,transparent 65%)', filter: 'blur(60px)' }}/>
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: 'radial-gradient(rgba(200,165,74,0.9) 1px,transparent 1px)', backgroundSize: '40px 40px' }}/>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Text */}
            <div>
              <p className="pd-ov-eyebrow text-[10px] tracking-[0.34em] uppercase font-semibold text-gold mb-6">
                The Platform
              </p>
              <h2 className="pd-ov-h font-serif text-4xl sm:text-5xl leading-tight mb-6"
                style={{ background: 'linear-gradient(135deg,#ffffff 0%,#ddd5be 45%,#C8A54A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                What is MindTrade?
              </h2>
              <div className="pd-ov-div mb-9"><GoldDivider/></div>
              <div className="space-y-5 mb-10">
                <p className="pd-ov-para text-white/55 text-base leading-relaxed">
                  MindTrade is a behavioral discipline platform built specifically for traders.
                  It captures, analyzes, and scores the behavioral patterns that silently drive every
                  trading decision.
                </p>
                <p className="pd-ov-para text-white/55 text-base leading-relaxed">
                  While most platforms focus on tools and information, MindTrade focuses on the
                  trader — understanding how their behavior under pressure influences outcomes and
                  building a clear path to improvement.
                </p>
                <p className="pd-ov-para text-white/55 text-base leading-relaxed">
                  Every session generates a behavioral intelligence report with a precision discipline
                  score, pattern insights, and a personalized improvement roadmap.
                </p>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-3">
                {['Real-time Analysis', 'Discipline Score', 'Pattern Insights', 'Session Reports'].map((pill, i) => (
                  <div key={i} className="pd-ov-pill flex items-center gap-2 rounded-full px-4 py-1.5"
                    style={{ background: 'rgba(200,165,74,0.07)', border: '1px solid rgba(200,165,74,0.18)' }}>
                    <span className="text-gold/60 text-[8px]">◆</span>
                    <span className="text-[9.5px] tracking-[0.2em] uppercase text-white/55">{pill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard SVG mockup */}
            <div className="pd-ov-card relative">
              <div className="absolute -inset-3 rounded-3xl opacity-30"
                style={{ background: 'radial-gradient(ellipse at 50% 50%,rgba(200,165,74,0.15) 0%,transparent 70%)', filter: 'blur(20px)' }}/>

              <div className="relative rounded-2xl overflow-hidden"
                style={{ background: 'linear-gradient(160deg,rgba(22,55,104,0.22) 0%,rgba(5,22,41,0.95) 100%)', border: '1px solid rgba(200,165,74,0.16)', boxShadow: '0 24px 80px -16px rgba(0,0,0,0.7)' }}>

                {/* Title bar */}
                <div className="flex items-center justify-between px-5 py-3.5"
                  style={{ borderBottom: '1px solid rgba(200,165,74,0.1)', background: 'rgba(8,31,63,0.6)' }}>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/12"/>
                      <div className="w-2.5 h-2.5 rounded-full bg-white/12"/>
                      <div className="w-2.5 h-2.5 rounded-full bg-white/12"/>
                    </div>
                    <span className="text-[9.5px] tracking-[0.2em] uppercase text-white/35 font-medium">MindTrade · Session Analytics</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold" style={{ animation: 'pdLivePulse 2s ease-in-out infinite' }}/>
                    <span className="text-[8.5px] tracking-[0.18em] uppercase text-gold/50">Live</span>
                  </div>
                </div>

                {/* SVG dashboard */}
                <svg viewBox="0 0 380 310" className="w-full" fill="none">
                  <defs>
                    <linearGradient id="pdBullGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4ade80" stopOpacity="0.9"/>
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0.7"/>
                    </linearGradient>
                    <linearGradient id="pdBearGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" stopOpacity="0.9"/>
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.7"/>
                    </linearGradient>
                    <linearGradient id="pdBarGold" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#C8A54A" stopOpacity="0.55"/>
                      <stop offset="100%" stopColor="#DFCA8D" stopOpacity="0.92"/>
                    </linearGradient>
                    <filter id="pdCandleGlow">
                      <feGaussianBlur stdDeviation="1.5" result="b"/>
                      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>

                  {/* Chart area label */}
                  <text x="20" y="22" fill="#C8A54A" fillOpacity="0.42" fontSize="7.5" fontFamily="Inter,sans-serif" letterSpacing="2">SESSION · PRICE ACTION</text>
                  <text x="330" y="22" fill="#4ade80" fillOpacity="0.65" fontSize="8" fontFamily="Inter,sans-serif" textAnchor="end">+2.34%</text>

                  {/* Chart grid lines */}
                  {[60, 90, 120, 150, 180].map((y, i) => (
                    <line key={i} x1="30" y1={y} x2="350" y2={y}
                      stroke="#C8A54A" strokeWidth="0.3" strokeOpacity="0.1" strokeDasharray="4 8"/>
                  ))}

                  {/* x-axis */}
                  <line x1="30" y1="195" x2="350" y2="195" stroke="#C8A54A" strokeWidth="0.4" strokeOpacity="0.18"/>

                  {/* Candlesticks */}
                  {DASH_CANDLES.map((c, i) => (
                    <g key={i} className="pd-candle" style={{ transformOrigin: `${c.x}px 195px` }} filter="url(#pdCandleGlow)">
                      {/* Wick */}
                      <line x1={c.x} y1={c.wy1} x2={c.x} y2={c.wy2}
                        stroke={c.bull ? '#4ade80' : '#f87171'} strokeWidth="1" strokeOpacity="0.65"/>
                      {/* Body */}
                      <rect x={c.x - 6} y={c.by} width="12" height={c.bh} rx="1.5"
                        fill={c.bull ? 'url(#pdBullGrad)' : 'url(#pdBearGrad)'}/>
                    </g>
                  ))}

                  {/* Divider */}
                  <line x1="20" y1="208" x2="360" y2="208" stroke="#C8A54A" strokeWidth="0.3" strokeOpacity="0.14"/>

                  {/* Score section label */}
                  <text x="20" y="226" fill="#C8A54A" fillOpacity="0.42" fontSize="7.5" fontFamily="Inter,sans-serif" letterSpacing="2">DISCIPLINE SCORE</text>
                  <text x="350" y="226" fill="#DFCA8D" fillOpacity="0.8" fontSize="10" fontFamily="Georgia,serif" fontStyle="italic" textAnchor="end">87</text>

                  {/* Score bars */}
                  {DASH_SCORES.map((sc, i) => {
                    const y = 240 + i * 17;
                    return (
                      <g key={i}>
                        <text x="20" y={y + 4} fill="#C8A54A" fillOpacity="0.4" fontSize="6.5" fontFamily="Inter,sans-serif" letterSpacing="1">
                          {sc.label.toUpperCase()}
                        </text>
                        {/* Track */}
                        <rect x="110" y={y - 4} width="230" height="7" rx="3.5" fill="rgba(255,255,255,0.05)"/>
                        {/* Fill */}
                        <rect className="pd-bar-fill" x="110" y={y - 4} width={sc.fw} height="7" rx="3.5" fill="url(#pdBarGold)"/>
                        <text x="346" y={y + 4} fill="#DFCA8D" fillOpacity="0.65" fontSize="6.5" fontFamily="Inter,sans-serif" textAnchor="end">
                          {sc.pct}%
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent"/>
      </section>

      {/* ── 3. CORE FEATURES ─────────────────────────────────────── */}
      <section className="pd-feat-section relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#081F3F 0%,#071b38 50%,#081F3F 100%)' }}>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[900px]"
            style={{ background: 'radial-gradient(ellipse,rgba(22,55,104,0.30) 0%,rgba(8,31,63,0.52) 45%,transparent 68%)', filter: 'blur(75px)' }}/>
          <div className="absolute inset-0 opacity-[0.016]"
            style={{ backgroundImage: 'linear-gradient(rgba(200,165,74,1) 1px,transparent 1px),linear-gradient(90deg,rgba(200,165,74,1) 1px,transparent 1px)', backgroundSize: '64px 64px' }}/>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="pd-feat-eyebrow text-[10px] tracking-[0.34em] uppercase font-semibold text-gold mb-6">What You Get</p>
            <h2 className="pd-feat-h font-serif text-4xl sm:text-5xl leading-tight mb-7"
              style={{ background: 'linear-gradient(135deg,#ffffff 0%,#ddd5be 45%,#C8A54A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Core Features
            </h2>
            <div className="pd-feat-div flex justify-center">
              <GoldDivider centered/>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => (
              <div key={i} className="pd-feat-card relative rounded-2xl p-8 overflow-hidden cursor-default"
                style={{ background: 'linear-gradient(160deg,rgba(22,55,104,0.15) 0%,rgba(8,31,63,0.72) 100%)', border: '1px solid rgba(200,165,74,0.1)', boxShadow: '0 12px 48px -14px rgba(0,0,0,0.6)', transition: 'border-color 0.4s ease,box-shadow 0.4s ease,transform 0.4s ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(200,165,74,0.28)'; el.style.boxShadow = '0 16px 55px -12px rgba(200,165,74,0.1)'; el.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(200,165,74,0.1)'; el.style.boxShadow = '0 12px 48px -14px rgba(0,0,0,0.6)'; el.style.transform = 'translateY(0)'; }}>

                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/38 to-transparent"/>

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-7"
                  style={{ background: 'linear-gradient(135deg,rgba(200,165,74,0.14) 0%,rgba(200,165,74,0.04) 100%)', border: '1px solid rgba(200,165,74,0.2)' }}>
                  <span style={{ color: '#C8A54A' }}><Icon type={feat.icon} size={20}/></span>
                </div>

                {/* Watermark */}
                <span className="absolute -top-4 -right-1 font-serif font-bold text-white/[0.027] leading-none select-none pointer-events-none" style={{ fontSize: '6rem' }}>
                  0{i + 1}
                </span>

                <div className="w-5 h-px bg-gold mb-5" style={{ opacity: 0.4 }}/>
                <h3 className="font-serif text-lg text-white/90 mb-3 leading-snug">{feat.title}</h3>
                <p className="text-white/44 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent"/>
      </section>

      {/* ── 4. HOW IT WORKS ──────────────────────────────────────── */}
      <section className="pd-how-section relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#081F3F 0%,#0d2a52 50%,#081F3F 100%)' }}>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[500px]"
            style={{ background: 'radial-gradient(circle,rgba(22,55,104,0.38) 0%,rgba(8,31,63,0.55) 45%,transparent 70%)', filter: 'blur(70px)' }}/>
          <div className="absolute bottom-0 left-0 w-[500px] h-[400px]"
            style={{ background: 'radial-gradient(circle,rgba(200,165,74,0.07) 0%,transparent 65%)', filter: 'blur(60px)' }}/>
          <div className="absolute inset-0 opacity-[0.017]"
            style={{ backgroundImage: 'linear-gradient(rgba(200,165,74,1) 1px,transparent 1px)', backgroundSize: '100% 48px' }}/>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <p className="pd-how-eyebrow text-[10px] tracking-[0.34em] uppercase font-semibold text-gold mb-6">The Process</p>
            <h2 className="pd-how-h font-serif text-4xl sm:text-5xl leading-tight mb-7"
              style={{ background: 'linear-gradient(135deg,#ffffff 0%,#ddd5be 45%,#C8A54A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              How MindTrade Works
            </h2>
            <div className="pd-how-div flex justify-center">
              <GoldDivider centered/>
            </div>
          </div>

          <div className="relative">
            {/* Desktop connecting track */}
            <div className="pd-how-track hidden md:block absolute top-8 h-px"
              style={{ left: 'calc(12.5%)', right: 'calc(12.5%)', background: 'linear-gradient(to right,rgba(200,165,74,0.1),rgba(200,165,74,0.52) 50%,rgba(200,165,74,0.1))' }}/>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={i} className="pd-how-item flex flex-row md:flex-col items-start md:items-center gap-6 md:gap-0 relative">
                  {/* Node */}
                  <div className="pd-how-node relative z-10 w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center md:mb-8"
                    style={{ background: 'linear-gradient(135deg,rgba(22,55,104,0.5) 0%,rgba(8,31,63,0.95) 100%)', border: '1px solid rgba(200,165,74,0.42)', boxShadow: '0 0 28px -8px rgba(200,165,74,0.3)' }}>
                    <span style={{ color: '#C8A54A' }}><Icon type={step.icon}/></span>
                  </div>
                  <div className="md:text-center">
                    <p className="text-gold/55 text-[9.5px] tracking-[0.28em] uppercase mb-2">{step.num}</p>
                    <h3 className="font-serif text-xl text-white/90 mb-3 leading-snug">{step.title}</h3>
                    <p className="text-white/44 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                  {/* Mobile connector */}
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="md:hidden absolute left-8 top-16 w-px h-10 bg-gradient-to-b from-gold/35 to-transparent"/>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent"/>
      </section>

      {/* ── 5. CTA ───────────────────────────────────────────────── */}
      <section className="pd-cta-section relative py-40 px-4 text-center overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#081F3F 0%,#051629 55%,#020811 100%)' }}>

        {/* Stars */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" preserveAspectRatio="none">
          {STARS.slice(0, 28).map((s, i) => (
            <circle key={i} cx={`${s.cx}%`} cy={`${s.cy}%`} r={s.r * 0.7} fill="#DFCA8D" opacity={s.o * 0.6}/>
          ))}
        </svg>

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle,rgba(200,165,74,0.9) 1.5px,transparent 1.5px)', backgroundSize: '44px 44px' }}/>

        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ width: '700px', height: '440px', background: 'radial-gradient(ellipse,rgba(22,55,104,0.38) 0%,rgba(8,31,63,0.62) 45%,transparent 70%)', filter: 'blur(70px)' }}/>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ width: '360px', height: '320px', background: 'radial-gradient(circle,rgba(200,165,74,0.08) 0%,transparent 65%)', filter: 'blur(50px)' }}/>
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <p className="pd-cta-eyebrow text-[10px] tracking-[0.36em] uppercase font-semibold text-gold mb-8">
            Experience MindTrade
          </p>
          <h2 className="pd-cta-h font-serif leading-tight mb-7"
            style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)', background: 'linear-gradient(135deg,#ffffff 0%,#e0d5b5 50%,#C8A54A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Build the Discipline<br/>to Trade with Clarity
          </h2>
          <div className="flex justify-center mb-9"><GoldDivider centered/></div>
          <p className="pd-cta-sub text-white/50 text-lg leading-relaxed mb-12">
            Join traders who have transformed their decision-making by understanding the behavioral
            patterns that define every trade. MindTrade turns behavioral awareness into lasting discipline.
          </p>
          <div className="pd-cta-btns flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="https://mindtradein.netlify.app/" external variant="primary">Visit MindTrade</CTAButton>
            <CTAButton href="/technology" variant="secondary">Our Technology</CTAButton>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent"/>
      </section>

    </div>
  );
}
