const STATS = [
  { label: '97M+', sub: 'monthly MCP downloads' },
  { label: '9,652+', sub: 'open-source servers' },
  { label: '3', sub: 'frameworks at launch' },
  { label: 'MIT', sub: 'licensed' },
  { label: '0', sub: 'runtime dependencies' },
]

export function ProofStrip() {
  return (
    <div
      className="w-full py-6"
      style={{
        borderTop: '1px solid var(--site-border)',
        borderBottom: '1px solid var(--site-border)',
        backgroundColor: 'var(--site-bg-elevated)',
      }}
    >
      <div className="site-container">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center gap-0.5">
              <span className="font-mono text-base font-semibold tracking-tight site-text sm:text-lg">
                {stat.label}
              </span>
              <span className="text-[11px] uppercase tracking-widest site-text-subtle">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
