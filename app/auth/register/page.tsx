'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        // Mostrar el error real de Supabase
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError('El usuario se creó pero no se pudo obtener la información del usuario.');
        setLoading(false);
        return;
      }

      // 2. Insertar el perfil en la tabla "perfiles"
      const { error: perfilError } = await supabase
        .from('perfiles')
        .insert([
          {
            id: authData.user.id,
            email: email,
            nombre: nombre,
            rol: 'usuario'
          }
        ]);

      if (perfilError) {
        // Si falla la inserción del perfil, mostramos el error pero NO eliminamos el usuario de Auth.
        // El usuario ya existe y puede iniciar sesión. El perfil se puede agregar manualmente desde el dashboard de Supabase.
        setError(`El usuario se creó, pero hubo un problema con su perfil: ${perfilError.message}. Por favor, contacta al administrador.`);
        setLoading(false);
        return;
      }

      // 3. Éxito
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login?registered=true');
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A2238] text-white flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-[#131A2A] rounded-lg border border-gray-700">
        <h1 className="text-3xl font-serif mb-6 text-center">Registro</h1>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 rounded bg-[#1A2238] border border-gray-600 focus:border-[#EAA584] outline-none text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-[#1A2238] border border-gray-600 focus:border-[#EAA584] outline-none text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-[#1A2238] border border-gray-600 focus:border-[#EAA584] outline-none text-white"
              required
            />
          </div>
          
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          
          {success && (
            <p className="text-green-400 text-sm">¡Usuario creado! Redirigiendo al login...</p>
          )}
          
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-[#EAA584] text-[#1A2238] py-2 rounded-lg font-medium hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-400 mt-4">
          ¿Ya tienes cuenta?{' '}
          <a href="/auth/login" className="text-[#EAA584] hover:underline">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
}