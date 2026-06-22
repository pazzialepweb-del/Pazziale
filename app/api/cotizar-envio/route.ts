// app/api/cotizar-envio/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Datos fijos de origen (desde Talca) - asumimos código comuna de Talca
const ORIGEN_CODIGO = 'TALCA'; // Reemplaza con el código real de Talca según Chilexpress

export async function POST(request: NextRequest) {
  try {
    // El frontend enviará el código de destino y el peso total del carrito
    const body = await request.json();
    const { destinoCodigo, pesoTotal } = body;

    if (!destinoCodigo) {
      return NextResponse.json(
        { error: 'El código de destino es obligatorio' },
        { status: 400 }
      );
    }

    // Construir payload para Chilexpress
    const payload = {
      originCountyCode: ORIGEN_CODIGO,
      destinationCountyCode: destinoCodigo,
      package: {
        weight: pesoTotal?.toString() || '1', // peso en kg
        height: '10', // altura en cm (valor por defecto)
        width: '10',
        length: '10',
      },
      productType: 3, // Tipo de producto (3 = mercancía general)
      contentType: 1, // 1 = documento, 2 = mercancía (usamos 1 para simplificar)
      declaredWorth: '0', // valor declarado (opcional)
      deliveryTime: 0, // 0 = entrega normal
    };

    // Llamada real a Chilexpress
    const response = await fetch(
      'https://testservices.wschilexpress.com/rating/api/v1.0/rates/courier',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Ocp-Apim-Subscription-Key': process.env.CHILEXPRESS_API_KEY!,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      // Si la API devuelve error, capturamos el mensaje
      const errorText = await response.text();
      console.error('Error Chilexpress:', response.status, errorText);
      return NextResponse.json(
        { error: `Error en API de Chilexpress: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Suponiendo que la respuesta tiene algo como: { rates: [{ serviceType: 1, total: 4000 }] }
    // Extraemos el precio del envío (puede variar según la estructura real)
    // Ajusta según la respuesta real de Chilexpress.
    let costoEnvio = 0;
    if (data.rates && data.rates.length > 0) {
      // Tomamos el primer rate (puedes filtrar por serviceType si hay varios)
      costoEnvio = data.rates[0].total || 0;
    } else if (data.total) {
      costoEnvio = data.total;
    } else {
      // Si no encontramos, devolvemos un error
      return NextResponse.json(
        { error: 'No se pudo obtener el costo de envío' },
        { status: 500 }
      );
    }

    return NextResponse.json({ costo: costoEnvio });
  } catch (error) {
    console.error('Error en cotización:', error);
    return NextResponse.json(
      { error: 'Error interno al cotizar envío' },
      { status: 500 }
    );
  }
}