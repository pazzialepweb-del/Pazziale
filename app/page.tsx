'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Phone, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Diamond, 
  PenTool, 
  Hammer, 
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';

// --- CONFIGURACIÓN DE IMÁGENES ---
const images = [
  { id: 1, src: "/images/anillo.jpg", alt: "Anillo de Compromiso Pazziale" },
  { id: 2, src: "/images/mariposa.jpg", alt: "Mariposa Esmaltada Pazziale" },
  { id: 3, src: "/images/colibri.jpg", alt: "Pájaros Coloridos Pazziale" },
  { id: 4, src: "/images/corazones.jpg", alt: "Pendientes Corazón Pazziale" },
  { id: 5, src: "/images/corazones 2.jpg", alt: "Pendientes Abstractos Pazziale" },
  { id: 6, src: "/images/corazones3.jpg", alt: "Pendientes Ginkgo Pazziale" },
  { id: 7, src: "/images/hojas.jpg", alt: "Pendientes Flor Roja Pazziale" },
];

// Testimonios simulados
const testimonios = [
  {
    id: 1,
    nombre: "María González",
    texto: "Compré un anillo de compromiso y la calidad es excepcional. Se nota el cariño y la dedicación en cada detalle. ¡Un trabajo increíble!",
    estrellas: 5
  },
  {
    id: 2,
    nombre: "Carlos Pérez",
    texto: "Los pendientes de Ginkgo son una obra de arte. La textura y el brillo son impresionantes. Sin duda, volveré a comprar.",
    estrellas: 5
  },
  {
    id: 3,
    nombre: "Valentina Ruiz",
    texto: "Me encanta el concepto de 'joyería hecha a mano'. Cada pieza cuenta una historia. Pazziale es mi nueva tienda favorita.",
    estrellas: 5
  }
];

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonioActual, setTestimonioActual] = useState(0);
  const router = useRouter();

  // Auto-slide para el carrusel de imágenes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Auto-slide para los testimonios
  useEffect(() => {
    const timerTestimonial = setInterval(() => {
      setTestimonioActual((prev) => (prev + 1) % testimonios.length);
    }, 6000);
    return () => clearInterval(timerTestimonial);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  const siguienteTestimonio = () => setTestimonioActual((prev) => (prev + 1) % testimonios.length);
  const anteriorTestimonio = () => setTestimonioActual((prev) => (prev - 1 + testimonios.length) % testimonios.length);

  return (
    <div className="min-h-screen bg-[#1A2238] text-white font-sans selection:bg-[#EAA584] selection:text-[#1A2238] overflow-x-hidden">
      
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        {/* Fondo animado sutil */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-[#EAA584]/5 to-transparent blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[120%] h-[120%] bg-gradient-to-tl from-[#EAA584]/10 to-transparent blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-4 animate-fade-in-up">
              <span className="inline-block w-12 h-[2px] bg-[#EAA584]"></span>
              <span className="text-[#EAA584] text-sm tracking-widest uppercase font-light">Bienvenido a Pazziale</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight animate-fade-in-up animation-delay-200">
              Joyería <br />
              <span className="text-[#EAA584] italic relative inline-block">
                Hecha a Mano
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#EAA584]/30"></span>
              </span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl font-light max-w-md mb-8 leading-relaxed animate-fade-in-up animation-delay-400">
              Orfebrería contemporánea que fusiona la tradición artesanal con el diseño moderno. Cada pieza es única, creada en nuestro taller con pasión y detalles minuciosos.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-600">
              <button 
                onClick={() => router.push('/tienda')}
                className="px-8 py-3 bg-[#EAA584] text-[#1A2238] rounded-full font-medium hover:bg-white transition-all shadow-lg shadow-[#EAA584]/30 hover:shadow-[#EAA584]/50 transform hover:-translate-y-1"
              >
                Ver Colección
              </button>
              <button 
                onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 border border-white/30 rounded-full hover:border-[#EAA584] hover:text-[#EAA584] transition-all flex items-center gap-2 hover:bg-white/5"
              >
                Conoce mi taller <ArrowRight className="w-4 h-4 animate-pulse" />
              </button>
            </div>
          </div>

          {/* CAROUSEL DE IMÁGENES MEJORADO */}
          <div className="relative w-full h-[400px] md:h-[550px] rounded-2xl overflow-hidden shadow-2xl border border-[#EAA584]/20 group">
            {images.map((img, index) => (
              <div
                key={img.id}
                className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${
                  index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A2238] via-transparent to-transparent"></div>
              </div>
            ))}
            
            {/* Controles del carousel más estéticos */}
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#1A2238]/80 backdrop-blur-sm border border-[#EAA584]/30 rounded-full flex items-center justify-center hover:bg-[#EAA584] hover:text-[#1A2238] transition-all z-10 text-white group-hover:opacity-100 opacity-0">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#1A2238]/80 backdrop-blur-sm border border-[#EAA584]/30 rounded-full flex items-center justify-center hover:bg-[#EAA584] hover:text-[#1A2238] transition-all z-10 text-white group-hover:opacity-100 opacity-0">
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Indicadores (puntos) */}
            <div className="absolute bottom-6 w-full flex justify-center gap-2 z-10">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    idx === currentSlide ? 'w-8 bg-[#EAA584] shadow-lg shadow-[#EAA584]/50' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT / FILOSOFÍA --- */}
      <section id="process" className="py-20 bg-[#131A2A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif mb-6">El Arte de la <span className="text-[#EAA584]">Metalistería</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              En Pazziale, no solo fabricamos joyas. Transformamos metales preciosos en narrativas visuales. 
              Desde la fundición hasta el pulido final, cada etapa respeta la esencia del material para crear piezas que perduran en el tiempo.
            </p>
          </div>

          {/* Proceso en 3 pasos */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1A2238] p-8 rounded-xl border border-gray-700 hover:border-[#EAA584] transition-all duration-300 group text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#EAA584]/10 border border-[#EAA584]/30 flex items-center justify-center group-hover:bg-[#EAA584] group-hover:text-[#1A2238] transition-all duration-300">
                <PenTool className="w-8 h-8 text-[#EAA584] group-hover:text-[#1A2238]" />
              </div>
              <h3 className="text-xl font-serif mb-2">Diseño Único</h3>
              <p className="text-gray-400 text-sm font-light">Cada pieza comienza con un boceto inspirado en la naturaleza y la emoción.</p>
            </div>
            <div className="bg-[#1A2238] p-8 rounded-xl border border-gray-700 hover:border-[#EAA584] transition-all duration-300 group text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#EAA584]/10 border border-[#EAA584]/30 flex items-center justify-center group-hover:bg-[#EAA584] group-hover:text-[#1A2238] transition-all duration-300">
                <Hammer className="w-8 h-8 text-[#EAA584] group-hover:text-[#1A2238]" />
              </div>
              <h3 className="text-xl font-serif mb-2">Forja Artesanal</h3>
              <p className="text-gray-400 text-sm font-light">El metal cobra vida bajo el martillo, moldeado con precisión y tradición.</p>
            </div>
            <div className="bg-[#1A2238] p-8 rounded-xl border border-gray-700 hover:border-[#EAA584] transition-all duration-300 group text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#EAA584]/10 border border-[#EAA584]/30 flex items-center justify-center group-hover:bg-[#EAA584] group-hover:text-[#1A2238] transition-all duration-300">
                <Diamond className="w-8 h-8 text-[#EAA584] group-hover:text-[#1A2238]" />
              </div>
              <h3 className="text-xl font-serif mb-2">Acabado Perfecto</h3>
              <p className="text-gray-400 text-sm font-light">El pulido final revela el brillo y la belleza intrínseca de cada creación.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- MINI GALERÍA MEJORADA --- */}
      <section id="gallery" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif mb-4">Creaciones Recientes</h2>
            <div className="w-20 h-1 bg-[#EAA584] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {images.slice(1, 5).map((img, index) => (
              <div key={img.id} className="relative group aspect-square overflow-hidden rounded-xl bg-[#131A2A] border border-gray-700 hover:border-[#EAA584] transition-all duration-300">
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A2238] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-serif text-lg">{img.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIAL / VALOR --- */}
      <section className="py-20 bg-[#131A2A] border-y border-[#EAA584]/10">
        <div className="max-w-4xl mx-auto px-6 relative">
          <h2 className="text-3xl font-serif text-center mb-12">Lo que dicen <span className="text-[#EAA584]">nuestros clientes</span></h2>
          
          <div className="bg-[#1A2238] p-8 md:p-12 rounded-2xl border border-gray-700 shadow-2xl relative">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-full bg-[#EAA584]/20 border border-[#EAA584] flex items-center justify-center shrink-0">
                <span className="text-4xl text-[#EAA584]">“</span>
              </div>
              <div className="flex-1">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#EAA584] text-[#EAA584]" />
                  ))}
                </div>
                <p className="text-xl font-light italic text-gray-200 mb-4">
                  "{testimonios[testimonioActual].texto}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-[#EAA584]">- {testimonios[testimonioActual].nombre}</span>
                  <div className="flex gap-2">
                    <button onClick={anteriorTestimonio} className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-[#EAA584] hover:text-[#EAA584] transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={siguienteTestimonio} className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-[#EAA584] hover:text-[#EAA584] transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTACT FOOTER --- */}
      <footer id="contact" className="bg-[#0F1523] py-16 border-t border-[#EAA584]/20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
             <h4 className="text-3xl font-serif text-[#EAA584] mb-4">Pazziale</h4>
             <p className="text-gray-400 text-sm leading-relaxed">Orfebrería artesanal chilena. Diseño y fabricación propia con pasión.</p>
          </div>
          <div>
            <h5 className="font-medium mb-4 text-[#EAA584]">Contacto</h5>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-[#EAA584]"/> +56 9 1234 5678
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-[#EAA584]"/> contacto@pazziale.cl
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-4 text-[#EAA584]">Enlaces</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-[#EAA584] transition-colors">Inicio</a></li>
              <li><a href="/tienda" className="hover:text-[#EAA584] transition-colors">Tienda</a></li>
              <li><a href="/admin" className="hover:text-[#EAA584] transition-colors">Panel Admin</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-4 text-[#EAA584]">Sígueme</h5>
            <div className="flex gap-4">
              
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} Pazziale. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-[#EAA584] fill-[#EAA584]" /> desde Chile.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;