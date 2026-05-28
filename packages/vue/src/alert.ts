import { defineComponent, computed, h } from 'vue'
import { cn } from '@mcp-elements/core'

type AlertVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info' | 'error'

export const McpeAlert = defineComponent({
  name: 'McpeAlert',
  props: {
    variant: { type: String as () => AlertVariant, default: 'default' },
    title: { type: String, default: '' },
    class: { type: String, default: '' },
  },
  setup(props, { slots }) {
    const classes = computed(() =>
      cn('mcpe-alert', `mcpe-alert-${props.variant}`, props.class)
    )

    return () => {
      const children = []

      if (props.title) {
        children.push(h('h5', { class: 'mcpe-alert-title' }, props.title))
      }

      if (slots.default) {
        children.push(h('div', { class: 'mcpe-alert-description' }, slots.default()))
      }

      return h('div', { role: 'alert', class: classes.value }, children)
    }
  },
})
