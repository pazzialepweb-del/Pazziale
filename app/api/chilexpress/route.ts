// app/api/chilexpress/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  // Este es TU body (lo copié exacto de lo que te generó)
  const body = {
    originCountyCode: "STGO",
    destinationCountyCode: "PROV",
    package: {
      weight: "16",
      height: "1",
      width: "1",
      length: "1"
    },
    productType: 3,
    contentType: 1,
    declaredWorth: "2333",
    deliveryTime: 0
  };

  try {
    const response = await fetch('https://testservices.wschilexpress.com/rating/api/v1.0/rates/courier', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        // 🔥 CAMBIO IMPORTANTE: usas la variable de entorno, NO la clave dura
        'Ocp-Apim-Subscription-Key': process.env.CHILEXPRESS_API_KEY!,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json(); // Cambié .text() por .json() para que te devuelva el objeto directo
    
    // Devuelves la respuesta al frontend
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error al cotizar en Chilexpress' },
      { status: 500 }
    );
  }
}