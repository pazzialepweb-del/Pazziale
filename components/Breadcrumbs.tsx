// components/Breadcrumbs.tsx
'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Si no hay items, intentamos generar automáticamente desde la URL
  const autoItems = !items || items.length === 0 
    ? generateBreadcrumbsFromPath(pathname)
    : items;

  return (
    <nav aria-label="Breadcrumb" className={`text-sm text-gray-400 ${className}`}>
      <ol className="flex items-center flex-wrap gap-1">
        <li>
          <Link 
            href="/" 
            className="flex items-center gap-1 hover:text-[#EC4899] transition-colors"
            aria-label="Inicio"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">Inicio</span>
          </Link>
        </li>
        {autoItems.map((item, index) => {
          const isLast = index === autoItems.length - 1;
          return (
            <li key={index} className="flex items-center gap-1">
              <ChevronRight className="w-4 h-4 text-gray-600" aria-hidden="true" />
              {isLast ? (
                <span className="text-white font-medium">{item.label}</span>
              ) : (
                <Link 
                  href={item.href || '#'} 
                  className="hover:text-[#EC4899] transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Función para generar breadcrumbs automáticamente desde la URL
function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [];
  let currentPath = '';

  const labelMap: Record<string, string> = {
    'tienda': 'Tienda',
    'anillos': 'Anillos',
    'aros': 'Aros',
    'pulseras': 'Pulseras',
    'collares': 'Collares',
    'accesorios': 'Accesorios',
    'producto': 'Producto',
    'taller': 'El Taller',
    'carrito': 'Carrito',
    'auth': 'Autenticación',
    'login': 'Iniciar Sesión',
    'register': 'Registro',
    'terminos-condiciones': 'Términos y Condiciones',
    'politica-privacidad': 'Política de Privacidad',
    'admin': 'Panel de Administración',
  };

  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    items.push({
      label,
      href: currentPath,
    });
  }

  return items;
}