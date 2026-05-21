'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { User, LogOut, ShoppingBag, Sparkles, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(false);
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
    setMenuAbierto(false);
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#1A2238]/90 backdrop-blur-sm border-b border-[#EAA584]/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2" onClick={cerrarMenu}>
          <span className="text-3xl font-serif italic tracking-wider text-[#EAA584]">Pazziale</span>
          <Sparkles className="w-5 h-5 text-[#EAA584]" />
        </Link>

        {/* NAV DESKTOP */}
        <div className="hidden md:flex gap-8 text-sm tracking-wide font-light items-center">
          <Link href="/" className={`hover:text-[#EAA584] transition-colors ${isActive('/') ? 'text-[#EAA584]' : 'text-white'}`}>
            Inicio
          </Link>
          
          <Link href="/tienda" className={`hover:text-[#EAA584] transition-colors flex items-center gap-1 ${isActive('/tienda') ? 'text-[#EAA584]' : 'text-white'}`}>
            <ShoppingBag className="w-4 h-4" />
            Tienda
          </Link>

          {isAdmin && (
            <Link href="/admin" className={`hover:text-[#EAA584] transition-colors ${isActive('/admin') ? 'text-[#EAA584]' : 'text-white'}`}>
              Admin
            </Link>
          )}

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

        {/* BOTÓN MENÚ MÓVIL */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white p-2">
            {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL (DESPLEGABLE) */}
      {menuAbierto && (
        <div className="md:hidden bg-[#1A2238] border-t border-[#EAA584]/20 px-6 py-4 flex flex-col gap-4 text-sm">
          <Link href="/" onClick={cerrarMenu} className={`${isActive('/') ? 'text-[#EAA584]' : 'text-white'} hover:text-[#EAA584] transition-colors`}>
            Inicio
          </Link>
          
          <Link href="/tienda" onClick={cerrarMenu} className={`flex items-center gap-2 ${isActive('/tienda') ? 'text-[#EAA584]' : 'text-white'} hover:text-[#EAA584] transition-colors`}>
            <ShoppingBag className="w-4 h-4" />
            Tienda
          </Link>

          {isAdmin && (
            <Link href="/admin" onClick={cerrarMenu} className={`${isActive('/admin') ? 'text-[#EAA584]' : 'text-white'} hover:text-[#EAA584] transition-colors`}>
              Admin
            </Link>
          )}

          {user ? (
            <div className="flex flex-col gap-2">
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <User className="w-4 h-4" />
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 hover:text-[#EAA584] transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          ) : (
            <Link href="/auth/login" onClick={cerrarMenu} className="bg-[#EAA584] text-[#1A2238] px-4 py-1.5 rounded-full font-medium hover:bg-white transition-colors text-center">
              Iniciar Sesión
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}