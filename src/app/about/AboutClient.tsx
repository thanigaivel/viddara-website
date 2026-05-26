'use client';

import { useRef, useEffect } from 'react';
import CTAButton from '@/components/ui/CTAButton';
import GoldDivider from '@/components/ui/GoldDivider';

// ── SSR-safe star field ───────────────────────────────────────
const STARS = Array.from({ length: 52 }, (_, i) => ({
  cx: ((i * 131 + 47) % 94) + 3,
  cy: ((i * 97 + 23) % 88) + 6,
  r: 0.4 + (i % 5) * 0.28,
  o: 0.05 + (i % 7) * 0.04,
}));

// ── Neural network — hardcoded integers (SSR safe) ────────────
const NN_NODES = [
  { x: 200, y: 180 }, // 0 = hub
  { x: 200, y: 52 }, // 1 top
  { x: 325, y: 112 }, // 2 top-right
  { x: 340, y: 248 }, // 3 right
  { x: 250, y: 322 }, // 4 bottom-right
  { x: 145, y: 322 }, // 5 bottom-left
  { x: 60, y: 248 }, // 6 left
  { x: 75, y: 112 }, // 7 top-left
];
const NN_EDGES = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 1],
  [1, 4], [2, 6], [3, 7],
];

// ── Data ──────────────────────────────────────────────────────
const HERO_WORDS = ['The', 'Science', 'of', 'Human', 'Decision'];
const HERO_GRADS = [
  'linear-gradient(135deg,#ffffff 0%,#d8e4f8 100%)',
  'linear-gradient(135deg,#d8e4f8 0%,#e8e4d8 100%)',
  'linear-gradient(135deg,#e8e4d8 0%,#ede0c0 100%)',
  'linear-gradient(135deg,#ede0c0 0%,#e4cfa0 100%)',
  'linear-gradient(135deg,#e4cfa0 0%,#C8A54A 100%)',
];

const CAPABILITIES = [
  {
    icon: 'network' as const,
    title: 'Behavioral Analysis',
    desc: 'Mapping the recurring patterns that govern how individuals make decisions under stress, uncertainty, and time pressure.',
  },
  {
    icon: 'target' as const,
    title: 'Decision Intelligence',
    desc: 'Converting raw behavioral data into precise, actionable intelligence that practitioners can immediately apply.',
  },
  {
    icon: 'trend' as const,
    title: 'Performance Systems',
    desc: 'Building structured platforms that help individuals develop lasting decision discipline over time.',
  },
];

const VALUES = [
  { icon: 'depth' as const, title: 'Depth', desc: 'We go beneath surface metrics into the behavioral science that drives meaningful, lasting change.' },
  { icon: 'precision' as const, title: 'Precision', desc: 'Every insight is evidence-based and specific to the individual practitioner.' },
  { icon: 'impact' as const, title: 'Impact', desc: 'Technology only matters when it produces measurable improvements in real outcomes.' },
  { icon: 'evolution' as const, title: 'Evolution', desc: 'Our systems learn and grow alongside each user, becoming sharper and more precise over time.' },
];

const MILESTONES = [
  { year: '2023', title: 'Inception', desc: 'Viddara Technologies founded with a mission to solve behavioral discipline challenges in high-performance environments.' },
  { year: '2024', title: 'Research', desc: 'Deep research into behavioral patterns, decision science, and performance psychology across high-stakes domains.' },
  { year: '2024', title: 'Launch', desc: 'Launched MindTrade — behavioral discipline platform for traders — as our first product in market.' },
  { year: '2025+', title: 'Expansion', desc: 'Expanding behavioral intelligence technology beyond trading into every domain where discipline defines outcomes.' },
];

// ── Icon component ────────────────────────────────────────────
type IconType = 'network' | 'target' | 'trend' | 'depth' | 'precision' | 'impact' | 'evolution';

