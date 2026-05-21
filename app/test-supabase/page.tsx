'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabase() {
  const [status, setStatus] = useState('Probando conexión...');
  const [detalles, setDetalles] = useState<any>({});

  useEffect(() => {
    async function test() {
      try {
        // 1. Probar conexión básica
        console.log('1. Probando conexión básica...');
        const { data, error } = await supabase
          .from('productos')
          .select('*');
        
        // 2. Ver qué devuelve Supabase
        console.log('2. Supabase respondió:', { data, error });
        
        if (error) {
          console.log('3. Hay un error de Supabase:', error);
          setStatus('❌ Error de Supabase');
          setDetalles({
            mensaje: error.message,
            código: error.code,
            detalles: error.details,
            hint: error.hint
          });
        } else {
          console.log('3. Éxito! Datos recibidos:', data);
          setStatus(`✅ Conexión exitosa! ${data?.length || 0} productos`);
          setDetalles({ productos: data });
        }
      } catch (e) {
        console.log('4. Error inesperado (catch):', e);
        setStatus('❌ Error inesperado');
        setDetalles({
          mensaje: e instanceof Error ? e.message : 'Error desconocido',
          tipo: typeof e,
          valor: e
        });
      }
    }
    
    test();
  }, []);

  return (
    <div className="min-h-screen bg-[#1A2238] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif mb-6">Prueba de Supabase</h1>
        
        <div className="mb-6 p-4 rounded-lg border border-gray-700">
          <p className="text-xl">{status}</p>
        </div>

        <div className="bg-[#131A2A] p-4 rounded-lg border border-gray-700 overflow-auto">
          <h2 className="font-medium mb-2">Detalles:</h2>
          <pre className="text-sm text-gray-300">
            {JSON.stringify(detalles, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}