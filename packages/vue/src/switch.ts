import { defineComponent, computed, h } from 'vue'
import { cn } from '@mcp-elements/core'

export const McpeSwitch = defineComponent({
  name: 'McpeSwitch',
  props: {
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    id: { type: String, default: '' },
    class: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const switchId = computed(
      () => props.id || `mcpe-switch-${Math.random().toString(36).slice(2, 9)}`
    )

    const toggle = () => {
      if (!props.disabled) {
        emit('update:modelValue', !props.modelValue)
      }
    }

    return () => {
      const switchBtn = h('button', {
        id: switchId.value,
        type: 'button',
        role: 'switch',
        'aria-checked': props.modelValue,
        'aria-disabled': props.disabled || undefined,
        disabled: props.disabled,
        class: cn(
          'mcpe-switch',
          props.modelValue ? 'mcpe-switch-checked' : '',
          props.class
        ),
        onClick: toggle,
        onKeydown: (e: KeyboardEvent) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            toggle()
          }
        },
      }, [h('span', { class: 'mcpe-switch-thumb' })])

      if (props.label) {
        return h('label', { class: 'mcpe-switch-wrapper' }, [
          switchBtn,
          h('span', { class: 'mcpe-switch-label' }, props.label),
        ])
      }

      return switchBtn
    }
  },
})
