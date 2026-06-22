// app/api/chilexpress/regiones/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.CHILEXPRESS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Clave de API no configurada' },
        { status: 500 }
      );
    }

    // 1. Obtener las regiones (código 99 = todas)
    const regionesRes = await fetch(
      'https://testservices.wschilexpress.com/georeference/api/v1.0/regions',
      {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
        },
      }
    );

    if (!regionesRes.ok) {
      throw new Error('Error al obtener regiones');
    }

    const regionesData = await regionesRes.json();
    const regiones = regionesData.regions || [];

    // 2. Para cada región, obtener sus comunas
    const regionesConComunas = await Promise.all(
      regiones.map(async (region: any) => {
        try {
          const comunasRes = await fetch(
            `https://testservices.wschilexpress.com/georeference/api/v1.0/regions/${region.code}/communes`,
            {
              headers: {
                'Ocp-Apim-Subscription-Key': apiKey,
              },
            }
          );

          if (!comunasRes.ok) {
            return { ...region, communes: [] };
          }

          const comunasData = await comunasRes.json();
          return {
            ...region,
            communes: comunasData.communes || [],
          };
        } catch (error) {
          return { ...region, communes: [] };
        }
      })
    );

    return NextResponse.json(regionesConComunas);
  } catch (error) {
    console.error('Error en API de regiones:', error);
    return NextResponse.json(
      { error: 'Error al obtener regiones y comunas' },
      { status: 500 }
    );
  }
}