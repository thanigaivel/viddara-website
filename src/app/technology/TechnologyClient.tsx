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
];
const BEHAVIORAL = [
  'Focuses on how and why decisions are actually made',
  'Understands why it happened — the behavioural root cause',
  'Explores patterns unique to each individual\'s decision-making',
  'Supports awareness of behavioural patterns before breakdowns occur',
];

const PIPELINE = [
  { num: '01', icon: 'eye'     as const, title: 'Understand',  desc: 'Recognize patterns in how decisions are made across different situations and conditions.' },
  { num: '02', icon: 'brain'   as const, title: 'Reflect',     desc: 'Examine behavioural tendencies that may influence consistency and performance over time.' },
  { num: '03', icon: 'arrowup' as const, title: 'Improve',     desc: 'Turn behavioural awareness into more deliberate and consistent decision-making.' },
];

const THEMES = [
  { icon: 'layers'   as const, title: 'Behavioural Awareness',     desc: 'Understanding the patterns that influence how individuals make decisions under pressure, uncertainty, and changing conditions.' },
  { icon: 'shield'   as const, title: 'Decision Discipline',       desc: 'Supporting the development of greater consistency and deliberateness in decision-making through structured insights.' },
  { icon: 'bulb'     as const, title: 'Performance Insight',        desc: 'Exploring how behavioural understanding can provide meaningful perspectives that support awareness and improvement.' },
];

