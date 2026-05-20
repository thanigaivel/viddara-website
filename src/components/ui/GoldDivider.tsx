interface GoldDividerProps {
  className?: string;
  centered?: boolean;
}

export default function GoldDivider({ className = '', centered = false }: GoldDividerProps) {
  return (
    <div
      className={`h-px w-16 bg-gold ${centered ? 'mx-auto' : ''} ${className}`}
    />
  );
}
