import { describe, it, expect } from 'vitest'
import { schemaToFields } from '../../src/mcp/schema-form'

describe('schemaToFields', () => {
  it('maps string property to text field', () => {
    const fields = schemaToFields({
      type: 'object',
      properties: { name: { type: 'string', description: 'Your name' } },
    })
    expect(fields).toHaveLength(1)
    expect(fields[0]).toMatchObject({
      key: 'name',
      kind: 'text',
      label: 'name',
      help: 'Your name',
      required: false,
    })
  })

  it('marks required fields', () => {
    const fields = schemaToFields({
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
    })
    expect(fields[0].required).toBe(true)
  })

  it('maps string with format:email to email field', () => {
    const fields = schemaToFields({
      type: 'object',
      properties: { email: { type: 'string', format: 'email' } },
    })
    expect(fields[0].kind).toBe('email')
  })

  it('maps number with bounds to number field', () => {
    const fields = schemaToFields({
      type: 'object',
      properties: { age: { type: 'integer', minimum: 0, maximum: 120 } },
    })
    expect(fields[0]).toMatchObject({
      kind: 'number',
      min: 0,
      max: 120,
    })
  })

  it('maps boolean to switch', () => {
    const fields = schemaToFields({
      type: 'object',
      properties: { enabled: { type: 'boolean' } },
    })
    expect(fields[0].kind).toBe('switch')
  })

  it('maps enum to select with options', () => {
    const fields = schemaToFields({
      type: 'object',
      properties: { role: { type: 'string', enum: ['admin', 'user', 'guest'] } },
    })
    expect(fields[0]).toMatchObject({
      kind: 'select',
      options: [
        { value: 'admin', label: 'admin' },
        { value: 'user', label: 'user' },
        { value: 'guest', label: 'guest' },
      ],
    })
  })

  it('maps array of strings to multiselect', () => {
    const fields = schemaToFields({
      type: 'object',
      properties: {
        tags: { type: 'array', items: { type: 'string' } },
      },
    })
    expect(fields[0].kind).toBe('multiselect')
  })

  it('uses title over property name when present', () => {
    const fields = schemaToFields({
      type: 'object',
      properties: { fullName: { type: 'string', title: 'Full Name' } },
    })
    expect(fields[0].label).toBe('Full Name')
  })

  it('returns empty array for schema without properties', () => {
    expect(schemaToFields({ type: 'object' })).toEqual([])
  })

  it('passes default value through to field descriptor', () => {
    const fields = schemaToFields({
      type: 'object',
      properties: { count: { type: 'number', default: 5 } },
    })
    expect(fields[0].defaultValue).toBe(5)
  })
})
