'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Pedido {
  id: string;
  estado: 'verificando' | 'verificado' | 'en envío' | 'recibido';
  metodo_envio: string | null;
  numero_seguimiento: string | null;
  total: number;
  direccion_envio: string;
  fecha_pedido: string;
}

export default function PerfilPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUser(user);

      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('user_id', user.id)
        .order('fecha_pedido', { ascending: false });

      if (error) console.error('Error cargando pedidos:', error);
      else setPedidos(data || []);
      setLoading(false);
    };
    fetchData();
  }, [router]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'verificando': return 'text-yellow-400';
      case 'verificado': return 'text-blue-400';
      case 'en envío': return 'text-[#F59E0B]';
      case 'recibido': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'verificando': return 'Verificando pago';
      case 'verificado': return 'Verificado';
      case 'en envío': return 'En envío';
      case 'recibido': return 'Recibido';
      default: return estado;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#1E1E1E] text-white"><Navbar /><div className="pt-32 px-6 text-center">Cargando perfil...</div></div>
  );

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      <div className="pt-32 px-4 md:px-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif mb-4">Mi Perfil</h1>
        <p className="text-gray-400 mb-8">Bienvenido, <span className="text-white font-medium">{user?.email?.split('@')[0]}</span></p>

        <h2 className="text-2xl font-serif mb-6 text-[#EC4899]">Mis Pedidos</h2>

        {pedidos.length === 0 ? (
          <div className="bg-[#2D2D2D] p-8 rounded-lg border border-[#F59E0B]/30 text-center">
            <p className="text-gray-400">No tienes pedidos realizados aún.</p>
            <Link href="/tienda" className="mt-4 inline-block bg-[#EC4899] text-white px-6 py-2 rounded-full hover:bg-[#F59E0B] transition-colors">
              Ir a comprar
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-[#2D2D2D] p-6 rounded-lg border border-[#F59E0B]/30 hover:border-[#EC4899] transition-colors">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Pedido #{pedido.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-400">Fecha: {new Date(pedido.fecha_pedido).toLocaleDateString('es-CL')}</p>
                    <p className="text-lg font-medium text-white mt-1">${pedido.total.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">Dirección: {pedido.direccion_envio}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(pedido.estado)} border-current`}>
                      {getEstadoLabel(pedido.estado)}
                    </span>
                    {pedido.metodo_envio && pedido.numero_seguimiento && (
                      <div className="text-sm text-gray-400">
                        <p>Envío: <span className="text-white">{pedido.metodo_envio}</span></p>
                        <p>Seguimiento: <span className="text-[#F59E0B]">{pedido.numero_seguimiento}</span></p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}