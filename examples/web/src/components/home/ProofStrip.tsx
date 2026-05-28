const STATS = [
  { label: '97M+', sub: 'monthly MCP downloads' },
  { label: '9,652+', sub: 'open-source servers' },
  { label: '3', sub: 'frameworks at launch' },
  { label: 'MIT', sub: 'licensed' },
  { label: '0', sub: 'runtime dependencies' },
]

export function ProofStrip() {
  return (
    <div className="relative w-full py-8">
      {/* Gradient hairlines instead of hard borders */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--site-border-strong), transparent)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--site-border-strong), transparent)' }}
      />
      {/* Subtle radial wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 100% at 50% 50%, color-mix(in oklab, var(--site-bg-elevated) 70%, transparent), transparent 80%)',
        }}
      />

      <div className="site-container relative">
        <div className="grid grid-cols-2 gap-y-5 gap-x-4 sm:grid-cols-3 md:grid-cols-5">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center gap-1">
              <span
                className="font-bold tracking-tight site-text sm:text-xl"
                style={{ fontSize: '1.1rem', letterSpacing: '-0.02em' }}
              >
                {stat.label}
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] site-text-subtle">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
