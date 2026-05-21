'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, Star, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
// --- CONFIGURACIÓN DE IMÁGENES ---
const images = [
  { id: 1, src: "/images/anillo.jpg", alt: "Logo Paziale" }, // Sustituye por la imagen 1 (Logo)
  { id: 2, src: "/images/mariposa.jpg", alt: "Mariposa Esmaltada" }, // Sustituye por la imagen 2
  { id: 3, src: "/images/colibri.jpg", alt: "Pájaros Coloridos" }, // Sustituye por la imagen 3
  { id: 4, src: "/images/corazones.jpg", alt: "Pendientes Corazón" }, // Sustituye por la imagen 4
  { id: 5, src: "/images/corazones 2.jpg", alt: "Pendientes Abstractos" }, // Sustituye por la imagen 5
  { id: 6, src: "/images/corazones3.jpg", alt: "Pendientes Ginkgo" }, // Sustituye por la imagen 6
  { id: 7, src: "/images/hojas.jpg", alt: "Pendientes Flor Roja" }, // Sustituye por la imagen 7
];

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000); // Cambia cada 4 segundos
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-[#1A2238] text-white font-sans selection:bg-[#EAA584] selection:text-[#1A2238]">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-[#1A2238]/90 backdrop-blur-sm border-b border-[#EAA584]/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* Texto Logo estilizado para la web */}
            <span className="text-3xl font-serif italic tracking-wider text-[#EAA584]">Pazziale</span>
            <Sparkles className="w-5 h-5 text-[#EAA584]" />
          </div>
          <div className="hidden md:flex gap-8 text-sm tracking-wide font-light">
            <a href="#gallery" className="hover:text-[#EAA584] transition-colors">Galería</a>
            <a href="#process" className="hover:text-[#EAA584] transition-colors">El Proceso</a>
            <a href="#contact" className="hover:text-[#EAA584] transition-colors">Contacto</a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
              Joyería <br />
              <span className="text-[#EAA584] italic">Hecha a Mano</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl font-light max-w-md mb-8 leading-relaxed">
              Orfebrería contemporánea que fusiona la tradición artesanal con el diseño moderno. Cada pieza es única, creada en nuestro taller con pasión y detalles minuciosos.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 bg-[#EAA584] text-[#1A2238] rounded-full font-medium hover:bg-white transition-all shadow-lg shadow-[#EAA584]/30">
                Ver Colección
              </button>
              <button className="px-8 py-3 border border-white/30 rounded-full hover:border-[#EAA584] hover:text-[#EAA584] transition-colors flex items-center gap-2">
                Conoce mi taller <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CAROUSEL DE IMÁGENES (A la derecha o arriba en móvil) */}
          <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#EAA584]/20">
            {images.map((img, index) => (
              <div
                key={img.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                />
                {/* Overlay sutil */}
                <div className="absolute inset-0 bg-[#1A2238]/30"></div>
              </div>
            ))}
            
            {/* Controles del carousel (flechas) */}
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-[#EAA584] transition-colors z-10 text-white">
              ◀
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-[#EAA584] transition-colors z-10 text-white">
              ▶
            </button>
            
            {/* Indicadores (puntos) */}
            <div className="absolute bottom-4 w-full flex justify-center gap-2 z-10">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentSlide ? 'w-8 bg-[#EAA584]' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT / FILOSOFÍA --- */}
      <section className="py-20 bg-[#131A2A]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">El Arte de la <span className="text-[#EAA584]">Metalistería</span></h2>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
            En Pazziale, no solo fabricamos joyas. Transformamos metales preciosos en narrativas visuales. 
            Desde la fundición hasta el pulido final, cada etapa respeta la esencia del material para crear piezas que perduran en el tiempo.
          </p>
        </div>
      </section>

      {/* --- MINI GALERÍA (Ejemplos de trabajos) --- */}
      <section id="gallery" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">Creaciones Recientes</h2>
            <div className="w-20 h-0.5 bg-[#EAA584] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Usamos las imagenes de referencia de forma estática aquí también o la 1ra imagen del array */}
            <div className="relative group aspect-square overflow-hidden rounded-lg bg-[#131A2A] border border-gray-700">
               <img src={images[1]?.src || "https://via.placeholder.com/400"} alt="Pieza 1" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                 <span className="text-sm text-white">Mariposa Esmaltada</span>
               </div>
            </div>
            <div className="relative group aspect-square overflow-hidden rounded-lg bg-[#131A2A] border border-gray-700">
               <img src={images[2]?.src || "https://via.placeholder.com/400"} alt="Pieza 2" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="relative group aspect-square overflow-hidden rounded-lg bg-[#131A2A] border border-gray-700">
               <img src={images[4]?.src || "https://via.placeholder.com/400"} alt="Pieza 3" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="relative group aspect-square overflow-hidden rounded-lg bg-[#131A2A] border border-gray-700">
               <img src={images[6]?.src || "https://via.placeholder.com/400"} alt="Pieza 4" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIAL / VALOR --- */}
      <section className="py-20 bg-[#131A2A] border-y border-[#EAA584]/10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/3 flex justify-center">
             {/* Icono representativo o logo pequeño */}
            <div className="w-32 h-32 rounded-full bg-[#EAA584]/10 border border-[#EAA584] flex items-center justify-center">
               <span className="text-6xl">⚒️</span>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <h3 className="text-2xl italic font-serif mb-4 text-[#EAA584]">"La belleza está en los detalles"</h3>
            <p className="text-gray-300 font-light">
              Cada pieza lleva consigo horas de trabajo, dedicación y una historia. 
              Me enorgullece ofrecer calidad de orfebrería en un mundo de producción masiva.
            </p>
          </div>
        </div>
      </section>

      {/* --- CONTACT FOOTER --- */}
      <footer id="contact" className="bg-[#0F1523] py-16 border-t border-[#EAA584]/20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div>
             <h4 className="text-2xl font-serif text-[#EAA584] mb-4">Pazziale</h4>
             <p className="text-gray-400 text-sm">Orfebrería artesanal.</p>
             <p className="text-gray-400 text-sm">Diseño y fabricación propia.</p>
          </div>
          <div>
            <h5 className="font-medium mb-4">Contacto Directo</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#EAA584]"/> +56 9 1234 5678</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#EAA584]"/> contacto@pazziale.cl</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-4">Sígueme</h5>
            <div className="flex gap-4">
              
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          © 2026 Pazziale. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;