import { useState } from 'react'
import { cn, schemaToFields } from '@mcp-elements/core'
import type { JsonSchema, FieldDescriptor } from '@mcp-elements/core'

export interface McpToolFormProps {
  schema: JsonSchema
  onSubmit: (args: Record<string, unknown>) => void
  loading?: boolean
  submitLabel?: string
  className?: string
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDescriptor
  value: unknown
  onChange: (v: unknown) => void
}) {
  const str = typeof value === 'string' ? value : value == null ? '' : String(value)

  switch (field.kind) {
    case 'switch':
      return (
        <input
          type="checkbox"
          id={field.key}
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="mcpe-switch"
          aria-label={field.label}
        />
      )

    case 'select':
      return (
        <select
          id={field.key}
          value={str}
          onChange={(e) => onChange(e.target.value)}
          className="mcpe-select"
          required={field.required}
        >
          <option value="">Select…</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )

    case 'multiselect':
      return (
        <select
          id={field.key}
          multiple
          value={Array.isArray(value) ? value.map(String) : []}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map((o) => o.value)
            onChange(selected)
          }}
          className="mcpe-select"
          required={field.required}
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )

    case 'textarea':
      return (
        <textarea
          id={field.key}
          value={str}
          onChange={(e) => onChange(e.target.value)}
          className="mcpe-textarea"
          required={field.required}
          minLength={field.minLength}
          maxLength={field.maxLength}
          rows={4}
        />
      )

    case 'number':
      return (
        <input
          type="number"
          id={field.key}
          value={str}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          className="mcpe-input"
          required={field.required}
          min={field.min}
          max={field.max}
        />
      )

    case 'unknown':
      return (
        <input
          type="text"
          id={field.key}
          value={str}
          onChange={(e) => onChange(e.target.value)}
          className="mcpe-input"
          disabled
          placeholder="(unsupported field type)"
        />
      )

    default:
      return (
        <input
          type={field.kind === 'email' ? 'email' : field.kind === 'url' ? 'url' : field.kind === 'date' ? 'date' : 'text'}
          id={field.key}
          value={str}
          onChange={(e) => onChange(e.target.value)}
          className="mcpe-input"
          required={field.required}
          pattern={field.pattern}
          minLength={field.minLength}
          maxLength={field.maxLength}
        />
      )
  }
}

export function McpToolForm({
  schema,
  onSubmit,
  loading = false,
  submitLabel = 'Run',
  className,
}: McpToolFormProps) {
  const fields = schemaToFields(schema)
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const defaults: Record<string, unknown> = {}
    for (const f of fields) {
      if (f.defaultValue !== undefined) defaults[f.key] = f.defaultValue
    }
    return defaults
  })

  function setValue(key: string, value: unknown) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(values)
  }

  if (fields.length === 0) {
    return (
      <form onSubmit={handleSubmit} className={cn('mcpe-mcp-tool-form', className)}>
        <p className="text-sm text-muted-foreground">This tool takes no inputs.</p>
        <div className="mcpe-mcp-tool-form-submit">
          <button type="submit" className="mcpe-btn mcpe-btn-primary mcpe-btn-sm" disabled={loading}>
            {loading ? 'Running…' : submitLabel}
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('mcpe-mcp-tool-form', className)}>
      {fields.map((field) => (
        <div key={field.key} className="mcpe-mcp-tool-form-field">
          <label
            htmlFor={field.key}
            className={cn('mcpe-mcp-tool-form-label', field.required && 'mcpe-mcp-tool-form-label-required')}
          >
            {field.label}
          </label>
          <FieldInput field={field} value={values[field.key]} onChange={(v) => setValue(field.key, v)} />
          {field.help && <p className="mcpe-mcp-tool-form-help">{field.help}</p>}
        </div>
      ))}
      <div className="mcpe-mcp-tool-form-submit">
        <button type="submit" className="mcpe-btn mcpe-btn-primary mcpe-btn-sm" disabled={loading}>
          {loading ? 'Running…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
