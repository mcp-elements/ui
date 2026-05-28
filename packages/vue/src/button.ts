import { defineComponent, computed, h } from 'vue'
import { cn } from '@mcp-elements/core'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export const McpeButton = defineComponent({
  name: 'McpeButton',
  props: {
    variant: { type: String as () => ButtonVariant, default: 'primary' },
    size: { type: String as () => ButtonSize, default: 'md' },
    disabled: { type: Boolean, default: false },
    type: { type: String as () => 'button' | 'submit' | 'reset', default: 'button' },
    class: { type: String, default: '' },
  },
  setup(props, { slots }) {
    const classes = computed(() =>
      cn('mcpe-btn', `mcpe-btn-${props.variant}`, `mcpe-btn-${props.size}`, props.class)
    )
    return () =>
      h(
        'button',
        {
          class: classes.value,
          disabled: props.disabled,
          type: props.type,
        },
        slots.default?.()
      )
  },
})
