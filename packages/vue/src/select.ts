import { defineComponent, computed, h } from 'vue'
import { cn } from '@mcp-elements/core'
import type { SelectOption } from '@mcp-elements/core'

export const McpeSelect = defineComponent({
  name: 'McpeSelect',
  props: {
    modelValue: { type: String, default: '' },
    options: { type: Array as () => SelectOption[], default: () => [] },
    label: { type: String, default: '' },
    error: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: 'Select...' },
    id: { type: String, default: '' },
    class: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selectId = computed(
      () => props.id || `mcpe-select-${Math.random().toString(36).slice(2, 9)}`
    )

    return () => {
      const children = []

      if (props.label) {
        children.push(
          h('label', { for: selectId.value, class: 'mcpe-select-label' }, props.label)
        )
      }

      const optionNodes = [
        h('option', { value: '', disabled: true }, props.placeholder),
        ...props.options.map((opt) =>
          h(
            'option',
            {
              key: opt.value,
              value: opt.value,
              disabled: opt.disabled ?? false,
            },
            opt.label
          )
        ),
      ]

      children.push(
        h('select', {
          id: selectId.value,
          class: cn('mcpe-select', props.error ? 'mcpe-select-error' : '', props.class),
          value: props.modelValue,
          disabled: props.disabled,
          onChange: (e: Event) =>
            emit('update:modelValue', (e.target as HTMLSelectElement).value),
        }, optionNodes)
      )

      if (props.error) {
        children.push(h('p', { class: 'mcpe-select-error-text' }, props.error))
      }

      return h('div', { class: 'mcpe-select-wrapper' }, children)
    }
  },
})
