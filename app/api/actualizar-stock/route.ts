// app/api/actualizar-stock/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { external_reference } = await req.json();

    if (!external_reference) {
      return NextResponse.json(
        { error: 'Falta external_reference' },
        { status: 400 }
      );
    }

    // 1. Buscar el pedido por external_reference
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .select('*')
      .eq('external_reference', external_reference)
      .single();

    if (pedidoError || !pedido) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    // 2. Si ya está pagado o ya se actualizó el stock, no hacer nada
    if (pedido.estado === 'pagado' || pedido.estado === 'completado') {
      return NextResponse.json({
        message: 'Pedido ya procesado',
        yaProcesado: true,
      });
    }

    // 3. Actualizar stock de cada producto
    const items = pedido.items; // [{ producto_id, cantidad, ... }]
    let stockActualizado = true;

    for (const item of items) {
      // Obtener stock actual
      const { data: producto, error: productError } = await supabase
        .from('productos')
        .select('stock')
        .eq('id', item.producto_id)
        .single();

      if (productError) {
        console.error(`Error al obtener stock del producto ${item.producto_id}:`, productError);
        stockActualizado = false;
        continue;
      }

      const nuevoStock = producto.stock - item.cantidad;

      // Si el stock queda negativo, puedes manejarlo (por ejemplo, no actualizar)
      if (nuevoStock < 0) {
        console.warn(`Stock insuficiente para ${item.producto_id}. Stock: ${producto.stock}, pedido: ${item.cantidad}`);
        // Decides si quieres fallar el pedido o forzar a 0
        // Forzamos a 0 para no tener números negativos
        // Pero mejor registrar el problema y no actualizar este producto.
        // En este ejemplo, lo dejamos como está y continuamos.
        // Opcional: puedes lanzar un error y detener todo.
        // return NextResponse.json({ error: 'Stock insuficiente' }, { status: 400 });
      }

      // Actualizar stock (solo si nuevoStock >= 0 o si decides forzar)
      if (nuevoStock >= 0) {
        const { error: updateError } = await supabase
          .from('productos')
          .update({ stock: nuevoStock })
          .eq('id', item.producto_id);

        if (updateError) {
          console.error(`Error al actualizar stock de ${item.producto_id}:`, updateError);
          stockActualizado = false;
        }
      } else {
        // Si no hay suficiente stock, podrías poner stock en 0 o mantenerlo
        // En este ejemplo, dejamos el stock como está y marcamos el pedido con problema
        stockActualizado = false;
      }
    }

    // 4. Actualizar estado del pedido a 'pagado' (o 'completado')
    const nuevoEstado = stockActualizado ? 'pagado' : 'stock_parcial';
    const { error: updatePedidoError } = await supabase
      .from('pedidos')
      .update({ estado: nuevoEstado })
      .eq('id', pedido.id);

    if (updatePedidoError) {
      console.error('Error al actualizar estado del pedido:', updatePedidoError);
    }

    return NextResponse.json({
      message: stockActualizado ? 'Stock actualizado correctamente' : 'Stock actualizado con problemas',
      stockActualizado,
      estado: nuevoEstado,
    });
  } catch (error) {
    console.error('Error en actualizar-stock:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}