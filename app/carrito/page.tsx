'use client';

import { useCarrito } from '@/context/CarritoContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Trash2, Minus, ShoppingBag, X, Loader2 } from 'lucide-react';
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

  // 🚚 Estado para el envío
  const [shippingOption, setShippingOption] = useState<'starken' | 'chilexpress' | null>(null);
  const starkenCost = 5000;
  const [chilexpressCost, setChilexpressCost] = useState<number | null>(null);
  const [cotizando, setCotizando] = useState(false);
  const [cotizacionError, setCotizacionError] = useState<string | null>(null);

  // Peso fijo por producto: 500 gramos = 0.5 kg
  const PESO_PRODUCTO_KG = 0.5;

  // Calcular peso total en kg
  const pesoTotal = items.reduce((acc, item) => acc + PESO_PRODUCTO_KG * item.cantidad, 0);

  const shippingCost = shippingOption === 'starken' ? starkenCost : (shippingOption === 'chilexpress' ? (chilexpressCost || 0) : 0);
  const totalConEnvio = totalPrecio + shippingCost;

  const [hydrated, setHydrated] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: ''
  });

  const [destinoCodigo, setDestinoCodigo] = useState('PROV'); // Código de comuna destino

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

  // Efecto para cotizar Chilexpress cuando se selecciona, cambia el destino o cambia el carrito (peso)
  useEffect(() => {
    const cotizarChilexpress = async () => {
      if (shippingOption !== 'chilexpress') {
        setChilexpressCost(null);
        setCotizacionError(null);
        return;
      }

      if (items.length === 0 || pesoTotal === 0) {
        setChilexpressCost(null);
        setCotizacionError(null);
        return;
      }

      setCotizando(true);
      setCotizacionError(null);
      try {
        // Llamada a nuestra API Route /api/chilexpress
        const res = await fetch('/api/chilexpress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            originCountyCode: 'STGO',        // Origen fijo: Santiago
            destinationCountyCode: destinoCodigo, // Comuna destino
            weight: pesoTotal.toString(),    // Peso en kg (puede tener decimales)
            height: '1',
            width: '1',
            length: '1',
            productType: 3,
            contentType: 1,
            declaredWorth: totalPrecio.toString(),
            deliveryTime: 0,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Error al cotizar envío');
        }

        const data = await res.json();
        // La API puede devolver el costo en diferentes campos; ajustamos según lo que retorne tu route
        const costo = data.rate || data.total || data.price || data.costo || null;
        if (costo && costo > 0) {
          setChilexpressCost(costo);
        } else {
          throw new Error('No se obtuvo costo de envío');
        }
      } catch (error: any) {
        console.error('Error cotizando Chilexpress:', error);
        setCotizacionError(error.message || 'Error al obtener cotización');
        setChilexpressCost(null);
      } finally {
        setCotizando(false);
      }
    };

    cotizarChilexpress();
  }, [shippingOption, destinoCodigo, items, pesoTotal, totalPrecio]);

  const handleMercadoPagoCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcesando(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      if (!form.nombre || !form.direccion || !form.telefono || !form.email) {
        alert('Por favor, completa todos los datos de envío.');
        setProcesando(false);
        return;
      }

      if (!shippingOption) {
        alert('Por favor, selecciona un método de envío.');
        setProcesando(false);
        return;
      }

      if (shippingOption === 'chilexpress' && (chilexpressCost === null || chilexpressCost === 0)) {
        alert('El costo de envío por Chilexpress aún no está disponible. Intenta de nuevo.');
        setProcesando(false);
        return;
      }

      const itemsData = items.map(item => ({
        producto_id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
        imagen_url: item.imagen_url
      }));

      const externalRef = `pedido_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

      const { data: pedidoData, error } = await supabase
        .from('pedidos')
        .insert([{
          user_id: user.id,
          nombre_cliente: form.nombre,
          telefono_cliente: form.telefono,
          email_cliente: form.email,
          direccion_envio: form.direccion,
          total: totalConEnvio,
          estado: 'verificando',
          items: itemsData,
          external_reference: externalRef
        }])
        .select();

      if (error) {
        console.error('❌ Error de Supabase al crear pedido:', error);
        throw new Error(`Error al crear el pedido: ${error.message}`);
      }

      vaciarCarrito();
      setCheckoutOpen(false);

      const mpItems = items.map(item => ({
        id: item.id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio,
        imagen_url: item.imagen_url,
      }));

      mpItems.push({
        id: 'shipping',
        nombre: `Envío ${shippingOption === 'starken' ? 'Starken' : 'Chilexpress'}`,
        cantidad: 1,
        precio: shippingCost,
        imagen_url: '',
      });

      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          external_reference: externalRef,
          items: mpItems,
          payer: {
            nombre: form.nombre,
            email: form.email,
            telefono: form.telefono,
          },
          total: totalConEnvio,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la preferencia de pago');
      }

      const preference = await response.json();

      if (preference.init_point) {
        window.location.href = preference.init_point;
      } else if (preference.sandbox_init_point) {
        window.location.href = preference.sandbox_init_point;
      } else {
        throw new Error('No se pudo obtener el enlace de pago');
      }

    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert(`❌ Error al procesar el pago:\n\n${error instanceof Error ? error.message : 'Error desconocido'}`);
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
                        <p className="text-xs text-gray-500">Peso: ~0.5 kg c/u</p>
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

                <div className="flex justify-between text-sm">
                  <span>Peso total aproximado</span>
                  <span>{pesoTotal.toFixed(2)} kg</span>
                </div>

                {/* ✅ Selector de Envío */}
                <div className="border-t border-[#F59E0B]/30 my-4 pt-4">
                  <p className="text-sm font-medium mb-2 text-[#F59E0B]">Método de envío:</p>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors text-gray-400">
                      <input
                        type="radio"
                        name="shipping"
                        value="starken"
                        checked={shippingOption === 'starken'}
                        onChange={() => setShippingOption('starken')}
                        className="accent-[#EC4899]"
                      />
                      Starken (Talca a todo Chile) - ${starkenCost.toLocaleString()}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors text-gray-400">
                      <input
                        type="radio"
                        name="shipping"
                        value="chilexpress"
                        checked={shippingOption === 'chilexpress'}
                        onChange={() => setShippingOption('chilexpress')}
                        className="accent-[#EC4899]"
                      />
                      Chilexpress (cotización en tiempo real)
                      {cotizando && <Loader2 className="w-4 h-4 animate-spin inline ml-1" />}
                      {shippingOption === 'chilexpress' && !cotizando && chilexpressCost !== null && (
                        <span className="text-white ml-1">- ${chilexpressCost.toLocaleString()}</span>
                      )}
                      {cotizacionError && <span className="text-red-400 text-xs ml-1">{cotizacionError}</span>}
                    </label>
                  </div>
                  {/* Si quieres permitir al usuario seleccionar comuna destino (para Chilexpress) */}
                  {shippingOption === 'chilexpress' && (
                    <div className="mt-2">
                      <label className="text-xs text-gray-400">Código de comuna destino:</label>
                      <input
                        type="text"
                        value={destinoCodigo}
                        onChange={(e) => setDestinoCodigo(e.target.value.toUpperCase())}
                        className="w-full p-1 rounded bg-[#1E1E1E] border border-gray-600 text-white text-sm mt-1"
                        placeholder="Ej: PROV"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">Ingresa el código de comuna de destino (ej: PROV, SCL, etc.)</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>
                    {shippingOption 
                      ? `$${shippingCost.toLocaleString()}` 
                      : 'Selecciona uno'}
                  </span>
                </div>

                <div className="border-t border-[#F59E0B]/30 my-4 pt-4">
                  <div className="flex justify-between text-xl text-white font-medium">
                    <span>Total</span>
                    <span>${totalConEnvio.toLocaleString()}</span>
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
          <div className="bg-[#1E1E1E] border border-[#EC4899]/30 rounded-2xl max-w-md w-full p-8 relative shadow-2xl">
            <button
              onClick={() => setCheckoutOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-serif mb-6 text-white text-center">Datos de Envío</h2>
            
            <form onSubmit={handleMercadoPagoCheckout} className="space-y-4 mt-4">
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
                className="w-full bg-[#009EE3] text-white py-3 rounded-lg font-medium hover:bg-[#3483FA] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
              >
                {procesando ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Procesando...
                  </>
                ) : (
                  'Pagar con Mercado Pago'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}