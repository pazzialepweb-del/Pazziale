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
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [esAdmin, setEsAdmin] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    stock: '',
    imagen: null as File | null
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
      cargarProductos();
    } catch (error) {
      console.error('Error verificando admin:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }

  async function cargarProductos() {
    try {
      const response = await fetch(
        'https://lcdhazkemkyktfrqjtka.supabase.co/rest/v1/productos?select=*',
        {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
          }
        }
      );
      
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      
      const data = await response.json();
      setProductos(data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setProductos([]);
    }
  }

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubiendo(true);

    try {
      let imagen_url = editandoId 
        ? productos.find(p => p.id === editandoId)?.imagen_url || '' 
        : '';

      if (form.imagen) {
        imagen_url = await subirImagen(form.imagen);
      }

      const productoData = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: parseFloat(form.precio),
        categoria: form.categoria,
        imagen_url: imagen_url,
        stock: parseInt(form.stock) || 0  // ✅ Agregar stock
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

      await cargarProductos();
      cerrarModal();
    } catch (error) {
      console.error('💥 Error completo guardando producto:', error);
      alert('Error al guardar producto: ' + JSON.stringify(error, null, 2));
    } finally {
      setSubiendo(false);
    }
  }

  async function handleEliminar(id: string) {
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

      await cargarProductos();
    } catch (error) {
      console.error('Error eliminando producto:', error);
      alert('Error al eliminar producto');
    }
  }

  function abrirModal(producto?: Producto) {
    if (producto) {
      setEditandoId(producto.id);
      setForm({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio.toString(),
        categoria: producto.categoria,
        stock: producto.stock.toString(), // ✅ Cargar stock
        imagen: null
      });
    } else {
      setEditandoId(null);
      setForm({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: '',
        stock: '',
        imagen: null
      });
    }
    setModalOpen(true);
  }

  function cerrarModal() {
    setModalOpen(false);
    setEditandoId(null);
    setForm({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: '',
      stock: '',
      imagen: null
    });
  }

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
            onClick={() => abrirModal()}
            className="flex items-center gap-2 bg-[#EC4899] text-white px-6 py-2 rounded-full font-medium hover:bg-[#F59E0B] transition-all shadow-lg shadow-[#EC4899]/30"
          >
            <Plus className="w-5 h-5" /> Agregar Producto
          </button>
        </div>
        
        {/* Estadísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#2D2D2D] p-6 rounded-lg border border-[#F59E0B]/30">
            <h2 className="text-xl font-medium mb-2 text-[#F59E0B]">Productos</h2>
            <p className="text-3xl font-serif text-[#EC4899]">{productos.length}</p>
          </div>
          <div className="bg-[#2D2D2D] p-6 rounded-lg border border-[#F59E0B]/30">
            <h2 className="text-xl font-medium mb-2 text-[#F59E0B]">Pedidos</h2>
            <p className="text-3xl font-serif text-[#EC4899]">0</p>
          </div>
          <div className="bg-[#2D2D2D] p-6 rounded-lg border border-[#F59E0B]/30">
            <h2 className="text-xl font-medium mb-2 text-[#F59E0B]">Usuarios</h2>
            <p className="text-3xl font-serif text-[#EC4899]">0</p>
          </div>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <div className="overflow-x-auto bg-[#2D2D2D] rounded-lg border border-[#F59E0B]/30">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#F59E0B]/30 text-left text-sm uppercase tracking-wider text-gray-400">
                <th className="p-4">Imagen</th>
                <th className="p-4">Nombre</th>
                <th className="p-4 hidden md:table-cell">Categoría</th>
                <th className="p-4">Precio</th>
                <th className="p-4 hidden md:table-cell">Stock</th>
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
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => abrirModal(producto)}
                      className="p-2 bg-[#EC4899]/20 hover:bg-[#EC4899]/40 rounded-lg transition-colors text-[#EC4899]"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEliminar(producto.id)}
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

      {/* --- MODAL FORM --- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] border border-[#EC4899]/30 rounded-2xl max-w-lg w-full p-8 relative shadow-2xl">
            <button
              onClick={cerrarModal}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-serif mb-6 text-white">{editandoId ? 'Editar' : 'Agregar'} Producto</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({...form, nombre: e.target.value})}
                  className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({...form, descripcion: e.target.value})}
                  className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white min-h-[80px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Precio ($)</label>
                  <input
                    type="number"
                    value={form.precio}
                    onChange={(e) => setForm({...form, precio: e.target.value})}
                    className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({...form, stock: e.target.value})}
                    className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Categoría</label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({...form, categoria: e.target.value})}
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
                <label className="block text-sm font-medium mb-1 text-gray-300">Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({...form, imagen: e.target.files?.[0] || null})}
                  className="w-full p-2 rounded bg-[#2D2D2D] border border-gray-600 focus:border-[#EC4899] outline-none text-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:bg-[#EC4899] file:text-white file:font-medium hover:file:bg-[#F59E0B]"
                />
                {!editandoId && !form.imagen && (
                  <p className="text-xs text-gray-500 mt-1">Selecciona una imagen para el producto.</p>
                )}
                {editandoId && !form.imagen && (
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
    </div>
  );
}