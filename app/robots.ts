// app/robots.ts
import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Ejemplo de rutas a bloquear
    },
    sitemap: 'https://www.pazziale.cl/sitemap.xml',
  }
}