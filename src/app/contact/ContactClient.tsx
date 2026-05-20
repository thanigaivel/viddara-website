'use client';

import { useEffect } from 'react';
import GoldDivider from '@/components/ui/GoldDivider';

// ── SSR-safe stars ─────────────────────────────────────────────
const STARS = Array.from({ length: 46 }, (_, i) => ({
  cx: ((i * 157 + 73) % 94) + 3,
  cy: ((i * 103 + 41) % 88) + 6,
  r:  0.4 + (i % 5) * 0.27,
  o:  0.04 + (i % 7) * 0.038,
}));

// ── Signal SVG — all hardcoded integers, SSR safe ─────────────
// Center (190,190); 6 nodes pre-computed at r=155 on 60° steps from 30°
// sin/cos rounded: sin30=0.5→77, cos30=0.866→134
const SIG_CENTER = { cx: 190, cy: 190 };
const SIG_NODES = [
  { cx: 267, cy:  56 },  // 330°
  { cx: 345, cy: 190 },  // 90° (right)
  { cx: 267, cy: 324 },  // 150°
  { cx: 113, cy: 324 },  // 210°
  { cx:  35, cy: 190 },  // 270° (left)
  { cx: 113, cy:  56 },  // 30°
];

// ── Data ──────────────────────────────────────────────────────
const HERO_WORDS = ['Get', 'in', 'Touch'];
const HERO_GRADS = [
  'linear-gradient(135deg,#ffffff 0%,#e8e4d8 100%)',
  'linear-gradient(135deg,#e8e4d8 0%,#ddd0b8 100%)',
  'linear-gradient(135deg,#ddd0b8 0%,#C8A54A 100%)',
];

const CONTACTS = [
  {
    icon: 'mail'     as const,
    label: 'Email',
    value: 'viddaratech@gmail.com',
    href: 'mailto:viddaratech@gmail.com',
    desc: 'Write to us anytime',
  },
  {
    icon: 'phone'    as const,
    label: 'Phone',
    value: '+91 89391 88855',
    href: 'tel:+918939188855',
    desc: 'Mon – Sat, 10am – 6pm IST',
  },
  {
    icon: 'location' as const,
    label: 'Location',
    value: 'Tamil Nadu, India',
    href: null,
    desc: 'Viddara Technologies Pvt. Ltd.',
  },
];

const REASONS = [
  {
    icon: 'product'  as const,
    label: 'Product',
    title: 'MindTrade Inquiries',
    desc: 'Questions about accessing MindTrade, its features, or how behavioral discipline technology can help your trading practice.',
  },
  {
    icon: 'partner'  as const,
    label: 'Collaborate',
    title: 'Partnership & Research',
    desc: 'Opportunities to collaborate with Viddara in behavioral intelligence research, product development, or domain expansion.',
  },
  {
    icon: 'message'  as const,
    label: 'General',
    title: 'General Inquiry',
    desc: 'Anything on your mind — we welcome every conversation about behavioral science, decision technology, and human performance.',
  },
];

// ── Icon component ─────────────────────────────────────────────
type CtIcon = 'mail' | 'phone' | 'location' | 'product' | 'partner' | 'message';

