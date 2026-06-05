'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { User, LogOut, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useCarrito } from '@/context/CarritoContext';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { totalItems } = useCarrito();

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

  const cerrarMenu = () => setMenuAbierto(false);

  const categorias = [
    { nombre: 'Aros', ruta: '/aros' },
    { nombre: 'Anillos', ruta: '/anillos' },
    { nombre: 'Pulseras', ruta: '/pulseras' },
    { nombre: 'Collares', ruta: '/collares' },
    { nombre: 'Accesorios', ruta: '/accesorios' },
  ];

  const isTiendaActive = pathname === '/tienda' || categorias.some(cat => pathname === cat.ruta);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#1A2238]/90 backdrop-blur-sm border-b border-[#EC4899]/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="relative flex items-center h-16 w-48">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 z-10">
            <Image
              src="/images/logo.png"
              alt="Pazziale Logo"
              width={400}
              height={120}
              className="h-28 w-auto object-contain"
              priority
            />
          </div>
        </Link>

        {/* NAV DESKTOP */}
        <div className="hidden md:flex gap-6 text-sm tracking-wide font-light items-center">
          <Link href="/" className={`hover:text-[#EC4899] transition-colors ${pathname === '/' ? 'text-[#EC4899]' : 'text-white'}`}>
            Inicio
          </Link>
          
          <div className="relative group">
            <Link 
              href="/tienda" 
              className={`flex items-center gap-1 hover:text-[#EC4899] transition-colors ${isTiendaActive ? 'text-[#EC4899]' : 'text-white'}`}
            >
              <ShoppingBag className="w-4 h-4" />
              Tienda
              <ChevronDown className="w-3 h-3 ml-0.5 group-hover:rotate-180 transition-transform" />
            </Link>

            <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A2238] border border-[#EC4899]/20 rounded-lg shadow-xl invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50 overflow-hidden">
              <div className="py-2">
                {categorias.map((categoria) => (
                  <Link 
                    key={categoria.ruta} 
                    href={categoria.ruta}
                    className="block px-6 py-2.5 text-sm text-gray-300 hover:text-[#EC4899] hover:bg-[#2D2D2D] transition-colors"
                    onClick={cerrarMenu}
                  >
                    {categoria.nombre}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/carrito" className={`hover:text-[#EC4899] transition-colors flex items-center gap-1 relative ${pathname === '/carrito' ? 'text-[#EC4899]' : 'text-white'}`}>
            <ShoppingBag className="w-4 h-4" />
            Carrito
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#EC4899] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg shadow-[#EC4899]/50">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          {isAdmin && (
            <Link href="/admin" className={`hover:text-[#EC4899] transition-colors ${pathname === '/admin' ? 'text-[#EC4899]' : 'text-white'}`}>
              Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/perfil" 
                className={`hover:text-[#EC4899] transition-colors text-sm ${pathname === '/perfil' ? 'text-[#EC4899]' : 'text-white'}`}
              >
                Perfil
              </Link>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <User className="w-4 h-4" />
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 hover:text-[#EC4899] transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="bg-[#EC4899] text-white px-4 py-1.5 rounded-full font-medium hover:bg-[#F59E0B] transition-colors">
              Iniciar Sesión
            </Link>
          )}
        </div>

        {/* BOTÓN MENÚ MÓVIL */}
        <div className="md:hidden">
          <button onClick={() => setMenuAbierto(!menuAbierto)} className="text-white p-2">
            {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL (DESPLEGABLE) */}
      {menuAbierto && (
        <div className="md:hidden bg-[#1A2238] border-t border-[#EC4899]/20 px-6 py-4 flex flex-col gap-4 text-sm">
          <Link href="/" onClick={cerrarMenu} className={`${pathname === '/' ? 'text-[#EC4899]' : 'text-white'} hover:text-[#EC4899] transition-colors`}>
            Inicio
          </Link>
          
          <Link href="/tienda" onClick={cerrarMenu} className={`flex items-center gap-2 ${pathname === '/tienda' ? 'text-[#EC4899]' : 'text-white'} hover:text-[#EC4899] transition-colors`}>
            <ShoppingBag className="w-4 h-4" />
            Tienda
          </Link>

          <div className="pl-6 flex flex-col gap-2 border-l border-[#EC4899]/20">
            {categorias.map((categoria) => (
              <Link 
                key={categoria.ruta} 
                href={categoria.ruta} 
                onClick={cerrarMenu}
                className={`${pathname === categoria.ruta ? 'text-[#EC4899]' : 'text-gray-400'} hover:text-[#EC4899] transition-colors`}
              >
                {categoria.nombre}
              </Link>
            ))}
          </div>

          <Link href="/carrito" onClick={cerrarMenu} className={`flex items-center gap-2 relative ${pathname === '/carrito' ? 'text-[#EC4899]' : 'text-white'} hover:text-[#EC4899] transition-colors`}>
            <ShoppingBag className="w-4 h-4" />
            Carrito
            {totalItems > 0 && (
              <span className="ml-auto bg-[#EC4899] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          {isAdmin && (
            <Link href="/admin" onClick={cerrarMenu} className={`${pathname === '/admin' ? 'text-[#EC4899]' : 'text-white'} hover:text-[#EC4899] transition-colors`}>
              Admin
            </Link>
          )}

          {user ? (
            <div className="flex flex-col gap-2">
              <Link href="/perfil" onClick={cerrarMenu} className={`${pathname === '/perfil' ? 'text-[#EC4899]' : 'text-white'} hover:text-[#EC4899] transition-colors`}>
                Perfil
              </Link>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <User className="w-4 h-4" />
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 hover:text-[#EC4899] transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          ) : (
            <Link href="/auth/login" onClick={cerrarMenu} className="bg-[#EC4899] text-white px-4 py-1.5 rounded-full font-medium hover:bg-[#F59E0B] transition-colors text-center">
              Iniciar Sesión
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}