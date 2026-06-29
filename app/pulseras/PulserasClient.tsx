// app/pulseras/PulserasClient.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingCart, Loader2, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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
}

export default function PulserasClient() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const { items, agregarAlCarrito } = useCarrito();

  const CATEGORIA = 'Pulseras';

  useEffect(() => {
    fetchProductos();
  }, []);

  async function fetchProductos() {
    try {
      setLoading(true);
      setError('');
      const url = `/api/productos?categoria=${encodeURIComponent(CATEGORIA)}&page=1&limit=100`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al cargar los productos');
      const json = await response.json();
      setProductos(json.data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  const handleAgregarAlCarrito = (productoId: string, nombreProducto: string, precio: number, stockActual: number) => {
    try {
      const itemEnCarrito = items.find(item => item.id === productoId);
      const cantidadActual = itemEnCarrito ? itemEnCarrito.cantidad : 0;
      if (cantidadActual >= stockActual) {
        alert(`⚠️ Solo hay ${stockActual} unidades disponibles de "${nombreProducto}".`);
        return;
      }
      const fullProducto = productos.find(p => p.id === productoId);
      if (fullProducto) {
        agregarAlCarrito({
          id: fullProducto.id,
          nombre: fullProducto.nombre,
          precio: precio,
          imagen_url: fullProducto.imagen_url,
          stock: fullProducto.stock
        });
        setMensajeExito(`✅ ${nombreProducto} agregado al carrito`);
        setTimeout(() => setMensajeExito(null), 3000);
      }
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

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

      {/* Breadcrumbs */}
      <div className="pt-32 px-4 md:px-8 max-w-7xl mx-auto">
        <Breadcrumbs
          items={[
            { label: 'Tienda', href: '/tienda' },
            { label: 'Pulseras' }
          ]}
          className="mb-4"
        />
      </div>

      <main className="pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif mb-4 text-white">
              Nuestras <span className="text-[#EC4899]">Pulseras</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto font-light">
              Descubre nuestra colección de pulseras artesanales, detalles que envuelven tu estilo con delicadeza y sutileza.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64" role="status" aria-label="Cargando pulseras">
              <Loader2 className="w-12 h-12 animate-spin text-[#EC4899]" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-12" role="alert">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {productos.map((producto) => (
                <article
                  key={producto.id}
                  className="group bg-[#2D2D2D] p-4 rounded-xl border border-[#F59E0B]/30 hover:border-[#EC4899] transition-all duration-300"
                >
                  <Link href={`/producto/${producto.id}`} className="block">
                    <div className="aspect-square overflow-hidden rounded-lg bg-[#1E1E1E] mb-4 relative flex items-center justify-center">
                      <Image
                        src={producto.imagen_url}
                        alt={`${producto.nombre} - Pulsera Pazziale`}
                        width={400}
                        height={400}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                        unoptimized={producto.imagen_url.startsWith('http')}
                        loading="lazy"
                      />
                      {producto.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-red-400 font-medium border border-red-400 px-3 py-1 rounded-full text-sm">
                            Agotado
                          </span>
                        </div>
                      )}
                    </div>
                    <h2 className="text-lg font-serif mb-1">{producto.nombre}</h2>
                    <p className="text-gray-400 text-sm font-light mb-2 line-clamp-1">{producto.descripcion}</p>
                  </Link>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      {producto.precio_oferta ? (
                        <>
                          <p className="text-gray-400 text-sm line-through">${producto.precio.toLocaleString()}</p>
                          <p className="text-[#EC4899] font-medium">${producto.precio_oferta.toLocaleString()}</p>
                        </>
                      ) : (
                        <p className="text-[#F59E0B] font-medium">${producto.precio.toLocaleString()}</p>
                      )}
                      <p className="text-xs text-gray-500">Stock: {producto.stock}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const precioACobrar = producto.precio_oferta ?? producto.precio;
                        handleAgregarAlCarrito(producto.id, producto.nombre, precioACobrar, producto.stock);
                      }}
                      disabled={producto.stock === 0}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors text-sm ${
                        producto.stock === 0
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-[#EC4899] text-white hover:bg-[#F59E0B]'
                      }`}
                      aria-label={`Agregar ${producto.nombre} al carrito`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {producto.stock === 0 ? 'Sin stock' : 'Agregar'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/tienda"
              className="text-[#EC4899] hover:text-[#F59E0B] transition-colors"
            >
              ← Volver a todas las categorías
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}