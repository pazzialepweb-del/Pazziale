import '@/app/globals.css';
import { CarritoProvider } from '@/context/CarritoContext';
import Script from 'next/script';
import type { Metadata } from 'next'; // 👈 Importa el tipo

// ✅ Agrega esta exportación
export const metadata: Metadata = {
  verification: {
    google: 'mXfvn8Qfo71YYbo_qQbcPCiNUaMXgR08XjJUSSX4cWM',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Google Analytics (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-HGRCMVCBBL`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HGRCMVCBBL', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body>
        <CarritoProvider>
          {children}
        </CarritoProvider>
      </body>
    </html>
  );
}