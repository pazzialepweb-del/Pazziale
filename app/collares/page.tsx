// app/collares/page.tsx
import type { Metadata } from 'next';
import CollaresClient from './CollaresClient';

export const metadata: Metadata = {
  title: 'Collares - Joyería Artesanal Pazziale',
  description: 'Descubre nuestra colección de collares artesanales, piezas que realzan tu cuello con sofisticación y estilo único. Hechos a mano en Chile.',
  keywords: 'collares artesanales, joyería Chile, collares de plata, Pazziale, joyas únicas',
  openGraph: {
    title: 'Collares Pazziale - Joyería Artesanal',
    description: 'Collares únicos hechos a mano con dedicación y amor por el arte joyero. Encuentra el collar perfecto para cada ocasión.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Collares Pazziale - Joyería Artesanal',
      },
    ],
    url: 'https://www.pazziale.cl/collares',
    type: 'website',
    siteName: 'Pazziale',
    locale: 'es_CL',
  },
  alternates: {
    canonical: 'https://www.pazziale.cl/collares',
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
    title: 'Collares Pazziale - Joyería Artesanal',
    description: 'Descubre nuestra colección de collares hechos a mano en Chile.',
    images: ['/og-image.jpg'],
  },
};

export default function CollaresPage() {
  return <CollaresClient />;
}