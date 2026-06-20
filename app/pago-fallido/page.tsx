'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function PagoFallidoPage() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col items-center justify-center py-20 px-4">
      <Navbar />
      <div className="max-w-md w-full bg-[#2D2D2D] p-8 rounded-2xl border border-red-500/30 text-center">
        <XCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
        <h1 className="text-3xl font-serif mb-2">Pago no completado</h1>
        <p className="text-gray-300 mb-6">
          Ocurrió un problema al procesar tu pago. Puedes intentarlo de nuevo o contactarnos si necesitas ayuda.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/carrito"
            className="w-full bg-[#EC4899] text-white py-3 rounded-lg font-medium hover:bg-[#F59E0B] transition-colors"
          >
            Volver al carrito
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