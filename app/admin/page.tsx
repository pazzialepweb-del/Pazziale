'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categoria: string;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [esAdmin, setEsAdmin] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const router = useRouter();

  useEffect(() => {
    verificarAdmin();
  }, []);

  async function verificarAdmin() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: perfil } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', user.id)
        .single();

      if (perfil?.rol !== 'admin') {
        router.push('/tienda');
        return;
      }

      setEsAdmin(true);
      cargarProductos();
    } catch (error) {
      console.error('Error verificando admin:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }

  async function cargarProductos() {
    const { data } = await supabase.from('productos').select('*');
    setProductos(data || []);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A2238] text-white">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p>Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!esAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1A2238] text-white">
      <Navbar />
      <div className="pt-24 px-8">
        <h1 className="text-4xl font-serif mb-8">Panel de Administración</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#131A2A] p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-medium mb-2">Productos</h2>
            <p className="text-3xl font-serif text-[#EAA584]">{productos.length}</p>
            <p className="text-gray-400 text-sm">Total de productos</p>
          </div>
          
          <div className="bg-[#131A2A] p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-medium mb-2">Pedidos</h2>
            <p className="text-3xl font-serif text-[#EAA584]">0</p>
            <p className="text-gray-400 text-sm">Pedidos pendientes</p>
          </div>
          
          <div className="bg-[#131A2A] p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-medium mb-2">Usuarios</h2>
            <p className="text-3xl font-serif text-[#EAA584]">0</p>
            <p className="text-gray-400 text-sm">Usuarios registrados</p>
          </div>
        </div>
      </div>
    </div>
  );
}