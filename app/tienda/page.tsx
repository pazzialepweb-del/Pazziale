import type { Metadata } from 'next';
import TiendaClient from './TiendaClient';

// ✅ Metadatos para SEO
export const metadata: Metadata = {
  title: 'Tienda - Joyería Artesanal Pazziale',
  description: 'Descubre nuestra colección de anillos, pulseras, collares y accesorios únicos, hechos a mano en Chile. Envíos a todo el país.',
  keywords: 'joyería artesanal, anillos de plata, pulseras hechas a mano, collares únicos, accesorios Chile, Pazziale',
  openGraph: {
    title: 'Tienda Pazziale - Joyería Artesanal',
    description: 'Encuentra la pieza perfecta para cada ocasión. Joyería hecha a mano con dedicación y amor por el arte joyero.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pazziale - Joyería Artesanal',
      },
    ],
    url: 'https://www.pazziale.cl/tienda',
    type: 'website',
    siteName: 'Pazziale',
    locale: 'es_CL',
  },
  alternates: {
    canonical: 'https://www.pazziale.cl/tienda',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tienda Pazziale - Joyería Artesanal',
    description: 'Descubre nuestra colección de joyería hecha a mano en Chile.',
    images: ['/og-image.jpg'],
  },
};

export default function TiendaPage() {

  return <TiendaClient />;
}