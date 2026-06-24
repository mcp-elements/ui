import { defineComponent, h, type PropType } from 'vue'
import { cn } from '@mcp-elements/core'

export interface McpResource {
  uri: string
  name: string
  mimeType?: string
  description?: string
}

function mimeTypeLabel(mimeType?: string): string {
  if (!mimeType) return 'res'
  if (mimeType.includes('json')) return 'json'
  if (mimeType.includes('text')) return 'txt'
  if (mimeType.includes('image')) return 'img'
  if (mimeType.includes('pdf')) return 'pdf'
  return mimeType.split('/')[1]?.slice(0, 4) ?? 'res'
}

export const McpeMcpResourceBrowser = defineComponent({
  name: 'McpeMcpResourceBrowser',
  props: {
    resources: { type: Array as PropType<McpResource[]>, default: () => [] },
    selectedUri: { type: String, default: undefined },
    loading: { type: Boolean, default: false },
    class: { type: String, default: '' },
  },
  emits: ['select'],
  setup(props, { emit }) {
    return () => {
      if (props.loading) {
        return h(
          'div',
          { class: cn('mcpe-mcp-resource-browser', props.class) },
          [1, 2, 3, 4].map(() =>
            h('div', { class: 'flex items-center gap-3 px-3 py-2.5' }, [
              h('div', { class: 'h-8 w-8 rounded-md animate-pulse bg-muted' }),
              h('div', { class: 'h-4 flex-1 rounded animate-pulse bg-muted' }),
            ])
          )
        )
      }

      if (props.resources.length === 0) {
        return h('div', { class: cn('mcpe-mcp-resource-browser', props.class) }, [
          h('p', { class: 'mcpe-mcp-resource-browser-empty' }, 'No resources available'),
        ])
      }

      return h(
        'div',
        { class: cn('mcpe-mcp-resource-browser', props.class), role: 'list' },
        props.resources.map((r) => {
          const selected = props.selectedUri === r.uri
          const children = [
            h(
              'span',
              { class: 'mcpe-mcp-resource-browser-icon', 'aria-hidden': 'true' },
              mimeTypeLabel(r.mimeType)
            ),
            h('span', { class: 'mcpe-mcp-resource-browser-name' }, r.name),
          ]
          if (r.mimeType) {
            children.push(
              h('span', { class: 'mcpe-mcp-resource-browser-type' }, r.mimeType.split('/')[0])
            )
          }
          return h(
            'button',
            {
              type: 'button',
              role: 'listitem',
              class: cn(
                'mcpe-mcp-resource-browser-item w-full text-left',
                selected ? 'mcpe-mcp-resource-browser-item-selected' : ''
              ),
              'aria-selected': selected,
              'aria-label': r.name,
              onClick: () => emit('select', r),
            },
            children
          )
        })
      )
    }
  },
})
