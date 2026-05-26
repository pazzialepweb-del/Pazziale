'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useCarrito } from '@/context/CarritoContext';
import { ShoppingCart, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categoria: string;
  stock: number;
}

export default function ProductoPage() {
  const params = useParams();
  const router = useRouter();
  const { agregarAlCarrito } = useCarrito();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [productosSimilares, setProductosSimilares] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const id = params.id as string;

  useEffect(() => {
    fetchProducto();
  }, [id]);

  async function fetchProducto() {
    try {
      setLoading(true);
      // 1. Obtener el producto actual
      const response = await fetch(
        `https://lcdhazkemkyktfrqjtka.supabase.co/rest/v1/productos?id=eq.${id}`,
        {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Error al cargar el producto');
      
      const data = await response.json();
      if (data.length === 0) {
        setError('Producto no encontrado');
      } else {
        const productoActual = data[0];
        setProducto(productoActual);
        
        // 2. Cargar productos similares con lógica de relleno
        await fetchProductosSimilares(productoActual);
      }
    } catch (error) {
      console.error('Error cargando producto:', error);
      setError('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  }

    async function fetchProductosSimilares(productoActual: Producto) {
    try {
      const SIMILAR_LIMIT = 4;
      // ✅ TIPADO EXPLÍCITO: Le decimos a TypeScript que será un array de Producto
      let allSimilars: Producto[] = [];

      // --- PASO 1: Buscar en la MISMA categoría ---
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

      // --- PASO 2: Si faltan productos, rellenar con OTRAS categorías ---
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
          // Combinamos los resultados (primero los de la misma categoría, luego los de otras)
          allSimilars = [...allSimilars, ...(otherData || [])];
        }
      }

      // --- PASO 3: Filtrado final para asegurar que no aparezca el producto actual ---
      // ✅ Ahora TypeScript sabe que 'allSimilars' contiene objetos 'Producto', por lo que 'p' se infiere correctamente
      setProductosSimilares(allSimilars.filter(p => p.id !== productoActual.id));

    } catch (error) {
      console.error('Error cargando productos similares:', error);
      // Si falla la carga de similares, simplemente no mostramos la sección
    }
  }

  const handleAgregarAlCarrito = () => {
    if (!producto) return;
    try {
      agregarAlCarrito({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen_url: producto.imagen_url
      });
      setMensajeExito(`✅ ${producto.nombre} agregado al carrito`);
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

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

  if (error || !producto) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] text-white">
        <Navbar />
        <div className="pt-32 px-6 text-center">
          <h1 className="text-3xl font-serif mb-4">Producto no encontrado</h1>
          <p className="text-gray-400 mb-6">El producto que buscas no existe o ha sido eliminado.</p>
          <Link 
            href="/tienda" 
            className="bg-[#EC4899] text-white px-6 py-2 rounded-full font-medium hover:bg-[#F59E0B] transition-colors"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      
      {/* Notificación de éxito flotante */}
      {mensajeExito && (
        <div className="fixed top-24 right-6 z-50 bg-[#2D2D2D] border border-[#F59E0B] text-white px-6 py-3 rounded-lg shadow-2xl animate-fade-in-up flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[#EC4899]" />
          <span>{mensajeExito}</span>
        </div>
      )}

      <div className="pt-32 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-[#EC4899] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Imagen del producto */}
          <div className="bg-[#2D2D2D] rounded-2xl overflow-hidden border border-[#F59E0B]/30 p-4">
            <div className="aspect-square rounded-xl overflow-hidden">
              <img 
                src={producto.imagen_url} 
                alt={producto.nombre} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Detalles del producto */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-serif mb-2">{producto.nombre}</h1>
            <p className="text-[#EC4899] text-2xl font-medium mb-4">${producto.precio.toLocaleString()}</p>
            
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${producto.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#EC4899]/10 text-[#EC4899] text-xs font-medium border border-[#EC4899]/30">
                {producto.categoria}
              </span>
            </div>

            <div className="border-t border-[#F59E0B]/30 my-4 pt-4">
              <h3 className="text-lg font-serif mb-2 text-[#F59E0B]">Descripción</h3>
              <p className="text-gray-400 leading-relaxed">
                {producto.descripcion}
              </p>
            </div>

            <button
              onClick={handleAgregarAlCarrito}
              disabled={producto.stock === 0}
              className={`mt-6 w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                producto.stock === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-[#EC4899] text-white hover:bg-[#F59E0B] shadow-lg shadow-[#EC4899]/30'
              }`}
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
        </div>

        {/* --- SECCIÓN DE PRODUCTOS SIMILARES (MEJORADA) --- */}
        {productosSimilares.length > 0 && (
          <div className="border-t border-[#F59E0B]/20 pt-12 mt-8">
            <h2 className="text-2xl md:text-3xl font-serif mb-8 text-center text-white">
              También te puede interesar
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {productosSimilares.map((similar) => (
                <Link
                  key={similar.id}
                  href={`/producto/${similar.id}`}
                  className="group bg-[#2D2D2D] p-3 rounded-lg border border-[#F59E0B]/30 hover:border-[#EC4899] transition-all duration-300 block"
                >
                  <div className="aspect-square overflow-hidden rounded-lg bg-[#1E1E1E] mb-3 relative">
                    <img
                      src={similar.imagen_url}
                      alt={similar.nombre}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {similar.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-red-400 font-medium border border-red-400 px-2 py-0.5 rounded-full text-[10px]">Agotado</span>
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-serif mb-1 line-clamp-1">{similar.nombre}</h4>
                  <p className="text-[#F59E0B] text-sm font-medium">${similar.precio.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="bg-[#1E1E1E] py-16 border-t border-[#EC4899]/20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div>
             <h4 className="text-2xl font-serif text-[#EC4899] mb-4">Pazziale</h4>
             <p className="text-gray-400 text-sm">Orfebrería artesanal. Diseño y fabricación propia con pasión.</p>
          </div>
          <div>
            <h5 className="font-medium mb-4 text-[#F59E0B]">Contacto</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>contacto@pazziale.cl</li>
              <li>+56 9 1234 5678</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-4 text-[#F59E0B]">Enlaces</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-[#EC4899] transition-colors">Inicio</a></li>
              <li><a href="/tienda" className="hover:text-[#EC4899] transition-colors">Tienda</a></li>
              <li><a href="/taller" className="hover:text-[#EC4899] transition-colors">El Taller</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}