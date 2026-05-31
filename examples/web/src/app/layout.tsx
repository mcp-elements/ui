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
    '38 copy-paste UI components. Multi-framework (React, Angular, Vue). The only library with MCP-native primitives — tool calls, consent, scopes, resources.',
  keywords: ['MCP', 'Model Context Protocol', 'AI UI', 'React components', 'shadcn', 'agent UI', 'tool calling UI', 'copy-paste components'],
  openGraph: {
    type: 'website',
    url: 'https://mcp-elements.wearesnx.studio',
    siteName: 'mcp-elements',
    title: 'mcp-elements — MCP-native UI components',
    description: 'Copy-paste UI primitives for AI & MCP apps. React, Angular, Vue.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mcp-elements',
    description: 'MCP-native, multi-framework copy-paste UI components.',
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
