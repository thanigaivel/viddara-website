'use client';

import { useSpring, animated } from '@react-spring/web';
import Link from 'next/link';
import { ReactNode } from 'react';

interface CTAButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  external?: boolean;
}

export default function CTAButton({
  href,
  onClick,
  variant = 'primary',
  children,
  external = false,
}: CTAButtonProps) {
  const [spring, api] = useSpring(() => ({
    scale: 1,
    config: { tension: 320, friction: 20 },
  }));

  const baseClasses =
    'inline-block text-sm font-semibold tracking-widest uppercase px-8 py-3.5 cursor-pointer select-none rounded-full transition-all duration-300';

  const variantClasses =
    variant === 'primary'
      ? 'bg-gradient-to-r from-[#DFCA8D] to-[#C8A54A] text-navy-dark shadow-[0_4px_20px_rgba(200,165,74,0.3)] border border-white/20'
      : 'glossy text-white hover:text-gold hover:border-gold/50';

  const inner = (
    <animated.span
      style={{ scale: spring.scale, display: 'inline-block' }}
      className={`${baseClasses} ${variantClasses}`}
      onMouseEnter={() => api.start({ scale: 1.04 })}
      onMouseLeave={() => api.start({ scale: 1 })}
      onMouseDown={() => api.start({ scale: 0.97 })}
      onMouseUp={() => api.start({ scale: 1.04 })}
    >
      {children}
    </animated.span>
  );

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {inner}
        </a>
      );
    }
    return <Link href={href}>{inner}</Link>;
  }

  return <button onClick={onClick}>{inner}</button>;
}
