import type { MetadataRoute } from 'next'

const BASE_URL = 'https://syncmaster.live'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login', '/signup'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
