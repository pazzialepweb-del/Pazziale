import '@/app/globals.css';  // ✅ Esta línea es la que falta
import { CarritoProvider } from '@/context/CarritoContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <CarritoProvider>
          {children}
        </CarritoProvider>
      </body>
    </html>
  );
}