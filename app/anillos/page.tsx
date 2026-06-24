// app/anillos/page.tsx
import type { Metadata } from 'next';
import AnillosClient from './AnillosClient';

export const metadata: Metadata = {
  title: 'Anillos - Joyería Artesanal Pazziale',
  description: 'Descubre nuestra colección de anillos artesanales, diseñados para marcar momentos especiales con elegancia y distinción. Hechos a mano en Chile.',
  keywords: 'anillos artesanales, anillos de plata, joyería Chile, anillos de compromiso, Pazziale',
  openGraph: {
    title: 'Anillos Pazziale - Joyería Artesanal',
    description: 'Anillos únicos hechos a mano con dedicación y amor por el arte joyero. Encuentra el anillo perfecto para cada ocasión.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Anillos Pazziale - Joyería Artesanal',
      },
    ],
    url: 'https://www.pazziale.cl/anillos',
    type: 'website',
    siteName: 'Pazziale',
    locale: 'es_CL',
  },
  alternates: {
    canonical: 'https://www.pazziale.cl/anillos',
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
    title: 'Anillos Pazziale - Joyería Artesanal',
    description: 'Descubre nuestra colección de anillos hechos a mano en Chile.',
    images: ['/og-image.jpg'],
  },
};

export default function AnillosPage() {
  return <AnillosClient />;
}