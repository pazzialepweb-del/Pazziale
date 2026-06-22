'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TerminosCondicionesPage() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      <div className="pt-32 px-4 md:px-8 max-w-4xl mx-auto pb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[#EAA584] hover:text-[#F59E0B] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <h1 className="text-4xl font-serif mb-8 text-[#EAA584]">Términos y Condiciones</h1>
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p><strong>Última actualización:</strong> [Fecha actual]</p>

          <section>
            <h2 className="text-2xl font-serif text-white mb-2">1. Aceptación de los Términos</h2>
            <p>Al utilizar la tienda en línea de Pazziale, aceptas cumplir con estos Términos y Condiciones. Si no estás de acuerdo, por favor no utilices nuestro sitio.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-2">2. Productos y precios</h2>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Los productos mostrados son artesanales y pueden presentar ligeras variaciones.</li>
              <li>Los precios están expresados en pesos chilenos (CLP) e incluyen IVA.</li>
              <li>Nos reservamos el derecho de modificar precios y disponibilidad sin previo aviso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-2">3. Proceso de compra</h2>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Al realizar un pedido, recibirás un correo de confirmación.</li>
              <li>El pago se procesa a través de Mercado Pago, quien gestiona la transacción de forma segura.</li>
              <li>Una vez confirmado el pago, procesaremos tu pedido para envío dentro de 2 a 3 días hábiles.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-2">4. Envíos y entregas</h2>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Realizamos envíos a todo Chile a través de Starken y Chilexpress.</li>
              <li>Los tiempos de entrega varían según la zona (aproximadamente 3 a 7 días hábiles).</li>
              <li>El costo de envío se calcula en el carrito según el destino y peso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-2">5. Cambios y devoluciones</h2>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Aceptamos cambios o devoluciones dentro de los 30 días posteriores a la compra, siempre que el producto esté en perfecto estado.</li>
              <li>Los gastos de envío por devolución corren por cuenta del cliente, excepto en casos de defecto de fábrica.</li>
              <li>Para iniciar un cambio, contáctanos a <a href="mailto:contacto@pazziale.cl" className="text-[#EAA584] hover:underline">contacto@pazziale.cl</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-2">6. Propiedad intelectual</h2>
            <p>Todo el contenido del sitio (textos, imágenes, logotipos) es propiedad de Pazziale y está protegido por derechos de autor. Queda prohibida su reproducción sin autorización expresa.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-2">7. Limitación de responsabilidad</h2>
            <p>No nos hacemos responsables por el mal uso de los productos ni por daños indirectos derivados de su uso. La información proporcionada es de carácter general y puede contener errores involuntarios.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-2">8. Modificaciones</h2>
            <p>Podemos actualizar estos términos en cualquier momento. Te recomendamos revisarlos periódicamente.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-2">9. Contacto</h2>
            <p>Si tienes preguntas sobre estos términos, escríbenos a <a href="mailto:contacto@pazziale.cl" className="text-[#EAA584] hover:underline">contacto@pazziale.cl</a>.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}