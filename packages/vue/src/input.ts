import { defineComponent, computed, h } from 'vue'
import { cn } from '@mcp-elements/core'

export const McpeInput = defineComponent({
  name: 'McpeInput',
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, default: '' },
    error: { type: String, default: '' },
    helperText: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    type: { type: String, default: 'text' },
    id: { type: String, default: '' },
    class: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inputId = computed(() => props.id || `mcpe-input-${Math.random().toString(36).slice(2, 9)}`)

    return () => {
      const children = []

      if (props.label) {
        children.push(
          h('label', { for: inputId.value, class: 'mcpe-input-label' }, props.label)
        )
      }

      children.push(
        h('input', {
          id: inputId.value,
          type: props.type,
          class: cn('mcpe-input', props.error ? 'mcpe-input-error' : '', props.class),
          value: props.modelValue,
          disabled: props.disabled,
          placeholder: props.placeholder,
          onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
        })
      )

      if (props.error) {
        children.push(h('p', { class: 'mcpe-input-error-text' }, props.error))
      } else if (props.helperText) {
        children.push(h('p', { class: 'mcpe-input-helper-text' }, props.helperText))
      }

      return h('div', { class: 'mcpe-input-wrapper' }, children)
    }
  },
})
