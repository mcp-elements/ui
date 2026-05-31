import type { MetadataRoute } from 'next'

const SITE = 'https://mcp-elements.wearesnx.studio'

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${SITE}/sitemap.xml`, host: SITE }
}
