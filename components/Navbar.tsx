'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { User, LogOut, ShoppingBag, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Verificar si es admin
        const { data: perfil } = await supabase
          .from('perfiles')
          .select('rol')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(perfil?.rol === 'admin');
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#1A2238]/90 backdrop-blur-sm border-b border-[#EAA584]/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl font-serif italic tracking-wider text-[#EAA584]">Pazziale</span>
          <Sparkles className="w-5 h-5 text-[#EAA584]" />
        </Link>

        {/* Navegación Desktop */}
        <div className="hidden md:flex gap-8 text-sm tracking-wide font-light items-center">
          <Link href="/" className={`hover:text-[#EAA584] transition-colors ${isActive('/') ? 'text-[#EAA584]' : 'text-white'}`}>
            Inicio
          </Link>
          
          <Link href="/tienda" className={`hover:text-[#EAA584] transition-colors ${isActive('/tienda') ? 'text-[#EAA584]' : 'text-white'}`}>
            Tienda
          </Link>

          {isAdmin && (
            <Link href="/admin" className={`hover:text-[#EAA584] transition-colors ${isActive('/admin') ? 'text-[#EAA584]' : 'text-white'}`}>
              Admin
            </Link>
          )}

          {/* Login / Logout */}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <User className="w-4 h-4" />
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 hover:text-[#EAA584] transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="bg-[#EAA584] text-[#1A2238] px-4 py-1.5 rounded-full font-medium hover:bg-white transition-colors">
              Iniciar Sesión
            </Link>
          )}
        </div>

        {/* Menú móvil (hamburguesa) - Pendiente de implementar */}
        <div className="md:hidden">
          <button className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}