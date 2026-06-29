import React from 'react';
import Link from 'next/link';
import { Phone, Mail, Heart, Truck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1E1E1E] py-16 border-t border-[#EC4899]/20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
           <h4 className="text-3xl font-serif text-[#EC4899] mb-4">Pazziale</h4>
           <p className="text-gray-400 text-sm leading-relaxed">Orfebrería artesanal chilena. Diseño y fabricación propia con pasión.</p>
        </div>
        <div>
          <h5 className="font-medium mb-4 text-[#F59E0B]">Contacto</h5>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-4 h-4 text-[#EC4899]"/> +56 9 3665 9341
            </li>
            <li className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-4 h-4 text-[#EC4899]"/> pazzialepweb@gmail.com
            </li>
            <li className="flex items-center gap-2 hover:text-white transition-colors">
              <Truck className="w-4 h-4 text-[#EC4899]"/> Envío a todo Chile
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-medium mb-4 text-[#F59E0B]">Enlaces</h5>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link href="/" className="hover:text-[#EC4899] transition-colors">Inicio</Link></li>
            <li><Link href="/tienda" className="hover:text-[#EC4899] transition-colors">Tienda</Link></li>
            <li><Link href="/taller" className="hover:text-[#EC4899] transition-colors">El Taller</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-medium mb-4 text-[#F59E0B]">Sígueme</h5>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/pazziale_orfebre/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-[#F59E0B]/30 flex items-center justify-center hover:border-[#EC4899] hover:text-[#EC4899] hover:bg-[#EC4899]/10 transition-all"
              aria-label="Instagram"
            >
              {/* SVG de Instagram (color actual) */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <div>
          © {new Date().getFullYear()} Pazziale. Todos los derechos reservados.
        </div>
        <div className="flex items-center gap-1">
          Hecho con <Heart className="w-3 h-3 text-[#EC4899] fill-[#EC4899]" /> desde Chile.
        </div>
      </div>
    </footer>
  );
}