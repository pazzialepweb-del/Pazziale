'use client';

import { useCarrito } from '@/context/CarritoContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Trash2, Minus, ShoppingBag, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Comuna {
  codigo: string;
  nombre: string;
  region?: string;
}

export default function CarritoPage() {
  const {
    items,
    loading,
    totalItems,
    totalPrecio,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
  } = useCarrito();

  // 🌎 Estado para envío
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [cargandoComunas, setCargandoComunas] = useState(true);
  const [comunaSeleccionada, setComunaSeleccionada] = useState<string>('PROV');
  const [costoEnvio, setCostoEnvio] = useState<number | null>(null);
  const [cotizando, setCotizando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [servicioEnvio, setServicioEnvio] = useState<string | null>(null);

  // 📦 Calcular peso total del carrito (0.5 kg por producto)
  const PESO_PRODUCTO = 0.5;
  const pesoTotal = items.reduce((acc, item) => acc + PESO_PRODUCTO * item.cantidad, 0);
  const valorDeclarado = totalPrecio;

  // 🔄 Obtener comunas desde la API de Coberturas de Chilexpress
  useEffect(() => {
    const cargarComunas = async () => {
      try {
        setCargandoComunas(true);
        const res = await fetch('/api/chilexpress/comunas');
        if (!res.ok) {
          throw new Error('Error al cargar comunas');
        }
        const data = await res.json();
        if (data.comunas && data.comunas.length > 0) {
          setComunas(data.comunas);
          // Si la lista incluye comunas, seleccionamos la primera (ej: Providencia)
          const primera = data.comunas[0];
          if (primera) {
            setComunaSeleccionada(primera.codigo);
          }
        } else {
          // Fallback a lista manual si la API no devuelve datos
          setComunas(comunasManual);
        }
      } catch (error) {
        console.error('Error cargando comunas:', error);
        // Fallback a lista manual
        setComunas(comunasManual);
      } finally {
        setCargandoComunas(false);
      }
    };
    cargarComunas();
  }, []);

  // 📋 Lista manual de comunas (fallback en caso de que la API falle)
  const comunasManual: Comuna[] = [
    { codigo: 'PROV', nombre: 'Providencia' },
    { codigo: 'SANTIAGO', nombre: 'Santiago Centro' },
    { codigo: 'LAS_CONDES', nombre: 'Las Condes' },
    { codigo: 'NUNOA', nombre: 'Ñuñoa' },
    { codigo: 'VITACURA', nombre: 'Vitacura' },
    { codigo: 'TALCA', nombre: 'Talca' },
    { codigo: 'CURICO', nombre: 'Curicó' },
    { codigo: 'LINARES', nombre: 'Linares' },
    { codigo: 'CONCEPCION', nombre: 'Concepción' },
    { codigo: 'TEMUCO', nombre: 'Temuco' },
    { codigo: 'VALDIVIA', nombre: 'Valdivia' },
    { codigo: 'PUERTO_MONTT', nombre: 'Puerto Montt' },
    { codigo: 'ARICA', nombre: 'Arica' },
    { codigo: 'IQUIQUE', nombre: 'Iquique' },
    { codigo: 'ANTOFAGASTA', nombre: 'Antofagasta' },
    { codigo: 'COPIAPO', nombre: 'Copiapó' },
    { codigo: 'LA_SERENA', nombre: 'La Serena' },
    { codigo: 'VALPARAISO', nombre: 'Valparaíso' },
    { codigo: 'RANCAGUA', nombre: 'Rancagua' },
    { codigo: 'CHILLAN', nombre: 'Chillán' },
    { codigo: 'OSORNO', nombre: 'Osorno' },
    { codigo: 'PUNTA_ARENAS', nombre: 'Punta Arenas' },
    { codigo: 'COYHAIQUE', nombre: 'Coyhaique' },
  ];

  // 🔄 Cotizar envío cuando cambia la comuna o el carrito
  useEffect(() => {
    const cotizar = async () => {
      if (items.length === 0 || !comunaSeleccionada) {
        setCostoEnvio(null);
        setErrorEnvio(null);
        return;
      }

      setCotizando(true);
      setErrorEnvio(null);

      try {
        const res = await fetch('/api/chilexpress/cotizar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destinationCountyCode: comunaSeleccionada,
            weight: pesoTotal.toFixed(2),
            height: '10',
            width: '10',
            length: '10',
            declaredWorth: valorDeclarado.toString(),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Error al cotizar');
        }

        if (data.success && data.serviceValue) {
          setCostoEnvio(parseInt(data.serviceValue));
          setServicioEnvio(data.serviceDescription);
          setErrorEnvio(null);
        } else {
          throw new Error(data.error || 'No se pudo obtener el costo de envío');
        }
      } catch (error) {
        console.error('Error cotizando:', error);
        setErrorEnvio(error instanceof Error ? error.message : 'Error al cotizar envío');
        setCostoEnvio(null);
      } finally {
        setCotizando(false);
      }
    };

    cotizar();
  }, [comunaSeleccionada, items, pesoTotal, valorDeclarado]);

  const totalConEnvio = totalPrecio + (costoEnvio || 0);

  const [hydrated, setHydrated] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
  });

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

      if (!costoEnvio) {
        alert('No se pudo obtener el costo de envío. Intenta de nuevo.');
        setProcesando(false);
        return;
      }

      const itemsData = items.map(item => ({
        producto_id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
        imagen_url: item.imagen_url,
      }));

      const externalRef = `pedido_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

      const { error } = await supabase
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
          external_reference: externalRef,
        }]);

      if (error) {
        console.error('❌ Error de Supabase:', error);
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
        nombre: `Envío Chilexpress - ${servicioEnvio || 'Estándar'}`,
        cantidad: 1,
        precio: costoEnvio,
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
          <ShoppingBag className="w-16 h-16 mx-auto text-[#EC4899] mb-4" aria-hidden="true" />
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
        <Breadcrumbs items={[{ label: 'Carrito' }]} className="mb-4" />
        <h1 className="text-4xl font-serif mb-8">Mi Carrito</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lista de productos */}
          <section className="flex-1" aria-label="Productos en el carrito">
            <div className="space-y-4">
              {items.map((item) => {
                const nombre = item.nombre || 'Producto sin nombre';
                const precio = typeof item.precio === 'number' && !isNaN(item.precio) ? item.precio : 0;
                const imagenUrl = item.imagen_url || '';

                return (
                  <article
                    key={item.id}
                    className="bg-[#2D2D2D] p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between border border-[#F59E0B]/30 hover:border-[#EC4899] transition-colors"
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-[#1E1E1E] border border-[#F59E0B]/30 flex items-center justify-center relative">
                        {imagenUrl ? (
                          <Image
                            src={imagenUrl}
                            alt={`${nombre} - Pazziale`}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                            unoptimized={imagenUrl.startsWith('http')}
                          />
                        ) : (
                          <span className="text-gray-500 text-xs text-center p-2">Sin imagen</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-serif text-lg truncate">{nombre}</h2>
                        <p className="text-[#EC4899] font-medium">
                          {precio > 0 ? `$${precio.toLocaleString()}` : 'Precio no disponible'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                      <div className="flex items-center gap-2 bg-[#1E1E1E] rounded-lg px-2 py-1">
                        <button
                          onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                          className="p-1 hover:text-[#EC4899] transition-colors"
                          disabled={item.cantidad <= 1}
                          aria-label={`Disminuir cantidad de ${nombre}`}
                        >
                          <Minus className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <span className="w-8 text-center" aria-label={`Cantidad: ${item.cantidad}`}>
                          {item.cantidad}
                        </span>
                      </div>
                      <button
                        onClick={() => eliminarDelCarrito(item.id)}
                        className="text-red-400 hover:text-red-500 transition-colors p-1"
                        aria-label={`Eliminar ${nombre} del carrito`}
                      >
                        <Trash2 className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Resumen */}
          <aside className="lg:w-96" aria-label="Resumen del carrito">
            <div className="bg-[#2D2D2D] p-6 rounded-lg border border-[#F59E0B]/30 sticky top-24">
              <h2 className="text-2xl font-serif mb-4">Resumen</h2>
              <div className="space-y-3 text-gray-400">
                <div className="flex justify-between">
                  <span>Productos ({totalItems})</span>
                  <span>${totalPrecio.toLocaleString()}</span>
                </div>

                {/* 🌎 Selector de comuna con cotización real Chilexpress */}
                <div className="border-t border-[#F59E0B]/30 my-4 pt-4">
                  <p className="text-sm font-medium mb-2 text-[#F59E0B]">Comuna de destino:</p>
                  <p className="text-xs text-gray-500 mb-2">📦 Envíos desde Talca</p>
                  {cargandoComunas ? (
                    <div className="flex items-center gap-2 text-yellow-400 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" /> Cargando comunas...
                    </div>
                  ) : (
                    <select
                      value={comunaSeleccionada}
                      onChange={(e) => setComunaSeleccionada(e.target.value)}
                      className="w-full p-2 rounded bg-[#1E1E1E] border border-gray-600 text-white text-sm"
                      disabled={cotizando}
                    >
                      {comunas.length > 0 ? (
                        comunas.map((comuna) => (
                          <option key={comuna.codigo} value={comuna.codigo}>
                            {comuna.nombre} {comuna.region ? `(${comuna.region})` : ''}
                          </option>
                        ))
                      ) : (
                        <option value="">No hay comunas disponibles</option>
                      )}
                    </select>
                  )}
                  {cotizando && (
                    <div className="flex items-center gap-2 mt-2 text-yellow-400 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" /> Cotizando envío...
                    </div>
                  )}
                  {errorEnvio && (
                    <p className="text-red-400 text-xs mt-2">{errorEnvio}</p>
                  )}
                  {costoEnvio !== null && !cotizando && !errorEnvio && (
                    <p className="text-green-400 text-xs mt-2">
                      ✅ {servicioEnvio || 'Envío'} - ${costoEnvio.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>{costoEnvio !== null ? `$${costoEnvio.toLocaleString()}` : 'Cotizando...'}</span>
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
                disabled={costoEnvio === null || cotizando || cargandoComunas}
                className={`w-full py-3 rounded-lg font-medium transition-colors mt-4 ${
                  costoEnvio === null || cotizando || cargandoComunas
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-[#EC4899] text-white hover:bg-[#F59E0B]'
                }`}
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
          </aside>
        </div>
      </div>

      {/* Modal de checkout */}
      {checkoutOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] border border-[#EC4899]/30 rounded-2xl max-w-md w-full p-8 relative shadow-2xl">
            <button
              onClick={() => setCheckoutOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Cerrar formulario"
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
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Dirección</label>
                <input
                  type="text"
                  value={form.direccion}
                  onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                  className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Teléfono</label>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Correo electrónico</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                  required
                />
              </div>

              <div className="bg-[#2D2D2D] p-3 rounded-lg border border-yellow-500/30">
                <p className="text-xs text-yellow-400 text-center">
                  💡 El costo de envío es calculado en tiempo real con Chilexpress desde Talca.
                </p>
              </div>

              <button
                type="submit"
                disabled={procesando}
                className="w-full bg-[#009EE3] text-white py-3 rounded-lg font-medium hover:bg-[#3483FA] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                {procesando ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Procesando...
                  </>
                ) : (
                  `Pagar $${totalConEnvio.toLocaleString()}`
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