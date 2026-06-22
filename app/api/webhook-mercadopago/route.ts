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

    // Seguridad
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
    }

    if (type !== 'payment') return NextResponse.json({ received: true }, { status: 200 });

    const paymentId = data.id;
    if (!MERCADOPAGO_ACCESS_TOKEN) throw new Error('MERCADOPAGO_ACCESS_TOKEN no configurado');

    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}` },
    });

    if (!mpResponse.ok) throw new Error('Error al consultar el pago en Mercado Pago');

    const paymentData = await mpResponse.json();
    const externalRef = paymentData.external_reference;
    console.log('💳 Pago aprobado. Buscando pedido con external_reference:', externalRef);

    let estadoTienda = 'verificando';
    let pagado = false;

    if (paymentData.status === 'approved') {
      estadoTienda = 'pagado';
      pagado = true;

      // 1. Obtener el pedido completo desde Supabase
      const { data: pedidoCompleto, error: pedidoError } = await supabase
        .from('pedidos')
        .select('items')
        .eq('external_reference', externalRef)
        .single();

      if (pedidoError || !pedidoCompleto) {
        console.error('❌ Error al buscar el pedido en Supabase:', pedidoError, 'ExternalRef:', externalRef);
        throw new Error(`Pedido no encontrado o error en BD: ${pedidoError?.message || 'No data'}`);
      }

      console.log('✅ Pedido encontrado. Items:', pedidoCompleto.items);

      // 2. Descontar el stock
      const itemsDelPedido = pedidoCompleto.items;
      if (itemsDelPedido && Array.isArray(itemsDelPedido) && itemsDelPedido.length > 0) {
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
            console.log(`📉 Stock de ${item.nombre} (${item.producto_id}) actualizado a ${nuevoStock}`);
          } else {
            console.warn(`⚠️ No se encontró el producto con ID: ${item.producto_id}`);
          }
        }
      } else {
        console.warn('⚠️ El pedido no tiene items o está vacío:', itemsDelPedido);
      }
    } else if (paymentData.status === 'pending') {
      estadoTienda = 'pendiente';
    } else if (paymentData.status === 'rejected') {
      estadoTienda = 'rechazado';
    } else if (paymentData.status === 'refunded') {
      estadoTienda = 'reembolsado';
    }

    // 3. Actualizar el estado del pedido
    const { error: updateError } = await supabase
      .from('pedidos')
      .update({
        estado: estadoTienda,
        pagado: pagado,
        fecha_pago: pagado ? new Date().toISOString() : null,
      })
      .eq('external_reference', externalRef);

    if (updateError) {
      console.error('❌ Error actualizando estado del pedido:', updateError);
      throw updateError;
    }

    console.log(`✅ Pedido con external_reference ${externalRef} actualizado a estado: ${estadoTienda}`);
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('💥 Error en el webhook:', error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}