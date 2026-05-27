import { describe, it, expect } from 'vitest'
import { generatePkcePair, buildAuthUrl, buildTokenExchangeBody, createOAuthFlow } from '../../src/mcp/oauth'

describe('generatePkcePair', () => {
  it('returns a 43-128 char URL-safe verifier', async () => {
    const pair = await generatePkcePair()
    expect(pair.codeVerifier.length).toBeGreaterThanOrEqual(43)
    expect(pair.codeVerifier.length).toBeLessThanOrEqual(128)
    expect(pair.codeVerifier).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('returns a base64url-encoded SHA-256 challenge', async () => {
    const pair = await generatePkcePair()
    expect(pair.codeChallenge).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(pair.codeChallenge).not.toContain('=')
    expect(pair.codeChallengeMethod).toBe('S256')
  })

  it('different calls produce different verifiers', async () => {
    const a = await generatePkcePair()
    const b = await generatePkcePair()
    expect(a.codeVerifier).not.toBe(b.codeVerifier)
  })
})

describe('buildAuthUrl', () => {
  it('includes all required params', () => {
    const url = buildAuthUrl({
      authorizationEndpoint: 'https://example.com/authorize',
      clientId: 'abc',
      redirectUri: 'https://app.example.com/cb',
      scope: 'user:read repo:write',
      codeChallenge: 'CHAL',
      state: 'STATE',
    })
    const u = new URL(url)
    expect(u.origin + u.pathname).toBe('https://example.com/authorize')
    expect(u.searchParams.get('response_type')).toBe('code')
    expect(u.searchParams.get('client_id')).toBe('abc')
    expect(u.searchParams.get('redirect_uri')).toBe('https://app.example.com/cb')
    expect(u.searchParams.get('scope')).toBe('user:read repo:write')
    expect(u.searchParams.get('code_challenge')).toBe('CHAL')
    expect(u.searchParams.get('code_challenge_method')).toBe('S256')
    expect(u.searchParams.get('state')).toBe('STATE')
  })
})

describe('buildTokenExchangeBody', () => {
  it('returns URL-encoded body', () => {
    const body = buildTokenExchangeBody({
      clientId: 'abc',
      code: 'AUTH_CODE',
      redirectUri: 'https://app.example.com/cb',
      codeVerifier: 'V',
    })
    const params = new URLSearchParams(body)
    expect(params.get('grant_type')).toBe('authorization_code')
    expect(params.get('client_id')).toBe('abc')
    expect(params.get('code')).toBe('AUTH_CODE')
    expect(params.get('redirect_uri')).toBe('https://app.example.com/cb')
    expect(params.get('code_verifier')).toBe('V')
  })
})

describe('createOAuthFlow', () => {
  it('starts in idle', () => {
    const f = createOAuthFlow()
    expect(f.status).toBe('idle')
  })

  it('transitions idle → authorizing → authorized', () => {
    const f = createOAuthFlow()
    f.start({ verifier: 'V', state: 'S' })
    expect(f.status).toBe('authorizing')
    f.markAuthorized({ accessToken: 'T', tokenType: 'Bearer' })
    expect(f.status).toBe('authorized')
    expect(f.tokens?.accessToken).toBe('T')
  })

  it('transitions authorizing → denied', () => {
    const f = createOAuthFlow()
    f.start({ verifier: 'V', state: 'S' })
    f.markDenied('user_denied')
    expect(f.status).toBe('denied')
  })

  it('throws on invalid transitions', () => {
    const f = createOAuthFlow()
    expect(() => f.markAuthorized({ accessToken: 'x', tokenType: 'Bearer' })).toThrow()
  })
})
