'use client';

import { useRef, useEffect } from 'react';
import CTAButton from '@/components/ui/CTAButton';
import GoldDivider from '@/components/ui/GoldDivider';

// ── SSR-safe stars ────────────────────────────────────────────
const STARS = Array.from({ length: 48 }, (_, i) => ({
  cx: ((i * 137 + 53) % 94) + 3,
  cy: ((i * 89  + 19) % 88) + 6,
  r:  0.4 + (i % 5) * 0.26,
  o:  0.04 + (i % 7) * 0.038,
}));

// ── Radar chart — all integers, SSR safe ─────────────────────
// Center (220,220), radius 160 — 6 axes at 60° steps from top
const CX = 220, CY = 220;
const RADAR_AXES = [
  { label: 'Awareness',    x2: 220, y2:  60 }, // top
  { label: 'Discipline',   x2: 359, y2: 140 }, // upper-right
  { label: 'Consistency',  x2: 359, y2: 300 }, // lower-right
  { label: 'Adaptability', x2: 220, y2: 380 }, // bottom
  { label: 'Focus',        x2:  81, y2: 300 }, // lower-left
  { label: 'Resilience',   x2:  81, y2: 140 }, // upper-left
];
// Score values → data polygon points (pre-computed integers)
// scores: [92, 87, 78, 83, 90, 85]
const RADAR_DATA_PTS = '220,73 341,150 328,282 220,353 95,292 102,152';
const RADAR_DOTS = [
  { cx: 220, cy:  73 },
  { cx: 341, cy: 150 },
  { cx: 328, cy: 282 },
  { cx: 220, cy: 353 },
  { cx:  95, cy: 292 },
  { cx: 102, cy: 152 },
];
// Label positions (just outside axis endpoints)
const RADAR_LABEL_OFFSETS = [
  { x: 220, y:  42, anchor: 'middle' as const },
  { x: 376, y: 138, anchor: 'start'  as const },
  { x: 376, y: 308, anchor: 'start'  as const },
  { x: 220, y: 402, anchor: 'middle' as const },
  { x:  60, y: 308, anchor: 'end'    as const },
  { x:  60, y: 138, anchor: 'end'    as const },
];
// Score labels near dots
const SCORE_LABELS = ['92%','87%','78%','83%','90%','85%'];
// Hexagonal guide rings at 33%, 66%, 100%
const HEX_33  = '220,167 266,194 266,246 220,273 174,246 174,194';
const HEX_66  = '220,114 312,167 312,273 220,326 128,273 128,167';
const HEX_100 = '220,60 359,140 359,300 220,380 81,300 81,140';

// ── Data ─────────────────────────────────────────────────────
const HERO_WORDS = ['Behavioral', 'Intelligence', 'Systems'];
const HERO_GRADS = [
  'linear-gradient(135deg,#ffffff 0%,#d8e4f8 100%)',
  'linear-gradient(135deg,#d8e4f8 0%,#e4cfa0 100%)',
  'linear-gradient(135deg,#e4cfa0 0%,#C8A54A 100%)',
];

const TRADITIONAL = [
  'Focuses on tools, workflows, and information delivery',
  'Measures what happened — outcomes and results only',
  'Provides one-size-fits-all guidance and frameworks',
  'Reacts to performance breakdowns after they occur',
  'Treats all users identically regardless of behavior',
];
const BEHAVIORAL = [
  'Focuses on how and why decisions are actually made',
  'Understands why it happened — the behavioral root cause',
  'Adapts intelligence to each individual\'s unique profile',
  'Recognizes behavioral patterns before breakdowns occur',
  'Evolves with the user, learning from every interaction',
];

const PIPELINE = [
  { num: '01', icon: 'eye'     as const, title: 'Observe',  desc: 'Capture behavioral signals during real decision-making sessions in high-stakes environments.' },
  { num: '02', icon: 'brain'   as const, title: 'Analyze',  desc: 'Process raw behavioral data to identify recurring patterns, tendencies, and risk signatures.' },
  { num: '03', icon: 'gauge'   as const, title: 'Score',    desc: 'Generate precision discipline scores that quantify behavioral consistency and decision quality.' },
  { num: '04', icon: 'arrowup' as const, title: 'Improve',  desc: 'Deliver actionable intelligence that drives measurable, sustained improvement over time.' },
];

const CAPABILITIES = [
  { icon: 'layers'   as const, title: 'Pattern Recognition',     desc: 'Identifies recurring behavioral sequences across sessions to surface hidden decision tendencies.' },
  { icon: 'activity' as const, title: 'Real-Time Analytics',     desc: 'Monitors decision states during live sessions, flagging behavioral deviations as they emerge.' },
  { icon: 'shield'   as const, title: 'Discipline Scoring',      desc: 'Quantifies behavioral consistency with precision metrics, creating a comparable performance baseline.' },
  { icon: 'link'     as const, title: 'Performance Correlation', desc: 'Connects specific behavioral patterns directly to measurable outcome variations.' },
  { icon: 'refresh'  as const, title: 'Adaptive Learning',       desc: 'System intelligence deepens with each user interaction, becoming more precise over time.' },
  { icon: 'bulb'     as const, title: 'Insight Engine',          desc: 'Translates complex behavioral data into clear, specific, and immediately actionable intelligence.' },
];

