import { generateSitemapEntry } from '@/lib/seo-utils'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://avgd.ua'
  
  const routes = [
    generateSitemapEntry(`${baseUrl}/`, new Date().toISOString().split('T')[0], 'daily', 1.0),
    generateSitemapEntry(`${baseUrl}/about`, new Date().toISOString().split('T')[0], 'monthly', 0.8),
    generateSitemapEntry(`${baseUrl}/products`, new Date().toISOString().split('T')[0], 'weekly', 0.9),
    generateSitemapEntry(`${baseUrl}/en`, new Date().toISOString().split('T')[0], 'daily', 0.9),
    generateSitemapEntry(`${baseUrl}/en/about`, new Date().toISOString().split('T')[0], 'monthly', 0.7),
    generateSitemapEntry(`${baseUrl}/en/products`, new Date().toISOString().split('T')[0], 'weekly', 0.8),
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${route.loc}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
