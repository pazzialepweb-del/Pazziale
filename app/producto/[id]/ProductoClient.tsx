'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCarrito } from '@/context/CarritoContext';
import Breadcrumbs from '@/components/Breadcrumbs';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_oferta?: number | null;
  imagen_url: string;
  categoria: string;
  stock: number;
  dimensiones: string;
}

interface ProductoClientProps {
  productoInicial: Producto | null;
  id: string;
}

export default function ProductoClient({ productoInicial, id }: ProductoClientProps) {
  const router = useRouter();
  const { agregarAlCarrito } = useCarrito();

  const [producto, setProducto] = useState<Producto | null>(productoInicial);
  const [productosSimilares, setProductosSimilares] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(!productoInicial);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Si no se pasó producto inicial, lo cargamos (por si se accede directamente)
  useEffect(() => {
    if (!productoInicial) {
      fetchProducto();
    } else {
      // Si ya tenemos producto, cargamos similares igual
      fetchProductosSimilares(productoInicial);
    }
  }, [id, productoInicial]);

  async function fetchProducto() {
    try {
      setLoading(true);
      setError('');

      const encodedId = encodeURIComponent(id);
      const url = `https://lcdhazkemkyktfrqjtka.supabase.co/rest/v1/productos?id=eq.${encodedId}`;

      const response = await fetch(url, {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
        }
      });

      if (!response.ok) {
        let errorText = '';
        try {
          const errorJson = await response.json();
          errorText = errorJson.message || errorJson.error || response.statusText;
        } catch {
          errorText = response.statusText || 'Error desconocido';
        }
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.length === 0) {
        setError('Producto no encontrado');
        setProducto(null);
      } else {
        const productoActual = data[0];
        setProducto(productoActual);
        await fetchProductosSimilares(productoActual);
      }
    } catch (error) {
      console.error('❌ [Cliente] Error cargando producto:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar el producto');
      setProducto(null);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProductosSimilares(productoActual: Producto) {
    try {
      const SIMILAR_LIMIT = 4;
      let allSimilars: Producto[] = [];

      const sameCatUrl = `https://lcdhazkemkyktfrqjtka.supabase.co/rest/v1/productos?categoria=eq.${encodeURIComponent(productoActual.categoria)}&id=neq.${productoActual.id}&limit=${SIMILAR_LIMIT}`;
      const sameCatResponse = await fetch(sameCatUrl, {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
        }
      });
      if (!sameCatResponse.ok) throw new Error('Error al cargar productos similares');
      const sameCatData = await sameCatResponse.json();
      allSimilars = sameCatData || [];

      if (allSimilars.length < SIMILAR_LIMIT) {
        const needed = SIMILAR_LIMIT - allSimilars.length;
        const otherUrl = `https://lcdhazkemkyktfrqjtka.supabase.co/rest/v1/productos?categoria=neq.${encodeURIComponent(productoActual.categoria)}&id=neq.${productoActual.id}&limit=${needed}`;
        const otherResponse = await fetch(otherUrl, {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
          }
        });
        if (otherResponse.ok) {
          const otherData = await otherResponse.json();
          allSimilars = [...allSimilars, ...(otherData || [])];
        }
      }

      setProductosSimilares(allSimilars.filter(p => p.id !== productoActual.id));
    } catch (error) {
      console.error('Error cargando productos similares:', error);
    }
  }

  const handleAgregarAlCarrito = () => {
    if (!producto) return;
    try {
      const precioFinal = producto.precio_oferta ?? producto.precio;
      agregarAlCarrito({
        id: producto.id,
        nombre: producto.nombre,
        precio: precioFinal,
        imagen_url: producto.imagen_url,
        stock: producto.stock
      });
      setMensajeExito(`✅ ${producto.nombre} agregado al carrito`);
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  // ⏳ Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] text-white">
        <Navbar />
        <div className="pt-32 px-6 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#EC4899] mx-auto" />
          <p className="mt-4 text-gray-400">Cargando producto...</p>
        </div>
      </div>
    );
  }

  // ❌ Error o producto no encontrado
  if (error || !producto) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] text-white">
        <Navbar />
        <div className="pt-32 px-6 text-center">
          <h1 className="text-3xl font-serif mb-4">Producto no encontrado</h1>
          <p className="text-gray-400 mb-6">{error || 'El producto que buscas no existe o ha sido eliminado.'}</p>
          <Link href="/tienda" className="bg-[#EC4899] text-white px-6 py-2 rounded-full font-medium hover:bg-[#F59E0B] transition-colors">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Producto cargado correctamente
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />

      {mensajeExito && (
        <div
          className="fixed top-24 right-6 z-50 bg-[#2D2D2D] border border-[#F59E0B] text-white px-6 py-3 rounded-lg shadow-2xl animate-fade-in-up flex items-center gap-2"
          role="alert"
          aria-live="polite"
        >
          <CheckCircle className="w-5 h-5 text-[#EC4899]" />
          <span>{mensajeExito}</span>
        </div>
      )}

      <div className="pt-32 px-4 md:px-8 max-w-6xl mx-auto">
        <Breadcrumbs
          items={[
            { label: 'Tienda', href: '/tienda' },
            { label: producto.categoria, href: `/${producto.categoria.toLowerCase()}` },
            { label: producto.nombre }
          ]}
          className="mb-4"
        />
      </div>

      <main className="pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-[#EC4899] transition-colors mb-6"
          aria-label="Volver atrás"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <article className="grid md:grid-cols-2 gap-12 mb-16">
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

          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-serif mb-2">{producto.nombre}</h1>

            {producto.precio_oferta ? (
              <div className="mb-4">
                <p className="text-gray-400 text-lg line-through">${producto.precio.toLocaleString()}</p>
                <p className="text-[#EC4899] text-3xl font-medium">${producto.precio_oferta.toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-[#EC4899] text-2xl font-medium mb-4">${producto.precio.toLocaleString()}</p>
            )}

            <div className="flex items-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${producto.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
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

            <button
              onClick={handleAgregarAlCarrito}
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

        {productosSimilares.length > 0 && (
          <section className="border-t border-[#F59E0B]/20 pt-12 mt-8">
            <h2 className="text-2xl md:text-3xl font-serif mb-8 text-center text-white">También te puede interesar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {productosSimilares.map((similar) => (
                <Link
                  key={similar.id}
                  href={`/producto/${similar.id}`}
                  className="group bg-[#2D2D2D] p-3 rounded-lg border border-[#F59E0B]/30 hover:border-[#EC4899] transition-all duration-300 block"
                >
                  <div className="aspect-square overflow-hidden rounded-lg bg-[#1E1E1E] mb-3 relative">
                    <Image
                      src={similar.imagen_url}
                      alt={`${similar.nombre} - Pazziale`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized={similar.imagen_url.startsWith('http')}
                      loading="lazy"
                    />
                    {similar.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-red-400 font-medium border border-red-400 px-2 py-0.5 rounded-full text-[10px]">
                          Agotado
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-serif mb-1 line-clamp-1">{similar.nombre}</h3>
                  <div className="text-sm">
                    {similar.precio_oferta ? (
                      <>
                        <span className="text-gray-400 text-xs line-through">${similar.precio.toLocaleString()}</span>
                        <span className="text-[#F59E0B] font-medium ml-1">${similar.precio_oferta.toLocaleString()}</span>
                      </>
                    ) : (
                      <span className="text-[#F59E0B] font-medium">${similar.precio.toLocaleString()}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}