// ── Icon component ────────────────────────────────────────────
type TechIcon = 'eye'|'brain'|'gauge'|'arrowup'|'layers'|'activity'|'shield'|'link'|'refresh'|'bulb';

function Icon({ type, size = 22 }: { type: TechIcon; size?: number }) {
  const s = { stroke:'currentColor', strokeWidth:1.5, strokeLinecap:'round' as const, strokeLinejoin:'round' as const, fill:'none' };
  const icons: Record<TechIcon, React.ReactNode> = {
    eye: (<>
      <path d="M1 12C1 12 5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z" {...s}/>
      <circle cx="12" cy="12" r="3" {...s}/>
      <circle cx="12" cy="12" r="1.2" fill="currentColor"/>
    </>),
    brain: (<>
      <path d="M9.5 2C7 2 5 4 5 6.5c0 1.5.7 2.8 1.8 3.7C5.7 11 5 12.2 5 13.5 5 16 7 18 9.5 18H11" {...s}/>
      <path d="M14.5 2C17 2 19 4 19 6.5c0 1.5-.7 2.8-1.8 3.7C18.3 11 19 12.2 19 13.5 19 16 17 18 14.5 18H13" {...s}/>
      <line x1="11" y1="9" x2="13" y2="9" {...s}/>
      <line x1="11" y1="12" x2="13" y2="12" {...s}/>
      <line x1="11" y1="15" x2="13" y2="15" {...s}/>
      <line x1="12" y1="2" x2="12" y2="18" {...s} strokeOpacity="0.3"/>
    </>),
    gauge: (<>
      <path d="M3.5 17.5A9 9 0 1 1 20.5 17.5" {...s}/>
      <path d="M12 12 L7.5 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1.8" fill="currentColor"/>
      <line x1="12" y1="4" x2="12" y2="6" {...s}/>
      <line x1="4.5" y1="8" x2="6" y2="9.3" {...s}/>
      <line x1="19.5" y1="8" x2="18" y2="9.3" {...s}/>
    </>),
    arrowup: (<>
      <line x1="12" y1="19" x2="12" y2="5" {...s}/>
      <polyline points="5 12 12 5 19 12" {...s}/>
      <line x1="5" y1="21" x2="19" y2="21" {...s} strokeOpacity="0.5"/>
    </>),
    layers: (<>
      <polygon points="12 2 22 8.5 12 15 2 8.5" {...s}/>
      <polyline points="2 14.5 12 21 22 14.5" {...s} strokeOpacity="0.6"/>
      <polyline points="2 11.5 12 18 22 11.5" {...s} strokeOpacity="0.35"/>
    </>),
    activity: (<>
      <polyline points="2 12 6 12 8 5 11 19 14 9 16 12 22 12" {...s}/>
    </>),
    shield: (<>
      <path d="M12 2 L20 6 V13 C20 17.4 16.4 21 12 22 C7.6 21 4 17.4 4 13 V6 Z" {...s}/>
      <polyline points="9 12 11 14 15 10" {...s}/>
    </>),
    link: (<>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" {...s}/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" {...s}/>
    </>),
    refresh: (<>
      <polyline points="23 4 23 10 17 10" {...s}/>
      <polyline points="1 20 1 14 7 14" {...s}/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" {...s}/>
    </>),
    bulb: (<>
      <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.4-1.4 4.5-3.5 5.5L14 17H10l-.5-2.5C7.4 13.5 6 11.4 6 9a6 6 0 0 1 6-6z" {...s}/>
      <line x1="9.5" y1="17" x2="14.5" y2="17" {...s} strokeOpacity="0.5"/>
    </>),
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none">{icons[type]}</svg>;
}

// ── Component ─────────────────────────────────────────────────
export default function TechnologyClient() {
  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // ── Hero ────────────────────────────────────────────────
      gsap.set('.th-eyebrow',  { opacity: 0, y: 20 });
      gsap.set('.th-word',     { opacity: 0, y: 44 });
      gsap.set('.th-div',      { opacity: 0, scaleX: 0 });
      gsap.set('.th-sub',      { opacity: 0, y: 22 });
      gsap.set('.th-stat',     { opacity: 0, y: 24 });
      gsap.set('.th-scroll',   { opacity: 0 });

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to('.th-eyebrow', { opacity: 1, y: 0, duration: 0.7 })
        .to('.th-word',    { opacity: 1, y: 0, duration: 0.75, stagger: 0.1 }, '-=0.3')
        .to('.th-div',     { opacity: 1, scaleX: 1, duration: 0.55, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.35')
        .to('.th-sub',     { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
        .to('.th-stat',    { opacity: 1, y: 0, duration: 0.6, stagger: 0.13 }, '-=0.3')
        .to('.th-scroll',  { opacity: 1, duration: 0.5 });

      gsap.utils.toArray<SVGCircleElement>('.th-star').forEach((el, i) => {
        const base = parseFloat(el.getAttribute('opacity') ?? '0.04');
        gsap.to(el, { opacity: Math.min(base * 4, 0.65), duration: 1.8 + (i % 5) * 0.7, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.11 });
      });

      // ── Comparison ──────────────────────────────────────────
      gsap.set('.th-comp-eyebrow', { opacity: 0, y: 18 });
      gsap.set('.th-comp-h',       { opacity: 0, y: 28 });
      gsap.set('.th-comp-div',     { opacity: 0, scaleX: 0 });
      gsap.set('.th-comp-card',    { opacity: 0, y: 28 });

      gsap.timeline({ scrollTrigger: { trigger: '.th-comp-section', start: 'top 72%', once: true }, defaults: { ease: 'power3.out' } })
        .to('.th-comp-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.th-comp-h',       { opacity: 1, y: 0, duration: 0.8 }, '-=0.25')
        .to('.th-comp-div',     { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.4')
        .to('.th-comp-card',    { opacity: 1, y: 0, duration: 0.7, stagger: 0.14 }, '-=0.3');

      // ── Pipeline ────────────────────────────────────────────
      gsap.set('.th-pipe-eyebrow', { opacity: 0, y: 18 });
      gsap.set('.th-pipe-h',       { opacity: 0, y: 28 });
      gsap.set('.th-pipe-div',     { opacity: 0, scaleX: 0 });
      gsap.set('.th-pipe-track',   { scaleX: 0 });
      gsap.set('.th-pipe-node',    { scale: 0 });
      gsap.set('.th-pipe-item',    { opacity: 0, y: 24 });

      gsap.timeline({ scrollTrigger: { trigger: '.th-pipe-section', start: 'top 72%', once: true }, defaults: { ease: 'power3.out' } })
        .to('.th-pipe-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.th-pipe-h',       { opacity: 1, y: 0, duration: 0.8 }, '-=0.25')
        .to('.th-pipe-div',     { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.4')
        .to('.th-pipe-track',   { scaleX: 1, duration: 1.4, ease: 'power2.inOut', transformOrigin: 'left center' }, '-=0.2')
        .to('.th-pipe-node',    { scale: 1, duration: 0.42, stagger: 0.18, ease: 'back.out(2.2)' }, '-=1.1')
        .to('.th-pipe-item',    { opacity: 1, y: 0, duration: 0.65, stagger: 0.14 }, '-=0.9');

      // ── Radar ────────────────────────────────────────────────
      gsap.set('.th-radar-eyebrow', { opacity: 0, y: 18 });
      gsap.set('.th-radar-h',       { opacity: 0, y: 28 });
      gsap.set('.th-radar-div',     { opacity: 0, scaleX: 0 });
      gsap.set('.th-radar-sub',     { opacity: 0, y: 18 });
      gsap.set('.th-radar-hex',     { opacity: 0 });
      gsap.set('.th-radar-axis',    { strokeDashoffset: 200 });
      gsap.set('.th-radar-bar',     { strokeDashoffset: 200 });
      gsap.set('.th-radar-polygon', { opacity: 0, scale: 0, transformOrigin: `${CX}px ${CY}px` });
      gsap.set('.th-radar-dot',     { scale: 0 });
      gsap.set('.th-radar-lbl',     { opacity: 0 });
      gsap.set('.th-radar-score',   { opacity: 0 });

      gsap.timeline({ scrollTrigger: { trigger: '.th-radar-section', start: 'top 68%', once: true }, defaults: { ease: 'power3.out' } })
        .to('.th-radar-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.th-radar-h',       { opacity: 1, y: 0, duration: 0.8 }, '-=0.25')
        .to('.th-radar-div',     { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.4')
        .to('.th-radar-sub',     { opacity: 1, y: 0, duration: 0.65 }, '-=0.35')
        .to('.th-radar-hex',     { opacity: 1, duration: 0.8, stagger: 0.12 }, '-=0.2')
        .to('.th-radar-axis',    { strokeDashoffset: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.5')
        .to('.th-radar-bar',     { strokeDashoffset: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, '-=0.55')
        .to('.th-radar-polygon', { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.3)' }, '-=0.6')
        .to('.th-radar-dot',     { scale: 1, duration: 0.35, stagger: 0.08, ease: 'back.out(2.5)' }, '-=0.5')
        .to('.th-radar-lbl',     { opacity: 1, duration: 0.4, stagger: 0.08 }, '-=0.4')
        .to('.th-radar-score',   { opacity: 1, duration: 0.35, stagger: 0.07 }, '-=0.35');

      // ── Capabilities ────────────────────────────────────────
      gsap.set('.th-cap-eyebrow', { opacity: 0, y: 18 });
      gsap.set('.th-cap-h',       { opacity: 0, y: 28 });
      gsap.set('.th-cap-div',     { opacity: 0, scaleX: 0 });
      gsap.set('.th-cap-card',    { opacity: 0, y: 30 });

      gsap.timeline({ scrollTrigger: { trigger: '.th-cap-section', start: 'top 72%', once: true }, defaults: { ease: 'power3.out' } })
        .to('.th-cap-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.th-cap-h',       { opacity: 1, y: 0, duration: 0.8 }, '-=0.25')
        .to('.th-cap-div',     { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.4')
        .to('.th-cap-card',    { opacity: 1, y: 0, duration: 0.65, stagger: 0.1 }, '-=0.3');

      // ── CTA ─────────────────────────────────────────────────
      gsap.set('.th-cta-eyebrow', { opacity: 0, y: 18 });
      gsap.set('.th-cta-h',       { opacity: 0, y: 28 });
      gsap.set('.th-cta-sub',     { opacity: 0, y: 20 });
      gsap.set('.th-cta-btns',    { opacity: 0, y: 18 });

      gsap.timeline({ scrollTrigger: { trigger: '.th-cta-section', start: 'top 75%', once: true }, defaults: { ease: 'power3.out' } })
        .to('.th-cta-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.th-cta-h',       { opacity: 1, y: 0, duration: 0.9 }, '-=0.25')
        .to('.th-cta-sub',     { opacity: 1, y: 0, duration: 0.7 }, '-=0.35')
        .to('.th-cta-btns',    { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
    };
    init();
  }, []);

  return (
    <div>

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center pt-32 pb-20 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#020811 0%,#051629 38%,#081F3F 100%)' }}>

        <style>{`
          @keyframes thHeroRing { 0%{transform:scale(0.06);opacity:0.4} 100%{transform:scale(1);opacity:0} }
          .th-hero-ring { animation: thHeroRing 9s ease-out infinite; transform-origin: center; }
          @keyframes thScanLine { 0%{transform:translateY(110%);opacity:0} 8%{opacity:0.35} 92%{opacity:0.35} 100%{transform:translateY(-110%);opacity:0} }
          .th-scan { animation: thScanLine 10s linear infinite; }
        `}</style>

        {/* Stars */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" preserveAspectRatio="none">
          {STARS.map((s, i) => (
            <circle key={i} className="th-star" cx={`${s.cx}%`} cy={`${s.cy}%`} r={s.r} fill="#DFCA8D" opacity={s.o}/>
          ))}
        </svg>

        {/* Circuit dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.045]"
          style={{ backgroundImage:'radial-gradient(circle,rgba(200,165,74,0.9) 1.5px,transparent 1.5px)', backgroundSize:'44px 44px' }}/>

        {/* Scan line */}
        <div className="th-scan absolute inset-x-0 h-px pointer-events-none"
          style={{ background:'linear-gradient(to right,transparent,rgba(200,165,74,0.35) 30%,rgba(200,165,74,0.55) 50%,rgba(200,165,74,0.35) 70%,transparent)' }}/>

        {/* Pulse rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[0,1,2].map(i => (
            <div key={i} className="th-hero-ring absolute rounded-full"
              style={{ width:'1000px', height:'1000px', border:'1px solid rgba(200,165,74,0.09)', animationDelay:`${i*3}s` }}/>
          ))}
        </div>

        {/* Depth glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px]"
            style={{ background:'radial-gradient(ellipse,rgba(22,55,104,0.36) 0%,rgba(8,31,63,0.52) 45%,transparent 68%)', filter:'blur(80px)' }}/>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]"
            style={{ background:'radial-gradient(circle,rgba(200,165,74,0.07) 0%,transparent 65%)', filter:'blur(50px)' }}/>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto w-full">
          <p className="th-eyebrow text-[10px] tracking-[0.38em] uppercase font-semibold text-gold mb-8">
            Viddara Technology
          </p>

          <h1 className="font-serif leading-tight mb-8" style={{ fontSize:'clamp(2.8rem,7vw,5.5rem)' }}>
            {HERO_WORDS.map((word, i) => (
              <span key={i} className="th-word inline-block"
                style={{ marginRight:'0.3em', background:HERO_GRADS[i], WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                {word}
              </span>
            ))}
          </h1>

          <div className="th-div flex justify-center mb-9">
            <GoldDivider centered/>
          </div>

          <p className="th-sub text-white/55 text-lg leading-relaxed max-w-2xl mx-auto mb-14">
            Technology that reads beyond outcomes — into the behavioral fabric of every decision,
            under every condition of pressure.
          </p>

          {/* Stat chips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { label:'Core System',   value:'Behavioral Intelligence' },
              { label:'Analysis Mode', value:'Real-time + Historical'  },
              { label:'Focus Domain',  value:'Decision Discipline'     },
            ].map((st, i) => (
              <div key={i} className="th-stat relative rounded-2xl px-6 py-5 text-center overflow-hidden"
                style={{ background:'linear-gradient(160deg,rgba(22,55,104,0.16) 0%,rgba(8,31,63,0.58) 100%)', border:'1px solid rgba(200,165,74,0.14)' }}>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"/>
                <p className="text-[9.5px] tracking-[0.24em] uppercase text-gold/50 mb-2">{st.label}</p>
                <p className="font-serif text-white/88 text-sm leading-snug">{st.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll */}
        <div className="th-scroll absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/28 text-[9px] tracking-[0.22em] uppercase">Scroll</span>
          <div className="relative w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-gold rounded-full" style={{ animation:'scrollPulse 2s ease-in-out infinite' }}/>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/14 to-transparent"/>
      </section>

      {/* ── 2. BEYOND TRADITIONAL ────────────────────────────────── */}
      <section className="th-comp-section relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background:'linear-gradient(180deg,#081F3F 0%,#0a2246 50%,#081F3F 100%)' }}>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[900px]"
            style={{ background:'radial-gradient(ellipse,rgba(22,55,104,0.34) 0%,rgba(8,31,63,0.52) 45%,transparent 68%)', filter:'blur(75px)' }}/>
          <div className="absolute inset-0 opacity-[0.018]"
            style={{ backgroundImage:'radial-gradient(rgba(200,165,74,0.9) 1px,transparent 1px)', backgroundSize:'40px 40px' }}/>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="th-comp-eyebrow text-[10px] tracking-[0.34em] uppercase font-semibold text-gold mb-6">A Different Lens</p>
            <h2 className="th-comp-h font-serif text-4xl sm:text-5xl leading-tight mb-7"
              style={{ background:'linear-gradient(135deg,#ffffff 0%,#ddd5be 45%,#C8A54A 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              Beyond Traditional Systems
            </h2>
            <div className="th-comp-div flex justify-center">
              <GoldDivider centered/>
            </div>
          </div>

          {/* Comparison card */}
          <div className="th-comp-card relative rounded-3xl overflow-hidden"
            style={{ background:'linear-gradient(160deg,rgba(22,55,104,0.14) 0%,rgba(8,31,63,0.72) 100%)', border:'1px solid rgba(200,165,74,0.12)' }}>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent"/>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Traditional */}
              <div className="p-10 lg:p-14 lg:border-r" style={{ borderColor:'rgba(200,165,74,0.1)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-white/20"/>
                  <p className="text-white/35 text-[9.5px] tracking-[0.3em] uppercase font-semibold">Traditional Systems</p>
                </div>
                <h3 className="font-serif text-2xl text-white/45 mb-8 leading-snug">Tool-centered.<br/>Outcome-focused.</h3>
                <div className="space-y-4">
                  {TRADITIONAL.map((item, i) => (
                    <div key={i} className="flex items-start gap-3.5">
                      <span className="text-white/22 mt-0.5 flex-shrink-0 text-lg leading-none">—</span>
                      <p className="text-white/35 text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Behavioral Intelligence */}
              <div className="p-10 lg:p-14 relative">
                {/* Gold left accent */}
                <div className="absolute left-0 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent lg:hidden"/>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-gold"/>
                  <p className="text-gold/65 text-[9.5px] tracking-[0.3em] uppercase font-semibold">Behavioral Intelligence</p>
                </div>
                <h3 className="font-serif text-2xl text-white/88 mb-8 leading-snug"
                  style={{ background:'linear-gradient(135deg,#ffffff 0%,#e8dfc0 60%,#DFCA8D 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  Behavior-centered.<br/>Decision-focused.
                </h3>
                <div className="space-y-4">
                  {BEHAVIORAL.map((item, i) => (
                    <div key={i} className="flex items-start gap-3.5">
                      <span className="text-gold/55 mt-1 flex-shrink-0 text-[8px]">◆</span>
                      <p className="text-white/65 text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/18 to-transparent"/>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent"/>
      </section>

      {/* ── 3. HOW IT WORKS ──────────────────────────────────────── */}
      <section className="th-pipe-section relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background:'linear-gradient(180deg,#081F3F 0%,#071b38 50%,#081F3F 100%)' }}>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[500px]"
            style={{ background:'radial-gradient(circle,rgba(22,55,104,0.38) 0%,rgba(8,31,63,0.55) 45%,transparent 70%)', filter:'blur(70px)' }}/>
          <div className="absolute bottom-0 left-0 w-[500px] h-[400px]"
            style={{ background:'radial-gradient(circle,rgba(200,165,74,0.07) 0%,transparent 65%)', filter:'blur(60px)' }}/>
          <div className="absolute inset-0 opacity-[0.017]"
            style={{ backgroundImage:'linear-gradient(rgba(200,165,74,1) 1px,transparent 1px)', backgroundSize:'100% 48px' }}/>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <p className="th-pipe-eyebrow text-[10px] tracking-[0.34em] uppercase font-semibold text-gold mb-6">The Process</p>
            <h2 className="th-pipe-h font-serif text-4xl sm:text-5xl leading-tight mb-7"
              style={{ background:'linear-gradient(135deg,#ffffff 0%,#ddd5be 45%,#C8A54A 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              How It Works
            </h2>
            <div className="th-pipe-div flex justify-center">
              <GoldDivider centered/>
            </div>
          </div>

          {/* Pipeline */}
          <div className="relative">
            {/* Desktop connecting track */}
            <div className="th-pipe-track hidden md:block absolute top-8 h-px"
              style={{ left:'calc(12.5%)', right:'calc(12.5%)', background:'linear-gradient(to right,rgba(200,165,74,0.1),rgba(200,165,74,0.52) 50%,rgba(200,165,74,0.1))' }}/>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
              {PIPELINE.map((step, i) => (
                <div key={i} className="th-pipe-item flex flex-row md:flex-col items-start md:items-center gap-6 md:gap-0">
                  {/* Node */}
                  <div className="th-pipe-node relative z-10 w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center md:mb-8"
                    style={{ background:'linear-gradient(135deg,rgba(22,55,104,0.5) 0%,rgba(8,31,63,0.95) 100%)', border:'1px solid rgba(200,165,74,0.42)', boxShadow:'0 0 28px -8px rgba(200,165,74,0.3)' }}>
                    <span style={{ color:'#C8A54A' }}><Icon type={step.icon}/></span>
                  </div>

                  <div className="md:text-center">
                    <p className="text-gold/55 text-[9.5px] tracking-[0.28em] uppercase mb-2">{step.num}</p>
                    <h3 className="font-serif text-xl text-white/90 mb-3 leading-snug">{step.title}</h3>
                    <p className="text-white/44 text-sm leading-relaxed">{step.desc}</p>
                  </div>

                  {/* Mobile connector */}
                  {i < PIPELINE.length - 1 && (
                    <div className="md:hidden absolute left-8 top-16 w-px h-10 bg-gradient-to-b from-gold/35 to-transparent"/>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent"/>
      </section>

      {/* ── 4. BEHAVIORAL RADAR ──────────────────────────────────── */}
      <section className="th-radar-section relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background:'linear-gradient(180deg,#081F3F 0%,#0d2a52 50%,#081F3F 100%)' }}>

        <style>{`
          @keyframes thRadarSweep { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          .th-sweep { animation: thRadarSweep 5s linear infinite; transform-origin:${CX}px ${CY}px; }
        `}</style>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px]"
            style={{ background:'radial-gradient(circle,rgba(22,55,104,0.38) 0%,rgba(8,31,63,0.55) 42%,transparent 65%)', filter:'blur(70px)' }}/>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px]"
            style={{ background:'radial-gradient(circle,rgba(200,165,74,0.08) 0%,transparent 65%)', filter:'blur(50px)' }}/>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="th-radar-eyebrow text-[10px] tracking-[0.34em] uppercase font-semibold text-gold mb-6">The Science</p>
            <h2 className="th-radar-h font-serif text-4xl sm:text-5xl leading-tight mb-7"
              style={{ background:'linear-gradient(135deg,#ffffff 0%,#ddd5be 45%,#C8A54A 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              Behavioral Intelligence Profile
            </h2>
            <div className="th-radar-div flex justify-center mb-8">
              <GoldDivider centered/>
            </div>
            <p className="th-radar-sub text-white/50 text-base leading-relaxed max-w-xl mx-auto">
              Every practitioner has a unique behavioral signature across six core dimensions.
              Viddara maps and tracks each dimension over time.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* SVG Radar */}
            <div className="w-full max-w-md mx-auto lg:mx-0 flex-shrink-0">
              <svg viewBox="0 0 440 440" className="w-full" fill="none">
                <defs>
                  <radialGradient id="thRadarFill" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#C8A54A" stopOpacity="0.28"/>
                    <stop offset="100%" stopColor="#C8A54A" stopOpacity="0.04"/>
                  </radialGradient>
                  <filter id="thDotGlow">
                    <feGaussianBlur stdDeviation="4" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>

                {/* Hexagonal guide rings */}
                <polygon className="th-radar-hex" points={HEX_33}
                  stroke="#C8A54A" strokeWidth="0.5" strokeOpacity="0.14" fill="none" strokeDasharray="4 8"/>
                <polygon className="th-radar-hex" points={HEX_66}
                  stroke="#C8A54A" strokeWidth="0.5" strokeOpacity="0.20" fill="none" strokeDasharray="4 8"/>
                <polygon className="th-radar-hex" points={HEX_100}
                  stroke="#C8A54A" strokeWidth="0.6" strokeOpacity="0.18" fill="none"/>

                {/* Radar sweep */}
                <g className="th-sweep">
                  <line x1={CX} y1={CY} x2={CX} y2="60" stroke="#C8A54A" strokeWidth="0.8" strokeOpacity="0.32"/>
                  <line x1={CX} y1={CY} x2={CX} y2="60" stroke="#C8A54A" strokeWidth="14" strokeOpacity="0.04"/>
                </g>

                {/* Axis guide lines */}
                {RADAR_AXES.map((ax, i) => (
                  <line key={i} className="th-radar-axis"
                    x1={CX} y1={CY} x2={ax.x2} y2={ax.y2}
                    stroke="#C8A54A" strokeWidth="0.5" strokeOpacity="0.18"
                    strokeDasharray="200"/>
                ))}

                {/* Data bars */}
                {RADAR_DOTS.map((dot, i) => (
                  <line key={i} className="th-radar-bar"
                    x1={CX} y1={CY} x2={dot.cx} y2={dot.cy}
                    stroke="#C8A54A" strokeWidth="2" strokeLinecap="round"
                    strokeOpacity="0.7" strokeDasharray="200"/>
                ))}

                {/* Filled data polygon */}
                <polygon className="th-radar-polygon"
                  points={RADAR_DATA_PTS}
                  fill="url(#thRadarFill)" stroke="#C8A54A" strokeWidth="1.5" strokeOpacity="0.65"/>

                {/* Data dots */}
                {RADAR_DOTS.map((dot, i) => (
                  <g key={i} className="th-radar-dot" style={{ transformOrigin:`${dot.cx}px ${dot.cy}px` }}>
                    <circle cx={dot.cx} cy={dot.cy} r="9" fill="none" stroke="#C8A54A" strokeWidth="0.5" strokeOpacity="0.22"/>
                    <circle cx={dot.cx} cy={dot.cy} r="5" fill="rgba(8,31,63,0.95)" stroke="#C8A54A" strokeWidth="1.2" strokeOpacity="0.7"/>
                    <circle cx={dot.cx} cy={dot.cy} r="2.2" fill="#DFCA8D" opacity="0.95" filter="url(#thDotGlow)"/>
                  </g>
                ))}

                {/* Center hub */}
                <circle cx={CX} cy={CY} r="6" fill="#C8A54A" opacity="0.6" filter="url(#thDotGlow)"/>
                <circle cx={CX} cy={CY} r="2.8" fill="#DFCA8D" opacity="0.95"/>

                {/* Axis labels */}
                {RADAR_AXES.map((ax, i) => (
                  <text key={i} className="th-radar-lbl"
                    x={RADAR_LABEL_OFFSETS[i].x} y={RADAR_LABEL_OFFSETS[i].y}
                    textAnchor={RADAR_LABEL_OFFSETS[i].anchor}
                    fill="#C8A54A" fillOpacity="0.55"
                    fontSize="9" fontFamily="Inter,sans-serif" letterSpacing="1.5">
                    {ax.label.toUpperCase()}
                  </text>
                ))}

                {/* Score labels */}
                {RADAR_DOTS.map((dot, i) => (
                  <text key={i} className="th-radar-score"
                    x={dot.cx + (dot.cx < CX ? -14 : dot.cx > CX ? 14 : 0)}
                    y={dot.cy + (dot.cy < CY ? -10 : dot.cy > CY ? 12 : -10)}
                    textAnchor={dot.cx < CX ? 'end' : dot.cx > CX ? 'start' : 'middle'}
                    fill="#DFCA8D" fillOpacity="0.72"
                    fontSize="8" fontFamily="Inter,sans-serif">
                    {SCORE_LABELS[i]}
                  </text>
                ))}
              </svg>
            </div>

            {/* Dimension list */}
            <div className="flex-1 w-full">
              <div className="space-y-4">
                {RADAR_AXES.map((ax, i) => (
                  <div key={i} className="flex items-center gap-5">
                    <div className="flex-shrink-0 w-24 text-right">
                      <p className="text-[9.5px] tracking-[0.2em] uppercase text-gold/55">{ax.label}</p>
                    </div>
                    {/* Bar track */}
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                      style={{ background:'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full"
                        style={{
                          width: SCORE_LABELS[i],
                          background:'linear-gradient(to right,rgba(200,165,74,0.45),rgba(200,165,74,0.88))',
                          boxShadow:'0 0 8px rgba(200,165,74,0.3)',
                        }}/>
                    </div>
                    <p className="flex-shrink-0 text-gold/65 text-xs font-medium w-8 text-right">{SCORE_LABELS[i]}</p>
                  </div>
                ))}
                <p className="text-white/30 text-xs leading-relaxed mt-6 pt-6"
                  style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                  Sample behavioral profile generated from session data.
                  Each dimension is tracked and scored across multiple trading sessions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent"/>
      </section>

      {/* ── 5. CORE CAPABILITIES ─────────────────────────────────── */}
      <section className="th-cap-section relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background:'linear-gradient(180deg,#081F3F 0%,#071b38 50%,#081F3F 100%)' }}>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[900px]"
            style={{ background:'radial-gradient(ellipse,rgba(22,55,104,0.30) 0%,rgba(8,31,63,0.52) 45%,transparent 68%)', filter:'blur(75px)' }}/>
          <div className="absolute inset-0 opacity-[0.016]"
            style={{ backgroundImage:'linear-gradient(rgba(200,165,74,1) 1px,transparent 1px),linear-gradient(90deg,rgba(200,165,74,1) 1px,transparent 1px)', backgroundSize:'64px 64px' }}/>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="th-cap-eyebrow text-[10px] tracking-[0.34em] uppercase font-semibold text-gold mb-6">Core Technology</p>
            <h2 className="th-cap-h font-serif text-4xl sm:text-5xl leading-tight mb-7"
              style={{ background:'linear-gradient(135deg,#ffffff 0%,#ddd5be 45%,#C8A54A 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              System Capabilities
            </h2>
            <div className="th-cap-div flex justify-center">
              <GoldDivider centered/>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITIES.map((cap, i) => (
              <div key={i} className="th-cap-card relative rounded-2xl p-8 overflow-hidden cursor-default group"
                style={{ background:'linear-gradient(160deg,rgba(22,55,104,0.15) 0%,rgba(8,31,63,0.72) 100%)', border:'1px solid rgba(200,165,74,0.1)', boxShadow:'0 12px 48px -14px rgba(0,0,0,0.6)', transition:'border-color 0.4s ease,box-shadow 0.4s ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(200,165,74,0.28)'; el.style.boxShadow='0 16px 55px -12px rgba(200,165,74,0.1)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(200,165,74,0.1)'; el.style.boxShadow='0 12px 48px -14px rgba(0,0,0,0.6)'; }}>

                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent"/>

                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-7"
                  style={{ background:'linear-gradient(135deg,rgba(200,165,74,0.14) 0%,rgba(200,165,74,0.04) 100%)', border:'1px solid rgba(200,165,74,0.2)' }}>
                  <span style={{ color:'#C8A54A' }}><Icon type={cap.icon} size={20}/></span>
                </div>

                {/* Watermark index */}
                <span className="absolute -top-4 -right-1 font-serif font-bold text-white/[0.028] leading-none select-none pointer-events-none" style={{ fontSize:'6rem' }}>
                  0{i+1}
                </span>

                <div className="w-5 h-px bg-gold mb-5" style={{ opacity:0.4 }}/>
                <h3 className="font-serif text-lg text-white/90 mb-3 leading-snug">{cap.title}</h3>
                <p className="text-white/44 text-sm leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent"/>
      </section>

      {/* ── 6. CTA ───────────────────────────────────────────────── */}
      <section className="th-cta-section relative py-36 px-4 text-center overflow-hidden"
        style={{ background:'linear-gradient(180deg,#081F3F 0%,#051629 55%,#020811 100%)' }}>

        <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" preserveAspectRatio="none">
          {STARS.slice(0,24).map((s, i) => (
            <circle key={i} cx={`${s.cx}%`} cy={`${s.cy}%`} r={s.r * 0.75} fill="#DFCA8D" opacity={s.o * 0.6}/>
          ))}
        </svg>

        {/* Circuit dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage:'radial-gradient(circle,rgba(200,165,74,0.9) 1.5px,transparent 1.5px)', backgroundSize:'44px 44px' }}/>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ width:'700px', height:'420px', background:'radial-gradient(ellipse,rgba(22,55,104,0.38) 0%,rgba(8,31,63,0.62) 45%,transparent 70%)', filter:'blur(70px)' }}/>
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <p className="th-cta-eyebrow text-[10px] tracking-[0.36em] uppercase font-semibold text-gold mb-8">
            See It in Action
          </p>
          <h2 className="th-cta-h font-serif leading-tight mb-7"
            style={{ fontSize:'clamp(2.4rem,5vw,3.8rem)', background:'linear-gradient(135deg,#ffffff 0%,#e0d5b5 50%,#C8A54A 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            Experience Behavioral Intelligence
          </h2>
          <div className="flex justify-center mb-9"><GoldDivider centered/></div>
          <p className="th-cta-sub text-white/50 text-lg leading-relaxed mb-12">
            MindTrade applies every layer of this technology to the trading environment —
            delivering real-time behavioral intelligence that transforms how traders make decisions.
          </p>
          <div className="th-cta-btns flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="https://mindtrade.in" external variant="primary">Explore MindTrade</CTAButton>
            <CTAButton href="/about" variant="secondary">Our Approach</CTAButton>
          </div>
        </div>
      </section>

    </div>
  );
}
