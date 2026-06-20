import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get('categoria');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);

  console.log('🔍 Parámetros recibidos:', { categoria, page, limit });

  // Validar parámetros
  if (page < 1 || limit < 1 || limit > 100) {
    return NextResponse.json(
      { error: 'Parámetros de paginación inválidos' },
      { status: 400 }
    );
  }

  const offset = (page - 1) * limit;

  try {
    // Consulta simple sin caché ni ordenamiento complejo
    let query = supabase
      .from('productos')
      .select('*', { count: 'exact' });

    if (categoria) {
      query = query.eq('categoria', categoria);
    }

    // Intentar ordenar por 'id' (si falla, lo capturamos abajo)
    query = query
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Error de Supabase:', error);
      return NextResponse.json(
        { error: `Supabase error: ${error.message}`, code: error.code, details: error.details },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      pagination: {
        total: count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    });
  } catch (error) {
    console.error('💥 Error inesperado:', error);
    return NextResponse.json(
      { error: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}