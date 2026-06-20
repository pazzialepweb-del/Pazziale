import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

// 🔥 El token se lee desde las variables de entorno (.env.local)
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken) {
  console.warn('⚠️ MERCADOPAGO_ACCESS_TOKEN no está configurado en las variables de entorno.');
}

const client = new MercadoPagoConfig({
  accessToken: accessToken || '',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, payer, total } = body;

    if (!items || !payer || !total) {
      return NextResponse.json({ error: 'Faltan datos para generar la preferencia' }, { status: 400 });
    }

    const origin = new URL(request.url).origin;

    const preference = new Preference(client);

    const preferenceData = {
      items: items.map((item: any) => ({
        id: item.id,
        title: item.nombre,
        quantity: item.cantidad,
        unit_price: item.precio,
        currency_id: 'CLP',
      })),
      payer: {
        name: payer.nombre,
        email: payer.email,
        phone: { area_code: '', number: payer.telefono },
      },
      back_urls: {
        success: `${origin}/pago-exitoso`,
        failure: `${origin}/pago-fallido`,
        pending: `${origin}/pago-pendiente`,
      },
      auto_return: 'approved',
      notification_url: `${origin}/api/webhook-mercadopago`,
      external_reference: `pedido_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
    };

    const result = await preference.create({ body: preferenceData });

    return NextResponse.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    });

  } catch (error: any) {
    console.error('💥 Error creando preferencia de pago:', error);
    
    if (error.message?.includes('Invalid access token')) {
      return NextResponse.json(
        { error: 'Token de Mercado Pago inválido. Asegúrate de configurar las claves en .env.local' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Error interno al crear la preferencia' },
      { status: 500 }
    );
  }
}