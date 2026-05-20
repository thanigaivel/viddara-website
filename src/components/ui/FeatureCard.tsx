'use client';

import { useSpring, animated } from '@react-spring/web';

interface FeatureCardProps {
  title: string;
  description: string;
}

export default function FeatureCard({ title, description }: FeatureCardProps) {
  const [spring, api] = useSpring(() => ({
    transform: 'translateY(0px)',
    boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
    config: { tension: 300, friction: 30 },
  }));

  return (
    <animated.div
      style={spring}
      onMouseEnter={() =>
        api.start({
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 40px 0px rgba(200, 165, 74, 0.12)',
        })
      }
      onMouseLeave={() =>
        api.start({
          transform: 'translateY(0px)',
          boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
        })
      }
      className="glossy rounded-xl p-8 flex flex-col gap-3 cursor-default relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="w-8 h-px bg-gold mb-2 relative z-10" />
      <h3 className="font-serif text-white text-xl relative z-10">{title}</h3>
      <p className="text-white/70 text-sm leading-relaxed relative z-10">{description}</p>
    </animated.div>
  );
}
