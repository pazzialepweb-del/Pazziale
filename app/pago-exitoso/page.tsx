// app/pago-exitoso/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2, CheckCircle } from 'lucide-react';

export default function PagoExitosoPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const actualizarStock = async () => {
      // 1. Obtener external_reference desde URL o localStorage
      let externalRef = searchParams.get('external_reference');

      if (!externalRef) {
        // Si no viene en la URL, intentar recuperar del localStorage
        externalRef = localStorage.getItem('ultimo_pedido_external_ref');
        // Opcional: limpiar después de usarlo
        // localStorage.removeItem('ultimo_pedido_external_ref');
      }

      if (!externalRef) {
        setStatus('error');
        setMessage('No se pudo identificar el pedido. Por favor contacta a soporte.');
        return;
      }

      try {
        const res = await fetch('/api/actualizar-stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ external_reference: externalRef }),
        });

        const data = await res.json();

        if (res.ok && data.stockActualizado !== false) {
          setStatus('success');
          setMessage('¡Pago confirmado y stock actualizado! Pronto recibirás tu pedido.');
        } else if (res.ok && data.yaProcesado) {
          setStatus('success');
          setMessage('Este pedido ya había sido procesado anteriormente.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Ocurrió un problema al actualizar el stock. Contacta a soporte.');
        }
      } catch (error) {
        console.error('Error:', error);
        setStatus('error');
        setMessage('Error al procesar la confirmación. Por favor contacta a soporte.');
      }
    };

    actualizarStock();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      <div className="pt-32 px-4 md:px-8 max-w-3xl mx-auto text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-16 h-16 animate-spin text-[#EC4899]" />
            <p className="mt-4 text-gray-400">Confirmando tu pago y actualizando stock...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-16">
            <CheckCircle className="w-20 h-20 mx-auto text-green-500" />
            <h1 className="text-4xl font-serif mt-6 mb-4">¡Pago exitoso!</h1>
            <p className="text-gray-300 text-lg">{message}</p>
            <p className="text-gray-400 mt-2">
              Te enviaremos un correo con los detalles de tu pedido.
            </p>
            <Link
              href="/tienda"
              className="inline-block mt-8 bg-[#EC4899] text-white px-8 py-3 rounded-full font-medium hover:bg-[#F59E0B] transition-colors"
            >
              Seguir comprando
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-16">
            <div className="w-20 h-20 mx-auto text-red-500 text-6xl">⚠️</div>
            <h1 className="text-4xl font-serif mt-6 mb-4">Hubo un problema</h1>
            <p className="text-gray-300 text-lg">{message}</p>
            <p className="text-gray-400 mt-2">
              No te preocupes, tu pago ya fue procesado. Nosotros revisaremos tu pedido manualmente.
            </p>
            <Link
              href="/contacto"
              className="inline-block mt-8 bg-[#F59E0B] text-[#1E1E1E] px-8 py-3 rounded-full font-medium hover:bg-[#EC4899] transition-colors"
            >
              Contactar soporte
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}