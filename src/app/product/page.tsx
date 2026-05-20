import type { Metadata } from 'next';
import ProductClient from './ProductClient';

export const metadata: Metadata = {
  title: 'Product – Viddara Technologies',
  description: 'MindTrade — a behavioral discipline platform designed for traders.',
};

export default function ProductPage() {
  return <ProductClient />;
}
