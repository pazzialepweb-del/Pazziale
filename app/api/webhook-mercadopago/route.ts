import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const MERCADOPAGO_WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const jsonBody = JSON.parse(body);
    const { type, data } = jsonBody;

    console.log('📩 Webhook recibido:', { type, data });

    // ✅ SEGURIDAD ACTIVADA: Verificar la firma de Mercado Pago
    const xSignature = request.headers.get('x-signature');
    const xRequestId = request.headers.get('x-request-id');
    
    if (xSignature && MERCADOPAGO_WEBHOOK_SECRET) {
      const parts = xSignature.split(',');
      let ts = '', hash = '';
      parts.forEach(part => {
        const [key, value] = part.split('=');
        if (key === 'ts') ts = value;
        if (key === 'v1') hash = value;
      });

      const manifest = `${data.id}${xRequestId}${ts}`;
      const hmac = crypto.createHmac('sha256', MERCADOPAGO_WEBHOOK_SECRET);
      hmac.update(manifest);
      const calculatedHash = hmac.digest('hex');

      if (calculatedHash !== hash) {
        console.warn('⛔️ Firma inválida en el webhook, ignorando petición.');
        return NextResponse.json({ received: false }, { status: 200 });
      }
      console.log('✅ Firma verificada correctamente.');
    }

    if (type !== 'payment') return NextResponse.json({ received: true }, { status: 200 });

    const paymentId = data.id;
    if (!MERCADOPAGO_ACCESS_TOKEN) throw new Error('MERCADOPAGO_ACCESS_TOKEN no configurado');

    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}` },
    });

    if (!mpResponse.ok) throw new Error('Error al consultar el pago en Mercado Pago');

    const paymentData = await mpResponse.json();
    console.log('💳 Detalle del pago MP:', {
      id: paymentData.id,
      status: paymentData.status,
      status_detail: paymentData.status_detail,
      external_reference: paymentData.external_reference,
    });

    const externalRef = paymentData.external_reference;

    let estadoTienda = 'verificando';
    let pagado = false;

    if (paymentData.status === 'approved') {
      estadoTienda = 'pagado';
      pagado = true;

      // 1. Obtener el pedido completo para tener los items
      const { data: pedidoCompleto, error: pedidoError } = await supabase
        .from('pedidos')
        .select('items')
        .eq('external_reference', externalRef)
        .single();

      if (pedidoError || !pedidoCompleto) {
        console.error('❌ Error al obtener los items del pedido para descontar stock:', pedidoError);
      } else {
        const itemsDelPedido = pedidoCompleto.items;
        if (itemsDelPedido && Array.isArray(itemsDelPedido)) {
          for (const item of itemsDelPedido) {
            const { data: currentProduct } = await supabase
              .from('productos')
              .select('stock')
              .eq('id', item.producto_id)
              .single();

            if (currentProduct) {
              const nuevoStock = Math.max(0, currentProduct.stock - item.cantidad);
              await supabase
                .from('productos')
                .update({ stock: nuevoStock })
                .eq('id', item.producto_id);
            }
          }
          console.log('✅ Stock descontado correctamente.');
        }
      }
    } else if (paymentData.status === 'pending') {
      estadoTienda = 'pendiente';
    } else if (paymentData.status === 'rejected') {
      estadoTienda = 'rechazado';
    } else if (paymentData.status === 'refunded') {
      estadoTienda = 'reembolsado';
    }

    if (!externalRef) {
      console.warn('⚠️ El pago no tiene external_reference, no podemos actualizar el pedido.');
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const { data: pedido, error: findError } = await supabase
      .from('pedidos')
      .select('id')
      .eq('external_reference', externalRef)
      .single();

    if (findError || !pedido) {
      console.warn('⚠️ No se encontró el pedido con external_reference:', externalRef);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const { error: updateError } = await supabase
      .from('pedidos')
      .update({
        estado: estadoTienda,
        pagado: pagado,
        fecha_pago: pagado ? new Date().toISOString() : null,
      })
      .eq('id', pedido.id);

    if (updateError) {
      console.error('❌ Error actualizando el pedido en Supabase:', updateError);
      throw updateError;
    }

    console.log(`✅ Pedido ${pedido.id} actualizado a estado: ${estadoTienda}`);

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('💥 Error procesando webhook:', error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}