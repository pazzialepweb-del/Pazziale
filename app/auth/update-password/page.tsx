'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Verificar si el usuario tiene sesión activa (debe tenerla después del reset)
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // Si no hay sesión, el enlace probablemente expiró o es inválido
        setError('El enlace ha expirado o es inválido. Solicita uno nuevo.');
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#1A2238] text-white flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-[#131A2A] rounded-lg border border-gray-700 shadow-2xl text-center">
          <h1 className="text-3xl font-serif mb-4 text-green-400">¡Contraseña actualizada!</h1>
          <p className="text-gray-400">Serás redirigido al inicio de sesión en unos segundos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A2238] text-white flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-[#131A2A] rounded-lg border border-gray-700 shadow-2xl">
        <h1 className="text-3xl font-serif mb-6 text-center">Nueva Contraseña</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nueva contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-[#1A2238] border border-gray-600 focus:border-[#EAA584] outline-none text-white"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 rounded bg-[#1A2238] border border-gray-600 focus:border-[#EAA584] outline-none text-white"
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#EAA584] text-[#1A2238] py-2 rounded-lg font-medium hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}