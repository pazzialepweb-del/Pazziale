'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      if (adminOnly) {
        const { data: perfil } = await supabase
          .from('perfiles')
          .select('rol')
          .eq('id', user.id)
          .single();

        if (perfil?.rol !== 'admin') {
          router.push('/tienda');
          return;
        }
      }

      setLoading(false);
    }

    checkAuth();
  }, [router, adminOnly]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A2238] text-white flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return <>{children}</>;
}