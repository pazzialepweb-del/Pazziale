'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingCart, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useCarrito } from '@/context/CarritoContext';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_oferta?: number | null; // ✅ Nuevo campo opcional
  imagen_url: string;
  categoria: string;
  stock: number;
}

export default function TiendaPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const { agregarAlCarrito } = useCarrito();

  const categorias = ['Todos', 'Aros', 'Anillos', 'Pulseras', 'Collares', 'Accesorios'];

  useEffect(() => {
    fetchProductos();
  }, [categoriaSeleccionada]);

  async function fetchProductos() {
    try {
      setLoading(true);
      setError('');

      // Construir la URL con el filtro de categoría y paginación
      let url = '/api/productos?page=1&limit=12';
      if (categoriaSeleccionada !== 'Todos') {
        let categoriaApi = categoriaSeleccionada;
        if (categoriaSeleccionada === 'Aros') {
          categoriaApi = 'Pendientes';
        }
        url += `&categoria=${encodeURIComponent(categoriaApi)}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al cargar los productos');
      }

      const json = await response.json();
      
      // ✅ CORRECCIÓN: Leer la propiedad 'data' del objeto de respuesta
      setProductos(json.data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  const handleAgregarAlCarrito = (productoId: string, nombreProducto: string, precio: number) => {
    try {
      const fullProducto = productos.find(p => p.id === productoId);
      
      if (fullProducto) {
        agregarAlCarrito({
          id: fullProducto.id,
          nombre: fullProducto.nombre,
          precio: precio, // ✅ Usa el precio (oferta o normal) que se pasa como argumento
          imagen_url: fullProducto.imagen_url
        });
        
        setMensajeExito(`✅ ${nombreProducto} agregado al carrito`);
        setTimeout(() => setMensajeExito(null), 3000);
      } else {
        console.error('Producto no encontrado en la lista');
      }
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />

      {mensajeExito && (
        <div className="fixed top-24 right-6 z-50 bg-[#2D2D2D] border border-[#F59E0B] text-white px-6 py-3 rounded-lg shadow-2xl animate-fade-in-up flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[#EC4899]" />
          <span>{mensajeExito}</span>
        </div>
      )}

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif mb-4 text-white">Nuestra <span className="text-[#EC4899]">Colección</span></h1>
            <p className="text-gray-400 max-w-2xl mx-auto font-light">
              Cada pieza está hecha a mano con dedicación y materiales de la más alta calidad.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaSeleccionada(categoria)}
                className={`px-6 py-2 rounded-full transition-all ${
                  categoriaSeleccionada === categoria
                    ? 'bg-[#EC4899] text-white'
                    : 'border border-[#F59E0B]/50 text-gray-400 hover:border-[#EC4899] hover:text-[#EC4899]'
                }`}
              >
                {categoria}
              </button>
            ))}
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
              {productos.map((producto) => (
                <Link
                  key={producto.id}
                  href={`/producto/${producto.id}`}
                  className="group bg-[#2D2D2D] p-4 rounded-xl border border-[#F59E0B]/30 hover:border-[#EC4899] transition-all duration-300 block"
                >
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
                      {/* ✅ Lógica para mostrar precio con oferta */}
                      {producto.precio_oferta ? (
                        <>
                          <p className="text-gray-400 text-sm line-through">
                            ${producto.precio.toLocaleString()}
                          </p>
                          <p className="text-[#EC4899] font-medium">
                            ${producto.precio_oferta.toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <p className="text-[#F59E0B] font-medium">
                          ${producto.precio.toLocaleString()}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">Stock: {producto.stock}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        // ✅ Se pasa el precio de oferta si existe, o el normal si no
                        const precioACobrar = producto.precio_oferta ?? producto.precio;
                        handleAgregarAlCarrito(producto.id, producto.nombre, precioACobrar);
                      }}
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
                </Link>
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
              <li><a href="/taller" className="hover:text-[#EC4899] transition-colors">El Taller</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}