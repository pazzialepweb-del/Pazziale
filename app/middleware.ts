import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { kv } from '@vercel/kv';

export const config = {
  matcher: '/api/:path*',
};

// Configuración del rate limiting
const RATE_LIMIT = 30; // 30 peticiones por minuto
const WINDOW_MS = 60 * 1000; // 1 minuto

export async function middleware(request: NextRequest) {
  // Obtener la IP real del cliente
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] ?? realIp ?? 'anonymous';

  const key = `rate_limit:${ip}`;
  const now = Date.now();

  try {
    // Obtener el contador actual y el timestamp de la primera petición en la ventana
    const record = await kv.get<{ count: number; start: number }>(key);
    
    if (!record) {
      // Primera petición en esta ventana
      await kv.set(key, { count: 1, start: now }, { ex: 60 });
      return NextResponse.next();
    }

    // Calcular si la ventana ha expirado
    if (now - record.start > WINDOW_MS) {
      // Ventana expirada: reiniciar
      await kv.set(key, { count: 1, start: now }, { ex: 60 });
      return NextResponse.next();
    }

    // Verificar si se ha excedido el límite
    if (record.count >= RATE_LIMIT) {
      // Si se excede, devolvemos error 429 con el tiempo de espera
      const resetTime = Math.ceil((record.start + WINDOW_MS - now) / 1000);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Demasiadas peticiones. Inténtalo de nuevo más tarde.',
          resetIn: resetTime 
        }),
        { 
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Incrementar el contador y actualizar el TTL
    await kv.set(key, { count: record.count + 1, start: record.start }, { ex: 60 });
    return NextResponse.next();
  } catch (error) {
    // Si Vercel KV falla, permitir la petición (pero loguear el error)
    console.error('KV error:', error);
    return NextResponse.next();
  }
}