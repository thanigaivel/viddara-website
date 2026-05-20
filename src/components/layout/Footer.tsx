'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NAV_LINKS = [
  { href: '/',            label: 'Home'       },
  { href: '/about',       label: 'About'      },
  { href: '/technology',  label: 'Technology' },
  { href: '/product',     label: 'Product'    },
  { href: '/contact',     label: 'Contact'    },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (!footerRef.current) return;

      gsap.set('.ft-brand',  { opacity: 0, y: 30 });
      gsap.set('.ft-rule',   { scaleX: 0 });
      gsap.set('.ft-col',    { opacity: 0, y: 22 });
      gsap.set('.ft-bottom', { opacity: 0 });

      gsap.timeline({
        scrollTrigger: { trigger: footerRef.current, start: 'top 94%', once: true },
        defaults: { ease: 'power3.out' },
      })
        .to('.ft-brand',  { opacity: 1, y: 0, duration: 0.9 })
        .to('.ft-rule',   { scaleX: 1, duration: 0.65, ease: 'power2.inOut', transformOrigin: 'center' }, '-=0.35')
        .to('.ft-col',    { opacity: 1, y: 0, duration: 0.7, stagger: 0.14 }, '-=0.35')
        .to('.ft-bottom', { opacity: 1, duration: 0.65 }, '-=0.2');
    };

    init();
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer ref={footerRef} className="relative overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #081F3F 0%, #051629 55%, #020811 100%)' }}>

      {/* ── Component-scoped styles ──────────────────────── */}
      <style>{`
        @keyframes ftShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .ft-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(200,165,74,0.12) 20%,
            rgba(200,165,74,0.5)  50%,
            rgba(200,165,74,0.12) 80%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: ftShimmer 5s ease-in-out infinite;
        }
        .ft-nav-link { position: relative; }
        .ft-nav-link::after {
          content: '';
          position: absolute;
          left: 0; bottom: -2px;
          height: 1px; width: 0;
          background: #C8A54A;
          transition: width 0.3s ease;
        }
        .ft-nav-link:hover::after { width: 100%; }
      `}</style>

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(200,165,74,0.75) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          opacity: 0.02,
        }} />

      {/* Shimmer top border */}
      <div className="ft-shimmer h-px w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Brand centerpiece ────────────────────────────── */}
        <div className="ft-brand py-14 flex flex-col items-center text-center">
          {/* Logo + wordmark */}
          <div className="flex items-center gap-4 mb-5">
            <div className="relative">
              {/* Subtle glow behind logo */}
              <div className="absolute inset-0 rounded-full blur-xl"
                style={{ background: 'rgba(200,165,74,0.12)', transform: 'scale(1.8)' }} />
              <Image
                src="/logo.png"
                alt="Viddara"
                width={44}
                height={44}
                className="relative w-auto h-11"
              />
            </div>
            <span
              className="font-serif text-2xl tracking-[0.06em]"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #e0d5b5 50%, #C8A54A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Viddara Technologies
            </span>
          </div>

          {/* Gold accent line */}
          <div className="h-px w-10 mb-4" style={{ background: 'rgba(200,165,74,0.45)' }} />

          <p className="text-[9.5px] tracking-[0.32em] uppercase font-medium"
            style={{ color: 'rgba(200,165,74,0.42)' }}>
            Behavioral Intelligence Systems
          </p>
        </div>

        {/* ── Horizontal separator (scales in) ─────────────── */}
        <div className="ft-rule h-px w-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)' }} />

        {/* ── Three columns ────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-14">

          {/* Col 1 — About */}
          <div className="ft-col">
            <h4 className="text-[9px] tracking-[0.3em] uppercase font-semibold mb-6"
              style={{ color: 'rgba(200,165,74,0.52)' }}>
              About
            </h4>
            <p className="text-sm leading-relaxed mb-5"
              style={{ color: 'rgba(255,255,255,0.42)' }}>
              Building behavioral intelligence technology to help individuals understand
              and improve their decision-making under pressure — across trading, learning,
              and professional environments.
            </p>
            <p className="text-xs tracking-wide" style={{ color: 'rgba(255,255,255,0.26)' }}>
              Tamil Nadu, India
            </p>
          </div>

          {/* Col 2 — Navigation */}
          <div className="ft-col">
            <h4 className="text-[9px] tracking-[0.3em] uppercase font-semibold mb-6"
              style={{ color: 'rgba(200,165,74,0.52)' }}>
              Explore
            </h4>
            <nav className="space-y-4">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="ft-nav-link block text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 w-fit"
                  style={{ color: 'rgba(255,255,255,0.46)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.82)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.46)')}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Contact + Product */}
          <div className="ft-col">
            <h4 className="text-[9px] tracking-[0.3em] uppercase font-semibold mb-6"
              style={{ color: 'rgba(200,165,74,0.52)' }}>
              Connect
            </h4>

            {/* Contact links */}
            <div className="space-y-3 mb-8">
              <a
                href="mailto:viddaratech@gmail.com"
                className="group flex items-center gap-3 transition-colors duration-200"
                style={{ color: 'rgba(255,255,255,0.46)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#C8A54A')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.46)')}
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(200,165,74,0.07)', border: '1px solid rgba(200,165,74,0.16)' }}>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="2.5"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 8l10 7 10-7"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="text-sm">viddaratech@gmail.com</span>
              </a>
              <a
                href="tel:+918939188855"
                className="group flex items-center gap-3 transition-colors duration-200"
                style={{ color: 'rgba(255,255,255,0.46)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#C8A54A')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.46)')}
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(200,165,74,0.07)', border: '1px solid rgba(200,165,74,0.16)' }}>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="text-sm">+91 89391 88855</span>
              </a>
            </div>

            {/* MindTrade product card */}
            <a
              href="https://mindtrade.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block rounded-xl p-4 overflow-hidden transition-all duration-400"
              style={{
                background: 'linear-gradient(135deg, rgba(200,165,74,0.06) 0%, rgba(200,165,74,0.02) 100%)',
                border: '1px solid rgba(200,165,74,0.13)',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'rgba(200,165,74,0.32)';
                el.style.boxShadow = '0 8px 30px -8px rgba(200,165,74,0.12)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'rgba(200,165,74,0.13)';
                el.style.boxShadow = 'none';
              }}
            >
              {/* Top shimmer */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(200,165,74,0.35), transparent)' }} />

              <p className="text-[9px] tracking-[0.26em] uppercase mb-2"
                style={{ color: 'rgba(200,165,74,0.42)' }}>
                Our Product
              </p>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.78)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLSpanElement).style.color = 'rgba(255,255,255,0.96)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLSpanElement).style.color = 'rgba(255,255,255,0.78)')}>
                  MindTrade
                </span>
                {/* Arrow icon */}
                <svg viewBox="0 0 12 12" className="w-3 h-3 flex-shrink-0 transition-colors duration-200"
                  style={{ color: 'rgba(200,165,74,0.5)' }}
                  fill="none"
                  onMouseEnter={e => ((e.currentTarget as SVGSVGElement).style.color = '#C8A54A')}
                >
                  <path d="M2 10L10 2M10 2H4M10 2V8"
                    stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Behavioral discipline for traders
              </p>
            </a>
          </div>

        </div>

        {/* ── Bottom bar ───────────────────────────────────── */}
        <div
          className="ft-bottom py-7 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-xs tracking-wide" style={{ color: 'rgba(255,255,255,0.24)' }}>
            © {year} Viddara Technologies Pvt. Ltd. · All rights reserved.
          </p>
          <p className="text-[10px] tracking-[0.22em] uppercase" style={{ color: 'rgba(255,255,255,0.16)' }}>
            Built for Performance
          </p>
        </div>

      </div>
    </footer>
  );
}
