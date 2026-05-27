// OAuth 2.1 + PKCE helpers and state machine for MCP flows.

export interface PkcePair {
  codeVerifier: string
  codeChallenge: string
  codeChallengeMethod: 'S256'
}

function randomBytes(n: number): Uint8Array {
  const arr = new Uint8Array(n)
  globalThis.crypto.getRandomValues(arr)
  return arr
}

function base64urlEncode(bytes: Uint8Array): string {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export async function generatePkcePair(): Promise<PkcePair> {
  const verifierBytes = randomBytes(64) // 64 bytes → 86 chars base64url, within 43-128 range
  const codeVerifier = base64urlEncode(verifierBytes)
  const verifierBuf = new TextEncoder().encode(codeVerifier)
  const hashBuf = await globalThis.crypto.subtle.digest('SHA-256', verifierBuf)
  const codeChallenge = base64urlEncode(new Uint8Array(hashBuf))
  return { codeVerifier, codeChallenge, codeChallengeMethod: 'S256' }
}

export interface AuthUrlInput {
  authorizationEndpoint: string
  clientId: string
  redirectUri: string
  scope: string
  codeChallenge: string
  state: string
  resource?: string // RFC 8707 — MCP-required for token binding
}

export function buildAuthUrl(input: AuthUrlInput): string {
  const u = new URL(input.authorizationEndpoint)
  u.searchParams.set('response_type', 'code')
  u.searchParams.set('client_id', input.clientId)
  u.searchParams.set('redirect_uri', input.redirectUri)
  u.searchParams.set('scope', input.scope)
  u.searchParams.set('code_challenge', input.codeChallenge)
  u.searchParams.set('code_challenge_method', 'S256')
  u.searchParams.set('state', input.state)
  if (input.resource) u.searchParams.set('resource', input.resource)
  return u.toString()
}

export interface TokenExchangeInput {
  clientId: string
  code: string
  redirectUri: string
  codeVerifier: string
}

export function buildTokenExchangeBody(input: TokenExchangeInput): string {
  const body = new URLSearchParams()
  body.set('grant_type', 'authorization_code')
  body.set('client_id', input.clientId)
  body.set('code', input.code)
  body.set('redirect_uri', input.redirectUri)
  body.set('code_verifier', input.codeVerifier)
  return body.toString()
}

export interface TokenRefreshInput {
  clientId: string
  refreshToken: string
  scope?: string
}

export function buildTokenRefreshBody(input: TokenRefreshInput): string {
  const body = new URLSearchParams()
  body.set('grant_type', 'refresh_token')
  body.set('client_id', input.clientId)
  body.set('refresh_token', input.refreshToken)
  if (input.scope) body.set('scope', input.scope)
  return body.toString()
}

export type OAuthStatus = 'idle' | 'authorizing' | 'authorized' | 'denied' | 'error'

export interface OAuthTokens {
  accessToken: string
  tokenType: string
  expiresIn?: number
  refreshToken?: string
  scope?: string
}

export interface OAuthFlowSnapshot {
  status: OAuthStatus
  verifier?: string
  state?: string
  tokens?: OAuthTokens
  error?: { code: string; message?: string; originalError?: Error }
}

export interface OAuthFlowApi extends Readonly<OAuthFlowSnapshot> {
  start(input: { verifier: string; state: string }): void
  markAuthorized(tokens: OAuthTokens): void
  markDenied(code: string, message?: string): void
  markError(error: Error): void
  reset(): void
  subscribe(fn: (s: OAuthFlowSnapshot) => void): () => void
}

const OAUTH_TRANSITIONS: Record<OAuthStatus, OAuthStatus[]> = {
  idle: ['authorizing'],
  authorizing: ['authorized', 'denied', 'error'],
  authorized: ['idle'],
  denied: ['idle'],
  error: ['idle'],
}

export function createOAuthFlow(): OAuthFlowApi {
  let snap: OAuthFlowSnapshot = { status: 'idle' }
  const listeners = new Set<(s: OAuthFlowSnapshot) => void>()

  function notify() {
    let firstError: unknown
    for (const fn of listeners) {
      try {
        fn(snap)
      } catch (e) {
        if (firstError === undefined) firstError = e
      }
    }
    if (firstError !== undefined) throw firstError
  }

  function transition(to: OAuthStatus, patch: Partial<OAuthFlowSnapshot> = {}) {
    const allowed = OAUTH_TRANSITIONS[snap.status]
    if (!allowed.includes(to)) {
      throw new Error(`Invalid oauth transition: ${snap.status} → ${to}`)
    }
    snap = { ...snap, ...patch, status: to }
    notify()
  }

  return {
    get status() {
      return snap.status
    },
    get verifier() {
      return snap.verifier
    },
    get state() {
      return snap.state
    },
    get tokens() {
      return snap.tokens
    },
    get error() {
      return snap.error
    },
    start({ verifier, state }) {
      transition('authorizing', { verifier, state })
    },
    markAuthorized(tokens) {
      transition('authorized', { tokens })
    },
    markDenied(code, message) {
      transition('denied', { error: { code, message } })
    },
    markError(error) {
      transition('error', { error: { code: 'unknown', message: error.message, originalError: error } })
    },
    reset() {
      if (snap.status === 'idle') return
      snap = { status: 'idle' }
      notify()
    },
    subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
}
