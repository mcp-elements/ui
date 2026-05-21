import { SourceCards, SourceCard } from '@mcp-elements/react'

export function SourceCardDemo() {
  return (
    <SourceCards className="w-full max-w-lg">
      <SourceCard
        href="#"
        favicon="https://developer.mozilla.org/favicon-48x48.png"
        title="CSS Cascade Layers - MDN Web Docs"
        domain="developer.mozilla.org"
        index={1}
      />
      <SourceCard
        href="#"
        favicon="https://web.dev/favicon-48x48.png"
        title="Learn CSS Layers"
        domain="web.dev"
        index={2}
      />
      <SourceCard
        href="#"
        favicon="https://css-tricks.com/favicon.ico"
        title="A Complete Guide to CSS Cascade Layers"
        domain="css-tricks.com"
        index={3}
      />
      <SourceCard
        href="#"
        favicon="https://stackoverflow.com/favicon.ico"
        title="When to use @layer in CSS?"
        domain="stackoverflow.com"
        index={4}
      />
    </SourceCards>
  )
}
