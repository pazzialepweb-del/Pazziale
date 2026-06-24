// app/producto/[id]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

interface PageProps {
  params: {
    id: string;
  };
}

// ✅ Metadatos dinámicos para SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;

  if (!id || id === 'undefined' || id === 'null') {
    return {
      title: 'Producto no encontrado - Pazziale',
      description: 'El producto que buscas no está disponible.',
      robots: { index: false },
    };
  }

  const { data: producto, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !producto) {
    return {
      title: 'Producto no encontrado - Pazziale',
      description: 'El producto que buscas no está disponible.',
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
      images: [{ url: producto.imagen_url, width: 600, height: 600, alt: producto.nombre }],
      url: `https://www.pazziale.cl/producto/${id}`,
      type: 'website',
      siteName: 'Pazziale',
      locale: 'es_CL',
    },
    alternates: { canonical: `https://www.pazziale.cl/producto/${id}` },
    robots: { index: true, follow: true },
    twitter: {
      card: 'summary_large_image',
      title: `${producto.nombre} - Pazziale`,
      description: producto.descripcion,
      images: [producto.imagen_url],
    },
    other: {
      'product:price': precio.toString(),
      'product:currency': 'CLP',
      'product:availability': producto.stock > 0 ? 'in stock' : 'out of stock',
    },
  };
}

// ✅ Página de producto (Server Component)
export default async function ProductoPage({ params }: PageProps) {
  const { id } = params;

  // Validación del ID
  if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
    notFound();
  }

  const { data: producto, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !producto) {
    notFound();
  }

  // ✅ Datos estructurados (JSON-LD) para el producto
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.nombre,
    description: producto.descripcion,
    image: producto.imagen_url,
    offers: {
      '@type': 'Offer',
      price: producto.precio_oferta ?? producto.precio,
      priceCurrency: 'CLP',
      availability: producto.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://www.pazziale.cl/producto/${id}`,
    },
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      {/* Breadcrumbs */}
      <div className="pt-32 px-4 md:px-8 max-w-6xl mx-auto">
        <Breadcrumbs
          items={[
            { label: 'Tienda', href: '/tienda' },
            { label: producto.categoria, href: `/${producto.categoria.toLowerCase()}` },
            { label: producto.nombre },
          ]}
          className="mb-4"
        />
      </div>

      <main className="pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        {/* Botón volver */}
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#EC4899] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a la tienda
        </Link>

        <article className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Imagen del producto */}
          <div className="bg-[#2D2D2D] rounded-2xl overflow-hidden border border-[#F59E0B]/30 p-4">
            <div className="aspect-square rounded-xl overflow-hidden relative">
              <Image
                src={producto.imagen_url}
                alt={`${producto.nombre} - Pazziale`}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
                unoptimized={producto.imagen_url.startsWith('http')}
              />
            </div>
          </div>

          {/* Detalles del producto */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-serif mb-2">{producto.nombre}</h1>

            {producto.precio_oferta ? (
              <div className="mb-4">
                <p className="text-gray-400 text-lg line-through">
                  ${producto.precio.toLocaleString()}
                </p>
                <p className="text-[#EC4899] text-3xl font-medium">
                  ${producto.precio_oferta.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-[#EC4899] text-2xl font-medium mb-4">
                ${producto.precio.toLocaleString()}
              </p>
            )}

            <div className="flex items-center gap-4 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  producto.stock > 0
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#EC4899]/10 text-[#EC4899] text-xs font-medium border border-[#EC4899]/30">
                {producto.categoria}
              </span>
            </div>

            <div className="border-t border-[#F59E0B]/30 my-4 pt-4">
              <h2 className="text-lg font-serif mb-2 text-[#F59E0B]">Descripción</h2>
              <p className="text-gray-400 leading-relaxed">{producto.descripcion}</p>
              {producto.dimensiones && (
                <div className="mt-3">
                  <span className="text-sm text-gray-400 block">Dimensiones:</span>
                  <p className="text-gray-300 text-sm">{producto.dimensiones}</p>
                </div>
              )}
            </div>

            {/* Botón Agregar al carrito (solo UI, sin funcionalidad real en servidor) */}
            <button
              disabled={producto.stock === 0}
              className={`mt-6 w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                producto.stock === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-[#EC4899] text-white hover:bg-[#F59E0B] shadow-lg shadow-[#EC4899]/30'
              }`}
              aria-label={`Agregar ${producto.nombre} al carrito`}
            >
              <ShoppingCart className="w-5 h-5" />
              {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>

            <Link
              href={`/tienda?categoria=${encodeURIComponent(producto.categoria)}`}
              className="mt-4 text-center text-sm text-gray-400 hover:text-[#EC4899] transition-colors"
            >
              Ver más productos en {producto.categoria}
            </Link>
          </div>
        </article>

        {/* Productos similares (opcional, puedes agregar lógica para obtenerlos) */}
        {/* ... */}
      </main>

      <Footer />
    </div>
  );
}