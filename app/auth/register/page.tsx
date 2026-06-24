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

    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneMinuscula = /[a-z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);
    const tieneEspecial = /[!@#$%^&*()_+\-=[\]{};:'"|,.<>/?]/.test(password);

    if (!tieneMayuscula || !tieneMinuscula || !tieneNumero || !tieneEspecial) {
      setError('La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial.');
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!validarFormulario()) {
      setLoading(false);
      return;
    }

    try {
      // 🔥 Intentar registrar
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        throw authError;
      }

      // ✅ Si no hay error, el usuario se creó (aunque user pueda ser null)
      // Supabase devuelve user null cuando la confirmación de email está activa
      // y el usuario aún no confirmó, pero la cuenta ya existe en Auth.

      // Intentamos obtener el user id si existe, si no, redirigimos igual
      let userId = authData.user?.id;

      // Si el user es null, intentamos obtener la sesión (por si ya quedó autenticado)
      if (!userId) {
        // Esperamos un momento para que Supabase procese el signup
        await new Promise(resolve => setTimeout(resolve, 1000));
        const { data: sessionData } = await supabase.auth.getSession();
        // Si hay sesión, usamos ese user id
        if (sessionData.session?.user) {
          userId = sessionData.session.user.id;
        }
      }

      // Si tenemos userId, insertamos el perfil
      if (userId) {
        const { error: perfilError } = await supabase
          .from('perfiles')
          .insert([
            {
              id: userId,
              email,
              nombre,
              rol: 'usuario',
              created_at: new Date().toISOString(),
            }
          ]);

        if (perfilError) {
          console.warn('Perfil no creado:', perfilError.message);
          // No mostramos error al usuario porque la cuenta ya existe
        }
      } else {
        // Si no tenemos userId, al menos la cuenta se creó en Auth
        console.log('Usuario creado en Auth, pendiente de confirmar correo');
      }

      // 🎉 Éxito: redirigimos al login con mensaje
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login?registered=true');
      }, 3000);

    } catch (error) {
      console.error('Error en registro:', error);

      let mensajeError = '';

      if (error instanceof Error) {
        const mensaje = error.message;

        if (mensaje.includes('User already registered')) {
          mensajeError = 'Este correo ya está registrado. Inicia sesión o recupera tu contraseña.';
        } else if (mensaje.includes('email rate limit exceeded')) {
          mensajeError = 'Has excedido el límite de intentos para este correo. Espera 15-30 minutos y vuelve a intentarlo, o usa otro correo.';
        } else if (mensaje.includes('Password should contain')) {
          mensajeError = 'La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial.';
        } else if (mensaje.includes('timeout') || mensaje.includes('504')) {
          mensajeError = 'El servidor está tardando demasiado. Intenta de nuevo en unos minutos.';
        } else {
          mensajeError = mensaje;
        }
      } else {
        mensajeError = 'Error inesperado. Por favor, intenta de nuevo.';
      }

      setError(mensajeError);
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
            <p className="text-xs text-gray-400 mt-1">
              Mínimo 6 caracteres. Debe tener mayúscula, minúscula, número y un carácter especial (ej: !@#$%).
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500 rounded-md">
              <p className="text-red-400 text-sm">{error}</p>
              {(error.includes('registrado') || error.includes('Registrado')) && (
                <Link href="/auth/login" className="text-sm text-[#EAA584] hover:underline mt-1 inline-block">
                  Iniciar sesión
                </Link>
              )}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500 rounded-md">
              <p className="text-green-400 text-sm">
                ¡Cuenta creada! Revisa tu correo para confirmar tu cuenta. Redirigiendo al login...
              </p>
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