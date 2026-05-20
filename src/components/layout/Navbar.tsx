'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTransition, animated } from '@react-spring/web';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/technology', label: 'Technology' },
  { href: '/product', label: 'Product' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const prevScrolled = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 80;
      if (isScrolled !== prevScrolled.current) {
        prevScrolled.current = isScrolled;
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const transitions = useTransition(isOpen, {
    from: { opacity: 0, transform: 'translateY(-8px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(-8px)' },
    config: { tension: 320, friction: 28 },
  });

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-navy-dark/90 backdrop-blur-xl border-b border-gold/10 shadow-[0_4px_32px_-8px_rgba(0,0,0,0.6)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo + wordmark */}
          <Link href="/" className="group flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="Viddara"
              width={76}
              height={76}
              priority
              className="w-auto h-[76px] transition-opacity duration-300 group-hover:opacity-80"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-white/65 hover:text-white text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 group py-1"
              >
                {link.label}
                <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-gradient-to-r from-gold to-gold-light group-hover:w-full transition-all duration-300 ease-out" />
              </Link>
            ))}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-[5px] p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-px bg-white/80 transition-all duration-300 origin-center ${
                isOpen ? 'rotate-45 translate-y-[6px]' : ''
              }`}
            />
            <span
              className={`block w-5 h-px bg-white/80 transition-all duration-300 ${
                isOpen ? 'opacity-0 scale-x-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-px bg-white/80 transition-all duration-300 origin-center ${
                isOpen ? '-rotate-45 -translate-y-[6px]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {transitions((style, item) =>
        item ? (
          <animated.div
            style={style}
            className="md:hidden bg-navy-dark/95 backdrop-blur-xl border-t border-gold/10"
          >
            <div className="px-5 py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white text-[10px] tracking-[0.2em] uppercase transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </animated.div>
        ) : null
      )}
    </nav>
  );
}
