// app/pago-exitoso/page.tsx
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PagoExitosoContent from './PagoExitosoContent';
import { Loader2 } from 'lucide-react';

export default function PagoExitosoPage() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      <div className="pt-32 px-4 md:px-8 max-w-3xl mx-auto text-center">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-16 h-16 animate-spin text-[#EC4899]" />
              <p className="mt-4 text-gray-400">Cargando confirmación...</p>
            </div>
          }
        >
          <PagoExitosoContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}