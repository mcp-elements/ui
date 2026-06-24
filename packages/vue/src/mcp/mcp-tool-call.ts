import { defineComponent, h, ref, computed, watch, onUnmounted, type PropType, type VNode } from 'vue'
import { cn } from '@mcp-elements/core'
import type { ToolStateApi, ToolStateSnapshot, ContentBlock } from '@mcp-elements/core'

const STATUS_LABELS: Record<string, string> = {
  idle: 'idle',
  pending: 'pending',
  running: 'running',
  done: 'done',
  error: 'error',
  cancelled: 'cancelled',
}

type TextBlock = Extract<ContentBlock, { type: 'text' }>

export const McpeMcpToolCall = defineComponent({
  name: 'McpeMcpToolCall',
  props: {
    state: { type: Object as PropType<ToolStateApi>, required: true },
    toolName: { type: String, default: '' },
    args: { type: Object as PropType<Record<string, unknown>>, default: undefined },
    class: { type: String, default: '' },
  },
  emits: ['retry'],
  setup(props, { emit }) {
    // Reactivity bridge: mirror the core ToolState machine into a Vue ref.
    // Re-subscribe whenever the `state` prop identity changes; seed the initial
    // snapshot from the machine's getters before the first subscribe fires.
    const snap = ref<ToolStateSnapshot>({ status: 'idle' })
    let unsub: (() => void) | undefined

    watch(
      () => props.state,
      (state) => {
        unsub?.()
        snap.value = {
          status: state.status,
          tool: state.tool,
          args: state.args,
          result: state.result,
          error: state.error,
          startedAt: state.startedAt,
          endedAt: state.endedAt,
        }
        unsub = state.subscribe((s) => {
          snap.value = { ...s }
        })
      },
      { immediate: true }
    )

    onUnmounted(() => unsub?.())

    const displayName = computed(() => snap.value.tool ?? props.toolName ?? 'unknown')
    const displayArgs = computed(() => snap.value.args ?? props.args)
    const textBlocks = computed<TextBlock[]>(
      () =>
        (snap.value.result?.content ?? []).filter((c): c is TextBlock => c.type === 'text')
    )

    return () => {
      const status = snap.value.status
      const children: VNode[] = []

      children.push(
        h('div', { class: 'mcpe-mcp-tool-call-header' }, [
          h('div', { class: 'mcpe-mcp-tool-call-name' }, [
            h('span', { class: 'mcpe-mcp-tool-call-icon', 'aria-hidden': 'true' }, 'fn'),
            h('span', { class: 'mcpe-mcp-tool-call-title' }, displayName.value),
          ]),
          h(
            'span',
            { class: cn('mcpe-mcp-tool-call-badge', `mcpe-mcp-tool-call-badge-${status}`) },
            [
              status === 'running'
                ? h(
                    'svg',
                    {
                      class: 'animate-spin h-3 w-3',
                      fill: 'none',
                      viewBox: '0 0 24 24',
                      'aria-hidden': 'true',
                    },
                    [
                      h('circle', {
                        class: 'opacity-25',
                        cx: '12',
                        cy: '12',
                        r: '10',
                        stroke: 'currentColor',
                        'stroke-width': '4',
                      }),
                      h('path', {
                        class: 'opacity-75',
                        fill: 'currentColor',
                        d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z',
                      }),
                    ]
                  )
                : null,
              STATUS_LABELS[status],
            ]
          ),
        ])
      )

      if (displayArgs.value) {
        children.push(
          h('pre', { class: 'mcpe-mcp-tool-call-args' }, JSON.stringify(displayArgs.value, null, 2))
        )
      }

      if (status === 'running') {
        children.push(
          h(
            'div',
            {
              class: 'mcpe-mcp-tool-call-progress',
              role: 'progressbar',
              'aria-label': 'Tool running',
            },
            [h('div', { class: 'mcpe-mcp-tool-call-progress-bar', style: 'width: 60%' })]
          )
        )
      }

      if (status === 'done' && snap.value.result) {
        children.push(
          h(
            'div',
            { class: 'mcpe-mcp-tool-call-result mcpe-mcp-tool-call-result-done' },
            textBlocks.value.map((b) => h('p', { class: 'whitespace-pre-wrap text-sm' }, b.text))
          )
        )
      }

      if (status === 'error' && snap.value.error) {
        children.push(
          h('div', { class: 'mcpe-mcp-tool-call-result mcpe-mcp-tool-call-result-error' }, [
            h('p', { class: 'text-sm' }, snap.value.error.message),
            h(
              'button',
              {
                class: 'text-xs underline underline-offset-2',
                type: 'button',
                onClick: () => emit('retry'),
              },
              'Retry'
            ),
          ])
        )
      }

      return h('div', { class: cn('mcpe-mcp-tool-call', props.class) }, children)
    }
  },
})
