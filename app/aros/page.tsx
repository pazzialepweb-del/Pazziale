'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingCart, Loader2, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useCarrito } from '@/context/CarritoContext';
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

export default function ArosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const { agregarAlCarrito } = useCarrito();

  // Categoría fija para esta página
  const CATEGORIA = 'Pendientes';

  useEffect(() => {
    fetchProductos();
  }, []);

  async function fetchProductos() {
    try {
      setLoading(true);
      setError('');

      // Construir la URL con el filtro de categoría fijo
      let url = `/api/productos?categoria=${encodeURIComponent(CATEGORIA)}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al cargar los productos');
      }

      const data = await response.json();
      setProductos(data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  const handleAgregarAlCarrito = (productoId: string, nombreProducto: string) => {
    try {
      const fullProducto = productos.find(p => p.id === productoId);
      if (fullProducto) {
        agregarAlCarrito({
          id: fullProducto.id,
          nombre: fullProducto.nombre,
          precio: fullProducto.precio,
          imagen_url: fullProducto.imagen_url
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

      {/* Notificación de éxito flotante */}
      {mensajeExito && (
        <div className="fixed top-24 right-6 z-50 bg-[#2D2D2D] border border-[#F59E0B] text-white px-6 py-3 rounded-lg shadow-2xl animate-fade-in-up flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[#EC4899]" />
          <span>{mensajeExito}</span>
        </div>
      )}

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif mb-4 text-white">Nuestros <span className="text-[#EC4899]">Aros</span></h1>
            <p className="text-gray-400 max-w-2xl mx-auto font-light">
              Descubre nuestra colección de aros artesanales, diseñados para realzar tu estilo con elegancia y sutileza.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 animate-spin text-[#EC4899]" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-12">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {productos.length > 0 ? (
                productos.map((producto) => (
                  <div key={producto.id} className="group bg-[#2D2D2D] p-4 rounded-xl border border-[#F59E0B]/30 hover:border-[#EC4899] transition-all duration-300">
                    <div className="aspect-square overflow-hidden rounded-lg bg-[#1E1E1E] mb-4 relative">
                      <img
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {producto.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-red-400 font-medium border border-red-400 px-3 py-1 rounded-full text-sm">Agotado</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-serif mb-1">{producto.nombre}</h3>
                    <p className="text-gray-400 text-sm font-light mb-2 line-clamp-1">{producto.descripcion}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <p className="text-[#F59E0B] font-medium">${producto.precio.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Stock: {producto.stock}</p>
                      </div>
                      <button
                        onClick={() => handleAgregarAlCarrito(producto.id, producto.nombre)}
                        disabled={producto.stock === 0}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors text-sm ${
                          producto.stock === 0
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-[#EC4899] text-white hover:bg-[#F59E0B]'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {producto.stock === 0 ? 'Sin stock' : 'Agregar'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400 py-12">
                  No hay aros disponibles en este momento. Vuelve pronto para ver nuevos diseños.
                </div>
              )}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/tienda" className="text-[#EC4899] hover:text-[#F59E0B] transition-colors">
              ← Volver a todas las categorías
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#1E1E1E] py-16 border-t border-[#EC4899]/20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div>
             <h4 className="text-2xl font-serif text-[#EC4899] mb-4">Pazziale</h4>
             <p className="text-gray-400 text-sm">Orfebrería artesanal.</p>
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
              <li><a href="/aros" className="hover:text-[#EC4899] transition-colors">Aros</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}