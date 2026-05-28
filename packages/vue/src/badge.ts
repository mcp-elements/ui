import { defineComponent, computed, h } from 'vue'
import { cn } from '@mcp-elements/core'

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive'
type BadgeSize = 'sm' | 'md'

export const McpeBadge = defineComponent({
  name: 'McpeBadge',
  props: {
    variant: { type: String as () => BadgeVariant, default: 'default' },
    size: { type: String as () => BadgeSize, default: 'md' },
    class: { type: String, default: '' },
  },
  setup(props, { slots }) {
    const classes = computed(() =>
      cn('mcpe-badge', `mcpe-badge-${props.variant}`, `mcpe-badge-${props.size}`, props.class)
    )
    return () =>
      h('div', { class: classes.value }, slots.default?.())
  },
})
