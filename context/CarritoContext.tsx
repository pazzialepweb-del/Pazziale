'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ItemCarrito {
  id: string; // producto_id
  nombre: string;
  precio: number;
  imagen_url: string;
  cantidad: number;
  stock: number; // ✅ Agregamos el campo stock
}

interface CarritoContextType {
  items: ItemCarrito[];
  loading: boolean;
  agregarAlCarrito: (producto: { id: string; nombre: string; precio: number; imagen_url: string; stock: number }, cantidad?: number) => void;
  eliminarDelCarrito: (productoId: string) => void;
  actualizarCantidad: (productoId: string, nuevaCantidad: number) => void;
  vaciarCarrito: () => void;
  totalItems: number;
  totalPrecio: number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = localStorage.getItem('carrito_pazziale');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error al cargar el carrito:', e);
        localStorage.removeItem('carrito_pazziale');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('carrito_pazziale', JSON.stringify(items));
    }
  }, [items, loading]);

  // --- Funciones del carrito ---

  const agregarAlCarrito = (producto: { id: string; nombre: string; precio: number; imagen_url: string; stock: number }, cantidad: number = 1) => {
    setItems((prev) => {
      const existing = prev.find(item => item.id === producto.id);
      
      if (existing) {
        // Si ya existe, validar que no supere el stock antes de sumar
        const nuevaCantidad = existing.cantidad + cantidad;
        if (nuevaCantidad > existing.stock) {
          alert(`⚠️ Solo hay ${existing.stock} unidades disponibles de "${existing.nombre}".`);
          return prev;
        }
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: nuevaCantidad }
            : item
        );
      }
      // Si no existe, crear el item guardando el stock
      return [...prev, { ...producto, cantidad }];
    });
  };

  const eliminarDelCarrito = (productoId: string) => {
    setItems((prev) => prev.filter(item => item.id !== productoId));
  };

  const actualizarCantidad = (productoId: string, nuevaCantidad: number) => {
    setItems((prev) => {
      const item = prev.find(i => i.id === productoId);
      if (!item) return prev;

      if (nuevaCantidad <= 0) {
        return prev.filter(i => i.id !== productoId);
      }

      // ✅ Validación de stock al actualizar manualmente
      if (nuevaCantidad > item.stock) {
        alert(`⚠️ Solo hay ${item.stock} unidades disponibles de "${item.nombre}".`);
        return prev; // No actualizamos
      }

      return prev.map(i =>
        i.id === productoId ? { ...i, cantidad: nuevaCantidad } : i
      );
    });
  };

  const vaciarCarrito = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
  const totalPrecio = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <CarritoContext.Provider value={{
      items,
      loading,
      agregarAlCarrito,
      eliminarDelCarrito,
      actualizarCantidad,
      vaciarCarrito,
      totalItems,
      totalPrecio
    }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);
  if (context === undefined) {
    throw new Error('useCarrito debe usarse dentro de un CarritoProvider');
  }
  return context;
}