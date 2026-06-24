// app/aros/page.tsx
import type { Metadata } from 'next';
import ArosClient from './ArosClient';

export const metadata: Metadata = {
  title: 'Aros - Joyería Artesanal Pazziale',
  description: 'Descubre nuestra colección de aros artesanales, diseñados para realzar tu estilo con elegancia y sutileza. Hechos a mano en Chile.',
  keywords: 'aros artesanales, pendientes de plata, joyería Chile, aros de mujer, Pazziale',
  openGraph: {
    title: 'Aros Pazziale - Joyería Artesanal',
    description: 'Aros únicos hechos a mano con dedicación y amor por el arte joyero. Encuentra el par perfecto para cada ocasión.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Aros Pazziale - Joyería Artesanal',
      },
    ],
    url: 'https://www.pazziale.cl/aros',
    type: 'website',
    siteName: 'Pazziale',
    locale: 'es_CL',
  },
  alternates: {
    canonical: 'https://www.pazziale.cl/aros',
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
    title: 'Aros Pazziale - Joyería Artesanal',
    description: 'Descubre nuestra colección de aros hechos a mano en Chile.',
    images: ['/og-image.jpg'],
  },
};

export default function ArosPage() {
  return <ArosClient />;
}