import type { Metadata } from 'next';
import TechnologyClient from './TechnologyClient';

export const metadata: Metadata = {
  title: 'Technology – Viddara Technologies',
  description:
    'Exploring how human behavior influences decision-making and performance.',
};

export default function TechnologyPage() {
  return <TechnologyClient />;
}
