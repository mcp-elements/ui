import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { SiteNav } from '@/components/site/SiteNav'
import { SiteFooter } from '@/components/site/SiteFooter'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'mcp-elements — The UI kit for MCP applications',
    template: '%s · mcp-elements',
  },
  description:
    'Pre-built consent dialogs, tool-call cards, and scope inspectors for MCP applications. Copy-paste into React, Angular, or Vue.',
  openGraph: {
    title: 'mcp-elements',
    description: 'The UI kit for MCP applications.',
    url: 'https://mcp-elements.dev',
    siteName: 'mcp-elements',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mcp-elements',
    description: 'The UI kit for MCP applications.',
  },
  keywords: ['MCP', 'Model Context Protocol', 'UI components', 'React', 'Angular', 'Vue', 'AI'],
}

function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem('mcp-theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})()`
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeScript />
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
