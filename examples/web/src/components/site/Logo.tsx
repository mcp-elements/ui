/**
 * mcp-elements brand mark — a periodic table element.
 *
 * Shows atomic number 7 (the 7 MCP components we ship), the symbol
 * "Mcp" as the element abbreviation, and "Elements" as the element
 * name. Works as a brand mark, favicon, and avatar at multiple sizes.
 *
 * Use:
 *   <Logo />          // 28×28, default
 *   <Logo size={48}/> // bigger
 *   <Logo variant="filled" />  // pink-filled (for hero, splash)
 *   <Wordmark />      // mark + "mcp-elements" text inline
 */

interface LogoProps {
  size?: number
  variant?: 'outline' | 'filled'
  className?: string
  ariaLabel?: string
}

export function Logo({
  size = 28,
  variant = 'outline',
  className,
  ariaLabel = 'mcp-elements',
}: LogoProps) {
  const filled = variant === 'filled'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={ariaLabel}
      className={className}
    >
      {/* Outer tile */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="10"
        fill={filled ? 'var(--site-accent)' : 'var(--site-bg-elevated)'}
        stroke={filled ? 'transparent' : 'var(--site-accent)'}
        strokeWidth="1.5"
      />
      {/* Inset highlight — like real light catching the surface */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="10"
        fill="none"
        stroke="oklch(1 0 0 / 0.10)"
        strokeWidth="1"
      />

      {/* Atomic number (top-left) */}
      <text
        x="8"
        y="16"
        fontSize="9"
        fontFamily="ui-monospace, 'Geist Mono', monospace"
        fontWeight="500"
        fill={filled ? 'oklch(1 0 0 / 0.85)' : 'var(--site-accent)'}
        letterSpacing="0.05em"
      >
        7
      </text>

      {/* Element symbol — "Mcp" — the heart of the mark */}
      <text
        x="32"
        y="40"
        fontSize="20"
        fontFamily="'Geist Sans', ui-sans-serif, system-ui, sans-serif"
        fontWeight="700"
        fill={filled ? 'oklch(1 0 0)' : 'var(--site-text)'}
        textAnchor="middle"
        letterSpacing="-0.02em"
      >
        Mcp
      </text>

      {/* Element name — "elements" — tiny label */}
      <text
        x="32"
        y="54"
        fontSize="6"
        fontFamily="ui-monospace, 'Geist Mono', monospace"
        fill={filled ? 'oklch(1 0 0 / 0.7)' : 'var(--site-text-subtle)'}
        textAnchor="middle"
        letterSpacing="0.18em"
        textRendering="geometricPrecision"
      >
        ELEMENTS
      </text>
    </svg>
  )
}

interface WordmarkProps {
  size?: number
  className?: string
}

export function Wordmark({ size = 28, className }: WordmarkProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <Logo size={size} />
      <span className="font-mono text-sm font-semibold tracking-tight site-text">
        mcp-elements
      </span>
    </span>
  )
}
