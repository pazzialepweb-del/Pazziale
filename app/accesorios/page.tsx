// app/accesorios/page.tsx
import type { Metadata } from 'next';
import CategoriaClient from './CategoriaClient';

export const metadata: Metadata = {
  title: 'Accesorios - Joyería Artesanal Pazziale',
  description: 'Descubre nuestra colección de accesorios artesanales: prendedores, broches y más. Piezas únicas hechas a mano en Chile.',
  keywords: 'accesorios artesanales, prendedores, broches, joyería Chile, Pazziale',
  openGraph: {
    title: 'Accesorios Pazziale - Joyería Artesanal',
    description: 'Accesorios únicos hechos a mano con dedicación y amor por el arte joyero.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Accesorios Pazziale',
      },
    ],
    url: 'https://www.pazziale.cl/accesorios',
    type: 'website',
    siteName: 'Pazziale',
    locale: 'es_CL',
  },
  alternates: {
    canonical: 'https://www.pazziale.cl/accesorios',
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
    title: 'Accesorios Pazziale - Joyería Artesanal',
    description: 'Descubre nuestra colección de accesorios hechos a mano en Chile.',
    images: ['/og-image.jpg'],
  },
};

export default function AccesoriosPage() {
  return (
    <CategoriaClient
      categoria="Accesorios"
      titulo="Accesorios"
      descripcion="Descubre nuestra colección de accesorios artesanales, diseñados para complementar tu estilo con elegancia y sutileza."
    />
  );
}