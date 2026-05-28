import { useCallback, useMemo, useState } from 'react'
import { schemaToFields } from '@mcp-elements/core'
import type { JsonSchema, FieldDescriptor } from '@mcp-elements/core'

export interface UseMcpSchemaFormReturn {
  /** Derived field descriptors from the JSON Schema */
  fields: FieldDescriptor[]
  /** Current form values */
  values: Record<string, unknown>
  /** Update a single field value (stable reference) */
  setValue: (key: string, value: unknown) => void
  /** Reset values to defaults (stable when fields are unchanged) */
  reset: () => void
}

function buildDefaults(fs: FieldDescriptor[]): Record<string, unknown> {
  const defaults: Record<string, unknown> = {}
  for (const f of fs) {
    if (f.defaultValue !== undefined) defaults[f.key] = f.defaultValue
  }
  return defaults
}

/**
 * React hook that converts a JSON Schema into form field descriptors
 * and manages form state.
 */
export function useMcpSchemaForm(schema: JsonSchema): UseMcpSchemaFormReturn {
  const fields = useMemo(() => schemaToFields(schema), [schema])
  const [values, setValues] = useState<Record<string, unknown>>(() => buildDefaults(fields))

  const setValue = useCallback((key: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  const reset = useCallback(() => {
    setValues(buildDefaults(fields))
  }, [fields])

  return { fields, values, setValue, reset }
}
