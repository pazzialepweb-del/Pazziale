import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

// ✅ CLAVES DE SANDBOX YA CONFIGURADAS
const accessToken = "APP_USR-2041772874821685-061916-ddfcac0436eab41fd209ecca886f855a-3486448774";

const client = new MercadoPagoConfig({
  accessToken: accessToken,
});

export async function POST(request: Request) {
  try {
    // 1. Obtener datos del frontend
    const body = await request.json();
    const { items, payer, total } = body;

    // Validaciones básicas
    if (!items || !payer || !total) {
      return NextResponse.json(
        { error: 'Faltan datos para generar la preferencia' },
        { status: 400 }
      );
    }

    // 2. Detectar el origen de la petición (localhost o dominio real)
    // Esto sirve para las URLs de redirección y el webhook automáticamente
    const origin = new URL(request.url).origin;

    // 3. Construir el objeto de la preferencia para Mercado Pago
    const preference = new Preference(client);

    const preferenceData = {
      // Items del carrito
      items: items.map((item: any) => ({
        id: item.id,
        title: item.nombre,
        quantity: item.cantidad,
        unit_price: item.precio,
        currency_id: 'CLP',
      })),
      
      // Datos del pagador
      payer: {
        name: payer.nombre,
        email: payer.email,
        phone: {
          area_code: '',
          number: payer.telefono,
        },
      },
      
      // URLs de retorno (éxito, fracaso, pendiente)
      back_urls: {
        success: `${origin}/pago-exitoso`,
        failure: `${origin}/pago-fallido`,
        pending: `${origin}/pago-pendiente`,
      },
      
      // Configuración avanzada
      auto_return: 'approved', // Redirige automáticamente al success si el pago aprueba
      notification_url: `${origin}/api/webhook-mercadopago`, // Webhook para actualizar el estado en Supabase
      external_reference: `pedido_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`, // Identificador único
    };

    // 4. Crear la preferencia en Mercado Pago
    const result = await preference.create({ body: preferenceData });

    // 5. Devolver los datos al frontend
    return NextResponse.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    });

  } catch (error: any) {
    console.error('💥 Error creando preferencia de pago:', error);
    
    // Si el token es inválido
    if (error.message?.includes('Invalid access token')) {
      return NextResponse.json(
        { error: 'Token de Mercado Pago inválido. Asegúrate de que el token sea correcto.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Error interno al crear la preferencia' },
      { status: 500 }
    );
  }
}