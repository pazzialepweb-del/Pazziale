// app/taller/TallerClient.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Hammer, Diamond, PenTool, Heart, ArrowRight, Sparkles } from 'lucide-react';

export default function TallerClient() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />

      {/* ✅ Breadcrumbs (migas de pan) */}
      <div className="pt-32 px-4 md:px-8 max-w-7xl mx-auto">
        <Breadcrumbs items={[{ label: 'El Taller' }]} className="mb-4" />
      </div>

      <main>
        {/* Hero de la página */}
        <section className="pb-16 px-6 overflow-hidden" aria-label="Hero del taller">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-[#EC4899]/10 to-transparent blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[120%] h-[120%] bg-gradient-to-tl from-[#F59E0B]/10 to-transparent blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4 animate-fade-in-up">
              <span className="inline-block w-12 h-[2px] bg-[#EC4899]" aria-hidden="true"></span>
              <span className="text-[#EC4899] text-sm tracking-widest uppercase font-light">Conoce el corazón de Pazziale</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight animate-fade-in-up animation-delay-200">
              El <span className="text-[#EC4899] italic">Taller</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up animation-delay-400">
              Un espacio donde el fuego, la plata y el cobre se funden para dar vida a piezas únicas. Cada joya es el resultado de horas de dedicación, pasión y un profundo respeto por el oficio.
            </p>
          </div>
        </section>

        {/* Sección: Nuestra Historia */}
        <section className="py-20 bg-[#2D2D2D]" aria-label="Nuestra historia">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#EC4899] text-sm tracking-widest uppercase font-light block mb-2">Nuestra Historia</span>
              <h2 className="text-3xl md:text-4xl font-serif mb-4 text-white">Un sueño forjado en <span className="text-[#F59E0B]">metal</span></h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Pazziale nace de la pasión por la orfebrería tradicional y el deseo de crear piezas que trasciendan el tiempo. Cada diseño es una historia, cada trazo una emoción.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Nuestro taller es un lugar de creación constante, donde el ruido del martillo y el brillo del metal se convierten en arte. No seguimos modas, creamos clásicos que perduran.
              </p>
              <div className="mt-6 flex gap-4">
                <span className="flex items-center gap-1 text-[#EC4899]">
                  <Sparkles className="w-4 h-4" aria-hidden="true" /> Hecho a mano
                </span>
                <span className="flex items-center gap-1 text-[#F59E0B]">
                  <Heart className="w-4 h-4" aria-hidden="true" /> Con amor
                </span>
              </div>
            </div>
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden border border-[#F59E0B]/30">
              <Image
                src="/images/taller.jpg"
                alt="Taller de orfebrería Pazziale - Espacio de creación artesanal"
                fill
                className="w-full h-full object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </section>

        {/* Sección: El Proceso Artesanal */}
        <section className="py-20 bg-[#1E1E1E]" aria-label="Proceso artesanal paso a paso">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-[#EC4899] text-sm tracking-widest uppercase font-light block mb-2">El Proceso</span>
              <h2 className="text-3xl md:text-4xl font-serif mb-4 text-white">Creación <span className="text-[#F59E0B]">paso a paso</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto font-light">
                Cada joya que creamos pasa por un cuidadoso proceso que combina técnicas tradicionales con un toque de innovación.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: PenTool, title: "Diseño", desc: "Cada pieza comienza con un boceto inspirado en la naturaleza, la geometría y la emoción.", color: "#EC4899" },
                { icon: Hammer, title: "Forja", desc: "El metal cobra vida bajo el martillo, moldeado con precisión y dedicación.", color: "#F59E0B" },
                { icon: Diamond, title: "Acabado", desc: "El pulido final revela el brillo y la belleza intrínseca de cada creación.", color: "#EC4899" },
              ].map((item, index) => (
                <div key={index} className="bg-[#2D2D2D] p-8 rounded-xl border border-[#F59E0B]/30 hover:border-[#EC4899] transition-all duration-300 group text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#EC4899]/10 border border-[#EC4899]/30 flex items-center justify-center group-hover:bg-[#EC4899] group-hover:text-[#1E1E1E] transition-all duration-300">
                    <item.icon className="w-8 h-8 text-[item.color] group-hover:text-[#1E1E1E]" />
                  </div>
                  <h3 className="text-xl font-serif mb-2 text-[item.color]">{item.title}</h3>
                  <p className="text-gray-400 text-sm font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección: El Taller en Acción (videos) */}
        <section className="py-20 bg-[#2D2D2D]" aria-label="El taller en acción">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-[#EC4899] text-sm tracking-widest uppercase font-light block mb-2">En Acción</span>
              <h2 className="text-3xl md:text-4xl font-serif mb-4 text-white">El <span className="text-[#F59E0B]">Taller</span> en Movimiento</h2>
              <p className="text-gray-400 max-w-2xl mx-auto font-light">
                Mira cómo el fuego, el metal y la pasión se unen para crear cada pieza única.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative rounded-xl overflow-hidden border border-[#F59E0B]/30 shadow-lg aspect-video">
                <video
                  src="/images/video1.mp4"
                  autoPlay
                  loop
                  muted
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                  aria-label="Proceso de forja de una joya en el taller"
                >
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-[#F59E0B]/30 shadow-lg aspect-video">
                <video
                  src="/images/video2.mp4"
                  autoPlay
                  loop
                  muted
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                  aria-label="Detalles del pulido y acabado de una pieza"
                >
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* Sección: ¿Por qué elegirnos? */}
        <section className="py-20 bg-[#2D2D2D]" aria-label="Ventajas de elegir Pazziale">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-[#EC4899] text-sm tracking-widest uppercase font-light block mb-2">¿Por qué elegirnos?</span>
              <h2 className="text-3xl md:text-4xl font-serif mb-4 text-white">La diferencia está en los <span className="text-[#F59E0B]">detalles</span></h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                { title: "Materiales de calidad", desc: "Trabajamos con metales nobles y piedras de primera calidad, seleccionados cuidadosamente para garantizar la durabilidad y belleza de cada pieza.", color: "#EC4899" },
                { title: "Diseño exclusivo", desc: "Cada joya es única, diseñada y fabricada a mano en nuestro taller. No fabricamos en masa, cada pieza cuenta una historia.", color: "#F59E0B" },
                { title: "Atención personalizada", desc: "Te ofrecemos un trato cercano y personalizado, asesorándote en cada paso para que encuentres la pieza perfecta.", color: "#EC4899" },
                { title: "Sostenibilidad", desc: "Comprometidos con el medio ambiente, utilizamos prácticas responsables en la obtención de materiales y la producción.", color: "#F59E0B" },
              ].map((item, index) => (
                <div key={index} className="bg-[#1E1E1E] p-6 rounded-xl border border-[#F59E0B]/30 hover:border-[#EC4899] transition-all duration-300">
                  <h3 className="text-xl font-serif mb-2 text-[item.color]">{item.title}</h3>
                  <p className="text-gray-400 text-sm font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Llamada a la acción */}
        <section className="py-20 bg-[#1E1E1E]" aria-label="Llamada a la acción">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="mb-6">
              <span className="text-4xl text-[#EC4899] opacity-20" aria-hidden="true">✦</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-serif italic mb-6 text-white">
              ¿Listo para encontrar tu próxima joya?
            </h3>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto font-light">
              Explora nuestra colección y descubre piezas diseñadas para ti, con la calidad y el cariño que solo un taller artesanal puede ofrecer.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/tienda"
                className="bg-[#EC4899] text-white px-8 py-3 rounded-full font-medium hover:bg-[#F59E0B] transition-all shadow-lg shadow-[#EC4899]/30 inline-flex items-center gap-2"
              >
                Ver Colección <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/contacto"
                className="border border-[#F59E0B]/50 text-gray-300 px-8 py-3 rounded-full font-medium hover:border-[#EC4899] hover:text-[#EC4899] transition-colors inline-flex items-center gap-2"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1E1E1E] py-16 border-t border-[#EC4899]/20" aria-label="Pie de página">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div>
            <h4 className="text-2xl font-serif text-[#EC4899] mb-4">Pazziale</h4>
            <p className="text-gray-400 text-sm">Orfebrería artesanal. Diseño y fabricación propia con pasión.</p>
          </div>
          <div>
            <h5 className="font-medium mb-4 text-[#F59E0B]">Contacto</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>contacto@pazziale.cl</li>
              <li>+56 9 1234 5678</li>
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
        </div>
      </footer>
    </div>
  );
}