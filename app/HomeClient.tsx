// app/HomeClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Mail, 
  Phone, 
  ArrowRight, 
  Sparkles, 
  Diamond, 
  PenTool, 
  Hammer, 
  Heart,
  Truck,
  Star
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const images = [
  { id: 1, src: "/images/carrusel1.jpg", alt: "Anillo de Compromiso Pazziale" },
  { id: 2, src: "/images/carrusel2.jpg", alt: "Mariposa Esmaltada Pazziale" },
  { id: 3, src: "/images/carrusel3.jpg", alt: "Pájaros Coloridos Pazziale" },
  { id: 4, src: "/images/carrusel4.jpg", alt: "Pendientes Corazón Pazziale" },
  { id: 5, src: "/images/carrusel5.jpg", alt: "Pendientes Abstractos Pazziale" },
  { id: 6, src: "/images/carrusel6.jpg", alt: "Pendientes Ginkgo Pazziale" },
  { id: 7, src: "/images/carrusel7.jpg", alt: "Pendientes Flor Roja Pazziale" },
];

const categories = [
  { name: "Aros", href: "/aros", image: "/images/aros.jpg" },
  { name: "Anillos", href: "/anillos", image: "/images/anillos.jpg" },
  { name: "Pulseras", href: "/pulseras", image: "/images/pulseras.jpg" },
  { name: "Collares", href: "/collares", image: "/images/collares.jpg" },
  { name: "Accesorios", href: "/accesorios", image: "/images/accesorios.jpg" },
];

