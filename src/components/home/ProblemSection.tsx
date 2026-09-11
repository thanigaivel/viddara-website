'use client';

import { useRef, useEffect } from 'react';
import GoldDivider from '@/components/ui/GoldDivider';

const ACTUAL_PATH =
  'M 60 280 C 160 245, 240 215, 320 198 C 370 190, 410 186, 450 198 C 500 217, 545 255, 600 300 C 650 332, 720 346, 800 350';
const IDEAL_PATH = 'M 60 280 L 800 60';
const ACTUAL_PATH_LEN = 810;
const IDEAL_PATH_LEN = 800;

const DATA_POINTS = [
  { x: 60,  y: 280, stress: false },
  { x: 175, y: 246, stress: false },
  { x: 270, y: 218, stress: false },
  { x: 360, y: 198, stress: false },
  { x: 450, y: 198, stress: true  },
  { x: 530, y: 238, stress: true  },
  { x: 600, y: 288, stress: true  },
  { x: 700, y: 342, stress: true  },
  { x: 800, y: 350, stress: true  },
];

/* Conceptual flow labels replacing proprietary zones */
const FLOW_STEPS = ['Knowledge', 'Intention', 'Decision', 'Pressure', 'Behaviour', 'Performance'];

export default function ProblemSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const headingRef    = useRef<HTMLHeadingElement>(null);
  const subtitleRef   = useRef<HTMLDivElement>(null);
  const chartRef      = useRef<SVGSVGElement>(null);
  const actualPathRef = useRef<SVGPathElement>(null);
  const idealPathRef  = useRef<SVGPathElement>(null);
  const brandRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const el = sectionRef.current;
      if (!el) return;

      /* Brand statement animations */
      gsap.set('.brand-eyebrow',  { opacity: 0, y: 18 });
      gsap.set('.brand-heading',  { opacity: 0, y: 36 });
      gsap.set('.brand-div',      { opacity: 0, scaleX: 0 });
      gsap.set('.brand-body',     { opacity: 0, y: 24 });

      gsap.timeline({
        scrollTrigger: { trigger: brandRef.current, start: 'top 75%', once: true },
        defaults: { ease: 'power3.out' },
      })
        .to('.brand-eyebrow',  { opacity: 1, y: 0, duration: 0.6 })
        .to('.brand-heading',  { opacity: 1, y: 0, duration: 0.9 }, '-=0.3')
        .to('.brand-div',      { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.5')
        .to('.brand-body',     { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');

      /* Problem section animations */
      gsap.set('.prob-eyebrow',  { opacity: 0, y: 18 });
      gsap.set(headingRef.current,  { opacity: 0, y: 36 });
      gsap.set('.prob-divider',  { opacity: 0, scaleX: 0 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 24 });
      gsap.set(chartRef.current,    { opacity: 0, y: 16 });
      gsap.set('.chart-lbl',     { opacity: 0 });
      gsap.set('.data-dot',      { scale: 0 });
      gsap.set('.flow-step',     { opacity: 0, y: 16 });

      if (actualPathRef.current) {
        actualPathRef.current.style.strokeDasharray = String(ACTUAL_PATH_LEN);
        actualPathRef.current.style.strokeDashoffset = String(ACTUAL_PATH_LEN);
      }
      if (idealPathRef.current) {
        idealPathRef.current.style.strokeDasharray = String(IDEAL_PATH_LEN);
        idealPathRef.current.style.strokeDashoffset = String(IDEAL_PATH_LEN);
      }

      gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 72%', once: true },
        defaults: { ease: 'power3.out' },
      })
        .to('.prob-eyebrow',  { opacity: 1, y: 0, duration: 0.6 })
        .to(headingRef.current, { opacity: 1, y: 0, duration: 0.9 }, '-=0.3')
        .to('.prob-divider',  { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.5')
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
        .to(chartRef.current,    { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
        .to(idealPathRef.current,  { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, '-=0.2')
        .to(actualPathRef.current, { strokeDashoffset: 0, duration: 2.2, ease: 'power1.inOut' }, '-=1.4')
        .to('.data-dot',      { scale: 1, duration: 0.35, stagger: 0.09, ease: 'back.out(2.5)' }, '-=1.9')
        .to('.chart-lbl',     { opacity: 1, duration: 0.4, stagger: 0.07 }, '-=0.6')
        .to('.flow-step',     { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, '-=0.3');
    };

    init();
  }, []);

  return (
    <>
      {/* ── Brand Statement ── */}
      <section
        ref={brandRef}
        className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #081F3F 0%, #0a2246 50%, #081F3F 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px]"
            style={{ background: 'radial-gradient(ellipse, rgba(22,55,104,0.38) 0%, rgba(8,31,63,0.5) 40%, transparent 70%)', filter: 'blur(60px)' }}
          />
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px]"
            style={{ background: 'radial-gradient(circle, rgba(200,165,74,0.06) 0%, transparent 65%)', filter: 'blur(70px)' }}
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <p className="brand-eyebrow text-[10px] tracking-[0.32em] uppercase font-semibold text-gold mb-8">
            Our Conviction
          </p>

          <h2
            className="brand-heading font-serif leading-tight mb-8"
            style={{
              fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
              background: 'linear-gradient(135deg, #ffffff 0%, #e8dfc0 50%, #C8A54A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            When decisions matter,
            <br className="hidden sm:block" />
            behaviour matters.
          </h2>

          <div className="brand-div flex justify-center mb-9">
            <GoldDivider centered />
          </div>

          <p className="brand-body text-white/55 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Knowledge, experience and capability do not always translate into consistent decisions.
            Viddara explores how technology can help make decision behaviour more visible,
            understandable and actionable.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent" />
      </section>

      {/* ── Core Challenge ── */}
      <section
        ref={sectionRef}
        className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #081F3F 0%, #071b38 50%, #081F3F 100%)' }}
      >
        {/* ── Background atmosphere ── */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px]"
            style={{ background: 'radial-gradient(ellipse, rgba(22,55,104,0.38) 0%, rgba(8,31,63,0.5) 40%, transparent 70%)', filter: 'blur(60px)' }}
          />
          <div
            className="absolute bottom-0 right-0 w-[650px] h-[480px]"
            style={{ background: 'radial-gradient(circle, rgba(200,165,74,0.08) 0%, transparent 65%)', filter: 'blur(80px)' }}
          />
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[600px]"
            style={{ background: 'radial-gradient(ellipse, rgba(8,31,63,0.9) 0%, transparent 70%)', filter: 'blur(50px)' }}
          />
          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(200,165,74,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,165,74,1) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">

          {/* ── Section header ── */}
          <div className="text-center mb-16">
            <p className="prob-eyebrow text-[10px] tracking-[0.32em] uppercase font-semibold text-gold mb-6">
              The Core Challenge
            </p>
            <h2
              ref={headingRef}
              className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] leading-tight mb-7"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #e0d5b5 42%, #C8A54A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              The Gap Between
              <br className="hidden sm:block" />
              Knowing and Doing
            </h2>
            <div className="prob-divider flex justify-center mb-8">
              <GoldDivider centered />
            </div>
            <div ref={subtitleRef} className="max-w-2xl mx-auto space-y-3 text-white/55 text-base leading-relaxed">
              <p>
                People can possess knowledge, plans and experience — yet behave differently
                when faced with uncertainty, pressure and rapidly changing conditions.
              </p>
            </div>
          </div>

          {/* ── Chart card (conceptual — no proprietary zones) ── */}
          <div className="mb-14">
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, rgba(22,55,104,0.18) 0%, rgba(8,31,63,0.7) 100%)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 28px 90px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              {/* Corner pin accents */}
              <div className="absolute top-0 left-0 w-28 h-px bg-gradient-to-r from-gold/60 to-transparent" />
              <div className="absolute top-0 left-0 w-px h-28 bg-gradient-to-b from-gold/60 to-transparent" />
              <div className="absolute bottom-0 right-0 w-28 h-px bg-gradient-to-l from-gold/18 to-transparent" />
              <div className="absolute bottom-0 right-0 w-px h-28 bg-gradient-to-t from-gold/18 to-transparent" />

              <div className="p-6 sm:p-10">
                {/* Legend */}
                <div className="flex items-center justify-end gap-6 flex-wrap gap-y-2 mb-5">
                  <div className="flex items-center gap-2">
                    <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke="rgba(22,55,104,0.8)" strokeWidth="1.5" strokeDasharray="6 3" /></svg>
                    <span className="text-white/35 text-[9px] tracking-[0.16em] uppercase">Expected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="24" height="8">
                      <defs>
                        <linearGradient id="lgLegend" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#C8A54A" />
                          <stop offset="100%" stopColor="#e05a5a" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="4" x2="24" y2="4" stroke="url(#lgLegend)" strokeWidth="2" />
                    </svg>
                    <span className="text-white/35 text-[9px] tracking-[0.16em] uppercase">Actual</span>
                  </div>
                </div>

                <svg
                  ref={chartRef}
                  viewBox="0 0 860 390"
                  className="w-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%"   stopColor="#C8A54A" />
                      <stop offset="52%"  stopColor="#DFCA8D" />
                      <stop offset="70%"  stopColor="#C8A54A" />
                      <stop offset="100%" stopColor="#e05a5a" />
                    </linearGradient>
                    <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%"   stopColor="#C8A54A" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#C8A54A" stopOpacity="0" />
                    </linearGradient>
                    <filter id="lineglow">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>

                  {/* Horizontal grid */}
                  {[80, 140, 200, 260, 320].map((y) => (
                    <line key={y} x1="60" y1={y} x2="820" y2={y}
                      stroke="#ffffff" strokeWidth="0.4" strokeOpacity="0.035" />
                  ))}

                  {/* Axes */}
                  <line x1="60" y1="360" x2="820" y2="360"
                    stroke="#C8A54A" strokeWidth="0.8" strokeOpacity="0.18" />
                  <line x1="60" y1="46" x2="60" y2="363"
                    stroke="#C8A54A" strokeWidth="0.8" strokeOpacity="0.18" />

                  {/* Conceptual shaded region — subtle, no proprietary label */}
                  <rect x="440" y="46" width="170" height="317"
                    fill="#C8A54A" fillOpacity="0.03" />
                  <line x1="440" y1="46" x2="440" y2="363"
                    stroke="#C8A54A" strokeWidth="0.6" strokeOpacity="0.12" strokeDasharray="5 4" />
                  <line x1="610" y1="46" x2="610" y2="363"
                    stroke="#C8A54A" strokeWidth="0.6" strokeOpacity="0.12" strokeDasharray="5 4" />

                  {/* Expected dashed line */}
                  <path
                    ref={idealPathRef}
                    d={IDEAL_PATH}
                    stroke="#163768"
                    strokeWidth="1.8"
                    strokeOpacity="0.8"
                    strokeDasharray="12 6"
                    fill="none"
                  />

                  {/* Area under actual line */}
                  <path
                    d={`${ACTUAL_PATH} L 800 360 L 60 360 Z`}
                    fill="url(#areaGrad)"
                  />

                  {/* Actual performance line */}
                  <path
                    ref={actualPathRef}
                    d={ACTUAL_PATH}
                    stroke="url(#lineGrad)"
                    strokeWidth="2.8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#lineglow)"
                  />

                  {/* Data points */}
                  {DATA_POINTS.map((p, i) => (
                    <g key={i} className="data-dot" style={{ transformOrigin: `${p.x}px ${p.y}px` }}>
                      <circle cx={p.x} cy={p.y} r="6.5"
                        fill={p.stress ? 'rgba(224,90,90,0.08)' : 'rgba(200,165,74,0.08)'}
                        stroke={p.stress ? '#e05a5a' : '#C8A54A'}
                        strokeWidth="1.5"
                        strokeOpacity={p.stress ? '0.7' : '0.55'} />
                      <circle cx={p.x} cy={p.y} r="2.5"
                        fill={p.stress ? '#e05a5a' : '#C8A54A'}
                        opacity={p.stress ? '0.88' : '0.72'} />
                    </g>
                  ))}

                  {/* Axis labels */}
                  <text className="chart-lbl" x="270" y="382"
                    fill="#C8A54A" fillOpacity="0.35" fontSize="9"
                    fontFamily="Inter,sans-serif" letterSpacing="1.8">
                    SITUATIONS / CONDITIONS →
                  </text>
                  <text className="chart-lbl" x="16" y="210"
                    fill="#C8A54A" fillOpacity="0.35" fontSize="9"
                    fontFamily="Inter,sans-serif" writingMode="tb" letterSpacing="1.8">
                    CONSISTENCY
                  </text>

                  {/* Expected path label */}
                  <text className="chart-lbl" x="638" y="86"
                    fill="#2a5298" fillOpacity="0.9" fontSize="9"
                    fontFamily="Inter,sans-serif" letterSpacing="1">
                    EXPECTED
                  </text>
                </svg>

                {/* ── Conceptual behaviour flow ── */}
                <div className="flex items-center justify-center gap-1 sm:gap-3 mt-6 flex-wrap">
                  {FLOW_STEPS.map((step, i) => (
                    <div key={i} className="flow-step flex items-center gap-1 sm:gap-3">
                      <span
                        className="text-[9px] sm:text-[10px] tracking-[0.16em] uppercase font-medium"
                        style={{
                          background: `linear-gradient(135deg, ${i < 3 ? '#ffffff' : '#DFCA8D'} 0%, ${i < 3 ? '#a8c5f0' : '#C8A54A'} 100%)`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {step}
                      </span>
                      {i < FLOW_STEPS.length - 1 && (
                        <span className="text-gold/30 text-[10px]">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
