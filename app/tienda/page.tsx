'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categoria: string;
}

export default function TiendaPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProductos();
  }, [categoriaSeleccionada]);

  async function fetchProductos() {
    try {
      setLoading(true);
      setError('');

      // Construir la URL con el filtro de categoría
      let url = '/api/productos';
      if (categoriaSeleccionada !== 'Todos') {
        url += `?categoria=${encodeURIComponent(categoriaSeleccionada)}`;
      }

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

  // Obtener categorías únicas
  const categorias = ['Todos', ...new Set(productos.map(p => p.categoria))];

  return (
    <div className="min-h-screen bg-[#1A2238] text-white">
      {/* Navbar */}
      <Navbar />

      {/* Contenido principal */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif mb-4">Nuestra <span className="text-[#EAA584]">Colección</span></h1>
            <p className="text-gray-300 max-w-2xl mx-auto font-light">
              Cada pieza está hecha a mano con dedicación y materiales de la más alta calidad.
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaSeleccionada(categoria)}
                className={`px-6 py-2 rounded-full transition-all ${
                  categoriaSeleccionada === categoria
                    ? 'bg-[#EAA584] text-[#1A2238]'
                    : 'border border-gray-600 hover:border-[#EAA584] hover:text-[#EAA584]'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>

          {/* Grid de productos */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 animate-spin text-[#EAA584]" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-12">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {productos.map((producto) => (
                <div key={producto.id} className="group">
                  <div className="aspect-square overflow-hidden rounded-lg bg-[#131A2A] border border-gray-700 mb-4 relative">
                    <img
                      src={producto.imagen_url}
                      alt={producto.nombre}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A2238] to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-full bg-[#EAA584] text-[#1A2238] py-2 rounded-lg font-medium hover:bg-white transition-colors flex items-center justify-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-serif mb-1">{producto.nombre}</h3>
                  <p className="text-gray-400 text-sm font-light mb-2">{producto.descripcion}</p>
                  <p className="text-[#EAA584] font-medium">${producto.precio.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
          
          {!loading && !error && productos.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No hay productos disponibles en esta categoría.
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F1523] py-16 border-t border-[#EAA584]/20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div>
             <h4 className="text-2xl font-serif text-[#EAA584] mb-4">Pazziale</h4>
             <p className="text-gray-400 text-sm">Orfebrería artesanal.</p>
          </div>
          <div>
            <h5 className="font-medium mb-4">Contacto</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>contacto@pazziale.cl</li>
              <li>+56 9 1234 5678</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-4">Enlaces</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-[#EAA584]">Inicio</a></li>
              <li><a href="/tienda" className="hover:text-[#EAA584]">Tienda</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}