function Icon({ type, size = 22 }: { type: IconType; size?: number }) {
  const s = { stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const icons: Record<IconType, React.ReactNode> = {
    network: (<>
      <circle cx="12" cy="5" r="2.2" fill="currentColor" opacity="0.9" />
      <circle cx="4.5" cy="18" r="2.2" fill="currentColor" opacity="0.9" />
      <circle cx="19.5" cy="18" r="2.2" fill="currentColor" opacity="0.9" />
      <line x1="12" y1="7" x2="4.5" y2="16" {...s} />
      <line x1="12" y1="7" x2="19.5" y2="16" {...s} />
      <line x1="6.5" y1="18" x2="17.5" y2="18" {...s} />
    </>),
    target: (<>
      <circle cx="12" cy="12" r="9" {...s} />
      <circle cx="12" cy="12" r="5" {...s} />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      <line x1="12" y1="3" x2="12" y2="6" {...s} />
      <line x1="12" y1="18" x2="12" y2="21" {...s} />
      <line x1="3" y1="12" x2="6" y2="12" {...s} />
      <line x1="18" y1="12" x2="21" y2="12" {...s} />
    </>),
    trend: (<>
      <polyline points="2.5 18 7 11 12 14.5 17.5 6 22 9.5" {...s} />
      <line x1="2.5" y1="21" x2="21.5" y2="21" {...s} />
      <circle cx="22" cy="9.5" r="1.5" fill="currentColor" />
    </>),
    depth: (<>
      <polygon points="12 2 20 8.5 18 19.5 6 19.5 4 8.5" {...s} />
      <line x1="4" y1="8.5" x2="20" y2="8.5" {...s} strokeOpacity="0.45" />
      <line x1="6" y1="19.5" x2="12" y2="8.5" {...s} strokeOpacity="0.3" />
      <line x1="18" y1="19.5" x2="12" y2="8.5" {...s} strokeOpacity="0.3" />
    </>),
    precision: (<>
      <circle cx="12" cy="12" r="9.5" {...s} />
      <line x1="12" y1="2.5" x2="12" y2="5" {...s} />
      <line x1="12" y1="19" x2="12" y2="21.5" {...s} />
      <line x1="2.5" y1="12" x2="5" y2="12" {...s} />
      <line x1="19" y1="12" x2="21.5" y2="12" {...s} />
      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.7" />
    </>),
    impact: (<>
      <circle cx="12" cy="12" r="9.5" {...s} />
      <line x1="2.5" y1="12" x2="21.5" y2="12" {...s} />
      <path d="M12 2.5 C8.5 6 8.5 18 12 21.5" {...s} />
      <path d="M12 2.5 C15.5 6 15.5 18 12 21.5" {...s} />
    </>),
    evolution: (<>
      <path d="M4 4.5 C7 4.5 9 8 12 9.5 C15 11 17 14 20 19.5" {...s} />
      <path d="M20 4.5 C17 4.5 15 8 12 9.5 C9 11 7 14 4 19.5" {...s} />
      <circle cx="12" cy="9.5" r="2" fill="currentColor" opacity="0.85" />
    </>),
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none">{icons[type]}</svg>;
}

// ── Component ─────────────────────────────────────────────────
export default function AboutClient() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // Hero — fires on mount
      gsap.set('.ab-hero-eyebrow', { opacity: 0, y: 20 });
      gsap.set('.ab-hero-word', { opacity: 0, y: 40 });
      gsap.set('.ab-hero-div', { opacity: 0, scaleX: 0 });
      gsap.set('.ab-hero-sub', { opacity: 0, y: 22 });
      gsap.set('.ab-hero-stat', { opacity: 0, y: 24 });
      gsap.set('.ab-hero-scroll', { opacity: 0 });

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to('.ab-hero-eyebrow', { opacity: 1, y: 0, duration: 0.7 })
        .to('.ab-hero-word', { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 }, '-=0.3')
        .to('.ab-hero-div', { opacity: 1, scaleX: 1, duration: 0.55, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.35')
        .to('.ab-hero-sub', { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
        .to('.ab-hero-stat', { opacity: 1, y: 0, duration: 0.6, stagger: 0.13 }, '-=0.3')
        .to('.ab-hero-scroll', { opacity: 1, duration: 0.5 });

      // Star twinkle
      gsap.utils.toArray<SVGCircleElement>('.ab-star').forEach((el, i) => {
        const base = parseFloat(el.getAttribute('opacity') ?? '0.05');
        gsap.to(el, { opacity: Math.min(base * 4, 0.65), duration: 1.7 + (i % 5) * 0.75, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.1 });
      });

      // Story
      gsap.set('.ab-story-eyebrow', { opacity: 0, y: 18 });
      gsap.set('.ab-story-h', { opacity: 0, y: 32 });
      gsap.set('.ab-story-div', { opacity: 0, scaleX: 0 });
      gsap.set('.ab-story-para', { opacity: 0, y: 20 });
      gsap.set('.ab-nn-line', { strokeDashoffset: 600 });
      gsap.set('.ab-nn-hub', { scale: 0, transformOrigin: '200px 180px' });
      gsap.set('.ab-nn-node', { scale: 0 });

      gsap.timeline({ scrollTrigger: { trigger: '.ab-story-section', start: 'top 72%', once: true }, defaults: { ease: 'power3.out' } })
        .to('.ab-story-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.ab-story-h', { opacity: 1, y: 0, duration: 0.8 }, '-=0.25')
        .to('.ab-story-div', { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'left' }, '-=0.4')
        .to('.ab-story-para', { opacity: 1, y: 0, duration: 0.65, stagger: 0.18 }, '-=0.35')
        .to('.ab-nn-hub', { scale: 1, duration: 0.65, ease: 'back.out(1.8)' }, '-=0.5')
        .to('.ab-nn-line', { strokeDashoffset: 0, duration: 0.7, stagger: 0.04, ease: 'power2.out' }, '-=0.4')
        .to('.ab-nn-node', { scale: 1, duration: 0.38, stagger: 0.07, ease: 'back.out(2)' }, '-=0.75');

      // Capabilities
      gsap.set('.ab-cap-eyebrow', { opacity: 0, y: 18 });
      gsap.set('.ab-cap-h', { opacity: 0, y: 28 });
      gsap.set('.ab-cap-div', { opacity: 0, scaleX: 0 });
      gsap.set('.ab-cap-card', { opacity: 0, y: 32 });

      gsap.timeline({ scrollTrigger: { trigger: '.ab-cap-section', start: 'top 72%', once: true }, defaults: { ease: 'power3.out' } })
        .to('.ab-cap-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.ab-cap-h', { opacity: 1, y: 0, duration: 0.8 }, '-=0.25')
        .to('.ab-cap-div', { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.4')
        .to('.ab-cap-card', { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 }, '-=0.3');

      // Mission
      gsap.set('.ab-mission-q', { opacity: 0, scale: 0.7 });
      gsap.set('.ab-mission-text', { opacity: 0, y: 30 });
      gsap.set('.ab-mission-attr', { opacity: 0 });

      gsap.timeline({ scrollTrigger: { trigger: '.ab-mission-section', start: 'top 70%', once: true }, defaults: { ease: 'power3.out' } })
        .to('.ab-mission-q', { opacity: 1, scale: 1, duration: 0.75, ease: 'back.out(1.4)' })
        .to('.ab-mission-text', { opacity: 1, y: 0, duration: 1.1 }, '-=0.35')
        .to('.ab-mission-attr', { opacity: 1, duration: 0.65 }, '-=0.3');

      // Values
      gsap.set('.ab-val-eyebrow', { opacity: 0, y: 18 });
      gsap.set('.ab-val-h', { opacity: 0, y: 28 });
      gsap.set('.ab-val-div', { opacity: 0, scaleX: 0 });
      gsap.set('.ab-val-item', { opacity: 0, y: 28 });

      gsap.timeline({ scrollTrigger: { trigger: '.ab-val-section', start: 'top 72%', once: true }, defaults: { ease: 'power3.out' } })
        .to('.ab-val-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.ab-val-h', { opacity: 1, y: 0, duration: 0.8 }, '-=0.25')
        .to('.ab-val-div', { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.4')
        .to('.ab-val-item', { opacity: 1, y: 0, duration: 0.65, stagger: 0.12 }, '-=0.3');

      // Journey
      gsap.set('.ab-tl-eyebrow', { opacity: 0, y: 18 });
      gsap.set('.ab-tl-h', { opacity: 0, y: 28 });
      gsap.set('.ab-tl-track', { scaleY: 0 });
      gsap.set('.ab-tl-node', { scale: 0 });
      gsap.set('.ab-tl-item', { opacity: 0, y: 20 });

      gsap.timeline({ scrollTrigger: { trigger: '.ab-tl-section', start: 'top 72%', once: true }, defaults: { ease: 'power3.out' } })
        .to('.ab-tl-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.ab-tl-h', { opacity: 1, y: 0, duration: 0.8 }, '-=0.25')
        .to('.ab-tl-track', { scaleY: 1, duration: 1.5, ease: 'power2.inOut', transformOrigin: 'top center' }, '-=0.2')
        .to('.ab-tl-node', { scale: 1, duration: 0.4, stagger: 0.22, ease: 'back.out(2.2)' }, '-=1.2')
        .to('.ab-tl-item', { opacity: 1, y: 0, duration: 0.6, stagger: 0.18 }, '-=1.0');

      // CTA
      gsap.set('.ab-cta-eyebrow', { opacity: 0, y: 18 });
      gsap.set('.ab-cta-h', { opacity: 0, y: 28 });
      gsap.set('.ab-cta-sub', { opacity: 0, y: 20 });
      gsap.set('.ab-cta-btns', { opacity: 0, y: 18 });

      gsap.timeline({ scrollTrigger: { trigger: '.ab-cta-section', start: 'top 75%', once: true }, defaults: { ease: 'power3.out' } })
        .to('.ab-cta-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.ab-cta-h', { opacity: 1, y: 0, duration: 0.9 }, '-=0.25')
        .to('.ab-cta-sub', { opacity: 1, y: 0, duration: 0.7 }, '-=0.35')
        .to('.ab-cta-btns', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
    };
    init();
  }, []);

  return (
    <div>

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[88vh] flex flex-col items-center justify-center pt-32 pb-20 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#020811 0%,#051629 38%,#081F3F 100%)' }}>

        <style>{`
          @keyframes abHeroRing { 0%{transform:scale(0.06);opacity:0.45} 100%{transform:scale(1);opacity:0} }
          .ab-hero-ring { animation: abHeroRing 9s ease-out infinite; transform-origin: center; }
        `}</style>

        {/* Stars */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" preserveAspectRatio="none">
          {STARS.map((s, i) => (
            <circle key={i} className="ab-star" cx={`${s.cx}%`} cy={`${s.cy}%`} r={s.r} fill="#DFCA8D" opacity={s.o} />
          ))}
        </svg>

        {/* Pulse rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[0, 1, 2].map(i => (
            <div key={i} className="ab-hero-ring absolute rounded-full"
              style={{ width: '1000px', height: '1000px', border: '1px solid rgba(200,165,74,0.10)', animationDelay: `${i * 3}s` }} />
          ))}
        </div>

        {/* Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px]"
            style={{ background: 'radial-gradient(ellipse,rgba(22,55,104,0.36) 0%,rgba(8,31,63,0.52) 45%,transparent 68%)', filter: 'blur(80px)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px]"
            style={{ background: 'radial-gradient(circle,rgba(200,165,74,0.07) 0%,transparent 65%)', filter: 'blur(50px)' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto w-full">
          <p className="ab-hero-eyebrow text-[10px] tracking-[0.38em] uppercase font-semibold text-gold mb-8">
            About Viddara Technologies
          </p>

          <h1 className="font-serif leading-tight mb-8" style={{ fontSize: 'clamp(2.8rem,7vw,5.5rem)' }}>
            {HERO_WORDS.map((word, i) => (
              <span key={i} className="ab-hero-word inline-block"
                style={{ marginRight: '0.3em', background: HERO_GRADS[i], WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {word}
              </span>
            ))}
          </h1>

          <div className="ab-hero-div flex justify-center mb-9">
            <GoldDivider centered />
          </div>

          <p className="ab-hero-sub text-white/55 text-lg leading-relaxed max-w-2xl mx-auto mb-14">
            We are a behavioral intelligence company building technology that helps individuals
            understand how they make decisions — and systematically improve them.
          </p>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { label: 'Our Domain', value: 'Behavioral Intelligence' },
              { label: 'Founded', value: '2026npm' },
              { label: 'First Product', value: 'MindTrade' },
            ].map((st, i) => (
              <div key={i} className="ab-hero-stat relative rounded-2xl px-6 py-5 text-center overflow-hidden"
                style={{ background: 'linear-gradient(160deg,rgba(22,55,104,0.16) 0%,rgba(8,31,63,0.58) 100%)', border: '1px solid rgba(200,165,74,0.14)' }}>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                <p className="text-[9.5px] tracking-[0.24em] uppercase text-gold/50 mb-2">{st.label}</p>
                <p className="font-serif text-white/88 text-base">{st.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="ab-hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/28 text-[9px] tracking-[0.22em] uppercase">Scroll</span>
          <div className="relative w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-gold rounded-full" style={{ animation: 'scrollPulse 2s ease-in-out infinite' }} />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/14 to-transparent" />
      </section>

      {/* ── 2. WHO WE ARE ────────────────────────────────────────── */}
      <section className="ab-story-section relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#081F3F 0%,#0a2246 50%,#081F3F 100%)' }}>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[550px] h-[450px]"
            style={{ background: 'radial-gradient(circle,rgba(22,55,104,0.42) 0%,transparent 65%)', filter: 'blur(65px)' }} />
          <div className="absolute bottom-0 right-0 w-[480px] h-[380px]"
            style={{ background: 'radial-gradient(circle,rgba(200,165,74,0.07) 0%,transparent 65%)', filter: 'blur(60px)' }} />
          <div className="absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: 'radial-gradient(rgba(200,165,74,0.9) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Text */}
            <div>
              <p className="ab-story-eyebrow text-[10px] tracking-[0.34em] uppercase font-semibold text-gold mb-6">
                Our Story
              </p>
              <h2 className="ab-story-h font-serif text-4xl sm:text-5xl leading-tight mb-6"
                style={{ background: 'linear-gradient(135deg,#ffffff 0%,#ddd5be 45%,#C8A54A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Who We Are
              </h2>
              <div className="ab-story-div mb-9"><GoldDivider /></div>
              <div className="space-y-5">
                <p className="ab-story-para text-white/55 text-base leading-relaxed">
                  Viddara Technologies is a behavioral technology company focused on analyzing how
                  individuals make decisions in high-pressure environments.
                </p>
                <p className="ab-story-para text-white/55 text-base leading-relaxed">
                  Many performance challenges are not caused by lack of knowledge, but by how decisions
                  are executed under stress, uncertainty, and time constraints. We build systems that
                  address this root cause directly.
                </p>
                <p className="ab-story-para text-white/55 text-base leading-relaxed">
                  Based in Tamil Nadu, India, we work at the intersection of behavioral science,
                  decision psychology, and performance technology.
                </p>
              </div>
            </div>

            {/* Neural network SVG */}
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 400 380" className="w-full max-w-sm" fill="none">
                <defs>
                  <filter id="abNnGlow">
                    <feGaussianBlur stdDeviation="5" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="abNnHubGlow">
                    <feGaussianBlur stdDeviation="16" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <radialGradient id="abNnHub" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#163768" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#081F3F" stopOpacity="1" />
                  </radialGradient>
                </defs>

                {/* Decorative rings */}
                <circle cx="200" cy="180" r="170" stroke="#C8A54A" strokeWidth="0.4" strokeOpacity="0.06" strokeDasharray="3 12" />
                <circle cx="200" cy="180" r="155" stroke="#C8A54A" strokeWidth="0.3" strokeOpacity="0.04" />

                {/* Edges */}
                {NN_EDGES.map(([a, b], i) => {
                  const na = NN_NODES[a], nb = NN_NODES[b];
                  const isSpoke = a === 0;
                  return (
                    <line key={i} className="ab-nn-line"
                      x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                      stroke="#C8A54A"
                      strokeWidth={isSpoke ? 0.9 : 0.5}
                      strokeOpacity={isSpoke ? 0.32 : 0.16}
                      strokeDasharray="600" />
                  );
                })}

                {/* Hub */}
                <g className="ab-nn-hub">
                  <circle cx="200" cy="180" r="42" fill="url(#abNnHub)" stroke="#C8A54A" strokeWidth="1.2" strokeOpacity="0.35" filter="url(#abNnHubGlow)" />
                  <circle cx="200" cy="180" r="31" fill="none" stroke="#C8A54A" strokeWidth="0.5" strokeOpacity="0.14" strokeDasharray="2 8" />
                  <circle cx="200" cy="180" r="7.5" fill="#C8A54A" opacity="0.72" filter="url(#abNnGlow)" />
                  <circle cx="200" cy="180" r="3.5" fill="#DFCA8D" opacity="0.95" />
                  <text x="200" y="172" textAnchor="middle" fill="#C8A54A" fillOpacity="0.52" fontSize="7" fontFamily="Inter,sans-serif" letterSpacing="2">BEHAVIORAL</text>
                  <text x="200" y="197" textAnchor="middle" fill="#C8A54A" fillOpacity="0.52" fontSize="7" fontFamily="Inter,sans-serif" letterSpacing="2">CORE</text>
                </g>

                {/* Outer nodes */}
                {NN_NODES.slice(1).map((n, i) => (
                  <g key={i} className="ab-nn-node" style={{ transformOrigin: `${n.x}px ${n.y}px` }}>
                    <circle cx={n.x} cy={n.y} r="18" fill="none" stroke="#C8A54A" strokeWidth="0.5" strokeOpacity="0.11" />
                    <circle cx={n.x} cy={n.y} r="11" fill="rgba(8,31,63,0.96)" stroke="#C8A54A" strokeWidth="1" strokeOpacity="0.38" />
                    <circle cx={n.x} cy={n.y} r="4" fill="#C8A54A" opacity="0.72" filter="url(#abNnGlow)" />
                    <circle cx={n.x} cy={n.y} r="1.8" fill="#DFCA8D" opacity="0.95" />
                  </g>
                ))}
              </svg>
            </div>

          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent" />
      </section>

      {/* ── 3. WHAT WE DO ────────────────────────────────────────── */}
      <section className="ab-cap-section relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#081F3F 0%,#071b38 50%,#081F3F 100%)' }}>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px]"
            style={{ background: 'radial-gradient(ellipse,rgba(22,55,104,0.32) 0%,rgba(8,31,63,0.55) 45%,transparent 68%)', filter: 'blur(70px)' }} />
          <div className="absolute inset-0 opacity-[0.017]"
            style={{ backgroundImage: 'linear-gradient(rgba(200,165,74,1) 1px,transparent 1px),linear-gradient(90deg,rgba(200,165,74,1) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="ab-cap-eyebrow text-[10px] tracking-[0.34em] uppercase font-semibold text-gold mb-6">Our Work</p>
            <h2 className="ab-cap-h font-serif text-4xl sm:text-5xl leading-tight mb-7"
              style={{ background: 'linear-gradient(135deg,#ffffff 0%,#ddd5be 45%,#C8A54A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              What We Do
            </h2>
            <div className="ab-cap-div flex justify-center"><GoldDivider centered /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {CAPABILITIES.map((cap, i) => (
              <div key={i} className="ab-cap-card relative rounded-3xl p-9 overflow-hidden cursor-default"
                style={{ background: 'linear-gradient(160deg,rgba(22,55,104,0.16) 0%,rgba(8,31,63,0.72) 100%)', border: '1px solid rgba(200,165,74,0.12)', boxShadow: '0 14px 55px -14px rgba(0,0,0,0.6)', transition: 'border-color 0.4s ease,box-shadow 0.4s ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(200,165,74,0.3)'; el.style.boxShadow = '0 18px 60px -12px rgba(200,165,74,0.1),0 0 0 1px rgba(200,165,74,0.1)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(200,165,74,0.12)'; el.style.boxShadow = '0 14px 55px -14px rgba(0,0,0,0.6)'; }}>

                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

                {/* Icon box */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-8"
                  style={{ background: 'linear-gradient(135deg,rgba(200,165,74,0.15) 0%,rgba(200,165,74,0.04) 100%)', border: '1px solid rgba(200,165,74,0.22)' }}>
                  <span style={{ color: '#C8A54A' }}><Icon type={cap.icon} /></span>
                </div>

                {/* Watermark */}
                <span className="absolute -top-4 -right-1 font-serif font-bold text-white/[0.028] leading-none select-none pointer-events-none" style={{ fontSize: '6.5rem' }}>0{i + 1}</span>

                <div className="w-6 h-px bg-gold mb-6" style={{ opacity: 0.4 }} />
                <h3 className="font-serif text-xl text-white/90 mb-4 leading-snug">{cap.title}</h3>
                <p className="text-white/48 text-sm leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent" />
      </section>

      {/* ── 4. MISSION ───────────────────────────────────────────── */}
      <section className="ab-mission-section relative py-40 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#081F3F 0%,#0d2a52 50%,#081F3F 100%)' }}>

        <style>{`
          @keyframes abMissionRing { 0%{transform:scale(0.08);opacity:0.4} 100%{transform:scale(1);opacity:0} }
          .ab-mission-ring { animation: abMissionRing 8s ease-out infinite; transform-origin: center; }
        `}</style>

        {/* Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[0, 1, 2].map(i => (
            <div key={i} className="ab-mission-ring absolute rounded-full"
              style={{ width: '900px', height: '900px', border: '1px solid rgba(200,165,74,0.12)', animationDelay: `${i * 2.66}s` }} />
          ))}
        </div>

        {/* Glows */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%,rgba(22,55,104,0.42) 0%,transparent 65%)' }} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ width: '580px', height: '380px', background: 'radial-gradient(ellipse,rgba(200,165,74,0.09) 0%,transparent 65%)', filter: 'blur(55px)' }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="ab-mission-q font-serif text-gold/14 leading-none select-none" style={{ fontSize: '9rem', marginBottom: '-2rem' }}>"</div>

          <blockquote className="ab-mission-text font-serif italic leading-tight mb-11"
            style={{ fontSize: 'clamp(1.85rem,4vw,3.5rem)', background: 'linear-gradient(135deg,#ffffff 0%,#e8dfc0 50%,#DFCA8D 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            To develop technology that helps individuals understand and improve their decision discipline.
          </blockquote>

          <div className="ab-mission-attr flex items-center justify-center gap-5">
            <div className="h-px w-14 bg-gradient-to-r from-transparent to-gold/45" />
            <p className="text-gold/55 text-[9px] tracking-[0.36em] uppercase font-semibold">Our Mission</p>
            <div className="h-px w-14 bg-gradient-to-l from-transparent to-gold/45" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent" />
      </section>

      {/* ── 5. VALUES ────────────────────────────────────────────── */}
      <section className="ab-val-section relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#081F3F 0%,#071b38 50%,#081F3F 100%)' }}>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[560px] h-[460px]"
            style={{ background: 'radial-gradient(circle,rgba(22,55,104,0.38) 0%,rgba(8,31,63,0.52) 45%,transparent 70%)', filter: 'blur(65px)' }} />
          <div className="absolute bottom-0 left-0 w-[460px] h-[380px]"
            style={{ background: 'radial-gradient(circle,rgba(200,165,74,0.07) 0%,transparent 65%)', filter: 'blur(55px)' }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="ab-val-eyebrow text-[10px] tracking-[0.34em] uppercase font-semibold text-gold mb-6">What Drives Us</p>
            <h2 className="ab-val-h font-serif text-4xl sm:text-5xl leading-tight mb-7"
              style={{ background: 'linear-gradient(135deg,#ffffff 0%,#ddd5be 45%,#C8A54A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Our Values
            </h2>
            <div className="ab-val-div flex justify-center"><GoldDivider centered /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val, i) => (
              <div key={i} className="ab-val-item relative rounded-2xl p-7 overflow-hidden cursor-default"
                style={{ background: 'linear-gradient(160deg,rgba(22,55,104,0.15) 0%,rgba(8,31,63,0.68) 100%)', border: '1px solid rgba(200,165,74,0.1)', transition: 'border-color 0.4s ease,transform 0.4s ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(200,165,74,0.28)'; el.style.transform = 'translateY(-5px)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(200,165,74,0.1)'; el.style.transform = 'translateY(0)'; }}>

                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/32 to-transparent" />

                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'linear-gradient(135deg,rgba(200,165,74,0.14) 0%,rgba(200,165,74,0.04) 100%)', border: '1px solid rgba(200,165,74,0.2)' }}>
                  <span style={{ color: '#C8A54A' }}><Icon type={val.icon} size={20} /></span>
                </div>

                <div className="w-5 h-px bg-gold mb-4" style={{ opacity: 0.4 }} />
                <h3 className="font-serif text-lg text-white/88 mb-3">{val.title}</h3>
                <p className="text-white/44 text-xs leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent" />
      </section>

      {/* ── 6. JOURNEY ───────────────────────────────────────────── */}
      <section className="ab-tl-section relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#081F3F 0%,#0a2246 50%,#081F3F 100%)' }}>

        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%,rgba(22,55,104,0.36) 0%,rgba(8,31,63,0.55) 45%,transparent 68%)' }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <p className="ab-tl-eyebrow text-[10px] tracking-[0.34em] uppercase font-semibold text-gold mb-6">Our Progress</p>
            <h2 className="ab-tl-h font-serif text-4xl sm:text-5xl leading-tight"
              style={{ background: 'linear-gradient(135deg,#ffffff 0%,#ddd5be 45%,#C8A54A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Our Journey
            </h2>
          </div>

          {/* Vertical timeline */}
          <div className="max-w-2xl mx-auto relative pl-16">
            {/* Track */}
            <div className="ab-tl-track absolute left-[18px] top-5 bottom-5 w-px"
              style={{ background: 'linear-gradient(to bottom,rgba(200,165,74,0.12),rgba(200,165,74,0.52) 50%,rgba(200,165,74,0.12))' }} />

            <div className="space-y-14">
              {MILESTONES.map((m, i) => (
                <div key={i} className="ab-tl-item relative">
                  {/* Node */}
                  <div className="ab-tl-node absolute -left-[46px] top-0.5 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,rgba(200,165,74,0.18) 0%,rgba(8,31,63,0.95) 100%)', border: '1px solid rgba(200,165,74,0.42)', boxShadow: '0 0 22px -6px rgba(200,165,74,0.28)' }}>
                    <div className="w-2.5 h-2.5 rounded-full bg-gold" style={{ opacity: 0.82 }} />
                  </div>

                  <p className="text-gold/65 text-[10px] tracking-[0.28em] uppercase mb-2">{m.year}</p>
                  <h3 className="font-serif text-xl text-white/90 mb-3 leading-snug">{m.title}</h3>
                  <p className="text-white/44 text-sm leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent" />
      </section>

      {/* ── 7. CTA ───────────────────────────────────────────────── */}
      <section className="ab-cta-section relative py-36 px-4 text-center overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#081F3F 0%,#051629 55%,#020811 100%)' }}>

        {/* Stars (subset) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" preserveAspectRatio="none">
          {STARS.slice(0, 26).map((s, i) => (
            <circle key={i} cx={`${s.cx}%`} cy={`${s.cy}%`} r={s.r * 0.8} fill="#DFCA8D" opacity={s.o * 0.65} />
          ))}
        </svg>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ width: '700px', height: '420px', background: 'radial-gradient(ellipse,rgba(22,55,104,0.38) 0%,rgba(8,31,63,0.6) 45%,transparent 70%)', filter: 'blur(70px)' }} />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <p className="ab-cta-eyebrow text-[10px] tracking-[0.36em] uppercase font-semibold text-gold mb-8">
            Begin Your Journey
          </p>
          <h2 className="ab-cta-h font-serif leading-tight mb-7"
            style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)', background: 'linear-gradient(135deg,#ffffff 0%,#e0d5b5 50%,#C8A54A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Start Improving Your Decision Discipline
          </h2>
          <div className="flex justify-center mb-9"><GoldDivider centered /></div>
          <p className="ab-cta-sub text-white/50 text-lg leading-relaxed mb-12">
            Explore MindTrade — our behavioral discipline platform — and experience what it means
            to make decisions with full psychological awareness.
          </p>
          <div className="ab-cta-btns flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="https://mindtradein.netlify.app/" external variant="primary">Explore MindTrade</CTAButton>
            <CTAButton href="/contact" variant="secondary">Get in Touch</CTAButton>
          </div>
        </div>
      </section>

    </div>
  );
}
