import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About – Viddara Technologies',
  description:
    'Focused on understanding and improving human decision behavior through technology.',
};

export default function AboutPage() {
  return <AboutClient />;
}
