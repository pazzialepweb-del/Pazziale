import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const API_KEY = process.env.CHILEXPRESS_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: 'API Key no configurada' }, { status: 500 });
    }

    // Obtener regiones
    const regionsRes = await fetch(
      'https://testservices.wschilexpress.com/coverage/api/v1.0/regions',
      {
        headers: { 'Ocp-Apim-Subscription-Key': API_KEY },
      }
    );
    const regionsData = await regionsRes.json();

    // Para cada región, obtener sus comunas
    const allComunas = [];
    for (const region of regionsData.data || []) {
      const communesRes = await fetch(
        `https://testservices.wschilexpress.com/coverage/api/v1.0/regions/${region.regionCode}/communes`,
        {
          headers: { 'Ocp-Apim-Subscription-Key': API_KEY },
        }
      );
      const communesData = await communesRes.json();
      const comunas = (communesData.data || []).map((c: any) => ({
        codigo: c.countyCode,
        nombre: c.countyName,
        region: region.regionName,
      }));
      allComunas.push(...comunas);
    }

    return NextResponse.json({ comunas: allComunas });
  } catch (error) {
    console.error('Error obteniendo comunas:', error);
    return NextResponse.json({ error: 'Error al obtener comunas' }, { status: 500 });
  }
}