// ── Icon component ────────────────────────────────────────────
type TechIcon = 'eye'|'brain'|'arrowup'|'layers'|'shield'|'bulb';

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
    shield: (<>
      <path d="M12 2 L20 6 V13 C20 17.4 16.4 21 12 22 C7.6 21 4 17.4 4 13 V6 Z" {...s}/>
      <polyline points="9 12 11 14 15 10" {...s}/>
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

      // ── Themes ────────────────────────────────────────────
      gsap.set('.th-theme-eyebrow', { opacity: 0, y: 18 });
      gsap.set('.th-theme-h',       { opacity: 0, y: 28 });
      gsap.set('.th-theme-div',     { opacity: 0, scaleX: 0 });
      gsap.set('.th-theme-card',    { opacity: 0, y: 30 });

      gsap.timeline({ scrollTrigger: { trigger: '.th-theme-section', start: 'top 72%', once: true }, defaults: { ease: 'power3.out' } })
        .to('.th-theme-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.th-theme-h',       { opacity: 1, y: 0, duration: 0.8 }, '-=0.25')
        .to('.th-theme-div',     { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.4')
        .to('.th-theme-card',    { opacity: 1, y: 0, duration: 0.65, stagger: 0.1 }, '-=0.3');

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
            Exploring how human behaviour influences decision-making and performance.
          </p>

          {/* Stat chips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { label:'Our Focus',      value:'Behavioural Technology' },
              { label:'Approach',       value:'Understand · Reflect · Improve'  },
              { label:'Core Theme',     value:'Decision Discipline'     },
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

              {/* Behavioural Approach */}
              <div className="p-10 lg:p-14 relative">
                <div className="absolute left-0 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent lg:hidden"/>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-gold"/>
                  <p className="text-gold/65 text-[9.5px] tracking-[0.3em] uppercase font-semibold">Behavioural Approach</p>
                </div>
                <h3 className="font-serif text-2xl text-white/88 mb-8 leading-snug"
                  style={{ background:'linear-gradient(135deg,#ffffff 0%,#e8dfc0 60%,#DFCA8D 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  Behaviour-centered.<br/>Decision-focused.
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

      {/* ── 3. OUR APPROACH ──────────────────────────────────────── */}
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
            <p className="th-pipe-eyebrow text-[10px] tracking-[0.34em] uppercase font-semibold text-gold mb-6">Our Approach</p>
            <h2 className="th-pipe-h font-serif text-4xl sm:text-5xl leading-tight mb-7"
              style={{ background:'linear-gradient(135deg,#ffffff 0%,#ddd5be 45%,#C8A54A 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              How We Think About Decision-Making
            </h2>
            <div className="th-pipe-div flex justify-center">
              <GoldDivider centered/>
            </div>
          </div>

          {/* Pipeline */}
          <div className="relative">
            {/* Desktop connecting track */}
            <div className="th-pipe-track hidden md:block absolute top-8 h-px"
              style={{ left:'calc(16.67%)', right:'calc(16.67%)', background:'linear-gradient(to right,rgba(200,165,74,0.1),rgba(200,165,74,0.52) 50%,rgba(200,165,74,0.1))' }}/>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
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

      {/* ── 4. TECHNOLOGY THEMES ─────────────────────────────────── */}
      <section className="th-theme-section relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background:'linear-gradient(180deg,#081F3F 0%,#0d2a52 50%,#081F3F 100%)' }}>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[900px]"
            style={{ background:'radial-gradient(ellipse,rgba(22,55,104,0.30) 0%,rgba(8,31,63,0.52) 45%,transparent 68%)', filter:'blur(75px)' }}/>
          <div className="absolute inset-0 opacity-[0.016]"
            style={{ backgroundImage:'linear-gradient(rgba(200,165,74,1) 1px,transparent 1px),linear-gradient(90deg,rgba(200,165,74,1) 1px,transparent 1px)', backgroundSize:'64px 64px' }}/>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="th-theme-eyebrow text-[10px] tracking-[0.34em] uppercase font-semibold text-gold mb-6">Public Technology Themes</p>
            <h2 className="th-theme-h font-serif text-4xl sm:text-5xl leading-tight mb-7"
              style={{ background:'linear-gradient(135deg,#ffffff 0%,#ddd5be 45%,#C8A54A 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              What We Explore
            </h2>
            <div className="th-theme-div flex justify-center mb-8">
              <GoldDivider centered/>
            </div>
            <p className="text-white/50 text-base leading-relaxed max-w-xl mx-auto">
              Traditional systems often focus on tools, information and outcomes.
              Viddara explores another layer: the behaviour surrounding how decisions are made.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {THEMES.map((theme, i) => (
              <div key={i} className="th-theme-card relative rounded-2xl p-8 overflow-hidden cursor-default group"
                style={{ background:'linear-gradient(160deg,rgba(22,55,104,0.15) 0%,rgba(8,31,63,0.72) 100%)', border:'1px solid rgba(200,165,74,0.1)', boxShadow:'0 12px 48px -14px rgba(0,0,0,0.6)', transition:'border-color 0.4s ease,box-shadow 0.4s ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(200,165,74,0.28)'; el.style.boxShadow='0 16px 55px -12px rgba(200,165,74,0.1)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(200,165,74,0.1)'; el.style.boxShadow='0 12px 48px -14px rgba(0,0,0,0.6)'; }}>

                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent"/>

                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-7"
                  style={{ background:'linear-gradient(135deg,rgba(200,165,74,0.14) 0%,rgba(200,165,74,0.04) 100%)', border:'1px solid rgba(200,165,74,0.2)' }}>
                  <span style={{ color:'#C8A54A' }}><Icon type={theme.icon} size={20}/></span>
                </div>

                <span className="absolute -top-4 -right-1 font-serif font-bold text-white/[0.028] leading-none select-none pointer-events-none" style={{ fontSize:'6rem' }}>
                  0{i+1}
                </span>

                <div className="w-5 h-px bg-gold mb-5" style={{ opacity:0.4 }}/>
                <h3 className="font-serif text-lg text-white/90 mb-3 leading-snug">{theme.title}</h3>
                <p className="text-white/44 text-sm leading-relaxed">{theme.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent"/>
      </section>

      {/* ── 5. CTA ───────────────────────────────────────────────── */}
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
            Experience Behavioural Technology in Action
          </h2>
          <div className="flex justify-center mb-9"><GoldDivider centered/></div>
          <p className="th-cta-sub text-white/50 text-lg leading-relaxed mb-12">
            MindTrade is the first product from Viddara Technologies — helping traders develop
            greater awareness of their decision behaviour and build stronger trading discipline.
          </p>
          <div className="th-cta-btns flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="https://mindtrade.in/" external variant="primary">Explore MindTrade</CTAButton>
            <CTAButton href="/about" variant="secondary">Our Approach</CTAButton>
          </div>
        </div>
      </section>

    </div>
  );
}
