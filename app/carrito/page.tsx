'use client';

import { useCarrito } from '@/context/CarritoContext';
import Navbar from '@/components/Navbar';
import { Trash2, Plus, Minus, ShoppingBag, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CarritoPage() {
  const { 
    items, 
    loading, 
    totalItems, 
    totalPrecio, 
    actualizarCantidad, 
    eliminarDelCarrito, 
    vaciarCarrito 
  } = useCarrito();

  const [hydrated, setHydrated] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Estado del formulario de checkout
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: ''
  });

  // Verificar usuario al cargar
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcesando(true);

    try {
      // Verificar que el usuario esté logueado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Validar que el formulario esté completo
      if (!form.nombre || !form.direccion || !form.telefono || !form.email) {
        alert('Por favor, completa todos los campos del formulario.');
        setProcesando(false);
        return;
      }

      // Crear el objeto con los items del carrito para guardar en JSON
      const itemsData = items.map(item => ({
        producto_id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
        imagen_url: item.imagen_url
      }));

      // Insertar el pedido en Supabase
      const { data, error } = await supabase
        .from('pedidos')
        .insert([{
          user_id: user.id,
          nombre_cliente: form.nombre,
          telefono_cliente: form.telefono,
          email_cliente: form.email,
          direccion_envio: form.direccion,
          total: totalPrecio,
          estado: 'verificando',
          items: itemsData // Guardamos los detalles de los productos
        }])
        .select();

      // 🔥 MEJORA: Mostrar el error real en la alerta
      if (error) {
        console.error('❌ Error completo de Supabase:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Error de Supabase: ${error.message} (Código: ${error.code})`);
      }

      // Vaciar el carrito después de crear el pedido
      vaciarCarrito();
      setCheckoutOpen(false);
      alert('🎉 ¡Pedido creado con éxito! Revisa el estado en tu perfil.');
      router.push('/perfil');

    } catch (error) {
      console.error('Error creando pedido:', error);
      alert(`❌ Error al procesar el pedido:\n\n${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setProcesando(false);
    }
  };

  if (loading || !hydrated) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] text-white">
        <Navbar />
        <div className="pt-32 px-6 text-center">
          <p className="text-gray-400">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] text-white">
        <Navbar />
        <div className="pt-32 px-6 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-[#EC4899] mb-4" />
          <h1 className="text-3xl font-serif mb-2">Tu carrito está vacío</h1>
          <p className="text-gray-400 mb-6">Explora nuestra colección y encuentra tu próxima joya.</p>
          <Link 
            href="/tienda" 
            className="bg-[#EC4899] text-white px-8 py-3 rounded-full font-medium hover:bg-[#F59E0B] transition-colors inline-block"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white pb-20">
      <Navbar />
      
      <div className="pt-32 px-4 md:px-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif mb-8">Mi Carrito</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lista de productos */}
          <div className="flex-1">
            <div className="space-y-4">
              {items.map((item) => {
                const nombre = item.nombre || 'Producto sin nombre';
                const precio = typeof item.precio === 'number' && !isNaN(item.precio) 
                  ? item.precio 
                  : 0;
                const imagenUrl = item.imagen_url || '';

                return (
                  <div 
                    key={item.id} 
                    className="bg-[#2D2D2D] p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between border border-[#F59E0B]/30 hover:border-[#EC4899] transition-colors"
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-[#1E1E1E] border border-[#F59E0B]/30 flex items-center justify-center">
                        {imagenUrl ? (
                          <img 
                            src={imagenUrl} 
                            alt={nombre} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 text-xs text-center p-2">Sin imagen</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-lg truncate">{nombre}</h3>
                        <p className="text-[#EC4899] font-medium">
                          {precio > 0 
                            ? `$${precio.toLocaleString()}`
                            : 'Precio no disponible'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                      <div className="flex items-center gap-2 bg-[#1E1E1E] rounded-lg px-2 py-1">
                        <button 
                          onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                          className="p-1 hover:text-[#EC4899] transition-colors"
                          disabled={item.cantidad <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.cantidad}</span>
                        <button 
                          onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                          className="p-1 hover:text-[#EC4899] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => eliminarDelCarrito(item.id)}
                        className="text-red-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:w-96">
            <div className="bg-[#2D2D2D] p-6 rounded-lg border border-[#F59E0B]/30 sticky top-24">
              <h2 className="text-2xl font-serif mb-4">Resumen</h2>
              <div className="space-y-3 text-gray-400">
                <div className="flex justify-between">
                  <span>Productos ({totalItems})</span>
                  <span>${totalPrecio.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>Calculado al pagar</span>
                </div>
                <div className="border-t border-[#F59E0B]/30 my-4 pt-4">
                  <div className="flex justify-between text-xl text-white font-medium">
                    <span>Total</span>
                    <span>${totalPrecio.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (!user) {
                    router.push('/auth/login');
                    return;
                  }
                  setCheckoutOpen(true);
                }}
                className="w-full bg-[#EC4899] text-white py-3 rounded-lg font-medium hover:bg-[#F59E0B] transition-colors mt-4"
              >
                Finalizar compra
              </button>
              
              <button 
                onClick={vaciarCarrito}
                className="w-full border border-red-400 text-red-400 py-2 rounded-lg font-medium hover:bg-red-400 hover:text-white transition-colors mt-2 text-sm"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL DE CHECKOUT --- */}
      {checkoutOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] border border-[#EC4899]/30 rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl">
            <button
              onClick={() => setCheckoutOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-serif mb-6 text-white">Finalizar Compra</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Formulario de datos del cliente */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-[#F59E0B]">Datos de envío</h3>
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Nombre completo</label>
                    <input
                      type="text"
                      value={form.nombre}
                      onChange={(e) => setForm({...form, nombre: e.target.value})}
                      className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Dirección</label>
                    <input
                      type="text"
                      value={form.direccion}
                      onChange={(e) => setForm({...form, direccion: e.target.value})}
                      className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Teléfono</label>
                    <input
                      type="tel"
                      value={form.telefono}
                      onChange={(e) => setForm({...form, telefono: e.target.value})}
                      className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Correo electrónico</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={procesando}
                    className="w-full bg-[#EC4899] text-white py-3 rounded-lg font-medium hover:bg-[#F59E0B] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {procesando ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Procesando...
                      </>
                    ) : 'Confirmar pedido'}
                  </button>
                </form>
              </div>

              {/* Información de transferencia */}
              <div className="bg-[#2D2D2D] p-6 rounded-lg border border-[#F59E0B]/30">
                <h3 className="text-lg font-medium mb-4 text-[#F59E0B]">Datos de transferencia</h3>
                <div className="space-y-3 text-gray-300 text-sm">
                  <p><span className="font-medium text-white">Banco:</span> Banco Estado</p>
                  <p><span className="font-medium text-white">Titular:</span> Pazziale Joyería SpA</p>
                  <p><span className="font-medium text-white">RUT:</span> 76.123.456-7</p>
                  <p><span className="font-medium text-white">Cuenta Corriente:</span> 123456789</p>
                  <p><span className="font-medium text-white">Correo:</span> contacto@pazziale.cl</p>
                  <div className="border-t border-[#F59E0B]/30 my-4 pt-4">
                    <p className="text-xs text-gray-400">
                      * Realiza la transferencia y luego confirma el pedido. Una vez verificado el pago, actualizaremos el estado de tu pedido.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}