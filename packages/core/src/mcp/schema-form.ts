// packages/core/src/mcp/schema-form.ts
import type { JsonSchema } from './types'

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'email'
  | 'url'
  | 'date'
  | 'number'
  | 'switch'
  | 'select'
  | 'multiselect'
  | 'unknown'

export interface FieldDescriptor {
  key: string
  kind: FieldKind
  label: string
  help?: string
  required: boolean
  defaultValue?: unknown
  options?: Array<{ value: string; label: string }>
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: string
}

export function schemaToFields(schema: JsonSchema): FieldDescriptor[] {
  if (schema.type !== 'object' || !schema.properties) return []
  const required = new Set(schema.required ?? [])
  const fields: FieldDescriptor[] = []
  for (const [key, propSchema] of Object.entries(schema.properties)) {
    fields.push(fieldFromProperty(key, propSchema, required.has(key)))
  }
  return fields
}

function fieldFromProperty(key: string, schema: JsonSchema, required: boolean): FieldDescriptor {
  const base = {
    key,
    label: schema.title ?? key,
    help: schema.description,
    required,
    defaultValue: schema.default,
  }

  if (schema.enum && schema.enum.length > 0) {
    return {
      ...base,
      kind: 'select',
      options: schema.enum.map((v) => ({ value: String(v), label: String(v) })),
    }
  }

  switch (schema.type) {
    case 'string': {
      if (schema.format === 'email') return { ...base, kind: 'email' }
      if (schema.format === 'uri' || schema.format === 'url') return { ...base, kind: 'url' }
      if (schema.format === 'date' || schema.format === 'date-time') return { ...base, kind: 'date' }
      if ((schema.maxLength ?? 0) > 200) {
        return {
          ...base,
          kind: 'textarea',
          minLength: schema.minLength,
          maxLength: schema.maxLength,
          pattern: schema.pattern,
        }
      }
      return {
        ...base,
        kind: 'text',
        minLength: schema.minLength,
        maxLength: schema.maxLength,
        pattern: schema.pattern,
      }
    }
    case 'number':
    case 'integer':
      return { ...base, kind: 'number', min: schema.minimum, max: schema.maximum }
    case 'boolean':
      return { ...base, kind: 'switch' }
    case 'array':
      if (schema.items?.type === 'string') return { ...base, kind: 'multiselect' }
      return { ...base, kind: 'unknown' }
    case 'null':
      return { ...base, kind: 'unknown' }
    default:
      return { ...base, kind: 'unknown' }
  }
}
