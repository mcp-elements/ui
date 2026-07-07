import { ImageResponse } from 'next/og'

export const alt = 'mcp-elements — the MCP-native UI kit for any framework'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Hex equivalents of the site tokens (satori has no oklch support):
// --site-bg oklch(0.13 0 0) ≈ #111113, --site-accent oklch(0.71 0.22 5) ≈ #f4437e
const BG = '#111113'
const CARD = '#1a1a1d'
const BORDER = '#2e2e33'
const TEXT = '#fafafa'
const MUTED = '#a1a1aa'
const SUBTLE = '#6b6b74'
const ACCENT = '#f4437e'
const SUCCESS = '#4ade80'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: BG,
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 52,
              height: 52,
              borderRadius: 12,
              backgroundColor: CARD,
              border: `1px solid ${ACCENT}`,
              color: TEXT,
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            Mcp
          </div>
          <div style={{ display: 'flex', color: TEXT, fontSize: 30, fontWeight: 600 }}>
            mcp-elements
          </div>
          <div
            style={{
              display: 'flex',
              marginLeft: 8,
              padding: '4px 14px',
              borderRadius: 999,
              border: `1px solid ${BORDER}`,
              color: SUBTLE,
              fontSize: 20,
            }}
          >
            v0.1
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              color: TEXT,
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -2,
            }}
          >
            The&nbsp;<span style={{ color: ACCENT }}>MCP-native</span>&nbsp;UI kit
          </div>
          <div
            style={{
              display: 'flex',
              color: MUTED,
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -2,
            }}
          >
            for any framework.
          </div>
          <div style={{ display: 'flex', color: MUTED, fontSize: 28, marginTop: 8 }}>
            Copy-paste MCP primitives — consent, scopes, tool calls, tool-forms, MCP-Apps frame.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 24px',
              borderRadius: 12,
              backgroundColor: CARD,
              border: `1px solid ${BORDER}`,
              color: MUTED,
              fontSize: 24,
            }}
          >
            <span style={{ color: SUCCESS }}>$</span>
            npx mcp-elements add mcp-tool-call
          </div>
          <div style={{ display: 'flex', color: SUBTLE, fontSize: 24 }}>
            React · Angular · Vue · 38 components
          </div>
        </div>
      </div>
    ),
    size,
  )
}
