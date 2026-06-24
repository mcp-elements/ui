import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { SiteNav } from '@/components/site/SiteNav'
import { SiteFooter } from '@/components/site/SiteFooter'
import { JsonLd } from '@/components/site/JsonLd'
import '@/styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://mcp-elements.wearesnx.studio'),
  title: {
    default: 'mcp-elements — MCP-native UI components',
    template: '%s · mcp-elements',
  },
  description:
    'The MCP-native UI kit. The only library shipping copy-paste, framework-agnostic MCP primitives — OAuth consent, scope inspector, tool-call cards, JSON-Schema tool-forms, sandboxed MCP-Apps frame. React, Angular & Vue.',
  keywords: ['MCP', 'Model Context Protocol', 'MCP UI', 'MCP Apps', 'OAuth consent UI', 'tool calling UI', 'AI UI', 'agent UI', 'React components', 'Angular', 'Vue', 'shadcn', 'copy-paste components'],
  openGraph: {
    type: 'website',
    url: 'https://mcp-elements.wearesnx.studio',
    siteName: 'mcp-elements',
    title: 'mcp-elements — the MCP-native UI kit',
    description: 'Copy-paste, framework-agnostic MCP UI primitives — consent, scopes, tool calls, tool-forms, MCP-Apps frame. React, Angular & Vue.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mcp-elements — the MCP-native UI kit',
    description: 'The only copy-paste, framework-agnostic MCP UI primitive kit. React, Angular & Vue.',
  },
}

function ThemeScript() {
  // Always set data-theme explicitly so both --site-* and --color-* tokens
  // resolve to the same theme. Default to dark, flip to light only when
  // user has chosen it.
  const script = `(function(){try{var t=localStorage.getItem('mcp-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})()`
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head />
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <JsonLd />
        <ThemeScript />
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
