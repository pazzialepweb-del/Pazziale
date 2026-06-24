// app/producto/[id]/page.tsx
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProductoClient from './ProductoClient';

interface PageProps {
  params: {
    id: string;
  };
}

// ✅ Metadatos dinámicos para SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;

  const { data: producto, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !producto) {
    return {
      title: 'Producto no encontrado - Pazziale',
      description: 'El producto que buscas no está disponible en nuestra tienda.',
      robots: { index: false },
    };
  }

  const precio = producto.precio_oferta ?? producto.precio;

  return {
    title: `${producto.nombre} - Pazziale`,
    description: producto.descripcion,
    keywords: `${producto.nombre}, joyería artesanal, ${producto.categoria}, Pazziale`,
    openGraph: {
      title: `${producto.nombre} - Pazziale`,
      description: producto.descripcion,
      images: [
        {
          url: producto.imagen_url,
          width: 600,
          height: 600,
          alt: producto.nombre,
        },
      ],
      url: `https://www.pazziale.cl/producto/${id}`,
      type: 'website', // ✅ CAMBIADO DE 'product' A 'website'
      siteName: 'Pazziale',
      locale: 'es_CL',
    },
    alternates: {
      canonical: `https://www.pazziale.cl/producto/${id}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: `${producto.nombre} - Pazziale`,
      description: producto.descripcion,
      images: [producto.imagen_url],
    },
    // Datos adicionales para Google Shopping (opcional)
    other: {
      'product:price': precio.toString(),
      'product:currency': 'CLP',
      'product:availability': producto.stock > 0 ? 'in stock' : 'out of stock',
    },
  };
}

export default async function ProductoPage({ params }: PageProps) {
  const { id } = params;

  const { data: producto, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single();

  const productoInicial = error ? null : producto;

  return <ProductoClient productoInicial={productoInicial} id={id} />;
}