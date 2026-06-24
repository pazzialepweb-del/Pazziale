// app/taller/page.tsx
import type { Metadata } from 'next';
import TallerClient from './TallerClient';

export const metadata: Metadata = {
  title: 'El Taller - Orfebrería Artesanal Pazziale',
  description: 'Conoce el taller de Pazziale, donde el fuego, la plata y el cobre se funden para crear joyas únicas. Proceso artesanal, diseño exclusivo y pasión por la orfebrería.',
  keywords: 'taller de orfebrería, joyería artesanal, proceso de creación, Pazziale, taller joyero Chile',
  openGraph: {
    title: 'El Taller Pazziale - Orfebrería Artesanal',
    description: 'Descubre el corazón de Pazziale: un taller donde cada joya es creada a mano con dedicación y amor por el oficio.',
    images: [
      {
        url: '/og-taller.jpg',
        width: 1200,
        height: 630,
        alt: 'Taller de orfebrería Pazziale',
      },
    ],
    url: 'https://www.pazziale.cl/taller',
    type: 'website',
    siteName: 'Pazziale',
    locale: 'es_CL',
  },
  alternates: {
    canonical: 'https://www.pazziale.cl/taller',
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Taller Pazziale - Orfebrería Artesanal',
    description: 'Conoce el proceso creativo detrás de cada joya Pazziale.',
    images: ['/og-taller.jpg'],
  },
};

// ✅ Datos estructurados para la página del taller
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "El Taller Pazziale",
  "description": "Taller de orfebrería artesanal donde se crean joyas únicas a mano.",
  "url": "https://www.pazziale.cl/taller",
  "image": "/og-taller.jpg",
  "mainEntity": {
    "@type": "Organization",
    "name": "Pazziale",
    "description": "Orfebrería artesanal chilena",
    "url": "https://www.pazziale.cl",
    "logo": "https://www.pazziale.cl/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+56-9-3665-9341",
      "contactType": "customer service",
      "availableLanguage": ["Spanish"]
    }
  }
};

export default function TallerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TallerClient />
    </>
  );
}