const STATS = [
  '97M+ monthly MCP downloads',
  '9,652+ servers',
  'React · Angular · Vue',
  'MIT License',
  'Copy-paste',
]

export function ProofStrip() {
  return (
    <div className="w-full border-y py-4"
      style={{ borderColor: 'var(--site-border)', backgroundColor: 'var(--site-bg-elevated)' }}>
      <div className="site-container flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
        {STATS.map((stat, i) => (
          <span key={i} className="text-sm" style={{ color: 'var(--site-text-muted)' }}>
            {stat}
          </span>
        ))}
      </div>
    </div>
  )
}
