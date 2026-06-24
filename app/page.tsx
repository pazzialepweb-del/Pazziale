// app/page.tsx
import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: {
    absolute: 'Pazziale - Joyería Artesanal Hecha a Mano en Chile',
  },
  description: 'Descubre Pazziale, joyería artesanal chilena. Anillos, pulseras, collares y aros únicos, hechos a mano con dedicación y amor por el arte joyero. Envíos a todo Chile.',
  keywords: 'joyería artesanal, orfebrería chilena, anillos de plata, joyas hechas a mano, Pazziale, joyería Chile, regalos originales',
  openGraph: {
    title: 'Pazziale - Joyería Artesanal Hecha a Mano en Chile',
    description: 'Orfebrería contemporánea que fusiona la tradición artesanal con el diseño moderno. Cada pieza es única, creada en nuestro taller con pasión y detalles minuciosos.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pazziale - Joyería Artesanal Hecha a Mano',
      },
    ],
    url: 'https://www.pazziale.cl',
    type: 'website',
    siteName: 'Pazziale',
    locale: 'es_CL',
  },
  alternates: {
    canonical: 'https://www.pazziale.cl',
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
    title: 'Pazziale - Joyería Artesanal Hecha a Mano',
    description: 'Descubre Pazziale, joyería artesanal chilena. Piezas únicas hechas con dedicación y amor por el arte joyero.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'mXfvn8Qfo71YYbo_qQbcPCiNUaMXgR08XjJUSSX4cWM',
  },
};

export default function HomePage() {
  // ✅ Datos estructurados JSON-LD para SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Pazziale",
    "url": "https://www.pazziale.cl",
    "description": "Joyería artesanal hecha a mano en Chile.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.pazziale.cl/tienda?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}