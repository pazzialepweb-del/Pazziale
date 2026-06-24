import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad - Pazziale',
  description: 'Conoce nuestra política de privacidad en Pazziale, tienda de joyería artesanal. Información sobre datos personales, cookies y tus derechos.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.pazziale.cl/politica-privacidad',
  },
  openGraph: {
    title: 'Política de Privacidad - Pazziale',
    description: 'Lee nuestra política de privacidad sobre el manejo de tus datos personales.',
    url: 'https://www.pazziale.cl/politica-privacidad',
    type: 'website',
    siteName: 'Pazziale',
    locale: 'es_CL',
  },
};

export default function PoliticaPrivacidadPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      <main className="pt-32 px-4 md:px-8 max-w-4xl mx-auto pb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#EAA584] hover:text-[#F59E0B] transition-colors mb-6"
          aria-label="Volver al inicio"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <h1 className="text-4xl font-serif mb-8 text-[#EAA584]">Política de Privacidad</h1>
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-CL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <section>
            <h2 className="text-2xl font-serif text-white mb-2">1. Información que recopilamos</h2>
            <p>En Pazziale, recopilamos la siguiente información personal cuando utilizas nuestra tienda en línea:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>
                <strong>Datos de contacto:</strong> nombre, dirección de correo electrónico, número de teléfono y dirección de envío.
              </li>
              <li>
                <strong>Datos de pago:</strong> procesados a través de Mercado Pago; no almacenamos información de tarjetas de crédito.
              </li>
              <li>
                <strong>Información de navegación:</strong> direcciones IP, tipo de navegador, páginas visitadas y tiempo de visita (a través de cookies y herramientas de análisis).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-2">2. Uso de la información</h2>
            <p>Utilizamos tu información para:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Procesar tus pedidos y gestionar envíos.</li>
              <li>Comunicarnos contigo sobre el estado de tus compras.</li>
              <li>Mejorar nuestros servicios y personalizar tu experiencia.</li>
              <li>Cumplir con obligaciones legales y fiscales.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-2">3. Cookies</h2>
            <p>
              Utilizamos cookies para mejorar la funcionalidad del sitio y analizar el tráfico. Puedes gestionar las cookies desde la configuración de tu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-2">4. Compartición de datos</h2>
            <p>No vendemos ni alquilamos tu información personal. Compartimos datos únicamente con:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>
                <strong>Proveedores de logística:</strong> Starken, Chilexpress, para gestionar envíos.
              </li>
              <li>
                <strong>Procesador de pagos:</strong> Mercado Pago, para gestionar transacciones.
              </li>
              <li>
                <strong>Plataformas de análisis:</strong> para entender el comportamiento de los usuarios (Vercel Analytics, Google Analytics).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-2">5. Tus derechos</h2>
            <p>
              Puedes solicitar acceso, corrección o eliminación de tus datos personales en cualquier momento escribiéndonos a{' '}
              <a href="mailto:contacto@pazziale.cl" className="text-[#EAA584] hover:underline">
                contacto@pazziale.cl
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-2">6. Cambios en esta política</h2>
            <p>
              Nos reservamos el derecho a actualizar esta política. Te notificaremos de cambios significativos a través de nuestro sitio web o por correo electrónico.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}