'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Trash2, Edit, Plus, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categoria: string;
  stock: number;
  dimensiones: string;
}

interface Pedido {
  id: string;
  user_id: string;
  nombre_cliente: string;
  telefono_cliente: string;
  email_cliente: string;
  direccion_envio: string;
  total: number;
  estado: 'verificando' | 'verificado' | 'en envío' | 'recibido';
  metodo_envio: string | null;
  numero_seguimiento: string | null;
  items: any[];
  fecha_pedido: string;
  fecha_actualizacion: string;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [esAdmin, setEsAdmin] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [modalProductoOpen, setModalProductoOpen] = useState(false);
  const [modalPedidoOpen, setModalPedidoOpen] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [actualizandoPedido, setActualizandoPedido] = useState(false);
  
  // Formulario de productos
  const [formProducto, setFormProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    stock: '',
    dimensiones: '',
    imagen: null as File | null
  });

  // Formulario de pedidos
  const [formPedido, setFormPedido] = useState({
    estado: 'verificando',
    metodo_envio: '',
    numero_seguimiento: ''
  });

  const router = useRouter();

  useEffect(() => {
    verificarAdmin();
  }, []);

  async function verificarAdmin() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/auth/login');

      const { data: perfil } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', user.id)
        .single();

      if (perfil?.rol !== 'admin') return router.push('/tienda');

      setEsAdmin(true);
      cargarDatos();
    } catch (error) {
      console.error('Error verificando admin:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }

  async function cargarDatos() {
    // Cargar productos
    try {
      const { data: productosData, error: productosError } = await supabase
        .from('productos')
        .select('*');
      if (productosError) throw productosError;
      setProductos(productosData || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }

    // Cargar pedidos
    try {
      const { data: pedidosData, error: pedidosError } = await supabase
        .from('pedidos')
        .select('*')
        .order('fecha_pedido', { ascending: false });
      if (pedidosError) throw pedidosError;
      setPedidos(pedidosData || []);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    }
  }

  // --- FUNCIONES DE PRODUCTOS (MANTENIDAS) ---
  async function subirImagen(file: File): Promise<string> {
    const nombreArchivo = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('productos')
      .upload(nombreArchivo, file);

    if (error) throw new Error('Error subiendo imagen: ' + error.message);

    const { data: urlData } = supabase.storage
      .from('productos')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  }

  async function handleSubmitProducto(e: React.FormEvent) {
    e.preventDefault();
    setSubiendo(true);

    try {
      let imagen_url = editandoId 
        ? productos.find(p => p.id === editandoId)?.imagen_url || '' 
        : '';

      if (formProducto.imagen) {
        imagen_url = await subirImagen(formProducto.imagen);
      }

      const productoData = {
        nombre: formProducto.nombre,
        descripcion: formProducto.descripcion,
        precio: parseFloat(formProducto.precio),
        categoria: formProducto.categoria,
        imagen_url: imagen_url,
        stock: parseInt(formProducto.stock) || 0,
        dimensiones: formProducto.dimensiones
      };

      if (editandoId) {
        const { error } = await supabase
          .from('productos')
          .update(productoData)
          .eq('id', editandoId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('productos')
          .insert([productoData]);
        if (error) throw error;
      }

      await cargarDatos();
      cerrarModalProducto();
    } catch (error) {
      console.error('💥 Error completo guardando producto:', error);
      alert('Error al guardar producto: ' + JSON.stringify(error, null, 2));
    } finally {
      setSubiendo(false);
    }
  }

  async function handleEliminarProducto(id: string) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      const producto = productos.find(p => p.id === id);
      
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);
      if (error) throw error;

      if (producto?.imagen_url) {
        const path = producto.imagen_url.split('/productos/')[1];
        if (path) {
          await supabase.storage.from('productos').remove([path]);
        }
      }

      await cargarDatos();
    } catch (error) {
      console.error('Error eliminando producto:', error);
      alert('Error al eliminar producto');
    }
  }

  function abrirModalProducto(producto?: Producto) {
    if (producto) {
      setEditandoId(producto.id);
      setFormProducto({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio.toString(),
        categoria: producto.categoria,
        stock: producto.stock.toString(),
        dimensiones: producto.dimensiones || '',
        imagen: null
      });
    } else {
      setEditandoId(null);
      setFormProducto({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: '',
        stock: '',
        dimensiones: '',
        imagen: null
      });
    }
    setModalProductoOpen(true);
  }

  function cerrarModalProducto() {
    setModalProductoOpen(false);
    setEditandoId(null);
    setFormProducto({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: '',
      stock: '',
      dimensiones: '',
      imagen: null
    });
  }

  // --- FUNCIONES DE PEDIDOS ---

  function abrirModalPedido(pedido?: Pedido) {
    if (pedido) {
      setEditandoId(pedido.id);
      setFormPedido({
        estado: pedido.estado,
        metodo_envio: pedido.metodo_envio || '',
        numero_seguimiento: pedido.numero_seguimiento || ''
      });
    } else {
      setEditandoId(null);
      setFormPedido({
        estado: 'verificando',
        metodo_envio: '',
        numero_seguimiento: ''
      });
    }
    setModalPedidoOpen(true);
  }

  function cerrarModalPedido() {
    setModalPedidoOpen(false);
    setEditandoId(null);
    setFormPedido({
      estado: 'verificando',
      metodo_envio: '',
      numero_seguimiento: ''
    });
  }

  async function handleSubmitPedido(e: React.FormEvent) {
    e.preventDefault();
    if (!editandoId) return;
    setActualizandoPedido(true);

    try {
      // ⚠️ CAMBIO IMPORTANTE: AÑADIMOS .select() PARA VERIFICAR CUÁNTAS FILAS SE ACTUALIZARON
      const { data: updatedData, error } = await supabase
        .from('pedidos')
        .update({
          estado: formPedido.estado,
          metodo_envio: formPedido.metodo_envio || null,
          numero_seguimiento: formPedido.numero_seguimiento || null,
          fecha_actualizacion: new Date().toISOString()
        })
        .eq('id', editandoId)
        .select(); // 👈 ESTA LÍNEA ES LA CLAVE PARA DETECTAR EL ERROR

      if (error) {
        console.error('❌ Error de Supabase:', error);
        throw error;
      }

      // Verificar si se actualizó alguna fila
      if (!updatedData || updatedData.length === 0) {
        console.warn('⚠️ No se encontró ningún pedido con el ID:', editandoId);
        throw new Error('No se pudo actualizar el pedido. Es posible que el ID no sea válido.');
      }

      console.log('✅ Datos actualizados correctamente:', updatedData);

      // Recargar datos y cerrar modal
      await cargarDatos();
      cerrarModalPedido();
      router.refresh();
    } catch (error) {
      console.error('💥 Error completo en catch:', error);
      alert('Error al actualizar pedido:\n\n' + 
        (error instanceof Error ? error.message : 'Error desconocido') + 
        '\n\nRevisa la consola del navegador para más detalles.');
    } finally {
      setActualizandoPedido(false);
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'verificando': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400';
      case 'verificado': return 'bg-blue-500/20 text-blue-400 border-blue-400';
      case 'en envío': return 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]';
      case 'recibido': return 'bg-green-500/20 text-green-400 border-green-400';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-[#EC4899]" />
      </div>
    </div>
  );
  
  if (!esAdmin) return null;

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white pb-20">
      <Navbar />
      
      <div className="pt-24 px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-serif text-white">Panel de Administración</h1>
          <button
            onClick={() => abrirModalProducto()}
            className="flex items-center gap-2 bg-[#EC4899] text-white px-6 py-2 rounded-full font-medium hover:bg-[#F59E0B] transition-all shadow-lg shadow-[#EC4899]/30"
          >
            <Plus className="w-5 h-5" /> Agregar Producto
          </button>
        </div>
        
        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#2D2D2D] p-6 rounded-lg border border-[#F59E0B]/30">
            <h2 className="text-xl font-medium mb-2 text-[#F59E0B]">Productos</h2>
            <p className="text-3xl font-serif text-[#EC4899]">{productos.length}</p>
          </div>
          <div className="bg-[#2D2D2D] p-6 rounded-lg border border-[#F59E0B]/30">
            <h2 className="text-xl font-medium mb-2 text-[#F59E0B]">Pedidos Totales</h2>
            <p className="text-3xl font-serif text-[#EC4899]">{pedidos.length}</p>
          </div>
          <div className="bg-[#2D2D2D] p-6 rounded-lg border border-[#F59E0B]/30">
            <h2 className="text-xl font-medium mb-2 text-[#F59E0B]">Pendientes</h2>
            <p className="text-3xl font-serif text-[#EC4899]">{pedidos.filter(p => p.estado === 'verificando').length}</p>
          </div>
          <div className="bg-[#2D2D2D] p-6 rounded-lg border border-[#F59E0B]/30">
            <h2 className="text-xl font-medium mb-2 text-[#F59E0B]">En envío</h2>
            <p className="text-3xl font-serif text-[#EC4899]">{pedidos.filter(p => p.estado === 'en envío').length}</p>
          </div>
        </div>

        {/* --- LISTA DE PEDIDOS --- */}
        <h2 className="text-2xl font-serif mb-4 text-[#EC4899]">Gestión de Pedidos</h2>
        <div className="overflow-x-auto bg-[#2D2D2D] rounded-lg border border-[#F59E0B]/30 mb-10">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#F59E0B]/30 text-left text-sm uppercase tracking-wider text-gray-400">
                <th className="p-4">ID</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Total</th>
                <th className="p-4">Dirección</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Envío</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="border-b border-[#F59E0B]/20 hover:bg-[#1E1E1E] transition-colors">
                  <td className="p-4 font-mono text-xs text-gray-400">{pedido.id.slice(0, 8)}</td>
                  <td className="p-4">{pedido.nombre_cliente || 'Sin nombre'}</td>
                  <td className="p-4 text-[#EC4899] font-medium">${pedido.total.toLocaleString()}</td>
                  <td className="p-4 text-sm text-gray-400 max-w-[150px] truncate">{pedido.direccion_envio}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEstadoColor(pedido.estado)}`}>
                      {pedido.estado}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {pedido.metodo_envio || '—'}
                    {pedido.numero_seguimiento && <span className="block text-[#F59E0B] text-xs">{pedido.numero_seguimiento}</span>}
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => abrirModalPedido(pedido)}
                      className="p-2 bg-[#EC4899]/20 hover:bg-[#EC4899]/40 rounded-lg transition-colors text-[#EC4899]"
                      title="Editar pedido"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pedidos.length === 0 && (
            <div className="text-center py-12 text-gray-400">No hay pedidos registrados.</div>
          )}
        </div>

        {/* --- LISTA DE PRODUCTOS --- */}
        <h2 className="text-2xl font-serif mb-4 text-[#EC4899]">Gestión de Productos</h2>
        <div className="overflow-x-auto bg-[#2D2D2D] rounded-lg border border-[#F59E0B]/30">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#F59E0B]/30 text-left text-sm uppercase tracking-wider text-gray-400">
                <th className="p-4">Imagen</th>
                <th className="p-4">Nombre</th>
                <th className="p-4 hidden md:table-cell">Categoría</th>
                <th className="p-4">Precio</th>
                <th className="p-4 hidden md:table-cell">Stock</th>
                <th className="p-4 hidden md:table-cell">Dimensiones</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} className="border-b border-[#F59E0B]/20 hover:bg-[#1E1E1E] transition-colors">
                  <td className="p-4">
                    <img 
                      src={producto.imagen_url} 
                      alt={producto.nombre} 
                      className="w-12 h-12 rounded-lg object-cover border border-[#F59E0B]/30"
                    />
                  </td>
                  <td className="p-4 font-medium text-white">{producto.nombre}</td>
                  <td className="p-4 hidden md:table-cell text-gray-400">{producto.categoria}</td>
                  <td className="p-4 text-[#EC4899] font-medium">${producto.precio.toLocaleString()}</td>
                  <td className="p-4 hidden md:table-cell text-[#F59E0B] font-medium">{producto.stock}</td>
                  <td className="p-4 hidden md:table-cell text-gray-400 text-sm truncate max-w-[150px]">{producto.dimensiones}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => abrirModalProducto(producto)}
                      className="p-2 bg-[#EC4899]/20 hover:bg-[#EC4899]/40 rounded-lg transition-colors text-[#EC4899]"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEliminarProducto(producto.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors text-red-400"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {productos.length === 0 && (
            <div className="text-center py-12 text-gray-400">No hay productos registrados.</div>
          )}
        </div>
      </div>

      {/* --- MODAL FORM PRODUCTOS --- */}
      {modalProductoOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] border border-[#EC4899]/30 rounded-2xl max-w-lg w-full p-8 relative shadow-2xl">
            <button
              onClick={cerrarModalProducto}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-serif mb-6 text-white">{editandoId ? 'Editar' : 'Agregar'} Producto</h2>
            
            <form onSubmit={handleSubmitProducto} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Nombre</label>
                <input
                  type="text"
                  value={formProducto.nombre}
                  onChange={(e) => setFormProducto({...formProducto, nombre: e.target.value})}
                  className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Descripción</label>
                <textarea
                  value={formProducto.descripcion}
                  onChange={(e) => setFormProducto({...formProducto, descripcion: e.target.value})}
                  className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white min-h-[80px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Precio ($)</label>
                  <input
                    type="number"
                    value={formProducto.precio}
                    onChange={(e) => setFormProducto({...formProducto, precio: e.target.value})}
                    className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Stock</label>
                  <input
                    type="number"
                    value={formProducto.stock}
                    onChange={(e) => setFormProducto({...formProducto, stock: e.target.value})}
                    className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Categoría</label>
                  <select
                    value={formProducto.categoria}
                    onChange={(e) => setFormProducto({...formProducto, categoria: e.target.value})}
                    className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                    required
                  >
                    <option value="">Seleccionar</option>
                    <option value="Anillos">Anillos</option>
                    <option value="Pendientes">Pendientes</option>
                    <option value="Collares">Collares</option>
                    <option value="Pulseras">Pulseras</option>
                    <option value="Broches">Broches</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Dimensiones</label>
                  <input
                    type="text"
                    value={formProducto.dimensiones}
                    onChange={(e) => setFormProducto({...formProducto, dimensiones: e.target.value})}
                    className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                    placeholder="Ej: 5cm x 3cm x 1cm, Peso: 2g"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormProducto({...formProducto, imagen: e.target.files?.[0] || null})}
                  className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:bg-[#EC4899] file:text-white file:font-medium hover:file:bg-[#F59E0B]"
                />
                {!editandoId && !formProducto.imagen && (
                  <p className="text-xs text-gray-500 mt-1">Selecciona una imagen para el producto.</p>
                )}
                {editandoId && !formProducto.imagen && (
                  <p className="text-xs text-gray-500 mt-1">Dejar vacío para mantener la imagen actual.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={subiendo}
                className="w-full bg-[#EC4899] text-white py-3 rounded-lg font-medium hover:bg-[#F59E0B] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {subiendo ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Guardando...
                  </>
                ) : (
                  editandoId ? 'Actualizar Producto' : 'Crear Producto'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL FORM PEDIDOS --- */}
      {modalPedidoOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] border border-[#EC4899]/30 rounded-2xl max-w-lg w-full p-8 relative shadow-2xl">
            <button
              onClick={cerrarModalPedido}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-serif mb-6 text-white">Actualizar Pedido</h2>
            
            <form onSubmit={handleSubmitPedido} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Estado del pedido</label>
                <select
                  value={formPedido.estado}
                  onChange={(e) => setFormPedido({...formPedido, estado: e.target.value})}
                  className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                  required
                >
                  <option value="verificando">Verificando pago</option>
                  <option value="verificado">Verificado</option>
                  <option value="en envío">En envío</option>
                  <option value="recibido">Recibido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Empresa de envío</label>
                <select
                  value={formPedido.metodo_envio}
                  onChange={(e) => setFormPedido({...formPedido, metodo_envio: e.target.value})}
                  className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                >
                  <option value="">Seleccionar</option>
                  <option value="Chilexpress">Chilexpress</option>
                  <option value="Starken">Starken</option>
                  <option value="Correos Chile">Correos Chile</option>
                  <option value="DHL">DHL</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Número de seguimiento</label>
                <input
                  type="text"
                  value={formPedido.numero_seguimiento}
                  onChange={(e) => setFormPedido({...formPedido, numero_seguimiento: e.target.value})}
                  className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                  placeholder="Ej: CHX123456789"
                />
              </div>

              <button
                type="submit"
                disabled={actualizandoPedido}
                className="w-full bg-[#EC4899] text-white py-3 rounded-lg font-medium hover:bg-[#F59E0B] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actualizandoPedido ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Actualizando...
                  </>
                ) : (
                  'Actualizar Pedido'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}