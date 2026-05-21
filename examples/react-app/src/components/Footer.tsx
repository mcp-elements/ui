import { Badge, Separator } from '@mcp-elements/react'

const links = [
  { label: 'GitHub', href: 'https://github.com', external: true },
  { label: 'Components', href: '#components', external: false },
  { label: 'CLI', href: '#cli', external: false },
]

const techBadges = ['React', 'Angular', 'Tailwind v4', 'TypeScript']

export function Footer() {
  return (
    <footer className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Separator />

        <div className="mt-8 flex flex-col items-center text-center gap-4">
          {/* Logo */}
          <span className="text-lg font-bold font-mono gradient-text">
            snuxt-ui
          </span>

          {/* Tagline */}
          <p className="text-sm text-muted-foreground">
            Framework-agnostic components. CSS-first. Own your code.
          </p>

          {/* Links */}
          <div className="flex items-center gap-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                {...(link.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Tech badges */}
          <div className="flex flex-wrap justify-center gap-2">
            {techBadges.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">&copy; 2026 snuxt-ui</p>
        </div>
      </div>
    </footer>
  )
}
