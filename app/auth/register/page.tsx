'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Validación previa antes de enviar
  const validarFormulario = () => {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio.');
      return false;
    }
    if (!email.trim()) {
      setError('El correo electrónico es obligatorio.');
      return false;
    }
    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validación previa
    if (!validarFormulario()) {
      setLoading(false);
      return;
    }

    try {
      // 1. Verificar si el usuario ya existe (opcional, pero evita el error)
      const { data: existingUser, error: checkError } = await supabase
        .from('perfiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        setError('Este correo electrónico ya está registrado. ¿Quieres iniciar sesión?');
        setLoading(false);
        return;
      }

      // 2. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        // Si el error es "User already registered", mostrar mensaje claro
        if (authError.message.includes('User already registered')) {
          setError('Este correo ya está registrado. Inicia sesión o recupera tu contraseña.');
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError('El usuario se creó pero no se pudo obtener la información del usuario.');
        setLoading(false);
        return;
      }

      // 3. Insertar el perfil en la tabla "perfiles"
      const { error: perfilError } = await supabase
        .from('perfiles')
        .insert([
          {
            id: authData.user.id,
            email: email,
            nombre: nombre,
            rol: 'usuario',
            created_at: new Date().toISOString(),
          }
        ]);

      if (perfilError) {
        // Si falla la inserción del perfil, mostrar error pero el usuario ya existe
        setError(`El usuario se creó, pero hubo un problema con su perfil: ${perfilError.message}. Por favor, contacta al administrador.`);
        setLoading(false);
        return;
      }

      // 4. Éxito
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login?registered=true');
      }, 3000);
    } catch (error) {
      console.error('Error en registro:', error);
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
              minLength={6}
            />
            <p className="text-xs text-gray-400 mt-1">Mínimo 6 caracteres.</p>
          </div>
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500 rounded-md">
              <p className="text-red-400 text-sm">{error}</p>
              {error.includes('registrado') && (
                <Link href="/auth/login" className="text-sm text-[#EAA584] hover:underline mt-1 inline-block">
                  Iniciar sesión
                </Link>
              )}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500 rounded-md">
              <p className="text-green-400 text-sm">¡Usuario creado exitosamente! Revisa tu correo para confirmar tu cuenta. Redirigiendo al login...</p>
            </div>
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
          <Link href="/auth/login" className="text-[#EAA584] hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}