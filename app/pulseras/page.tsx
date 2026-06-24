// app/pulseras/page.tsx
import type { Metadata } from 'next';
import PulserasClient from './PulserasClient';

export const metadata: Metadata = {
  title: 'Pulseras - Joyería Artesanal Pazziale',
  description: 'Descubre nuestra colección de pulseras artesanales, detalles que envuelven tu estilo con delicadeza y sutileza. Hechas a mano en Chile.',
  keywords: 'pulseras artesanales, joyería Chile, pulseras de plata, Pazziale, accesorios únicos',
  openGraph: {
    title: 'Pulseras Pazziale - Joyería Artesanal',
    description: 'Pulseras únicas hechas a mano con dedicación y amor por el arte joyero. Encuentra la pulsera perfecta para ti.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pulseras Pazziale - Joyería Artesanal',
      },
    ],
    url: 'https://www.pazziale.cl/pulseras',
    type: 'website',
    siteName: 'Pazziale',
    locale: 'es_CL',
  },
  alternates: {
    canonical: 'https://www.pazziale.cl/pulseras',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pulseras Pazziale - Joyería Artesanal',
    description: 'Descubre nuestra colección de pulseras hechas a mano en Chile.',
    images: ['/og-image.jpg'],
  },
};

export default function PulserasPage() {
  return <PulserasClient />;
}