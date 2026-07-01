import { defineComponent, h, ref, computed, type PropType, type VNode } from 'vue'
import { cn, parseScopes } from '@mcp-elements/core'
import type { ScopeDescriptor } from '@mcp-elements/core'

export const McpeMcpScopeInspector = defineComponent({
  name: 'McpeMcpScopeInspector',
  props: {
    scopes: {
      type: [String, Array] as PropType<string | ScopeDescriptor[]>,
      default: '',
    },
    descriptions: {
      type: Object as PropType<Record<string, string>>,
      default: () => ({}),
    },
    class: { type: String, default: '' },
  },
  setup(props) {
    const parsed = computed<ScopeDescriptor[]>(() =>
      typeof props.scopes === 'string' ? parseScopes(props.scopes) : props.scopes
    )

    const openKeys = ref<Set<string>>(new Set())
    const isOpen = (key: string) => openKeys.value.has(key)
    const toggle = (key: string) => {
      const next = new Set(openKeys.value)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      openKeys.value = next
    }

    const getDescription = (s: ScopeDescriptor) =>
      props.descriptions[s.raw] ?? props.descriptions[s.resource] ?? s.description

    return () =>
      h(
        'div',
        { class: cn('mcpe-mcp-scope-inspector', props.class), role: 'list' },
        parsed.value.map((s) => {
          const open = isOpen(s.raw)
          const desc = getDescription(s)
          const itemChildren: VNode[] = [
            h(
              'button',
              {
                type: 'button',
                class: 'mcpe-mcp-scope-inspector-trigger',
                'aria-expanded': open,
                onClick: () => toggle(s.raw),
              },
              [
                h('div', { class: 'flex items-center gap-3' }, [
                  h('span', { class: 'mcpe-mcp-scope-inspector-resource' }, s.resource),
                  h(
                    'div',
                    { class: 'mcpe-mcp-scope-inspector-perms' },
                    s.permissions.map((p) =>
                      h('span', { class: 'mcpe-mcp-scope-inspector-perm', 'data-perm': p.toLowerCase() }, p)
                    )
                  ),
                ]),
                h(
                  'svg',
                  {
                    class: cn(
                      'mcpe-mcp-scope-inspector-chevron',
                      open ? 'mcpe-mcp-scope-inspector-chevron-open' : ''
                    ),
                    xmlns: 'http://www.w3.org/2000/svg',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': '2',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                    'aria-hidden': 'true',
                  },
                  [h('path', { d: 'm6 9 6 6 6-6' })]
                ),
              ]
            ),
          ]

          if (open && desc) {
            itemChildren.push(
              h('div', { role: 'region', class: 'mcpe-mcp-scope-inspector-body' }, desc)
            )
          }

          return h(
            'div',
            { class: 'mcpe-mcp-scope-inspector-item', role: 'listitem' },
            itemChildren
          )
        })
      )
  },
})
