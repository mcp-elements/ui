import { reactive, computed, watch, type ComputedRef } from 'vue'
import { schemaToFields } from '@mcp-elements/core'
import type { JsonSchema, FieldDescriptor } from '@mcp-elements/core'

export interface UseMcpSchemaForm {
  /** Form fields derived from the JSON Schema. */
  fields: ComputedRef<FieldDescriptor[]>
  /** Reactive map of field key → current value. */
  values: Record<string, unknown>
  /** Set a single field's value. */
  setValue: (key: string, value: unknown) => void
  /** Reset all values to the schema defaults. */
  reset: () => void
}

/**
 * Vue composable that turns a JSON Schema into reactive form state via the
 * framework-free `schemaToFields()`. Re-seeds defaults when the schema changes.
 */
export function useMcpSchemaForm(schema: JsonSchema | (() => JsonSchema)): UseMcpSchemaForm {
  const getSchema = typeof schema === 'function' ? schema : () => schema
  const fields = computed<FieldDescriptor[]>(() => schemaToFields(getSchema()))
  const values = reactive<Record<string, unknown>>({})

  const reset = () => {
    for (const k of Object.keys(values)) delete values[k]
    for (const f of fields.value) {
      if (f.defaultValue !== undefined) values[f.key] = f.defaultValue
    }
  }

  watch(fields, reset, { immediate: true })

  const setValue = (key: string, value: unknown) => {
    values[key] = value
  }

  return { fields, values, setValue, reset }
}
