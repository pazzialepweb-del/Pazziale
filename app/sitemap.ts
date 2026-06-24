// app/sitemap.ts
import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.pazziale.cl',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://www.pazziale.cl/tienda',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // Aquí puedes añadir dinámicamente las URLs de tus productos
    // Ej: ...productos.map((producto) => ({ url: `https://www.pazziale.cl/producto/${producto.id}`, ... }))
  ]
}