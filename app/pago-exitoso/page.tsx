'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function PagoExitosoPage() {
  useEffect(() => {
    // Opcional: aquí podrías redirigir automáticamente al perfil después de unos segundos
    // const timer = setTimeout(() => window.location.href = '/perfil', 5000);
    // return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col items-center justify-center py-20 px-4">
      <Navbar />
      <div className="max-w-md w-full bg-[#2D2D2D] p-8 rounded-2xl border border-green-500/30 text-center">
        <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
        <h1 className="text-3xl font-serif mb-2">¡Pago exitoso!</h1>
        <p className="text-gray-300 mb-6">
          Tu pedido ha sido confirmado y lo estamos preparando. Te notificaremos cuando esté en camino.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/perfil"
            className="w-full bg-[#EC4899] text-white py-3 rounded-lg font-medium hover:bg-[#F59E0B] transition-colors"
          >
            Ver mis pedidos
          </Link>
          <Link
            href="/tienda"
            className="w-full border border-[#F59E0B]/50 text-gray-300 py-3 rounded-lg font-medium hover:border-[#EC4899] hover:text-[#EC4899] transition-colors"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}