import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact – Viddara Technologies',
  description: 'Get in touch with Viddara Technologies.',
};

export default function ContactPage() {
  return <ContactClient />;
}
