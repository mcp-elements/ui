// MCP descriptor types. Sourced from MCP spec 2025-11-25.
// Reference: docs/research/protocol-cheatsheet.md § 1

export interface BaseMetadata {
  name: string
  title?: string
}

export interface Icons {
  icons?: Array<{
    src: string
    mimeType?: string
    sizes?: string[]
    theme?: 'light' | 'dark'
  }>
}

export interface Implementation extends BaseMetadata, Icons {
  version: string
  description?: string
  websiteUrl?: string
}

export interface ServerCapabilities {
  experimental?: Record<string, object>
  logging?: object
  completions?: object
  prompts?: { listChanged?: boolean }
  resources?: { subscribe?: boolean; listChanged?: boolean }
  tools?: { listChanged?: boolean }
  tasks?: {
    list?: object
    cancel?: object
    requests?: { tools?: { call?: object } }
  }
}

export interface JsonSchema {
  $schema?: string
  type: 'object' | 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'null'
  properties?: Record<string, JsonSchema>
  required?: string[]
  additionalProperties?: boolean
  description?: string
  title?: string
  format?: string
  enum?: unknown[]
  default?: unknown
  minimum?: number
  maximum?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  items?: JsonSchema
}

export interface Tool extends BaseMetadata, Icons {
  description?: string
  inputSchema: JsonSchema & { type: 'object' }
  outputSchema?: JsonSchema & { type: 'object' }
  annotations?: {
    title?: string
    readOnlyHint?: boolean
    destructiveHint?: boolean
    idempotentHint?: boolean
    openWorldHint?: boolean
  }
}

export interface Resource extends BaseMetadata, Icons {
  uri: string
  mimeType?: string
  description?: string
  size?: number
}

export interface Prompt extends BaseMetadata, Icons {
  description?: string
  arguments?: Array<{
    name: string
    description?: string
    required?: boolean
  }>
}

export type ContentBlock =
  | { type: 'text'; text: string }
  | { type: 'image'; data: string; mimeType: string }
  | { type: 'audio'; data: string; mimeType: string }
  | { type: 'resource'; resource: Resource & { text?: string; blob?: string } }

export interface CallToolResult {
  content: ContentBlock[]
  isError?: boolean
  structuredContent?: Record<string, unknown>
}

// MCP App UI Resource (MCP Apps spec 2026-01-26)
export interface UiResource {
  uri: string
  mimeType: string
  content: string
  metadata?: Record<string, unknown>
}

// Tool call lifecycle status (used by ToolState machine)
export type ToolCallStatus =
  | 'idle'
  | 'pending'
  | 'running'
  | 'done'
  | 'error'
  | 'cancelled'

// OAuth scope descriptor (used by Scope parser + Consent dialog)
export interface ScopeDescriptor {
  raw: string                    // original scope string e.g. "user.email:read"
  resource: string               // before the colon — "user.email"
  permissions: string[]          // after the colon, comma-split — ["read"]
  description?: string           // human-readable; set by callers
}
