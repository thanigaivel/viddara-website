import GoldDivider from './GoldDivider';

interface PageHeroProps {
  title: string;
  subtitle?: string;
}

export default function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <div className="bg-navy pt-36 pb-20 px-4 sm:px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl sm:text-5xl text-white mb-5 leading-tight">
          {title}
        </h1>
        <GoldDivider centered className="mb-6" />
        {subtitle && (
          <p className="text-white/65 text-lg leading-relaxed">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
