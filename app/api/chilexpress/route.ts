// app/api/chilexpress/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const apiKey = process.env.CHILEXPRESS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Clave de API no configurada' },
        { status: 500 }
      );
    }

    const response = await fetch(
      'https://testservices.wschilexpress.com/rating/api/v1.0/rates/courier',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Ocp-Apim-Subscription-Key': apiKey,
        },
        body: JSON.stringify({
          originCountyCode: 'STGO',
          destinationCountyCode: body.destinationCountyCode || 'PROV',
          package: {
            weight: body.weight || '1',
            height: '1',
            width: '1',
            length: '1',
          },
          productType: 3,
          contentType: 1,
          declaredWorth: body.declaredWorth || '0',
          deliveryTime: 0,
        }),
      }
    );

    const data = await response.json();

    // 🔥 Si la respuesta no es OK, devolvemos el error tal cual
    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Error en la API de Chilexpress' },
        { status: response.status }
      );
    }

    // 📌 Extraer el costo (ajusta según la estructura real de la API)
    const rate = data.rate || data.total || data.price || null;

    if (rate === null) {
      return NextResponse.json(
        { error: 'No se encontró tarifa para la comuna ingresada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ rate, ...data }, { status: 200 });
  } catch (error) {
    console.error('❌ Error en API Chilexpress:', error);
    return NextResponse.json(
      { error: 'Error interno al cotizar' },
      { status: 500 }
    );
  }
}