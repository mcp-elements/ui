import type { MetadataRoute } from 'next'
import { COMPONENTS } from '@/data/components'

const SITE = 'https://mcp-elements.wearesnx.studio'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/components', '/mcp', '/themes', '/playground'].map((p) => ({
    url: `${SITE}${p}`,
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.8,
  }))
  const componentRoutes = COMPONENTS.map((c) => ({
    url: `${SITE}/components/${c.slug}`,
    changeFrequency: 'monthly' as const,
    priority: c.isMcp ? 0.9 : 0.6,
  }))
  return [...staticRoutes, ...componentRoutes]
}
