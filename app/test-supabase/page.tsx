'use client';

import { useEffect, useState } from 'react';

export default function TestSupabase() {
  const [status, setStatus] = useState('Probando...');

  useEffect(() => {
    async function test() {
      try {
        // Consultar la tabla productos directamente
        const response = await fetch(
          'https://lcdhazkemkyktfrqjtka.supabase.co/rest/v1/productos?select=*',
          {
            headers: {
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'MISSING_KEY'
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setStatus(`✅ Conexión exitosa. Se encontraron ${data.length} productos.`);
          console.log('Productos:', data);
        } else if (response.status === 401) {
          const error = await response.json();
          setStatus(`❌ Error de permisos (401): ${JSON.stringify(error)}`);
        } else {
          const text = await response.text();
          setStatus(`❌ Código ${response.status}: ${text}`);
        }
      } catch (error) {
        setStatus(`❌ Error crítico: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }
    
    test();
  }, []);

  return (
    <div className="min-h-screen bg-[#1A2238] text-white p-8">
      <h1 className="text-3xl font-serif mb-6">Diagnóstico Supabase - Productos</h1>
      <pre className="bg-[#131A2A] p-4 rounded-lg border border-gray-700 whitespace-pre-wrap text-wrap">
        {status}
      </pre>
    </div>
  );
}