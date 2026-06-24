import { defineComponent, h, reactive, computed, watch, type PropType, type VNode } from 'vue'
import { cn, schemaToFields } from '@mcp-elements/core'
import type { JsonSchema, FieldDescriptor } from '@mcp-elements/core'

export const McpeMcpToolForm = defineComponent({
  name: 'McpeMcpToolForm',
  props: {
    schema: { type: Object as PropType<JsonSchema>, required: true },
    loading: { type: Boolean, default: false },
    submitLabel: { type: String, default: 'Run' },
    class: { type: String, default: '' },
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const fields = computed<FieldDescriptor[]>(() => schemaToFields(props.schema))
    const values = reactive<Record<string, unknown>>({})

    watch(
      fields,
      (fs) => {
        for (const k of Object.keys(values)) delete values[k]
        for (const f of fs) {
          if (f.defaultValue !== undefined) values[f.key] = f.defaultValue
        }
      },
      { immediate: true }
    )

    const getStr = (key: string) => {
      const v = values[key]
      return v == null ? '' : String(v)
    }
    const getBool = (key: string) => Boolean(values[key])
    const inputType = (f: FieldDescriptor) =>
      f.kind === 'email' ? 'email' : f.kind === 'url' ? 'url' : f.kind === 'date' ? 'date' : 'text'

    const handleSubmit = (e: Event) => {
      e.preventDefault()
      emit('submit', { ...values })
    }

    const submitButton = () =>
      h('div', { class: 'mcpe-mcp-tool-form-submit' }, [
        h(
          'button',
          {
            type: 'submit',
            class: 'mcpe-btn mcpe-btn-primary mcpe-btn-sm',
            disabled: props.loading,
          },
          props.loading ? 'Running…' : props.submitLabel
        ),
      ])

    const fieldInput = (field: FieldDescriptor): VNode => {
      switch (field.kind) {
        case 'switch':
          return h('input', {
            type: 'checkbox',
            id: field.key,
            class: 'mcpe-switch',
            checked: getBool(field.key),
            onChange: (e: Event) => {
              values[field.key] = (e.target as HTMLInputElement).checked
            },
          })
        case 'select':
          return h(
            'select',
            {
              id: field.key,
              class: 'mcpe-select',
              value: getStr(field.key),
              onChange: (e: Event) => {
                values[field.key] = (e.target as HTMLSelectElement).value
              },
            },
            [
              h('option', { value: '' }, 'Select…'),
              ...(field.options ?? []).map((opt) =>
                h('option', { value: opt.value }, opt.label)
              ),
            ]
          )
        case 'textarea':
          return h('textarea', {
            id: field.key,
            class: 'mcpe-textarea',
            rows: 4,
            value: getStr(field.key),
            onInput: (e: Event) => {
              values[field.key] = (e.target as HTMLTextAreaElement).value
            },
          })
        case 'number':
          return h('input', {
            type: 'number',
            id: field.key,
            class: 'mcpe-input',
            value: getStr(field.key),
            onInput: (e: Event) => {
              const raw = (e.target as HTMLInputElement).value
              values[field.key] = raw === '' ? undefined : Number(raw)
            },
          })
        default:
          return h('input', {
            type: inputType(field),
            id: field.key,
            class: 'mcpe-input',
            value: getStr(field.key),
            onInput: (e: Event) => {
              values[field.key] = (e.target as HTMLInputElement).value
            },
          })
      }
    }

    return () => {
      if (fields.value.length === 0) {
        return h('form', { class: cn('mcpe-mcp-tool-form', props.class), onSubmit: handleSubmit }, [
          h('p', { class: 'text-sm text-muted-foreground' }, 'This tool takes no inputs.'),
          submitButton(),
        ])
      }

      const fieldNodes = fields.value.map((field) => {
        const children: VNode[] = [
          h(
            'label',
            {
              for: field.key,
              class: cn(
                'mcpe-mcp-tool-form-label',
                field.required ? 'mcpe-mcp-tool-form-label-required' : ''
              ),
            },
            field.label
          ),
          fieldInput(field),
        ]
        if (field.help) {
          children.push(h('p', { class: 'mcpe-mcp-tool-form-help' }, field.help))
        }
        return h('div', { class: 'mcpe-mcp-tool-form-field' }, children)
      })

      return h('form', { class: cn('mcpe-mcp-tool-form', props.class), onSubmit: handleSubmit }, [
        ...fieldNodes,
        submitButton(),
      ])
    }
  },
})