function Icon({ type, size = 22 }: { type: CtIcon; size?: number }) {
  const s = { stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const icons: Record<CtIcon, React.ReactNode> = {
    mail: (<>
      <rect x="2" y="4" width="20" height="16" rx="2.5" {...s}/>
      <path d="M2 8l10 7 10-7" {...s}/>
    </>),
    phone: (<>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" {...s}/>
    </>),
    location: (<>
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" {...s}/>
      <circle cx="12" cy="10" r="3" {...s}/>
    </>),
    product: (<>
      <rect x="2" y="3" width="20" height="14" rx="2" {...s}/>
      <line x1="8" y1="21" x2="16" y2="21" {...s} strokeOpacity="0.5"/>
      <line x1="12" y1="17" x2="12" y2="21" {...s} strokeOpacity="0.5"/>
      <polyline points="7 9.5 10 12.5 14 8.5 17 11.5" {...s}/>
    </>),
    partner: (<>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/>
      <circle cx="9" cy="7" r="4" {...s}/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/>
    </>),
    message: (<>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/>
      <line x1="8" y1="10" x2="16" y2="10" {...s} strokeOpacity="0.5"/>
      <line x1="8" y1="13.5" x2="13" y2="13.5" {...s} strokeOpacity="0.35"/>
    </>),
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none">{icons[type]}</svg>;
}

// ── Component ─────────────────────────────────────────────────
export default function ContactClient() {
  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // ── Hero ────────────────────────────────────────────────
      gsap.set('.ct-eyebrow', { opacity: 0, y: 20 });
      gsap.set('.ct-word',    { opacity: 0, y: 44 });
      gsap.set('.ct-div',     { opacity: 0, scaleX: 0 });
      gsap.set('.ct-sub',     { opacity: 0, y: 22 });
      gsap.set('.ct-scroll',  { opacity: 0 });

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to('.ct-eyebrow', { opacity: 1, y: 0, duration: 0.7 })
        .to('.ct-word',    { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, '-=0.3')
        .to('.ct-div',     { opacity: 1, scaleX: 1, duration: 0.55, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.35')
        .to('.ct-sub',     { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
        .to('.ct-scroll',  { opacity: 1, duration: 0.5 });

      gsap.utils.toArray<SVGCircleElement>('.ct-star').forEach((el, i) => {
        const base = parseFloat(el.getAttribute('opacity') ?? '0.04');
        gsap.to(el, { opacity: Math.min(base * 4, 0.65), duration: 1.8 + (i % 5) * 0.7, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.11 });
      });

      // ── Contact info + Signal SVG ───────────────────────────
      gsap.set('.ct-info-eyebrow', { opacity: 0, y: 18 });
      gsap.set('.ct-info-h',       { opacity: 0, y: 28 });
      gsap.set('.ct-info-div',     { opacity: 0, scaleX: 0 });
      gsap.set('.ct-info-para',    { opacity: 0, y: 18 });
      gsap.set('.ct-info-card',    { opacity: 0, x: -22 });
      gsap.set('.ct-sig-ring',     { scale: 0, transformOrigin: `${SIG_CENTER.cx}px ${SIG_CENTER.cy}px` });
      gsap.set('.ct-sig-hub',      { scale: 0, transformOrigin: `${SIG_CENTER.cx}px ${SIG_CENTER.cy}px` });
      gsap.set('.ct-sig-line',     { strokeDashoffset: 200 });
      gsap.set('.ct-sig-node',     { scale: 0 });

      const infoTl = gsap.timeline({
        scrollTrigger: { trigger: '.ct-info-section', start: 'top 68%', once: true },
        defaults: { ease: 'power3.out' },
      });
      infoTl
        .to('.ct-info-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.ct-info-h',       { opacity: 1, y: 0, duration: 0.8 }, '-=0.25')
        .to('.ct-info-div',     { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'left' }, '-=0.4')
        .to('.ct-info-para',    { opacity: 1, y: 0, duration: 0.6, stagger: 0.14 }, '-=0.35')
        .to('.ct-info-card',    { opacity: 1, x: 0, duration: 0.55, stagger: 0.13, ease: 'back.out(1.3)' }, '-=0.4')
        .to('.ct-sig-ring',     { scale: 1, duration: 0.55, stagger: 0.16, ease: 'back.out(1.15)' }, '-=0.55')
        .to('.ct-sig-hub',      { scale: 1, duration: 0.7, ease: 'back.out(1.8)' }, '-=0.45')
        .to('.ct-sig-line',     { strokeDashoffset: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }, '-=0.4')
        .to('.ct-sig-node',     { scale: 1, duration: 0.38, stagger: 0.07, ease: 'back.out(2.4)' }, '-=0.45')
        .call(() => {
          // Continuous ring breathing after entry
          gsap.to('.ct-sig-ring', {
            scale: 1.04,
            duration: 3,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            stagger: { each: 0.5 },
            transformOrigin: `${SIG_CENTER.cx}px ${SIG_CENTER.cy}px`,
          });
        });

      // ── Reasons ──────────────────────────────────────────────
      gsap.set('.ct-rsn-eyebrow', { opacity: 0, y: 18 });
      gsap.set('.ct-rsn-h',       { opacity: 0, y: 28 });
      gsap.set('.ct-rsn-div',     { opacity: 0, scaleX: 0 });
      gsap.set('.ct-rsn-card',    { opacity: 0, y: 30 });

      gsap.timeline({ scrollTrigger: { trigger: '.ct-rsn-section', start: 'top 72%', once: true }, defaults: { ease: 'power3.out' } })
        .to('.ct-rsn-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.ct-rsn-h',       { opacity: 1, y: 0, duration: 0.8 }, '-=0.25')
        .to('.ct-rsn-div',     { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.4')
        .to('.ct-rsn-card',    { opacity: 1, y: 0, duration: 0.65, stagger: 0.13 }, '-=0.3');

      // ── CTA ──────────────────────────────────────────────────
      gsap.set('.ct-cta-h',    { opacity: 0, y: 28 });
      gsap.set('.ct-cta-sub',  { opacity: 0, y: 20 });
      gsap.set('.ct-cta-item', { opacity: 0, y: 16 });

      gsap.timeline({ scrollTrigger: { trigger: '.ct-cta-section', start: 'top 75%', once: true }, defaults: { ease: 'power3.out' } })
        .to('.ct-cta-h',    { opacity: 1, y: 0, duration: 0.9 })
        .to('.ct-cta-sub',  { opacity: 1, y: 0, duration: 0.7 }, '-=0.35')
        .to('.ct-cta-item', { opacity: 1, y: 0, duration: 0.55, stagger: 0.12 }, '-=0.3');
    };
    init();
  }, []);

  return (
    <div>

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[82vh] flex flex-col items-center justify-center pt-32 pb-20 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#020811 0%,#051629 38%,#081F3F 100%)' }}>

        <style>{`
          @keyframes ctHeroRing { 0%{transform:scale(0.06);opacity:0.42} 100%{transform:scale(1);opacity:0} }
          .ct-hero-ring { animation: ctHeroRing 9s ease-out infinite; transform-origin: center; }
          @keyframes ctScanLine { 0%{transform:translateY(110%);opacity:0} 8%{opacity:0.28} 92%{opacity:0.28} 100%{transform:translateY(-110%);opacity:0} }
          .ct-scan { animation: ctScanLine 14s linear infinite; }
        `}</style>

        {/* Stars */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" preserveAspectRatio="none">
          {STARS.map((s, i) => (
            <circle key={i} className="ct-star" cx={`${s.cx}%`} cy={`${s.cy}%`} r={s.r} fill="#DFCA8D" opacity={s.o}/>
          ))}
        </svg>

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle,rgba(200,165,74,0.9) 1.5px,transparent 1.5px)', backgroundSize: '44px 44px' }}/>

        {/* Scan line */}
        <div className="ct-scan absolute inset-x-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(to right,transparent,rgba(200,165,74,0.28) 28%,rgba(200,165,74,0.48) 50%,rgba(200,165,74,0.28) 72%,transparent)' }}/>

        {/* Pulse rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[0, 1, 2].map(i => (
            <div key={i} className="ct-hero-ring absolute rounded-full"
              style={{ width: '1000px', height: '1000px', border: '1px solid rgba(200,165,74,0.09)', animationDelay: `${i * 3}s` }}/>
          ))}
        </div>

        {/* Depth glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px]"
            style={{ background: 'radial-gradient(ellipse,rgba(22,55,104,0.36) 0%,rgba(8,31,63,0.52) 45%,transparent 68%)', filter: 'blur(80px)' }}/>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px]"
            style={{ background: 'radial-gradient(circle,rgba(200,165,74,0.07) 0%,transparent 65%)', filter: 'blur(50px)' }}/>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
          <p className="ct-eyebrow text-[10px] tracking-[0.38em] uppercase font-semibold text-gold mb-8">
            Viddara Technologies
          </p>

          <h1 className="font-serif leading-tight mb-8" style={{ fontSize: 'clamp(3rem,7.5vw,6rem)' }}>
            {HERO_WORDS.map((word, i) => (
              <span key={i} className="ct-word inline-block"
                style={{ marginRight: '0.28em', background: HERO_GRADS[i], WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {word}
              </span>
            ))}
          </h1>

          <div className="ct-div flex justify-center mb-9">
            <GoldDivider centered/>
          </div>

          <p className="ct-sub text-white/52 text-lg leading-relaxed max-w-xl mx-auto">
            We are always open to conversations about behavioral science, decision intelligence, and the technology we are building.
          </p>
        </div>

        {/* Scroll */}
        <div className="ct-scroll absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/28 text-[9px] tracking-[0.22em] uppercase">Scroll</span>
          <div className="relative w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-gold rounded-full" style={{ animation: 'scrollPulse 2s ease-in-out infinite' }}/>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/14 to-transparent"/>
      </section>

      {/* ── 2. CONTACT DETAILS ──────────────────────────────────── */}
      <section className="ct-info-section relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
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

            {/* Left — text + contact cards */}
            <div>
              <p className="ct-info-eyebrow text-[10px] tracking-[0.34em] uppercase font-semibold text-gold mb-6">
                Contact Us
              </p>
              <h2 className="ct-info-h font-serif text-4xl sm:text-5xl leading-tight mb-6"
                style={{ background: 'linear-gradient(135deg,#ffffff 0%,#ddd5be 45%,#C8A54A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                We'd Love to<br/>Hear from You
              </h2>
              <div className="ct-info-div mb-9"><GoldDivider/></div>
              <div className="space-y-4 mb-12">
                <p className="ct-info-para text-white/55 text-base leading-relaxed">
                  Whether you have a question about MindTrade, want to explore how behavioral
                  intelligence can help you, or simply want to connect — reach out directly.
                </p>
                <p className="ct-info-para text-white/55 text-base leading-relaxed">
                  Viddara Technologies is a focused team based in Tamil Nadu, India. We respond
                  to every inquiry personally and thoughtfully.
                </p>
              </div>

              {/* Contact cards */}
              <div className="space-y-4">
                {CONTACTS.map((c, i) => (
                  <div key={i} className="ct-info-card">
                    {c.href ? (
                      <a href={c.href}
                        className="group flex items-center gap-5 rounded-2xl px-6 py-5 cursor-pointer block"
                        style={{ background: 'linear-gradient(160deg,rgba(22,55,104,0.15) 0%,rgba(8,31,63,0.68) 100%)', border: '1px solid rgba(200,165,74,0.1)', transition: 'border-color 0.35s ease,box-shadow 0.35s ease,transform 0.35s ease' }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(200,165,74,0.3)'; el.style.boxShadow = '0 12px 40px -10px rgba(200,165,74,0.12)'; el.style.transform = 'translateX(4px)'; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(200,165,74,0.1)'; el.style.boxShadow = 'none'; el.style.transform = 'translateX(0)'; }}>
                        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right,transparent,rgba(200,165,74,0.28),transparent)' }}/>
                        <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg,rgba(200,165,74,0.14) 0%,rgba(200,165,74,0.04) 100%)', border: '1px solid rgba(200,165,74,0.22)' }}>
                          <span style={{ color: '#C8A54A' }}><Icon type={c.icon} size={18}/></span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] tracking-[0.26em] uppercase text-gold/50 mb-0.5">{c.label}</p>
                          <p className="text-white/85 text-sm font-medium group-hover:text-gold transition-colors duration-300 truncate">{c.value}</p>
                          <p className="text-white/30 text-[11px] mt-0.5">{c.desc}</p>
                        </div>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" className="flex-shrink-0 opacity-25 group-hover:opacity-60 group-hover:translate-x-1 transition-all duration-300">
                          <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    ) : (
                      <div className="flex items-center gap-5 rounded-2xl px-6 py-5"
                        style={{ background: 'linear-gradient(160deg,rgba(22,55,104,0.12) 0%,rgba(8,31,63,0.62) 100%)', border: '1px solid rgba(200,165,74,0.08)' }}>
                        <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg,rgba(200,165,74,0.12) 0%,rgba(200,165,74,0.03) 100%)', border: '1px solid rgba(200,165,74,0.18)' }}>
                          <span style={{ color: '#C8A54A' }}><Icon type={c.icon} size={18}/></span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] tracking-[0.26em] uppercase text-gold/50 mb-0.5">{c.label}</p>
                          <p className="text-white/80 text-sm font-medium">{c.value}</p>
                          <p className="text-white/30 text-[11px] mt-0.5">{c.desc}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Signal broadcast SVG */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Outer glow */}
                <div className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle,rgba(200,165,74,0.06) 0%,transparent 70%)', filter: 'blur(40px)', transform: 'scale(1.4)' }}/>

                <svg viewBox="0 0 380 380" className="w-full max-w-[380px]" fill="none">
                  <defs>
                    <radialGradient id="ctHubGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#163768" stopOpacity="0.95"/>
                      <stop offset="100%" stopColor="#081F3F" stopOpacity="1"/>
                    </radialGradient>
                    <filter id="ctHubGlow">
                      <feGaussianBlur stdDeviation="14" result="b"/>
                      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <filter id="ctNodeGlow">
                      <feGaussianBlur stdDeviation="4" result="b"/>
                      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>

                  {/* Concentric rings — outermost to innermost */}
                  <circle className="ct-sig-ring"
                    cx={SIG_CENTER.cx} cy={SIG_CENTER.cy} r="158"
                    stroke="#C8A54A" strokeWidth="0.5" strokeOpacity="0.12"
                    strokeDasharray="5 14" fill="none"/>
                  <circle className="ct-sig-ring"
                    cx={SIG_CENTER.cx} cy={SIG_CENTER.cy} r="112"
                    stroke="#C8A54A" strokeWidth="0.5" strokeOpacity="0.18"
                    strokeDasharray="4 10" fill="none"/>
                  <circle className="ct-sig-ring"
                    cx={SIG_CENTER.cx} cy={SIG_CENTER.cy} r="66"
                    stroke="#C8A54A" strokeWidth="0.6" strokeOpacity="0.22"
                    strokeDasharray="3 7" fill="none"/>

                  {/* Spoke lines from center to nodes */}
                  {SIG_NODES.map((n, i) => (
                    <line key={i} className="ct-sig-line"
                      x1={SIG_CENTER.cx} y1={SIG_CENTER.cy}
                      x2={n.cx} y2={n.cy}
                      stroke="#C8A54A" strokeWidth="0.6" strokeOpacity="0.2"
                      strokeDasharray="200"/>
                  ))}

                  {/* Outer nodes */}
                  {SIG_NODES.map((n, i) => (
                    <g key={i} className="ct-sig-node" style={{ transformOrigin: `${n.cx}px ${n.cy}px` }} filter="url(#ctNodeGlow)">
                      <circle cx={n.cx} cy={n.cy} r="16" stroke="#C8A54A" strokeWidth="0.4" strokeOpacity="0.12" fill="none"/>
                      <circle cx={n.cx} cy={n.cy} r="9" fill="rgba(8,31,63,0.96)" stroke="#C8A54A" strokeWidth="0.9" strokeOpacity="0.38"/>
                      <circle cx={n.cx} cy={n.cy} r="3.5" fill="#C8A54A" opacity="0.72"/>
                      <circle cx={n.cx} cy={n.cy} r="1.5" fill="#DFCA8D" opacity="0.95"/>
                    </g>
                  ))}

                  {/* Hub */}
                  <g className="ct-sig-hub">
                    {/* Outer halo */}
                    <circle cx={SIG_CENTER.cx} cy={SIG_CENTER.cy} r="44"
                      fill="none" stroke="#C8A54A" strokeWidth="0.4" strokeOpacity="0.1" strokeDasharray="2 10"/>
                    {/* Main circle */}
                    <circle cx={SIG_CENTER.cx} cy={SIG_CENTER.cy} r="30"
                      fill="url(#ctHubGrad)" stroke="#C8A54A" strokeWidth="1.1" strokeOpacity="0.38"
                      filter="url(#ctHubGlow)"/>
                    {/* Inner ring */}
                    <circle cx={SIG_CENTER.cx} cy={SIG_CENTER.cy} r="21"
                      fill="none" stroke="#C8A54A" strokeWidth="0.4" strokeOpacity="0.16" strokeDasharray="2 6"/>
                    {/* Icon lines (stylised "V" for Viddara) */}
                    <text
                      x={SIG_CENTER.cx} y={SIG_CENTER.cy - 4}
                      textAnchor="middle"
                      fill="#C8A54A" fillOpacity="0.55"
                      fontSize="9" fontFamily="Georgia,serif" letterSpacing="2">
                      VIDDARA
                    </text>
                    <text
                      x={SIG_CENTER.cx} y={SIG_CENTER.cy + 8}
                      textAnchor="middle"
                      fill="#C8A54A" fillOpacity="0.35"
                      fontSize="6" fontFamily="Inter,sans-serif" letterSpacing="1.5">
                      TECH
                    </text>
                    {/* Center dot */}
                    <circle cx={SIG_CENTER.cx} cy={SIG_CENTER.cy} r="4.5"
                      fill="#C8A54A" opacity="0.6" filter="url(#ctNodeGlow)"/>
                    <circle cx={SIG_CENTER.cx} cy={SIG_CENTER.cy} r="2"
                      fill="#DFCA8D" opacity="0.95"/>
                  </g>

                  {/* Decorative tick marks on outer ring at node positions */}
                  {SIG_NODES.map((n, i) => {
                    // Short tick toward center, 8px long, at r=170 from center
                    // direction: unit vector from center to node
                    // We pre-compute end points for each tick (integers only)
                    const ticks = [
                      { x1: 267, y1: 38,  x2: 267, y2: 48  },
                      { x1: 362, y1: 190, x2: 352, y2: 190 },
                      { x1: 267, y1: 342, x2: 267, y2: 332 },
                      { x1: 113, y1: 342, x2: 113, y2: 332 },
                      { x1:  18, y1: 190, x2:  28, y2: 190 },
                      { x1: 113, y1:  38, x2: 113, y2:  48 },
                    ];
                    const t = ticks[i];
                    return (
                      <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                        stroke="#C8A54A" strokeWidth="1" strokeOpacity="0.25" strokeLinecap="round"/>
                    );
                  })}
                </svg>
              </div>
            </div>

          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent"/>
      </section>

      {/* ── 3. WHY REACH OUT ─────────────────────────────────────── */}
      <section className="ct-rsn-section relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#081F3F 0%,#071b38 50%,#081F3F 100%)' }}>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[900px]"
            style={{ background: 'radial-gradient(ellipse,rgba(22,55,104,0.30) 0%,rgba(8,31,63,0.52) 45%,transparent 68%)', filter: 'blur(75px)' }}/>
          <div className="absolute inset-0 opacity-[0.016]"
            style={{ backgroundImage: 'linear-gradient(rgba(200,165,74,1) 1px,transparent 1px),linear-gradient(90deg,rgba(200,165,74,1) 1px,transparent 1px)', backgroundSize: '64px 64px' }}/>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="ct-rsn-eyebrow text-[10px] tracking-[0.34em] uppercase font-semibold text-gold mb-6">
              How We Can Help
            </p>
            <h2 className="ct-rsn-h font-serif text-4xl sm:text-5xl leading-tight mb-7"
              style={{ background: 'linear-gradient(135deg,#ffffff 0%,#ddd5be 45%,#C8A54A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Why Reach Out
            </h2>
            <div className="ct-rsn-div flex justify-center">
              <GoldDivider centered/>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {REASONS.map((r, i) => (
              <div key={i} className="ct-rsn-card relative rounded-3xl p-9 overflow-hidden cursor-default"
                style={{ background: 'linear-gradient(160deg,rgba(22,55,104,0.16) 0%,rgba(8,31,63,0.72) 100%)', border: '1px solid rgba(200,165,74,0.12)', boxShadow: '0 14px 55px -14px rgba(0,0,0,0.6)', transition: 'border-color 0.4s ease,box-shadow 0.4s ease,transform 0.4s ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(200,165,74,0.3)'; el.style.boxShadow = '0 18px 60px -12px rgba(200,165,74,0.1)'; el.style.transform = 'translateY(-5px)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(200,165,74,0.12)'; el.style.boxShadow = '0 14px 55px -14px rgba(0,0,0,0.6)'; el.style.transform = 'translateY(0)'; }}>

                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"/>

                {/* Label pill */}
                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-7"
                  style={{ background: 'rgba(200,165,74,0.07)', border: '1px solid rgba(200,165,74,0.16)' }}>
                  <span className="text-gold/55 text-[7.5px]">◆</span>
                  <span className="text-[8.5px] tracking-[0.22em] uppercase text-gold/55">{r.label}</span>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-7"
                  style={{ background: 'linear-gradient(135deg,rgba(200,165,74,0.15) 0%,rgba(200,165,74,0.04) 100%)', border: '1px solid rgba(200,165,74,0.22)' }}>
                  <span style={{ color: '#C8A54A' }}><Icon type={r.icon}/></span>
                </div>

                {/* Watermark */}
                <span className="absolute -top-4 -right-1 font-serif font-bold text-white/[0.028] leading-none select-none pointer-events-none" style={{ fontSize: '6.5rem' }}>
                  0{i + 1}
                </span>

                <div className="w-6 h-px bg-gold mb-5" style={{ opacity: 0.38 }}/>
                <h3 className="font-serif text-xl text-white/90 mb-4 leading-snug">{r.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent"/>
      </section>

      {/* ── 4. CLOSING ───────────────────────────────────────────── */}
      <section className="ct-cta-section relative py-40 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#081F3F 0%,#051629 55%,#020811 100%)' }}>

        {/* Stars */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" preserveAspectRatio="none">
          {STARS.slice(0, 26).map((s, i) => (
            <circle key={i} cx={`${s.cx}%`} cy={`${s.cy}%`} r={s.r * 0.72} fill="#DFCA8D" opacity={s.o * 0.6}/>
          ))}
        </svg>

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.024]"
          style={{ backgroundImage: 'radial-gradient(circle,rgba(200,165,74,0.9) 1.5px,transparent 1.5px)', backgroundSize: '44px 44px' }}/>

        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ width: '700px', height: '440px', background: 'radial-gradient(ellipse,rgba(22,55,104,0.38) 0%,rgba(8,31,63,0.62) 45%,transparent 70%)', filter: 'blur(70px)' }}/>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ width: '360px', height: '300px', background: 'radial-gradient(circle,rgba(200,165,74,0.08) 0%,transparent 65%)', filter: 'blur(50px)' }}/>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">

          <h2 className="ct-cta-h font-serif leading-tight mb-8"
            style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)', background: 'linear-gradient(135deg,#ffffff 0%,#e0d5b5 50%,#C8A54A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Every Great Conversation<br/>Starts with Hello
          </h2>

          <div className="flex justify-center mb-8"><GoldDivider centered/></div>

          <p className="ct-cta-sub text-white/48 text-base leading-relaxed max-w-xl mx-auto mb-14">
            We are a focused team building technology at the frontier of behavioral science.
            Your message matters to us — we read and respond to every one.
          </p>

          {/* Direct contact links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            {CONTACTS.filter(c => c.href).map((c, i) => (
              <a key={i} className="ct-cta-item group flex items-center gap-3 rounded-2xl px-7 py-4"
                href={c.href!}
                style={{ background: 'linear-gradient(160deg,rgba(22,55,104,0.18) 0%,rgba(8,31,63,0.65) 100%)', border: '1px solid rgba(200,165,74,0.14)', transition: 'border-color 0.35s ease,transform 0.35s ease,box-shadow 0.35s ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(200,165,74,0.36)'; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 12px 40px -10px rgba(200,165,74,0.15)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(200,165,74,0.14)'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(200,165,74,0.1)', border: '1px solid rgba(200,165,74,0.2)' }}>
                  <span style={{ color: '#C8A54A' }}><Icon type={c.icon} size={15}/></span>
                </div>
                <div className="text-left">
                  <p className="text-[8.5px] tracking-[0.22em] uppercase text-gold/45 mb-0.5">{c.label}</p>
                  <p className="text-white/72 text-sm group-hover:text-gold transition-colors duration-300">{c.value}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Company footer note */}
          <div className="ct-cta-item mt-16 pt-10 flex items-center justify-center gap-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/30"/>
            <p className="text-white/22 text-[10px] tracking-[0.28em] uppercase font-medium">
              Viddara Technologies Pvt. Ltd. · Tamil Nadu, India
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/30"/>
          </div>
        </div>

      </section>

    </div>
  );
}
