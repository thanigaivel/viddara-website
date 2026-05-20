'use client';

import { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CTAButton from '@/components/ui/CTAButton';
import GoldDivider from '@/components/ui/GoldDivider';

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });

export default function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runAnimations = async () => {
      const { gsap } = await import('gsap');

      // Ambient orbs float animation
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          y: -30,
          x: 20,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          y: 25,
          x: -15,
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 2,
        });
      }

      // Staggered entrance animations
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 20, letterSpacing: '0.5em' },
        { opacity: 1, y: 0, letterSpacing: '0.25em', duration: 0.8 }
      )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 40, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1.0 },
          '-=0.3'
        )
        .fromTo(
          '.hero-divider',
          { opacity: 0, scaleX: 0 },
          { opacity: 1, scaleX: 1, duration: 0.6, transformOrigin: 'center' },
          '-=0.4'
        )
        .fromTo(
          subtextRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.2'
        )
        .fromTo(
          buttonsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.4'
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          '-=0.2'
        );
    };

    runAnimations();
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-navy-darker overflow-hidden">
      {/* Three.js background */}
      <div className="absolute inset-0 w-full h-full">
        <HeroCanvas />
      </div>

      {/* Ambient glow orbs */}
      <div
        ref={orb1Ref}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(42,82,152,0.35) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,165,74,0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Top & bottom fade overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-darker/80 via-transparent to-navy/95 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-darker/35 via-transparent to-navy-darker/35 pointer-events-none" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-20"
      >
        {/* Eyebrow tagline */}
        <p
          ref={taglineRef}
          className="text-gold text-[10px] sm:text-xs tracking-[0.25em] uppercase font-semibold mb-6"
          style={{ opacity: 0 }}
        >
          Behavioral Intelligence Technology
        </p>

        {/* Main headline — NO char split, no wrapping issues */}
        <h1
          ref={headlineRef}
          className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6 pb-2"
          style={{ opacity: 0 }}
        >
          <span
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #a8c5f0 45%, #C8A54A 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'textShimmer 6s linear infinite',
              display: 'inline',
            }}
          >
            Building Technology
          </span>
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #a8c5f0 0%, #ffffff 40%, #DFCA8D 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'textShimmer 6s linear infinite 1s',
              display: 'inline',
            }}
          >
            to Improve Human
          </span>
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #C8A54A 0%, #DFCA8D 50%, #ffffff 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'textShimmer 6s linear infinite 2s',
              display: 'inline',
            }}
          >
            Decision Discipline
          </span>
        </h1>

        <div className="hero-divider" style={{ opacity: 0 }}>
          <GoldDivider centered className="mb-7" />
        </div>

        <p
          ref={subtextRef}
          className="text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10"
          style={{ opacity: 0 }}
        >
          Viddara Technologies develops behavioral intelligence systems designed
          to analyze and improve decision patterns in high-pressure environments.
        </p>

        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row gap-4 justify-center"
          style={{ opacity: 0 }}
        >
          <CTAButton href="https://mindtrade.in" external variant="primary">
            Explore MindTrade
          </CTAButton>
          <CTAButton href="/about" variant="secondary">
            Learn More
          </CTAButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: 0 }}
      >
        <span className="text-white/30 text-[9px] tracking-[0.2em] uppercase mb-2">Scroll</span>
        <div className="relative w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
          <div
            className="w-1 h-1.5 bg-gold rounded-full"
            style={{ animation: 'scrollPulse 2s ease-in-out infinite' }}
          />
        </div>
      </div>
    </div>
  );
}
