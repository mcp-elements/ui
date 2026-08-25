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
    default: 'mcp-elements — UI primitives for MCP hosts',
    template: '%s · mcp-elements',
  },
  description:
    'UI primitives for building MCP hosts — OAuth consent, tool-call cards, scope inspectors, resource browsers, and an MCP Apps (SEP-1865) renderer. Copy-paste source for React, Angular & Vue. You own the code.',
  keywords: ['MCP', 'Model Context Protocol', 'MCP host', 'MCP client', 'MCP Apps', 'SEP-1865', 'MCP UI', 'OAuth consent UI', 'tool calling UI', 'AI UI', 'agent UI', 'React components', 'Angular', 'Vue', 'shadcn', 'copy-paste components'],
  openGraph: {
    type: 'website',
    url: 'https://mcp-elements.wearesnx.studio',
    siteName: 'mcp-elements',
    title: 'mcp-elements — UI primitives for MCP hosts',
    description: 'The screens every MCP host rebuilds — consent, scopes, tool calls, tool-forms — plus an MCP Apps (SEP-1865) renderer. Copy-paste for React, Angular & Vue.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mcp-elements — UI primitives for MCP hosts',
    description: 'Consent, tool calls, scopes, resources + an MCP Apps (SEP-1865) renderer. Copy-paste, you own the source.',
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
