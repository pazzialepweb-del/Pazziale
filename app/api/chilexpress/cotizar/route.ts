// app/api/chilexpress/cotizar/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { destinationCountyCode, weight, height, width, length, declaredWorth } = body;

    // Obtener la clave de API desde variables de entorno
    const API_KEY = process.env.CHILEXPRESS_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'CHILEXPRESS_API_KEY no configurada' },
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
          'Ocp-Apim-Subscription-Key': API_KEY,
        },
        body: JSON.stringify({
          originCountyCode: 'TALCA', // 📦 Origen fijo: Talca (cambia si es necesario)
          destinationCountyCode: destinationCountyCode || 'PROV',
          package: {
            weight: weight || '1',
            height: height || '1',
            width: width || '1',
            length: length || '1',
          },
          productType: 3, // 3 = Encomienda
          contentType: 1,
          declaredWorth: declaredWorth || '0',
          deliveryTime: 0, // 0 = Todos los servicios
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Si la respuesta no es 200, devolvemos el error detallado
      return NextResponse.json(
        { 
          error: data.statusDescription || data.errors || 'Error en la API de Chilexpress',
          details: data.errors || null
        },
        { status: response.status }
      );
    }

    // Extraer las opciones de servicio
    const courierOptions = data.data?.courierServiceOptions || [];

    // Devolver todas las opciones y la primera como predeterminada
    const firstOption = courierOptions.length > 0 ? courierOptions[0] : null;

    return NextResponse.json({
      success: true,
      serviceValue: firstOption?.serviceValue || null,
      serviceDescription: firstOption?.serviceDescription || null,
      finalWeight: firstOption?.finalWeight || null,
      allOptions: courierOptions,
    });
  } catch (error) {
    console.error('❌ Error en cotización Chilexpress:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}