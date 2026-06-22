'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Enviar correo de restablecimiento con redirectTo a nuestra página de actualización
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;
      setMessage('Revisa tu correo para restablecer tu contraseña.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A2238] text-white flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-[#131A2A] rounded-lg border border-gray-700 shadow-2xl">
        <h1 className="text-3xl font-serif mb-6 text-center">Recuperar Contraseña</h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {message && <p className="text-green-400 text-sm">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#EAA584] text-[#1A2238] py-2 rounded-lg font-medium hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          ¿Recordaste tu contraseña?{' '}
          <Link href="/auth/login" className="text-[#EAA584] hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}