export default function HomeClient() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white font-sans selection:bg-[#EC4899] selection:text-white overflow-x-hidden">
      
      <Navbar />

      {/* FRANJA DE OFERTAS */}
      <div className="w-full bg-[#EC4899] py-2 overflow-hidden border-b border-[#F59E0B]/20 relative mt-24 z-10">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="mx-4 text-white font-medium flex items-center gap-2">
              <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
              🎉 ¡Por el lanzamiento de la web tenemos ofertas! 🎉
              <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
            </span>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden" aria-label="Bienvenida a Pazziale">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-[#EC4899]/10 to-transparent blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[120%] h-[120%] bg-gradient-to-tl from-[#F59E0B]/10 to-transparent blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-4 animate-fade-in-up">
              <span className="inline-block w-12 h-[2px] bg-[#F59E0B]"></span>
              <span className="text-[#F59E0B] text-sm tracking-widest uppercase font-light">Bienvenido a Pazziale</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight animate-fade-in-up animation-delay-200">
              Joyería <br />
              <span className="text-[#F59E0B] italic relative inline-block">
                Hecha a Mano
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#F59E0B]/30"></span>
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-light max-w-md mb-8 leading-relaxed animate-fade-in-up animation-delay-400">
              Orfebrería contemporánea que fusiona la tradición artesanal con el diseño moderno. Cada pieza es única, creada en nuestro taller con pasión y detalles minuciosos.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-600">
              <button 
                onClick={() => router.push('/tienda')}
                className="px-8 py-3 bg-[#EC4899] text-white rounded-full font-medium hover:bg-[#F59E0B] transition-all shadow-lg shadow-[#EC4899]/30 hover:shadow-[#F59E0B]/50 transform hover:-translate-y-1"
                aria-label="Ver colección de joyería"
              >
                Ver Colección
              </button>
              <button 
                onClick={() => router.push('/taller')}
                className="px-8 py-3 border border-[#F59E0B]/50 rounded-full hover:border-[#EC4899] hover:text-[#EC4899] transition-all flex items-center gap-2 hover:bg-white/5"
                aria-label="Conoce mi taller de orfebrería"
              >
                Conoce mi taller <ArrowRight className="w-4 h-4 animate-pulse" />
              </button>
            </div>
          </div>

          {/* CAROUSEL */}
          <div className="relative w-full h-[400px] md:h-[550px] rounded-2xl overflow-hidden shadow-2xl border border-[#F59E0B]/30 group" role="region" aria-label="Carrusel de joyas destacadas">
            {images.map((img, index) => (
              <div
                key={img.id}
                className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${
                  index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                aria-hidden={index !== currentSlide}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="w-full h-full object-contain"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
            
            <button 
              onClick={prevSlide} 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#1E1E1E]/80 backdrop-blur-sm border border-[#F59E0B]/30 rounded-full flex items-center justify-center hover:bg-[#EC4899] hover:text-white transition-all z-10 text-white group-hover:opacity-100 opacity-0"
              aria-label="Diapositiva anterior"
            >
              <span className="text-xl" aria-hidden="true">◀</span>
            </button>
            <button 
              onClick={nextSlide} 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#1E1E1E]/80 backdrop-blur-sm border border-[#F59E0B]/30 rounded-full flex items-center justify-center hover:bg-[#EC4899] hover:text-white transition-all z-10 text-white group-hover:opacity-100 opacity-0"
              aria-label="Siguiente diapositiva"
            >
              <span className="text-xl" aria-hidden="true">▶</span>
            </button>
            
            <div className="absolute bottom-6 w-full flex justify-center gap-2 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    idx === currentSlide ? 'w-8 bg-[#EC4899] shadow-lg shadow-[#EC4899]/50' : 'w-2 bg-gray-500'
                  }`}
                  aria-label={`Ir a diapositiva ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FILOSOFÍA / PROCESO */}
      <section id="process" className="py-20 bg-[#2D2D2D]" aria-label="Proceso artesanal">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif mb-6">El Arte de la <span className="text-[#EC4899]">Metalistería</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
              En Pazziale, no solo fabricamos joyas. Transformamos metales preciosos en narrativas visuales. 
              Desde la fundición hasta el pulido final, cada etapa respeta la esencia del material para crear piezas que perduran en el tiempo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: PenTool, title: "Diseño Único", desc: "Cada pieza comienza con un boceto inspirado en la naturaleza y la emoción.", color: "#F59E0B" },
              { icon: Hammer, title: "Forja Artesanal", desc: "El metal cobra vida bajo el martillo, moldeado con precisión y tradición.", color: "#EC4899" },
              { icon: Diamond, title: "Acabado Perfecto", desc: "El pulido final revela el brillo y la belleza intrínseca de cada creación.", color: "#F59E0B" },
            ].map((item, index) => (
              <div key={index} className="bg-[#1E1E1E] p-8 rounded-xl border border-[#F59E0B]/30 hover:border-[#EC4899] transition-all duration-300 group text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/30 flex items-center justify-center group-hover:bg-[item.color] group-hover:text-[#1E1E1E] transition-all duration-300">
                  <item.icon className="w-8 h-8 text-[item.color] group-hover:text-[#1E1E1E]" />
                </div>
                <h3 className="text-xl font-serif mb-2 text-[item.color]">{item.title}</h3>
                <p className="text-gray-400 text-sm font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section id="categories" className="py-20 px-6 bg-[#1E1E1E]" aria-label="Categorías de productos">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif mb-4 text-white">Explora Nuestras <span className="text-[#EC4899]">Categorías</span></h2>
            <div className="w-20 h-1 bg-[#EC4899] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((categoria) => (
              <Link 
                key={categoria.name}
                href={categoria.href} 
                className="group relative overflow-hidden rounded-2xl h-64 lg:h-80 bg-[#2D2D2D] border border-[#F59E0B]/30 hover:border-[#EC4899] transition-all duration-300"
                aria-label={`Ver categoría ${categoria.name}`}
              >
                <div className="absolute inset-0">
                  <Image 
                    src={categoria.image} 
                    alt={`Categoría ${categoria.name} - Pazziale`} 
                    fill
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-4 text-center">
                  <span className="text-3xl font-serif mb-2 text-white drop-shadow-lg group-hover:text-[#F59E0B] transition-colors">
                    {categoria.name}
                  </span>
                  <div className="opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span className="inline-block border border-[#EC4899] text-[#EC4899] px-4 py-1.5 rounded-full text-xs font-medium drop-shadow-lg hover:bg-[#EC4899] hover:text-white transition-colors">
                      Ver Colección
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BIENVENIDA */}
      <section className="py-20 bg-[#2D2D2D] border-y border-[#EC4899]/20" aria-label="Mensaje de bienvenida">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-6">
            <span className="text-4xl text-[#EC4899] opacity-30" aria-hidden="true">✦</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-serif italic mb-8 text-[#F59E0B] leading-relaxed">
            "Bienvenido a nuestro universo creativo"
          </h3>
          <div className="space-y-4 text-gray-400 text-lg md:text-xl font-light leading-relaxed">
            <p>
              Aquí, el fuego, la plata y el cobre se funden para dar vida a piezas únicas que cuentan historias. 
              No creamos accesorios; <span className="text-white font-medium">esculpimos declaraciones de identidad</span> con metales nobles y detalles que celebran lo auténtico.
            </p>
            <p>
              Cada joya es un manifiesto de <span className="text-[#EC4899]">diseño sutil</span>, elegancia atemporal y fuerza natural. 
              Pasa, descubre la pieza que fue pensada para ti y lleva contigo una obra de arte hecha a mano.
            </p>
          </div>
          <div className="mt-8">
            <div className="w-16 h-1 bg-[#EC4899] mx-auto"></div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-[#1E1E1E] py-16 border-t border-[#EC4899]/20" aria-label="Pie de página">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
             <h4 className="text-3xl font-serif text-[#EC4899] mb-4">Pazziale</h4>
             <p className="text-gray-400 text-sm leading-relaxed">Orfebrería artesanal chilena. Diseño y fabricación propia con pasión.</p>
          </div>
          <div>
            <h5 className="font-medium mb-4 text-[#F59E0B]">Contacto</h5>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-[#EC4899]" aria-hidden="true"/> +56936659341
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-[#EC4899]" aria-hidden="true"/> pazzialepweb@gmail.com
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <Truck className="w-4 h-4 text-[#EC4899]" aria-hidden="true"/> Envío a todo Chile
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
              <a href="#" className="w-10 h-10 rounded-full border border-[#F59E0B]/30 flex items-center justify-center hover:border-[#EC4899] hover:text-[#EC4899] hover:bg-[#EC4899]/10 transition-all" aria-label="Instagram">
                <span className="text-xl" aria-hidden="true">📸</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[#F59E0B]/30 flex items-center justify-center hover:border-[#EC4899] hover:text-[#EC4899] hover:bg-[#EC4899]/10 transition-all" aria-label="Facebook">
                <span className="text-xl" aria-hidden="true">👍</span>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-[#2D2D2D] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} Pazziale. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-[#EC4899] fill-[#EC4899]" aria-hidden="true" /> desde Chile.
          </div>
        </div>
      </footer>
    </div>
  );
}