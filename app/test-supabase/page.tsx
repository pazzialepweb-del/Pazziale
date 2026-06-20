'use client';

import { useEffect, useState } from 'react';

export default function TestSupabase() {
  const [status, setStatus] = useState('Probando...');
  const [data, setData] = useState<any>(null);
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    async function test() {
      try {
        // Llamada al endpoint de productos con paginación mínima
        const response = await fetch('/api/productos?page=1&limit=1');
        
        // Mostrar el estado HTTP
        setStatus(`Código de respuesta: ${response.status}`);
        
        if (!response.ok) {
          // Obtener el texto del error
          const text = await response.text();
          setErrorDetails(`Error ${response.status}: ${text}`);
          return;
        }

        // Obtener el JSON de la respuesta
        const json = await response.json();
        setData(json);
        
        // Verificar la estructura esperada
        if (json.data) {
          setStatus(`✅ OK - Productos recibidos: ${json.data.length}`);
        } else {
          setStatus('⚠️ Respuesta recibida pero sin propiedad "data"');
        }
      } catch (error) {
        setStatus('❌ Error al hacer la petición');
        setErrorDetails(error instanceof Error ? error.message : 'Error desconocido');
      }
    }
    
    test();
  }, []);

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif mb-6 text-center">🧪 Diagnóstico API Productos</h1>
        
        <div className="bg-[#2D2D2D] p-6 rounded-lg border border-[#F59E0B]/30 mb-6">
          <p className="text-xl font-medium mb-4">{status}</p>
          {errorDetails && (
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded text-red-400 text-sm">
              <p className="font-medium mb-1">Detalles del error:</p>
              <pre className="whitespace-pre-wrap">{errorDetails}</pre>
            </div>
          )}
        </div>

        {data && (
          <div className="bg-[#2D2D2D] p-6 rounded-lg border border-[#F59E0B]/30">
            <h2 className="text-xl font-medium mb-4">Estructura de la respuesta:</h2>
            <pre className="text-sm text-gray-300 bg-[#1E1E1E] p-4 rounded-lg overflow-auto max-h-[500px]">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>Si ves datos en la respuesta, el problema está en el frontend.</p>
          <p>Si ves un error, el problema está en el endpoint.</p>
        </div>
      </div>
    </div>
  );
}