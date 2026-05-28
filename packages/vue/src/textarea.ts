import { defineComponent, computed, h } from 'vue'
import { cn } from '@mcp-elements/core'

export const McpeTextarea = defineComponent({
  name: 'McpeTextarea',
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, default: '' },
    error: { type: String, default: '' },
    helperText: { type: String, default: '' },
    rows: { type: Number, default: 3 },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    id: { type: String, default: '' },
    class: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const textareaId = computed(
      () => props.id || `mcpe-textarea-${Math.random().toString(36).slice(2, 9)}`
    )

    return () => {
      const children = []

      if (props.label) {
        children.push(
          h('label', { for: textareaId.value, class: 'mcpe-textarea-label' }, props.label)
        )
      }

      children.push(
        h('textarea', {
          id: textareaId.value,
          class: cn('mcpe-textarea', props.error ? 'mcpe-textarea-error' : '', props.class),
          value: props.modelValue,
          rows: props.rows,
          disabled: props.disabled,
          placeholder: props.placeholder,
          onInput: (e: Event) =>
            emit('update:modelValue', (e.target as HTMLTextAreaElement).value),
        })
      )

      if (props.error) {
        children.push(h('p', { class: 'mcpe-textarea-error-text' }, props.error))
      } else if (props.helperText) {
        children.push(h('p', { class: 'mcpe-textarea-helper-text' }, props.helperText))
      }

      return h('div', { class: 'mcpe-textarea-wrapper' }, children)
    }
  },
})
