import '@/app/globals.css';
import { CarritoProvider } from '@/context/CarritoContext';
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <CarritoProvider>
          {children}
        </CarritoProvider>
        <GoogleAnalytics gaId="G-HGRCMVCBBL" />
      </body>
    </html>
  );
}
///--//