'use client';

import Link from 'next/link';
import { Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function PagoPendientePage() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col items-center justify-center py-20 px-4">
      <Navbar />
      <div className="max-w-md w-full bg-[#2D2D2D] p-8 rounded-2xl border border-yellow-500/30 text-center">
        <Clock className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
        <h1 className="text-3xl font-serif mb-2">Pago en revisión</h1>
        <p className="text-gray-300 mb-6">
          El pago está siendo procesado. Te notificaremos cuando se confirme. No te preocupes, no se te ha cobrado hasta que se apruebe.
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